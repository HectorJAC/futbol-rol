import { getClub } from '../data/clubs'
import { MATCH_MOMENTS } from '../data/matchMoments'
import type {
  MatchMoment,
  MatchMomentEffects,
  MatchMomentOption,
  MatchPhase,
  ScoreSituation
} from '../data/matchTypes'
import type { Career, ClubMatch, LiveMatch, MatchRole, MomentResolution } from '../types/career'
import { leagueRounds, penaltyShootout, seasonStrength, type ClubFixture } from './competitions'
import { baseAttributes, setPieceRoles } from './playerAttributes'
import { clamp, createRng, poisson, randomInt, seedFor, shuffle, type Rng } from './random'
import {
  applyEffects,
  checkChance,
  clubStrengthWithPlayer,
  driftMorale,
  importanceOf,
  matchRating,
  minutesShare,
  seasonContext
} from './season'

/**
 * Partidos importantes jugados jugada a jugada (temporadas completas).
 * Hay goles "de fondo" que no dependen de ti (compañeros y rival) y de 3 a 5
 * jugadas en las que decides tú (2 si sales desde el banquillo). El marcador se
 * actualiza después de cada decisión.
 */

export function getMoment(id: string): MatchMoment {
  const moment = MATCH_MOMENTS.find((m) => m.id === id)
  if (!moment) throw new Error(`Jugada desconocida: ${id}`)
  return moment
}

const momentTimesFlag = (id: string): string => `times:moment:${id}`

/** Marcador antes del minuto indicado: goles de fondo previos + goles de las jugadas ya resueltas. */
export function scoreBefore(live: LiveMatch, minute: number): { for: number; against: number } {
  const bg = live.background.filter((g) => g.minute < minute)
  return {
    for: bg.filter((g) => g.side === 'for').length + live.momentGoalsFor,
    against: bg.filter((g) => g.side === 'against').length + live.momentGoalsAgainst
  }
}

/** Marcador final (todos los goles de fondo + los de tus jugadas). */
export function finalScore(live: LiveMatch): { for: number; against: number } {
  return scoreBefore(live, 91)
}

function situationOf(score: { for: number; against: number }): ScoreSituation {
  return score.for > score.against
    ? 'ganando'
    : score.for < score.against
      ? 'perdiendo'
      : 'empatando'
}

/** Minuto que cuenta el texto de la jugada ("Minuto 63."). */
export function momentMinute(moment: MatchMoment): number | null {
  const match = /minuto\s+(\d+)/i.exec(moment.text)
  return match ? Number(match[1]) : null
}

/** Texto de la jugada según tu edad (algunas tienen una versión para menores de 25). */
export function momentText(moment: MatchMoment, career: Pick<Career, 'age'>): string {
  return moment.youngText && career.age < 25 ? moment.youngText : moment.text
}

export interface Lineup {
  role: MatchRole
  enterMinute?: number
  exitMinute?: number
}

/**
 * Convocatoria de un partido importante. Eres titular según la parte de los
 * partidos que juegas; si no, sales desde el banquillo o no vas convocado. Un
 * titular puede ser sustituido (más probable con poca resistencia o veterano).
 */
export function lineupFor(career: Career, rng: Rng): Lineup {
  const share = minutesShare(career)
  const roll = rng()
  if (roll < share) {
    const stamina = baseAttributes(career).stamina
    const subOff = clamp(0.32 - (stamina - 10) * 0.025 + (career.age >= 31 ? 0.1 : 0), 0.08, 0.45)
    return rng() < subOff
      ? { role: 'titular', exitMinute: randomInt(rng, 66, 82) }
      : { role: 'titular' }
  }
  if (roll < share + (1 - share) * 0.6) {
    return { role: 'suplente', enterMinute: randomInt(rng, 50, 72) }
  }
  return { role: 'noConvocado' }
}

/**
 * Jugadas que vives como titular según la relevancia del partido: 3 en un
 * partido grande, 4 en un clásico, un derbi, una semifinal o la lucha por el
 * título al final de la liga, y 5 en una final. En las copas continentales,
 * una más (hasta 5).
 */
