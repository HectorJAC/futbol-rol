import { ATTRIBUTE_MIN, ATTRIBUTES, BASE_ATTRIBUTES, clampAttribute } from '../data/attributes'
import { getClub, isClubId } from '../data/clubs'
import { CONTINENTAL_CUP_IDS } from '../data/continentalCups'
import { LEAGUES } from '../data/leagues'
import { EVENTS } from '../data/events'
import { attributeScale, isValidMode, MAX_CUSTOM_SEASONS, type GameMode } from '../data/gameModes'
import { MATCH_MOMENTS } from '../data/matchMoments'
import { NATIONALITIES, type NationalityId } from '../data/nationalities'
import { nationalOriginByArchetype, ORIGINS, type OriginArchetype } from '../data/origins'
import { POSITIONS } from '../data/positions'
import { SHOP_ITEMS } from '../data/shop'
import { TROPHIES } from '../data/trophies'
import { isValidSaveId, type SaveFile } from '../../../shared/saves'
import type { Career, Flags, SeasonSetup, Teammate } from '../types/career'
import { validateName } from './characterName'
import {
  buildSeasonSetup,
  initialContinentalTeams,
  initialDivisions,
  totalSlots
} from './competitions'
import { buildContract, marketWage, TIER_WAGE } from './finance'
import { initialStanding, MAX_PENDING_POINTS, spreadEvents } from './season'
import { generateTeammates, MAX_EX_TEAMMATES, relationsFromFlags, ROSTER_ROLES } from './teammates'

/**
 * Versión del formato de guardado. Súbela cuando cambie la forma de `Career`
 * y añade la migración correspondiente en `migrate`.
 * - v1 (juego v0.2): personaje, origen, atributos y club.
 * - v2 (juego v0.3): + confianza, moral, fama, temporada en curso e historial (palmarés).
 * - v3 (juego v0.7): + modo de juego, 4 atributos nuevos, orígenes por país, dinero,
 *   contrato, compras y calendario de partidos en la temporada en curso.
 * - v4 (juego v0.8): clubes parecidos a los reales en primera y segunda división,
 *   ascensos y descensos, puntos de atributo pendientes y sueldo mensual.
 * - v5 (juego v0.10): atributos de balón parado y escala por modo (20/30/50),
 *   compañeros y excompañeros, capitanía, club objetivo y tres copas europeas.
 */
export const SAVE_VERSION = 5

