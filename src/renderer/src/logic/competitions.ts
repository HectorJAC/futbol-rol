import {
  ALL_CLUBS,
  cupName,
  divisionName,
  getClub,
  initialDivision,
  type Club,
  type Division
} from '../data/clubs'
import {
  CONTINENTAL_CUP_IDS,
  CONTINENTAL_FORMATS,
  continentalRoundNames,
  EUROPEAN_SPOTS,
  groupRounds,
  INTERCONTINENTAL_SPOTS,
  isEuropean,
  knockoutRounds,
  mainCupFor,
  type ContinentalCupId,
  type ContinentalFormat,
  type ContinentalQualifiers
} from '../data/continentalCups'
import { NATIONALITIES, type NationalityId } from '../data/nationalities'
import { FIRST_NAMES, LAST_NAMES } from '../data/playerNames'
import { getTrophy } from '../data/trophies'
import type { ClubMatch, CompetitionId, DivisionsState, SeasonSetup } from '../types/career'
import {
  clamp,
  createRng,
  hashString,
  poisson,
  seedFor,
  shuffle,
  weightedIndex,
  type Rng
} from './random'

/**
 * Competiciones de cada temporada: tu división (liga a doble vuelta), la copa
 * de tu país (32 equipos, eliminatorias a partido único) y la copa
 * internacional (grupos + eliminatorias; ver `data/continentalCups.ts`).
 *
 * Solo se guardan los partidos de tu club; el resto se recalcula siempre igual
 * con la semilla de la partida, así que las tablas no ocupan espacio en el guardado.
 */

const DAY = 86_400_000

// ---------------------------------------------------------------------------
// Calendario
// ---------------------------------------------------------------------------

/** Año en que empieza la primera temporada. */
export const FIRST_YEAR = 2026

export function seasonYearLabel(season: number): string {
  const start = FIRST_YEAR + season - 1
  return `${start}/${String((start + 1) % 100).padStart(2, '0')}`
}

export interface SlotInfo {
  competition: CompetitionId
  /** Jornada de liga, ronda de copa (0–4) o ronda internacional (0–8). */
  round: number
}

export const CUP_ROUND_NAMES = [
  'Dieciseisavos de final',
  'Octavos de final',
  'Cuartos de final',
  'Semifinales',
  'Final'
]
/** Rondas de la copa internacional antigua (16 equipos; temporadas de antes de la v0.10). */
export const CONTINENTAL_ROUND_NAMES = continentalRoundNames(CONTINENTAL_FORMATS.legacy)
export const GROUP_ROUNDS = 6

/** Formato de la copa internacional de una temporada. */
export function continentalFormat(setup: Pick<SeasonSetup, 'continentalCup'>): ContinentalFormat {
  return CONTINENTAL_FORMATS[setup.continentalCup ?? 'legacy']
}

/** Nombres de las rondas de la copa internacional de una temporada. */
export function continentalNames(setup: Pick<SeasonSetup, 'continentalCup'>): string[] {
  return continentalRoundNames(continentalFormat(setup))
}

/** En qué punto de la liga (fracción de jornadas) se juega cada ronda de copa / internacional. */
const CUP_FRACTIONS = [0.15, 0.3, 0.5, 0.68, 0.85]
const LEGACY_GROUP_FRACTIONS = [0.08, 0.13, 0.2, 0.26, 0.32, 0.38]
const KNOCKOUT_FRACTIONS = [0.55, 0.7, 1]

function continentalFractions(groups: number, knockout: number): number[] {
  const groupFractions =
    groups === 6
      ? LEGACY_GROUP_FRACTIONS
      : Array.from({ length: groups }, (_, i) => 0.08 + (0.3 * i) / Math.max(1, groups - 1))
  return [...groupFractions, ...KNOCKOUT_FRACTIONS.slice(-knockout)]
}

function afterRounds(fractions: number[], rounds: number): number[] {
  const result: number[] = []
  for (const f of fractions) {
    let r = clamp(Math.round(f * rounds), 1, rounds)
    const previous = result.at(-1)
    if (previous !== undefined && r <= previous) r = Math.min(rounds, previous + 1)
    result.push(r)
  }
  return result
}

const slotsCache = new Map<string, SlotInfo[]>()

/**
 * Huecos del calendario para una liga de `leagueRounds` jornadas y una copa
 * internacional con `groups` jornadas de grupos y `knockout` eliminatorias.
 */
export function seasonSlots(leagueRounds: number, groups = 6, knockout = 3): readonly SlotInfo[] {
  const key = `${leagueRounds}|${groups}|${knockout}`
  const cached = slotsCache.get(key)
  if (cached) return cached
  const cupAfter = afterRounds(CUP_FRACTIONS, leagueRounds)
  const continentalAfter = afterRounds(continentalFractions(groups, knockout), leagueRounds)
  const slots: SlotInfo[] = []
  for (let r = 1; r <= leagueRounds; r++) {
    slots.push({ competition: 'liga', round: r - 1 })
    cupAfter.forEach((after, i) => after === r && slots.push({ competition: 'copa', round: i }))
    continentalAfter.forEach(
      (after, i) => after === r && slots.push({ competition: 'continental', round: i })
    )
  }
  slotsCache.set(key, slots)
  return slots
}