export function momentCount(career: Career, fixture: ClubFixture): number {
  const reason = importanceOf(career, fixture)
  let count = 3
  if (reason === 'final') count = 5
  else if (reason === 'semifinal' || reason === 'clasico' || reason === 'derbi') count = 4
  else if (reason === 'segundo' || reason === 'descenso') {
    const rounds = leagueRounds(seasonContext(career).setup)
    if (fixture.round >= Math.floor((rounds * 2) / 3)) count = 4
  }
  if (fixture.competition === 'continental') count++
  return clamp(count, 3, 5)
}

/** Rangos de minutos de cada jugada (titular sin cambio), de 3 a 5 jugadas. */
const TITULAR_PLAN: Record<number, Array<[MatchPhase, number, number]>> = {
  3: [
    ['inicio', 8, 28],
    ['medio', 36, 66],
    ['final', 76, 88]
  ],
  4: [
    ['inicio', 8, 24],
    ['medio', 31, 46],
    ['medio', 52, 68],
    ['final', 76, 88]
  ],
  5: [
    ['inicio', 5, 12],
    ['inicio', 16, 28],
    ['medio', 33, 46],
    ['medio', 52, 68],
    ['final', 75, 88]
  ]
}

/** Fases y minutos de las jugadas que vives según la convocatoria. */
function momentPlan(
  lineup: Lineup,
  count: number,
  rng: Rng
): { phases: MatchPhase[]; minutes: number[] } {
  if (lineup.role === 'noConvocado') return { phases: [], minutes: [] }
  if (lineup.role === 'suplente') {
    // Desde el banquillo: dos jugadas desde que entras.
    const enter = lineup.enterMinute ?? 60
    return enter <= 62
      ? {
          phases: ['medio', 'final'],
          minutes: [randomInt(rng, enter + 2, 69), randomInt(rng, 76, 88)]
        }
      : {
          phases: ['final', 'final'],
          minutes: [randomInt(rng, enter + 2, 80), randomInt(rng, 83, 89)]
        }
  }
  if (lineup.exitMinute !== undefined) {
    // Titular sustituido: todas las jugadas antes del cambio (al menos 3).
    const last = lineup.exitMinute - 2
    const plan: Array<[MatchPhase, number, number]> =
      count >= 5
        ? [
            ['inicio', 5, 14],
            ['inicio', 17, 28],
            ['medio', 33, 44],
            ['medio', 47, 56],
            ['medio', 58, last]
          ]
        : count === 4
          ? [
              ['inicio', 6, 14],
              ['inicio', 17, 28],
              ['medio', 33, 48],
              ['medio', 52, last]
            ]
          : [
              ['inicio', 8, 26],
              ['medio', 31, 48],
              ['medio', 52, last]
            ]
    return {
      phases: plan.map(([phase]) => phase),
      minutes: plan.map(([, from, to]) => randomInt(rng, from, Math.max(from, to)))
    }
  }
  const plan = TITULAR_PLAN[clamp(count, 3, 5)]
  return {
    phases: plan.map(([phase]) => phase),
    minutes: plan.map(([, from, to]) => randomInt(rng, from, to))
  }
}

/**
 * Elige la jugada número `index` según la fase y cómo va el marcador, y ajusta
 * su minuto al que cuenta el texto (siempre después de la jugada anterior).
 */