export function toSaveFile(career: Career): SaveFile {
  return {
    version: SAVE_VERSION,
    summary: {
      id: career.id,
      playerName: career.character.name,
      nationalityId: career.character.nationalityId,
      clubName: getClub(career.clubId).name,
      season: career.season,
      updatedAt: career.updatedAt
    },
    career
  }
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
const isPercent = (v: unknown): boolean => typeof v === 'number' && v >= 0 && v <= 100
const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0

const OLD_ORIGINS: OriginArchetype[] = ['barrio', 'academia', 'herencia', 'tardio']

/** Clubes destacados de antes de la v0.8: país y papel en el primer contrato (0 grande … 2 modesto). */
const LEGACY_FEATURED: Record<string, number> = {
  'arg-riberas': 0,
  'arg-pampa': 1,
  'arg-puertosur': 2,
  'bra-guanabara': 0,
  'bra-planalto': 1,
  'bra-litoral': 2,
  'esp-meseta': 0,
  'esp-atalaya': 1,
  'esp-cantabrica': 2,
  'fra-lumiere': 0,
  'fra-provence': 1,
  'fra-bretagne': 2,
  'eng-thameside': 0,
  'eng-northgate': 1,
  'eng-harbour': 2,
  'ger-rheinstadt': 0,
  'ger-isartal': 1,
  'ger-elbe': 2,
  'ita-tevere': 0,
  'ita-vesuvio': 1,
  'ita-brianza': 2,
  'jpn-skyline': 0,
  'jpn-kaido': 1,
  'jpn-snowowls': 2,
  'usa-hudson': 0,
  'usa-lonestar': 1,
  'usa-cascadia': 2
}

/** Club de antes de la v0.8 → club equivalente de ahora (mismo país y nivel parecido). */
export function mapLegacyClub(id: unknown): string | null {
  if (isClubId(id)) return id
  if (typeof id !== 'string') return null
  const country = NATIONALITIES.find((n) => id.startsWith(`${n.id.toLowerCase()}-`))
  if (!country) return null
  return LEAGUES[country.id].firstOffers[LEGACY_FEATURED[id] ?? 2]
}

/** Cambia los ids de club antiguos en una partida de antes de la v0.8. */
function mapLegacyClubs(c: Record<string, unknown>): Record<string, unknown> | null {
  const clubId = mapLegacyClub(c.clubId)
  if (!clubId) return null
  const history = Array.isArray(c.history)
    ? c.history.map((r) => {
        if (!isObject(r)) return r
        // Los partidos y tablas antiguas eran de otras ligas: se quitan.
        const { clubMatches, finalTable, ...rest } = r
        void clubMatches
        void finalTable
        return { ...rest, clubId: mapLegacyClub(r.clubId) ?? clubId }
      })
    : c.history
  const contract = isObject(c.contract)
    ? { ...c.contract, clubId: mapLegacyClub(c.contract.clubId) ?? clubId }
    : c.contract
  const flags = isObject(c.flags) ? { ...c.flags } : c.flags
  if (isObject(flags) && typeof flags.rejectedFirstOffers === 'string') {
    flags.rejectedFirstOffers = flags.rejectedFirstOffers
      .split(',')
      .map((old) => mapLegacyClub(old))
      .filter((x): x is string => !!x)
      .join(',')
  }
  return { ...c, clubId, history, contract, flags }
}

/** v3 → v4: divisiones, clasificados internacionales, puntos pendientes y calendario nuevo. */
function migrateV3(c: Record<string, unknown>): Record<string, unknown> | null {
  if (!isClubId(c.clubId)) return null
  const divisions = initialDivisions()
  const continentalTeams = initialContinentalTeams(divisions)
  const progress = isObject(c.seasonProgress) ? c.seasonProgress : null
  const eventIds = progress && Array.isArray(progress.eventIds) ? progress.eventIds : []
  const setup = buildSeasonSetup(divisions, continentalTeams, c.clubId)
  return {
    ...c,
    divisions,
    continentalTeams,
    pendingPoints: 0,
    seasonProgress: progress && {
      ...progress,
      setup,
      salaryPaid: 0,
      eventSlots: spreadEvents(eventIds.length, totalSlots(setup)),
      playedSlots: 0,
      clubMatches: [],
      liveMatch: null,
      injuredUntil: 0
    }
  }
}

/**
 * v4 → v5: atributos de balón parado, escala de atributos del modo, compañeros
 * (con la relación que dejaron las decisiones antiguas), excompañeros de los
 * clubes anteriores y clasificados por copa internacional.
 */
function migrateV4(c: Record<string, unknown>): Record<string, unknown> | null {
  if (!isClubId(c.clubId) || !isObject(c.attributes) || !isValidMode(c.mode)) return null
  const max = attributeScale(c.mode)
  const source = { ...BASE_ATTRIBUTES, ...c.attributes } as Record<string, unknown>
  const attributes = Object.fromEntries(
    ATTRIBUTES.map(({ id }) => {
      const value = typeof source[id] === 'number' ? (source[id] as number) : BASE_ATTRIBUTES[id]
      return [id, clampAttribute(Math.round((value * max) / 20), max)]
    })
  )
  const season = typeof c.season === 'number' ? c.season : 1
  const flags = (isObject(c.flags) ? c.flags : {}) as Flags
  const history = Array.isArray(c.history) ? c.history.filter(isObject) : []
  const previousClubs = [...new Set(history.map((r) => r.clubId).reverse())].filter(
    (id): id is string => isClubId(id) && id !== c.clubId
  )
  const exTeammates: Teammate[] = previousClubs
    .flatMap((clubId) =>
      generateTeammates(clubId, 1).map((t) => ({ ...t, relation: t.role === 'amigo' ? 62 : 55 }))
    )
    .slice(0, MAX_EX_TEAMMATES)
  const divisions = isValidDivisions(c.divisions) ? c.divisions : initialDivisions()
  const pending = typeof c.pendingPoints === 'number' ? c.pendingPoints : 0
  return {
    ...c,
    attributes,
    divisions,
    pendingPoints: Math.round((pending * max) / 20),
    continentalTeams: Array.isArray(c.continentalTeams)
      ? initialContinentalTeams(divisions as Career['divisions'])
      : c.continentalTeams,
    teammates: relationsFromFlags(generateTeammates(c.clubId, season), flags),
    exTeammates,
    captaincy: null,
    transferTarget: null
  }
}

/** v2 → v3. Las partidas antiguas pasan al modo Completa (decisiones en todas las temporadas). */
function migrateV2(c: Record<string, unknown>): Record<string, unknown> | null {
  if (!isObject(c.character) || !isObject(c.attributes) || !isClubId(c.clubId)) return null
  const nationalityId = c.character.nationalityId as NationalityId
  const archetype = c.originId as OriginArchetype
  if (!OLD_ORIGINS.includes(archetype)) return null
  const origin = nationalOriginByArchetype(nationalityId, archetype)
  if (!origin) return null

  const season = typeof c.season === 'number' ? c.season : 1
  const reputation = typeof c.reputation === 'number' ? c.reputation : 0
  const mode: GameMode = {
    id: 'completa',
    seasons: Math.min(MAX_CUSTOM_SEASONS, Math.max(20, season)),
    decisionInterval: 1
  }
  const history = Array.isArray(c.history) ? c.history : []
  // Lo que habría cobrado en las temporadas ya jugadas.
  const money = history.reduce<number>((sum, r) => {
    const tier = isObject(r) && isClubId(r.clubId) ? getClub(r.clubId).tier : 'modesto'
    return sum + TIER_WAGE[tier] * 52
  }, 0)
  const tier = getClub(c.clubId).tier

  const progress = isObject(c.seasonProgress) ? c.seasonProgress : null
  const eventIds = progress && Array.isArray(progress.eventIds) ? progress.eventIds : []

  return {
    ...c,
    originId: origin.id,
    mode,
    attributes: { ...BASE_ATTRIBUTES, ...c.attributes },
    money,
    contract: buildContract(
      c.clubId,
      marketWage({ reputation, season }, tier),
      'Rotación',
      season,
      3
    ),
    purchases: [],
    seasonProgress: progress && {
      ...progress,
      eventSlots: spreadEvents(eventIds.length, eventIds.length),
      eventMoney: 0,
      playedSlots: 0,
      clubMatches: [],
      liveMatch: null,
      injuredUntil: 0
    }
  }
}

/** Lleva una partida antigua al formato actual. Devuelve `null` si la versión no se conoce. */
function migrate(version: number, career: unknown): unknown {
  if (!isObject(career)) return null
  let c: Record<string, unknown> | null = career
  if (version < 4) {
    c = mapLegacyClubs(c)
    if (!c) return null
  }
  if (version === 1) {
    const club = isClubId(c.clubId) ? getClub(c.clubId) : null
    const nationalityId = isObject(c.character)
      ? (c.character.nationalityId as NationalityId)
      : null
    const origin =
      nationalityId && nationalOriginByArchetype(nationalityId, c.originId as OriginArchetype)
    if (!club || !origin) return null
    c = {
      ...c,
      ...initialStanding(club.tier, origin.id),
      seasonProgress: null,
      history: []
    }
    version = 2
  }
  if (version === 2) {
    c = migrateV2(c)
    if (!c) return null
    version = 3
  }
  if (version === 3) {
    c = migrateV3(c)
    if (!c) return null
    version = 4
  }
  if (version === 4) {
    c = migrateV4(c)
    if (!c) return null
    version = 5
  }
  return version === SAVE_VERSION ? c : null
}

function isValidHistory(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (r) =>
        isObject(r) &&
        typeof r.season === 'number' &&
        typeof r.goals === 'number' &&
        typeof r.matches === 'number' &&
        isClubId(r.clubId) &&
        Array.isArray(r.trophies) &&
        r.trophies.every((t) => TROPHIES.some((info) => info.id === t))
    )
  )
}