export function leagueRounds(setup: SeasonSetup): number {
  return 2 * (setup.league.length - 1)
}

export function slotsFor(setup: SeasonSetup): readonly SlotInfo[] {
  const format = continentalFormat(setup)
  return seasonSlots(leagueRounds(setup), groupRounds(format), knockoutRounds(format))
}

export function totalSlots(setup: SeasonSetup): number {
  return slotsFor(setup).length
}

export function slotOf(setup: SeasonSetup, competition: CompetitionId, round: number): number {
  return slotsFor(setup).findIndex((s) => s.competition === competition && s.round === round)
}

export function roundLabel(slot: SlotInfo, setup?: Pick<SeasonSetup, 'continentalCup'>): string {
  if (slot.competition === 'liga') return `Jornada ${slot.round + 1}`
  if (slot.competition === 'copa') return CUP_ROUND_NAMES[slot.round]
  return (setup ? continentalNames(setup) : CONTINENTAL_ROUND_NAMES)[slot.round] ?? ''
}

/**
 * Fecha de un hueco: la liga en domingo (con algún parón) y las copas entre
 * semana, de mediados de agosto a mayo.
 */
export function slotDate(setup: SeasonSetup, season: number, slot: number): Date {
  const rounds = leagueRounds(setup)
  const slots = slotsFor(setup)
  let leagueSlot = slot
  while (slots[leagueSlot].competition !== 'liga') leagueSlot--
  const round = slots[leagueSlot].round
  const midweek = slot === leagueSlot ? 0 : 2 + (slot - leagueSlot)
  const breaks = Math.max(1, 40 - rounds)
  const breakEvery = Math.ceil(rounds / (breaks + 1))
  const weeks = round + Math.floor(round / breakEvery)
  const august = new Date(Date.UTC(FIRST_YEAR + season - 1, 7, 14))
  const start = august.getTime() + ((7 - august.getUTCDay()) % 7) * DAY
  return new Date(start + (weeks * 7 + midweek) * DAY)
}

export function formatSlotDate(setup: SeasonSetup, season: number, slot: number): string {
  return slotDate(setup, season, slot).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC'
  })
}

/** Mes de la temporada de un hueco: 1 = agosto … 10 = mayo. */
export function seasonMonth(setup: SeasonSetup, season: number, slot: number): number {
  const date = slotDate(setup, season, slot)
  const startYear = FIRST_YEAR + season - 1
  return (date.getUTCFullYear() - startYear) * 12 + date.getUTCMonth() - 7 + 1
}

// ---------------------------------------------------------------------------
// Partidos
// ---------------------------------------------------------------------------

export const CONTINENTAL_NAME = getTrophy('continental').name

/** Nivel de un club en una temporada concreta (varía un poco cada año). */
export function seasonStrength(careerId: string, club: Club, season: number): number {
  const rng = createRng(seedFor(careerId, 'strength', club.id, season))
  return club.strength + (rng() * 8 - 4)
}

/** Marcador de un partido entre dos niveles (el local tiene un pequeño plus). */
export function simulateScore(
  rng: Rng,
  homeStrength: number,
  awayStrength: number,
  neutral = false
): [number, number] {
  const diff = homeStrength + (neutral ? 0 : 3) - awayStrength
  const lambdaHome = clamp(1.3 + diff * 0.045, 0.25, 3.6)
  const lambdaAway = clamp(1.15 - diff * 0.04, 0.2, 3.2)
  return [poisson(rng, lambdaHome), poisson(rng, lambdaAway)]
}

/** Tanda de penaltis: devuelve [local, visitante], nunca empate. */
export function penaltyShootout(rng: Rng): [number, number] {
  let home = 0
  let away = 0
  for (let i = 0; i < 5; i++) {
    if (rng() < 0.76) home++
    if (rng() < 0.76) away++
  }
  while (home === away) {
    if (rng() < 0.76) home++
    if (rng() < 0.76) away++
  }
  return [home, away]
}

export interface MatchScore {
  home: number
  away: number
  /** Penaltis [local, visitante] si hubo empate en una eliminatoria. */
  penalties?: [number, number]
}

export interface Fixture {
  home: string
  away: string
}

/** Lo que hace falta para recalcular las competiciones de una temporada. */
export interface SeasonContext {
  careerId: string
  season: number
  /** Tu club esa temporada ('' para simular un mundo sin ti). */
  clubId: string
  clubMatches: ClubMatch[]
  /** Huecos del calendario ya jugados. */
  playedSlots: number
  /** Goles extra de los eventos (cuentan para la tabla de goleadores). */
  bonusGoals: number
  setup: SeasonSetup
}