export function pickMoment(
  career: Career,
  live: LiveMatch,
  index: number
): { id: string; minute: number } {
  const phase: MatchPhase = live.phases[index]
  // Solo vives jugadas mientras estás en el campo: desde que entras hasta que te cambian.
  const previous = index > 0 ? live.minutes[index - 1] : (live.enterMinute ?? 0)
  const upper = live.exitMinute ?? 100
  const rng = createRng(seedFor(career.id, 'moment', career.season, live.slot, index))
  const times = (m: MatchMoment): number => Number(career.flags[momentTimesFlag(m.id)] ?? 0)
  const roles = setPieceRoles(career)
  // Los balones parados solo los vives si eres el lanzador.
  const usable = (m: MatchMoment): boolean =>
    !live.momentIds.includes(m.id) && (!m.setPiece || roles[m.setPiece])
  const inWindow = (m: MatchMoment, until = upper): boolean => {
    const t = momentMinute(m) ?? 90
    return t > previous && t < until
  }
  // Mejor si cae antes de la siguiente jugada prevista (deja hueco para las demás).
  const nextPlanned = live.minutes[index + 1] ?? upper
  const unused = MATCH_MOMENTS.filter((m) => m.phase === phase && usable(m))
  const spaced = unused.filter((m) => inWindow(m, Math.min(upper, nextPlanned)))
  const inOrder = spaced.length > 0 ? spaced : unused.filter((m) => inWindow(m))
  const otherPhases = MATCH_MOMENTS.filter((m) => m.phase !== phase && usable(m) && inWindow(m))
  const base = inOrder.length > 0 ? inOrder : otherPhases.length > 0 ? otherPhases : unused
  // Minuto en el que pasa cada jugada (el que cuenta su texto, si cae mientras juegas).
  const minuteOf = (m: MatchMoment): number => {
    const textMinute = momentMinute(m)
    const minute =
      textMinute !== null && textMinute > previous && textMinute < upper
        ? textMinute
        : live.minutes[index]
    return clamp(minute, previous + 1, upper - 1)
  }
  // El marcador se mira en el minuto real de la jugada: "vais por detrás" solo si es verdad.
  const fits = (list: MatchMoment[]): MatchMoment[] =>
    list.filter(
      (m) => !m.situations || m.situations.includes(situationOf(scoreBefore(live, minuteOf(m))))
    )
  const inOrderFitting = fits(base)
  const anyFitting = fits(unused)
  const candidates =
    inOrderFitting.length > 0 ? inOrderFitting : anyFitting.length > 0 ? anyFitting : base
  const pool = shuffle(rng, candidates).sort((a, b) => times(a) - times(b))
  if (pool.length === 0) throw new Error(`No hay jugadas para la fase ${phase}`)
  return { id: pool[0].id, minute: minuteOf(pool[0]) }
}

/** Añade la jugada elegida (y su minuto) al partido. */
function withMoment(career: Career, live: LiveMatch, index: number): LiveMatch {
  const { id, minute } = pickMoment(career, live, index)
  const minutes = [...live.minutes]
  minutes[index] = minute
  // Las jugadas siguientes nunca pueden ir antes que esta.
  for (let i = index + 1; i < minutes.length; i++) minutes[i] = Math.max(minutes[i], minute + 1)
  return { ...live, minutes, momentIds: [...live.momentIds, id] }
}