function isValidClubMatch(m: unknown): boolean {
  return (
    isObject(m) &&
    isCount(m.slot) &&
    isClubId(m.opponentId) &&
    isCount(m.goalsFor) &&
    isCount(m.goalsAgainst) &&
    isCount(m.playerGoals) &&
    isCount(m.playerAssists)
  )
}

function isValidLiveMatch(value: unknown): boolean {
  if (value === null) return true
  return (
    isObject(value) &&
    isCount(value.slot) &&
    isClubId(value.opponentId) &&
    Array.isArray(value.phases) &&
    Array.isArray(value.minutes) &&
    Array.isArray(value.resolutions) &&
    Array.isArray(value.background) &&
    Array.isArray(value.momentIds) &&
    value.momentIds.every((id) => MATCH_MOMENTS.some((m) => m.id === id))
  )
}

const isClubList = (v: unknown): v is string[] => Array.isArray(v) && v.every(isClubId)

function isValidSetup(value: unknown): value is SeasonSetup {
  return (
    isObject(value) &&
    NATIONALITIES.some((n) => n.id === value.countryId) &&
    (value.division === 1 || value.division === 2) &&
    isClubList(value.league) &&
    value.league.length >= 4 &&
    value.league.length % 2 === 0 &&
    isClubList(value.cup) &&
    isClubList(value.continental) &&
    (value.continentalCup === undefined ||
      CONTINENTAL_CUP_IDS.includes(value.continentalCup as never))
  )
}

function isValidQualifiers(value: unknown): boolean {
  return isObject(value) && CONTINENTAL_CUP_IDS.every((cup) => isClubList(value[cup]))
}