function storedScore(match: ClubMatch): MatchScore {
  const pens = match.penalties
  return match.home
    ? {
        home: match.goalsFor,
        away: match.goalsAgainst,
        penalties: pens && [pens.for, pens.against]
      }
    : {
        home: match.goalsAgainst,
        away: match.goalsFor,
        penalties: pens && [pens.against, pens.for]
      }
}

/** Resultado de un partido ya jugado: el guardado si es de tu club, o el simulado si no. */
function scoreFor(
  ctx: SeasonContext,
  slot: number,
  home: string,
  away: string,
  knockout: boolean,
  neutral = false
): MatchScore {
  if (ctx.clubId && (home === ctx.clubId || away === ctx.clubId)) {
    const stored = ctx.clubMatches.find((m) => m.slot === slot)
    if (stored) return storedScore(stored)
  }
  const rng = createRng(seedFor(ctx.careerId, 'match', ctx.season, slot, home, away))
  const [h, a] = simulateScore(
    rng,
    seasonStrength(ctx.careerId, getClub(home), ctx.season),
    seasonStrength(ctx.careerId, getClub(away), ctx.season),
    neutral
  )
  return knockout && h === a
    ? { home: h, away: a, penalties: penaltyShootout(rng) }
    : { home: h, away: a }
}

function winnerOf(fixture: Fixture, score: MatchScore): string {
  if (score.home !== score.away) return score.home > score.away ? fixture.home : fixture.away
  const [ph, pa] = score.penalties ?? [1, 0]
  return ph > pa ? fixture.home : fixture.away
}

// ---------------------------------------------------------------------------
// Liga
// ---------------------------------------------------------------------------

/**
 * Liga a doble vuelta por el método del círculo. Con `balanced` cada equipo
 * alterna casa y fuera casi siempre (calendario de la v0.9).
 */
export function roundRobin(ids: readonly string[], balanced = false): Fixture[][] {
  const n = ids.length
  const arr = [...ids]
  const firstHalf: Fixture[][] = []
  for (let r = 0; r < n - 1; r++) {
    const round: Fixture[] = []
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i]
      const b = arr[n - 1 - i]
      const aHome = balanced ? (i === 0 ? r % 2 === 0 : i % 2 === 1) : (r + i) % 2 === 0
      round.push(aHome ? { home: a, away: b } : { home: b, away: a })
    }
    firstHalf.push(round)
    arr.splice(1, 0, arr.pop() as string)
  }
  const secondHalf = firstHalf.map((round) => round.map((f) => ({ home: f.away, away: f.home })))
  return [...firstHalf, ...secondHalf]
}

export function leagueFixtures(
  careerId: string,
  season: number,
  teams: readonly string[],
  balanced = true
): Fixture[][] {
  const key = hashString([...teams].sort().join(','))
  const rng = createRng(seedFor(careerId, 'fixtures', season, key))
  return roundRobin(shuffle(rng, teams), balanced)
}