/** Prepara un partido importante: minutos de las jugadas y goles de fondo. */
export function createLiveMatch(career: Career, fixture: ClubFixture): LiveMatch {
  const rng = createRng(seedFor(career.id, 'live', career.season, fixture.slot))
  const count = momentCount(career, fixture)
  const lineup = lineupFor(career, rng)
  const { phases, minutes } = momentPlan(lineup, count, rng)

  // Los goles de fondo son menos que en un partido normal: el resto depende de
  // tus jugadas. Cuantas menos jugadas vives (suplente, no convocado), más goles de fondo.
  const share = Math.min(1, phases.length / count)
  const own = clubStrengthWithPlayer(career)
  const opp = seasonStrength(career.id, getClub(fixture.opponentId), career.season)
  const diff = own - opp + (fixture.neutral ? 0 : fixture.home ? 3 : -3)
  // Con más jugadas tuyas, menos goles de fondo a favor (el marcador sigue siendo realista).
  const ownPart = clamp(0.55 - (count - 3) * 0.15, 0.25, 0.55)
  const lambdaFor = clamp(1.25 + diff * 0.045, 0.25, 3.4) * (ownPart + (1 - ownPart) * (1 - share))
  const lambdaAgainst = clamp(1.15 - diff * 0.04, 0.2, 3) * (0.75 + 0.25 * (1 - share))
  const background: LiveMatch['background'] = []
  for (let i = poisson(rng, lambdaFor); i > 0; i--) {
    background.push({ minute: randomInt(rng, 1, 90), side: 'for' })
  }
  for (let i = poisson(rng, lambdaAgainst); i > 0; i--) {
    background.push({ minute: randomInt(rng, 1, 90), side: 'against' })
  }
  background.sort((a, b) => a.minute - b.minute)

  const live: LiveMatch = {
    slot: fixture.slot,
    competition: fixture.competition,
    round: fixture.round,
    opponentId: fixture.opponentId,
    home: fixture.home,
    knockout: fixture.knockout,
    neutral: fixture.neutral,
    phases,
    minutes,
    momentIds: [],
    resolutions: [],
    background,
    playerGoals: 0,
    playerAssists: 0,
    momentGoalsFor: 0,
    momentGoalsAgainst: 0,
    role: lineup.role,
    ...(lineup.enterMinute !== undefined ? { enterMinute: lineup.enterMinute } : {}),
    ...(lineup.exitMinute !== undefined ? { exitMinute: lineup.exitMinute } : {}),
    started: false
  }
  return phases.length > 0 ? withMoment(career, live, 0) : live
}

/** ¿Hay que enseñar la convocatoria antes de empezar? (los partidos de antes de la v0.11 no la tienen) */
export function needsLineup(live: LiveMatch): boolean {
  return live.role !== undefined && !live.started
}

/** Empieza el partido tras ver la convocatoria. */
export function startLiveMatch(career: Career): Career {
  const p = career.seasonProgress
  if (!p?.liveMatch) return career
  return { ...career, seasonProgress: { ...p, liveMatch: { ...p.liveMatch, started: true } } }
}

/** Jugada que toca decidir ahora, o `null` si ya se decidieron todas. */
export function currentMoment(live: LiveMatch): MatchMoment | null {
  const index = live.resolutions.length
  return index < live.momentIds.length ? getMoment(live.momentIds[index]) : null
}

export function isLiveMatchOver(live: LiveMatch): boolean {
  return live.resolutions.length >= live.phases.length
}

/** Cambia `{rival}` y `{club}` por los nombres reales. */
export function fillMomentText(text: string, career: Career, live: LiveMatch): string {
  return text
    .replaceAll('{rival}', getClub(live.opponentId).name)
    .replaceAll('{club}', getClub(career.clubId).name)
}

export interface ResolvedMoment {
  career: Career
  resolution: MomentResolution
  effects: MatchMomentEffects
}

/** Opciones de una jugada: si eres el capitán, las que tienen otra versión para ti. */
export function momentOptions(
  moment: MatchMoment,
  career: Pick<Career, 'captaincy'>
): MatchMomentOption[] {
  if (!career.captaincy) return moment.options
  return moment.options.map((option) => {
    const variant = option.asCaptain
    if (!variant) return option
    return {
      ...option,
      label: variant.label,
      ...(option.check
        ? {
            check: {
              ...option.check,
              success: {
                ...option.check.success,
                text: variant.success ?? option.check.success.text
              },
              failure: {
                ...option.check.failure,
                text: variant.failure ?? option.check.failure.text
              }
            }
          }
        : {})
    }
  })
}