function isValidTeammates(value: unknown): value is Teammate[] {
  return (
    Array.isArray(value) &&
    value.every(
      (t) =>
        isObject(t) &&
        typeof t.id === 'string' &&
        typeof t.name === 'string' &&
        ROSTER_ROLES.includes(t.role as never) &&
        isClubId(t.clubId) &&
        isPercent(t.relation) &&
        isCount(t.since)
    )
  )
}

const isNullOr = (value: unknown, check: (v: Record<string, unknown>) => boolean): boolean =>
  value === null || (isObject(value) && check(value))

function isValidDivisions(value: unknown): value is Career['divisions'] {
  return (
    isObject(value) &&
    NATIONALITIES.every((n) => {
      const pair = value[n.id]
      return Array.isArray(pair) && pair.length === 2 && isClubList(pair[0]) && isClubList(pair[1])
    })
  )
}

function isValidSeasonProgress(value: unknown): boolean {
  if (value === null) return true
  return (
    isObject(value) &&
    isValidSetup(value.setup) &&
    isCount(value.salaryPaid) &&
    Array.isArray(value.eventIds) &&
    value.eventIds.every((id) => EVENTS.some((e) => e.id === id)) &&
    Array.isArray(value.eventSlots) &&
    value.eventSlots.length === value.eventIds.length &&
    Array.isArray(value.resolutions) &&
    value.resolutions.length <= value.eventIds.length &&
    typeof value.bonusGoals === 'number' &&
    typeof value.eventMoney === 'number' &&
    isCount(value.playedSlots) &&
    value.playedSlots <= totalSlots(value.setup) &&
    Array.isArray(value.clubMatches) &&
    value.clubMatches.every(isValidClubMatch) &&
    isValidLiveMatch(value.liveMatch) &&
    isCount(value.injuredUntil)
  )
}

function isValidContract(value: unknown): boolean {
  return (
    isObject(value) &&
    isClubId(value.clubId) &&
    isCount(value.signedSeason) &&
    isCount(value.endSeason) &&
    isCount(value.weeklyWage) &&
    isCount(value.goalBonus) &&
    isCount(value.titleBonus) &&
    isCount(value.releaseClause) &&
    typeof value.role === 'string'
  )
}

function isValidPurchases(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (p) =>
        isObject(p) &&
        SHOP_ITEMS.some((i) => i.id === p.itemId) &&
        isCount(p.season) &&
        isCount(p.cost) &&
        isObject(p.attributes)
    )
  )
}

/** Comprueba que lo leído del disco es una carrera válida (migrando si hace falta). Si no, `null`. */
export function careerFromSaveFile(file: SaveFile): Career | null {
  const c = migrate(file.version, file.career)
  if (!isObject(c) || !isObject(c.character) || !isObject(c.attributes) || !isObject(c.flags)) {
    return null
  }

  const ch = c.character
  const validCharacter =
    typeof ch.name === 'string' &&
    validateName(ch.name) === null &&
    (ch.sex === 'M' || ch.sex === 'F') &&
    POSITIONS.some((p) => p.id === ch.position) &&
    NATIONALITIES.some((n) => n.id === ch.nationalityId)

  const attrs = c.attributes
  const max = isValidMode(c.mode) ? attributeScale(c.mode) : 0
  const validAttributes = ATTRIBUTES.every(({ id }) => {
    const value = attrs[id]
    return (
      typeof value === 'number' && Number.isInteger(value) && value >= ATTRIBUTE_MIN && value <= max
    )
  })

  const valid =
    isValidSaveId(c.id) &&
    typeof c.createdAt === 'string' &&
    typeof c.updatedAt === 'string' &&
    validCharacter &&
    ORIGINS.some((o) => o.id === c.originId) &&
    isValidMode(c.mode) &&
    validAttributes &&
    isClubId(c.clubId) &&
    typeof c.age === 'number' &&
    typeof c.season === 'number' &&
    isPercent(c.trust) &&
    isPercent(c.morale) &&
    isPercent(c.reputation) &&
    isCount(c.money) &&
    isValidContract(c.contract) &&
    isValidPurchases(c.purchases) &&
    isValidDivisions(c.divisions) &&
    isValidQualifiers(c.continentalTeams) &&
    isCount(c.pendingPoints) &&
    c.pendingPoints <= MAX_PENDING_POINTS &&
    isValidTeammates(c.teammates) &&
    isValidTeammates(c.exTeammates) &&
    isNullOr(c.captaincy, (v) => isClubId(v.clubId) && isCount(v.since)) &&
    isNullOr(c.transferTarget, (v) => isClubId(v.clubId) && isCount(v.season)) &&
    isValidSeasonProgress(c.seasonProgress) &&
    isValidHistory(c.history)

  return valid ? (c as unknown as Career) : null
}