export interface TableRow {
  clubId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

function emptyRow(clubId: string): TableRow {
  return { clubId, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
}

function addResult(row: TableRow, scored: number, conceded: number): void {
  row.played++
  row.goalsFor += scored
  row.goalsAgainst += conceded
  if (scored > conceded) {
    row.won++
    row.points += 3
  } else if (scored === conceded) {
    row.drawn++
    row.points++
  } else {
    row.lost++
  }
}

function sortTable(rows: TableRow[]): TableRow[] {
  return rows.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor ||
      getClub(a.clubId).name.localeCompare(getClub(b.clubId).name)
  )
}

/** Partidos de liga ya jugados de tu división, con su resultado. */
function playedLeagueMatches(
  ctx: SeasonContext
): Array<{ slot: number; fixture: Fixture; score: MatchScore }> {
  const fixtures = leagueFixtures(
    ctx.careerId,
    ctx.season,
    ctx.setup.league,
    ctx.setup.schedule === 2
  )
  const result: Array<{ slot: number; fixture: Fixture; score: MatchScore }> = []
  slotsFor(ctx.setup).forEach((info, slot) => {
    if (info.competition !== 'liga' || slot >= ctx.playedSlots) return
    for (const fixture of fixtures[info.round]) {
      result.push({ slot, fixture, score: scoreFor(ctx, slot, fixture.home, fixture.away, false) })
    }
  })
  return result
}

export function leagueTable(ctx: SeasonContext): TableRow[] {
  const rows = new Map(ctx.setup.league.map((id) => [id, emptyRow(id)]))
  for (const { fixture, score } of playedLeagueMatches(ctx)) {
    addResult(rows.get(fixture.home) as TableRow, score.home, score.away)
    addResult(rows.get(fixture.away) as TableRow, score.away, score.home)
  }
  return sortTable([...rows.values()])
}

/** Clasificación final de una liga sin tu club (para ascensos y plazas internacionales). */
export function simulateLeague(
  careerId: string,
  season: number,
  countryId: NationalityId,
  division: Division,
  teams: readonly string[]
): string[] {
  const setup: SeasonSetup = {
    countryId,
    division,
    league: [...teams],
    cup: [],
    continental: [],
    schedule: 2
  }
  const ctx: SeasonContext = {
    careerId,
    season,
    clubId: '',
    clubMatches: [],
    playedSlots: totalSlots(setup),
    bonusGoals: 0,
    setup
  }
  return leagueTable(ctx).map((r) => r.clubId)
}

// ---------------------------------------------------------------------------
// Divisiones, ascensos y plazas internacionales
// ---------------------------------------------------------------------------

/** Ascienden y descienden 3 equipos cada temporada. */
export const PROMOTION_SPOTS = 3

export function initialDivisions(): DivisionsState {
  return Object.fromEntries(
    NATIONALITIES.map(({ id }) => [id, [initialDivision(id, 1), initialDivision(id, 2)]])
  ) as DivisionsState
}

export function emptyQualifiers(): ContinentalQualifiers {
  return { campeones: [], europa: [], conferencia: [], intercontinental: [] }
}

/**
 * Reparte las plazas internacionales a partir de la clasificación de la
 * primera división de cada país: en Europa los 4 primeros van a la Copa de
 * Campeones, el 5º y el 6º a la Copa de Europa y el 7º a la Conferencia.
 */
export function qualifiersFromTables(
  tables: Partial<Record<NationalityId, readonly string[]>>
): ContinentalQualifiers {
  const result = emptyQualifiers()
  for (const { id } of NATIONALITIES) {
    const table = tables[id] ?? []
    if (isEuropean(id)) {
      for (const cup of ['campeones', 'europa', 'conferencia'] as const) {
        for (const position of EUROPEAN_SPOTS[cup]) {
          const club = table[position - 1]
          if (club) result[cup].push(club)
        }
      }
    } else {
      result.intercontinental.push(...table.slice(0, INTERCONTINENTAL_SPOTS[id] ?? 0))
    }
  }
  return result
}

/** Clasificados de la primera temporada: los más fuertes de cada primera división. */
export function initialContinentalTeams(divisions: DivisionsState): ContinentalQualifiers {
  const tables = Object.fromEntries(
    NATIONALITIES.map(({ id }) => [
      id,
      [...divisions[id][0]].sort(
        (a, b) => getClub(b).strength - getClub(a).strength || a.localeCompare(b)
      )
    ])
  )
  return qualifiersFromTables(tables)
}

/** Copa internacional en la que juega un club (o `null` si no se clasificó). */
export function qualifiedCup(
  qualifiers: ContinentalQualifiers,
  clubId: string
): ContinentalCupId | null {
  return CONTINENTAL_CUP_IDS.find((cup) => qualifiers[cup].includes(clubId)) ?? null
}

/** Equipos de cada competición para tu club esta temporada. */
export function buildSeasonSetup(
  divisions: DivisionsState,
  continentalTeams: ContinentalQualifiers,
  clubId: string
): SeasonSetup {
  const club = getClub(clubId)
  const [first, second] = divisions[club.countryId]
  const division: Division = first.includes(clubId) ? 1 : 2
  const league = division === 1 ? first : second
  const fill = [...second]
    .sort((a, b) => getClub(b).strength - getClub(a).strength || a.localeCompare(b))
    .slice(0, Math.max(0, 32 - first.length))
  let cup = [...first, ...fill]
  if (!cup.includes(clubId)) cup = [...cup.slice(0, cup.length - 1), clubId]
  const continentalCup = qualifiedCup(continentalTeams, clubId) ?? mainCupFor(club.countryId)
  return {
    countryId: club.countryId,
    division,
    league: [...league],
    cup,
    continental: [...continentalTeams[continentalCup]],
    continentalCup,
    schedule: 2
  }
}

export interface NextSeasonState {
  divisions: DivisionsState
  continentalTeams: ContinentalQualifiers
  /** Si tu club sube o baja de división. */
  movement?: 'ascenso' | 'descenso'
}

/**
 * Al cerrar la temporada: ascensos y descensos en todos los países y
 * clasificados para la copa internacional del año siguiente.
 */
export function nextSeasonState(
  careerId: string,
  season: number,
  divisions: DivisionsState,
  userClubId: string,
  userSetup: SeasonSetup,
  userTable: string[]
): NextSeasonState {
  const next = {} as DivisionsState
  const firstTables: Partial<Record<NationalityId, string[]>> = {}
  let movement: NextSeasonState['movement']
  for (const { id } of NATIONALITIES) {
    const [first, second] = divisions[id]
    const table = (division: Division, teams: string[]): string[] =>
      userSetup.countryId === id && userSetup.division === division
        ? userTable
        : simulateLeague(careerId, season, id, division, teams)
    const firstTable = table(1, first)
    const secondTable = table(2, second)
    const relegated = firstTable.slice(-PROMOTION_SPOTS)
    const promoted = secondTable.slice(0, PROMOTION_SPOTS)
    next[id] = [
      [...firstTable.filter((c) => !relegated.includes(c)), ...promoted],
      [...relegated, ...secondTable.filter((c) => !promoted.includes(c))]
    ]
    firstTables[id] = firstTable
    if (relegated.includes(userClubId)) movement = 'descenso'
    if (promoted.includes(userClubId)) movement = 'ascenso'
  }
  return { divisions: next, continentalTeams: qualifiersFromTables(firstTables), movement }
}

/** División actual de un club. */
export function divisionOf(divisions: DivisionsState, clubId: string): Division {
  return divisions[getClub(clubId).countryId][0].includes(clubId) ? 1 : 2
}

// ---------------------------------------------------------------------------
// Eliminatorias
// ---------------------------------------------------------------------------

export interface KnockoutTie {
  home: string | null
  away: string | null
  score?: MatchScore
  winner?: string
}

function playKnockoutRound(
  ctx: SeasonContext,
  ties: KnockoutTie[],
  slot: number,
  neutral: boolean
): void {
  if (slot < 0 || slot >= ctx.playedSlots) return
  for (const tie of ties) {
    if (!tie.home || !tie.away) continue
    tie.score = scoreFor(ctx, slot, tie.home, tie.away, true, neutral)
    tie.winner = winnerOf({ home: tie.home, away: tie.away }, tie.score)
  }
}

function nextRound(ties: KnockoutTie[]): KnockoutTie[] {
  const next: KnockoutTie[] = []
  for (let i = 0; i < ties.length; i += 2) {
    next.push({ home: ties[i].winner ?? null, away: ties[i + 1].winner ?? null })
  }
  return next
}

/** Cuadro de la copa: 32 equipos, partido único y penaltis si hay empate. */
export function cupBracket(ctx: SeasonContext): KnockoutTie[][] {
  const rng = createRng(seedFor(ctx.careerId, 'cup-draw', ctx.season, ctx.setup.countryId))
  const teams = shuffle(rng, ctx.setup.cup)
  const rounds: KnockoutTie[][] = []
  let ties: KnockoutTie[] = []
  for (let i = 0; i + 1 < teams.length; i += 2) ties.push({ home: teams[i], away: teams[i + 1] })
  for (let r = 0; r < CUP_ROUND_NAMES.length; r++) {
    playKnockoutRound(ctx, ties, slotOf(ctx.setup, 'copa', r), r === CUP_ROUND_NAMES.length - 1)
    rounds.push(ties)
    if (r < CUP_ROUND_NAMES.length - 1) ties = nextRound(ties)
  }
  return rounds
}

export const GROUP_NAMES = ['A', 'B', 'C', 'D']
/** Grupo de 5 a una vuelta: cada jornada descansa un equipo. */
const FIVE_SCHEDULE: Array<Array<[number, number]>> = [
  [
    [0, 1],
    [2, 3]
  ],
  [
    [4, 0],
    [1, 2]
  ],
  [
    [3, 4],
    [0, 2]
  ],
  [
    [1, 3],
    [2, 4]
  ],
  [
    [3, 0],
    [4, 1]
  ]
]
/** Grupo de 4 a ida y vuelta. */
const GROUP_SCHEDULE: Array<Array<[number, number]>> = [
  [
    [0, 1],
    [2, 3]
  ],
  [
    [0, 2],
    [1, 3]
  ],
  [
    [3, 0],
    [1, 2]
  ],
  [
    [1, 0],
    [3, 2]
  ],
  [
    [2, 0],
    [3, 1]
  ],
  [
    [0, 3],
    [2, 1]
  ]
]

export interface ContinentalView {
  qualified: boolean
  groups: Array<{ name: string; table: TableRow[]; fixtures: Fixture[][] }>
  knockout: KnockoutTie[][]
}

/**
 * Copa internacional: grupos (de 4 a ida y vuelta o de 5 a una vuelta) y
 * eliminatorias a partido único con los 2 primeros de cada grupo.
 */
export function continentalCup(ctx: SeasonContext): ContinentalView {
  const qualifiers = ctx.setup.continental
  const format = continentalFormat(ctx.setup)
  const groupCount = format.groups
  const groupDays = groupRounds(format)
  const rng = createRng(
    seedFor(ctx.careerId, 'continental-draw', ctx.season, ctx.setup.continentalCup ?? '')
  )
  // Bombos por nivel: cada grupo recibe un equipo de cada bombo.
  const byStrength = [...qualifiers].sort(
    (a, b) => getClub(b).strength - getClub(a).strength || a.localeCompare(b)
  )
  const pots = Array.from({ length: format.groupSize }, (_, p) =>
    shuffle(rng, byStrength.slice(p * groupCount, p * groupCount + groupCount))
  )
  const groupTeams = GROUP_NAMES.slice(0, groupCount).map((_, g) =>
    pots.map((pot) => pot[g]).filter((id): id is string => id !== undefined)
  )
  const schedule = format.groupSize === 5 ? FIVE_SCHEDULE : GROUP_SCHEDULE

  const groups = groupTeams.map((teams, g) => {
    const rows = new Map(teams.map((id) => [id, emptyRow(id)]))
    const fixtures = schedule.map((round) =>
      round
        .filter(([h, a]) => teams[h] !== undefined && teams[a] !== undefined)
        .map(([h, a]) => ({ home: teams[h], away: teams[a] }))
    )
    fixtures.forEach((round, r) => {
      const slot = slotOf(ctx.setup, 'continental', r)
      if (slot >= ctx.playedSlots) return
      for (const fixture of round) {
        const score = scoreFor(ctx, slot, fixture.home, fixture.away, false)
        addResult(rows.get(fixture.home) as TableRow, score.home, score.away)
        addResult(rows.get(fixture.away) as TableRow, score.away, score.home)
      }
    })
    return { name: GROUP_NAMES[g], table: sortTable([...rows.values()]), fixtures }
  })

  const groupsDone = slotOf(ctx.setup, 'continental', groupDays - 1) < ctx.playedSlots
  const pos = (g: number, p: number): string | null =>
    groupsDone ? (groups[g]?.table[p]?.clubId ?? null) : null
  let ties: KnockoutTie[] =
    groupCount === 1
      ? [{ home: pos(0, 0), away: pos(0, 1) }]
      : groupCount === 2
        ? [
            { home: pos(0, 0), away: pos(1, 1) },
            { home: pos(1, 0), away: pos(0, 1) }
          ]
        : [
            { home: pos(0, 0), away: pos(1, 1) },
            { home: pos(1, 0), away: pos(0, 1) },
            { home: pos(2, 0), away: pos(3, 1) },
            { home: pos(3, 0), away: pos(2, 1) }
          ]
  const knockout: KnockoutTie[][] = []
  const totalRounds = groupDays + knockoutRounds(format)
  for (let r = groupDays; r < totalRounds; r++) {
    playKnockoutRound(ctx, ties, slotOf(ctx.setup, 'continental', r), r === totalRounds - 1)
    knockout.push(ties)
    if (r < totalRounds - 1) ties = nextRound(ties)
  }

  return { qualified: qualifiers.includes(ctx.clubId), groups, knockout }
}

// ---------------------------------------------------------------------------
// Partido de tu club en un hueco del calendario
// ---------------------------------------------------------------------------

export interface ClubFixture {
  slot: number
  competition: CompetitionId
  round: number
  opponentId: string
  home: boolean
  knockout: boolean
  /** Las finales se juegan en campo neutral. */
  neutral: boolean
}

/**
 * ¿Juega tu club en este hueco y contra quién? Requiere que los huecos
 * anteriores estén jugados (para saber quién pasó las eliminatorias).
 */
export function clubFixtureAt(ctx: SeasonContext, slot: number): ClubFixture | null {
  const info = slotsFor(ctx.setup)[slot]
  if (!info) return null
  const asFixture = (
    home: string,
    away: string,
    knockout: boolean,
    neutral: boolean
  ): ClubFixture => ({
    slot,
    competition: info.competition,
    round: info.round,
    opponentId: home === ctx.clubId ? away : home,
    home: home === ctx.clubId,
    knockout,
    neutral
  })

  // Las rondas posteriores solo se conocen cuando se han jugado las anteriores.
  const known: SeasonContext = { ...ctx, playedSlots: Math.min(ctx.playedSlots, slot) }

  if (info.competition === 'liga') {
    const fixture = leagueFixtures(
      ctx.careerId,
      ctx.season,
      ctx.setup.league,
      ctx.setup.schedule === 2
    )[info.round].find((f) => f.home === ctx.clubId || f.away === ctx.clubId)
    return fixture ? asFixture(fixture.home, fixture.away, false, false) : null
  }
  if (info.competition === 'copa') {
    const tie = cupBracket(known)[info.round].find(
      (t) => t.home === ctx.clubId || t.away === ctx.clubId
    )
    return tie?.home && tie.away
      ? asFixture(tie.home, tie.away, true, info.round === CUP_ROUND_NAMES.length - 1)
      : null
  }
  const cup = continentalCup(known)
  if (!cup.qualified) return null
  const format = continentalFormat(ctx.setup)
  const groupDays = groupRounds(format)
  const lastRound = groupDays + knockoutRounds(format) - 1
  if (info.round < groupDays) {
    const group = cup.groups.find((g) => g.table.some((r) => r.clubId === ctx.clubId))
    const fixture = group?.fixtures[info.round].find(
      (f) => f.home === ctx.clubId || f.away === ctx.clubId
    )
    return fixture ? asFixture(fixture.home, fixture.away, false, false) : null
  }
  const tie = cup.knockout[info.round - groupDays]?.find(
    (t) => t.home === ctx.clubId || t.away === ctx.clubId
  )
  return tie?.home && tie.away
    ? asFixture(tie.home, tie.away, true, info.round === lastRound)
    : null
}

// ---------------------------------------------------------------------------
// Goleadores y asistentes
// ---------------------------------------------------------------------------

/** Pesos de gol y de asistencia de los 5 jugadores destacados de cada plantilla. */
const GOAL_WEIGHTS = [0.34, 0.16, 0.12, 0.1, 0.06, 0.22]
const ASSIST_WEIGHTS = [0.08, 0.18, 0.2, 0.1, 0.06, 0.38]
const ROSTER_SIZE = 5

/** Jugadores ficticios de un club (siempre los mismos para el mismo club). */
export function clubRoster(club: Club): string[] {
  const rng = createRng(hashString(`roster|${club.id}`))
  const names: string[] = []
  while (names.length < ROSTER_SIZE) {
    const country =
      rng() < 0.8 ? club.countryId : NATIONALITIES[Math.floor(rng() * NATIONALITIES.length)].id
    const first = FIRST_NAMES[country][Math.floor(rng() * FIRST_NAMES[country].length)]
    const last = LAST_NAMES[country][Math.floor(rng() * LAST_NAMES[country].length)]
    const name = `${first} ${last}`
    if (!names.includes(name)) names.push(name)
  }
  return names
}

export interface StatRow {
  /** 'player' = tú. */
  key: string
  name: string
  clubId: string
  value: number
  isPlayer: boolean
}

export const PLAYER_KEY = 'player'

/** Tablas de máximos goleadores y asistentes de tu división. */
export function leagueStats(
  ctx: SeasonContext,
  playerName: string
): { scorers: StatRow[]; assists: StatRow[] } {
  const goals = new Map<string, number>()
  const assists = new Map<string, number>()
  const add = (map: Map<string, number>, key: string, n = 1): void => {
    map.set(key, (map.get(key) ?? 0) + n)
  }

  const attribute = (rng: Rng, clubId: string, count: number, playerAssists = 0): void => {
    let pending = playerAssists
    for (let i = 0; i < count; i++) {
      const scorer = weightedIndex(rng, GOAL_WEIGHTS)
      if (scorer < ROSTER_SIZE) add(goals, `${clubId}#${scorer}`)
      if (pending > 0) {
        pending--
        continue
      }
      const assister = weightedIndex(rng, ASSIST_WEIGHTS)
      if (assister < ROSTER_SIZE && assister !== scorer) add(assists, `${clubId}#${assister}`)
    }
  }

  for (const { slot, fixture, score } of playedLeagueMatches(ctx)) {
    const rng = createRng(seedFor(ctx.careerId, 'scorers', ctx.season, slot, fixture.home))
    for (const [clubId, scored] of [
      [fixture.home, score.home],
      [fixture.away, score.away]
    ] as const) {
      const mine = clubId === ctx.clubId ? ctx.clubMatches.find((m) => m.slot === slot) : undefined
      if (mine) {
        add(goals, PLAYER_KEY, mine.playerGoals)
        add(assists, PLAYER_KEY, mine.playerAssists)
        attribute(rng, clubId, Math.max(0, scored - mine.playerGoals), mine.playerAssists)
      } else {
        attribute(rng, clubId, scored)
      }
    }
  }
  if (ctx.clubId && ctx.bonusGoals > 0) add(goals, PLAYER_KEY, ctx.bonusGoals)

  const toRows = (map: Map<string, number>): StatRow[] =>
    [...map.entries()]
      .map(([key, value]): StatRow => {
        if (key === PLAYER_KEY) {
          return { key, name: playerName, clubId: ctx.clubId, value, isPlayer: true }
        }
        const [clubId, index] = key.split('#')
        return {
          key,
          name: clubRoster(getClub(clubId))[Number(index)],
          clubId,
          value,
          isPlayer: false
        }
      })
      .filter((r) => r.value > 0)
      .sort(
        (a, b) =>
          b.value - a.value ||
          Number(b.isPlayer) - Number(a.isPlayer) ||
          a.name.localeCompare(b.name)
      )

  return { scorers: toRows(goals), assists: toRows(assists) }
}

// ---------------------------------------------------------------------------
// Vista completa de una temporada (pantalla de Competiciones)
// ---------------------------------------------------------------------------

export interface CalendarEntry {
  slot: number
  date: string
  competition: CompetitionId
  label: string
  /** `null` = rival aún por decidir. */
  opponentId: string | null
  home: boolean
  match?: ClubMatch
}

export interface SeasonView {
  season: number
  clubId: string
  countryId: NationalityId
  division: Division
  leagueName: string
  cupName: string
  continentalName: string
  /** Nombres de las rondas de la copa internacional de esa temporada. */
  continentalRoundNames: string[]
  playedSlots: number
  leagueRounds: number
  calendar: CalendarEntry[]
  leagueTable: TableRow[]
  cup: KnockoutTie[][]
  continental: ContinentalView
  scorers: StatRow[]
  assists: StatRow[]
}

function clubCalendar(
  ctx: SeasonContext,
  cup: KnockoutTie[][],
  continental: ContinentalView
): CalendarEntry[] {
  const entries: CalendarEntry[] = []
  const alive = (ties: KnockoutTie[][], round: number): boolean =>
    ties.slice(0, round).every((r) => {
      const tie = r.find((t) => t.home === ctx.clubId || t.away === ctx.clubId)
      return tie !== undefined && (tie.winner === undefined || tie.winner === ctx.clubId)
    })
  const fixtures = leagueFixtures(
    ctx.careerId,
    ctx.season,
    ctx.setup.league,
    ctx.setup.schedule === 2
  )
  const groupDays = groupRounds(continentalFormat(ctx.setup))

  slotsFor(ctx.setup).forEach((info, slot) => {
    const base = {
      slot,
      date: formatSlotDate(ctx.setup, ctx.season, slot),
      competition: info.competition,
      label: roundLabel(info, ctx.setup),
      match: ctx.clubMatches.find((m) => m.slot === slot)
    }
    if (info.competition === 'liga') {
      const fixture = fixtures[info.round].find(
        (f) => f.home === ctx.clubId || f.away === ctx.clubId
      )
      if (fixture) {
        const home = fixture.home === ctx.clubId
        entries.push({ ...base, opponentId: home ? fixture.away : fixture.home, home })
      }
      return
    }

    let tie: KnockoutTie | Fixture | undefined
    let stillIn = true
    if (info.competition === 'copa') {
      if (!ctx.setup.cup.includes(ctx.clubId)) return
      stillIn = alive(cup, info.round)
      tie = cup[info.round].find((t) => t.home === ctx.clubId || t.away === ctx.clubId)
    } else {
      if (!continental.qualified) return
      if (info.round < groupDays) {
        const group = continental.groups.find((g) => g.table.some((r) => r.clubId === ctx.clubId))
        tie = group?.fixtures[info.round].find(
          (f) => f.home === ctx.clubId || f.away === ctx.clubId
        )
      } else {
        const knockout = continental.knockout
        const r = info.round - groupDays
        const groupsDone = knockout[0].some((t) => t.home !== null)
        if (groupsDone) {
          stillIn = alive(knockout, r)
          tie = knockout[r].find((t) => t.home === ctx.clubId || t.away === ctx.clubId)
        }
      }
    }
    if (!stillIn) return
    if (tie?.home && tie.away) {
      const home = tie.home === ctx.clubId
      entries.push({ ...base, opponentId: home ? tie.away : tie.home, home })
    } else if (base.match === undefined) {
      entries.push({ ...base, opponentId: null, home: true })
    }
  })
  return entries
}

const viewCache = new Map<string, SeasonView>()

export function buildSeasonView(ctx: SeasonContext, playerName: string): SeasonView {
  const key = [
    ctx.careerId,
    ctx.season,
    ctx.clubId,
    ctx.playedSlots,
    ctx.clubMatches.length,
    ctx.bonusGoals,
    ctx.setup.league.join(','),
    ctx.setup.continentalCup ?? '',
    playerName
  ].join('|')
  const cached = viewCache.get(key)
  if (cached) return cached

  const cup = cupBracket(ctx)
  const continental = continentalCup(ctx)
  const stats = leagueStats(ctx, playerName)
  const { countryId, division } = ctx.setup
  const view: SeasonView = {
    season: ctx.season,
    clubId: ctx.clubId,
    countryId,
    division,
    leagueName: divisionName(countryId, division),
    cupName: cupName(countryId),
    continentalName: continentalFormat(ctx.setup).name,
    continentalRoundNames: continentalNames(ctx.setup),
    playedSlots: ctx.playedSlots,
    leagueRounds: leagueRounds(ctx.setup),
    calendar: clubCalendar(ctx, cup, continental),
    leagueTable: leagueTable(ctx),
    cup,
    continental,
    scorers: stats.scorers,
    assists: stats.assists
  }
  if (viewCache.size > 20) viewCache.clear()
  viewCache.set(key, view)
  return view
}

/** Hasta dónde llegó tu club en una eliminatoria ("Campeón", "Final", "Semifinales"…). */
export function knockoutReach(
  ties: KnockoutTie[][],
  clubId: string,
  roundNames: readonly string[],
  firstRound = 0
): string | null {
  let reached: string | null = null
  ties.forEach((round, i) => {
    const tie = round.find((t) => t.home === clubId || t.away === clubId)
    if (!tie) return
    reached = roundNames[firstRound + i]
    if (i === ties.length - 1 && tie.winner === clubId) reached = 'Campeón'
  })
  return reached
}

/** Todos los clubes del país ordenados por nivel. */
export function countryClubsByStrength(countryId: NationalityId): Club[] {
  return ALL_CLUBS.filter((c) => c.countryId === countryId).sort(
    (a, b) => b.strength - a.strength || a.id.localeCompare(b.id)
  )
}