/** Resuelve la jugada actual. Igual que en los eventos, la tirada no cambia al recargar. */
export function resolveMoment(career: Career, optionIndex: number): ResolvedMoment {
  const progress = career.seasonProgress
  const live = progress?.liveMatch
  if (!progress || !live) throw new Error('No hay partido en juego')
  const index = live.resolutions.length
  const moment = currentMoment(live)
  if (!moment) throw new Error('El partido ya terminó')
  const option = momentOptions(moment, career)[optionIndex]
  if (!option) throw new Error(`Opción ${optionIndex} no existe en ${moment.id}`)

  let effects: MatchMomentEffects
  let resolution: MomentResolution
  const minute = live.minutes[index]
  if (option.check) {
    const chance = checkChance(career, option.check)
    const rng = createRng(seedFor(career.id, 'moment-roll', career.season, live.slot, index))
    const roll = rng()
    const success = roll < chance
    const outcome = success ? option.check.success : option.check.failure
    effects = outcome.effects
    resolution = {
      momentId: moment.id,
      minute,
      optionIndex,
      roll: { attribute: option.check.attribute, chance, roll, success },
      text: outcome.text
    }
  } else {
    const outcome = option.outcome ?? { text: '', effects: {} }
    effects = outcome.effects
    resolution = { momentId: moment.id, minute, optionIndex, text: outcome.text }
  }

  const { playerGoals = 0, playerAssists = 0, teamGoals = 0, opponentGoals = 0, ...rest } = effects
  const applied = applyEffects(career, rest)
  let nextLive: LiveMatch = {
    ...live,
    resolutions: [...live.resolutions, resolution],
    playerGoals: live.playerGoals + playerGoals,
    playerAssists: live.playerAssists + playerAssists,
    momentGoalsFor: live.momentGoalsFor + playerGoals + playerAssists + teamGoals,
    momentGoalsAgainst: live.momentGoalsAgainst + opponentGoals
  }
  const withFlags: Career = {
    ...applied,
    flags: {
      ...applied.flags,
      [momentTimesFlag(moment.id)]: Number(applied.flags[momentTimesFlag(moment.id)] ?? 0) + 1
    }
  }
  if (index + 1 < live.phases.length) {
    nextLive = withMoment(withFlags, nextLive, index + 1)
  }
  return {
    effects,
    resolution,
    career: {
      ...withFlags,
      seasonProgress: withFlags.seasonProgress && {
        ...withFlags.seasonProgress,
        liveMatch: nextLive
      }
    }
  }
}

/** Resultado final del partido importante (con penaltis si hace falta). */
export function liveMatchResult(career: Career, live: LiveMatch): ClubMatch {
  const rng = createRng(seedFor(career.id, 'live-end', career.season, live.slot))
  const score = finalScore(live)
  let penalties: ClubMatch['penalties']
  if (live.knockout && score.for === score.against) {
    const [pf, pa] = penaltyShootout(rng)
    penalties = { for: pf, against: pa }
  }
  const played = live.role !== 'noConvocado'
  const rolls = live.resolutions.filter((r) => r.roll)
  const successes = rolls.filter((r) => r.roll?.success).length
  const failures = rolls.length - successes
  const base = matchRating(
    career,
    live.playerGoals,
    live.playerAssists,
    score.for,
    score.against,
    rng,
    live.role === 'suplente'
  )
  // Las jugadas bien resueltas suben la nota; las que salen mal la bajan un poco.
  const rating = clamp(base + successes * 0.15 - failures * 0.1, 5, 10)
  return {
    slot: live.slot,
    competition: live.competition,
    opponentId: live.opponentId,
    home: live.home,
    goalsFor: score.for,
    goalsAgainst: score.against,
    penalties,
    played,
    squad: live.role === 'titular' ? 'titular' : live.role === 'suplente' ? 'suplente' : 'fuera',
    playerGoals: live.playerGoals,
    playerAssists: live.playerAssists,
    rating: played ? Math.round(rating * 10) / 10 : undefined,
    important: true
  }
}

/** Cierra el partido importante: guarda el resultado y sigue el calendario. */
export function finishLiveMatch(career: Career): Career {
  const progress = career.seasonProgress
  const live = progress?.liveMatch
  if (!progress || !live || !isLiveMatchOver(live)) return career
  return driftMorale(
    {
      ...career,
      seasonProgress: {
        ...progress,
        clubMatches: [...progress.clubMatches, liveMatchResult(career, live)],
        playedSlots: live.slot + 1,
        liveMatch: null
      }
    },
    live.slot
  )
}
