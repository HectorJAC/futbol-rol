import { getClub } from '../data/clubs'
import { MATCH_MOMENTS } from '../data/matchMoments'
import type {
  MatchMoment,
  MatchMomentEffects,
  MatchPhase,
  ScoreSituation
} from '../data/matchTypes'
import type { Career, ClubMatch, LiveMatch, MomentResolution } from '../types/career'
import { penaltyShootout, seasonStrength, type ClubFixture } from './competitions'
import { setPieceRoles } from './playerAttributes'
import { clamp, createRng, poisson, randomInt, seedFor, shuffle } from './random'
import { applyEffects, checkChance, clubStrengthWithPlayer, matchRating } from './season'

/**
 * Partidos importantes jugados jugada a jugada (temporadas completas).
 * Hay goles "de fondo" que no dependen de ti (compañeros y rival) y 3–4 jugadas
 * en las que decides tú. El marcador se actualiza después de cada decisión.
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
  const previous = index > 0 ? live.minutes[index - 1] : 0
  const rng = createRng(seedFor(career.id, 'moment', career.season, live.slot, index))
  const times = (m: MatchMoment): number => Number(career.flags[momentTimesFlag(m.id)] ?? 0)
  const roles = setPieceRoles(career)
  // Los balones parados solo los vives si eres el lanzador.
  const unused = MATCH_MOMENTS.filter(
    (m) => m.phase === phase && !live.momentIds.includes(m.id) && (!m.setPiece || roles[m.setPiece])
  )
  const inOrder = unused.filter((m) => (momentMinute(m) ?? 90) > previous)
  const base = inOrder.length > 0 ? inOrder : unused
  // Minuto en el que pasa cada jugada (el que cuenta su texto, si va después de la anterior).
  const minuteOf = (m: MatchMoment): number => {
    const textMinute = momentMinute(m)
    const minute = textMinute !== null && textMinute > previous ? textMinute : live.minutes[index]
    return Math.max(previous + 1, minute)
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
  const isFinal = fixture.knockout && fixture.neutral
  const phases: MatchPhase[] = isFinal
    ? ['inicio', 'medio', 'medio', 'final']
    : ['inicio', 'medio', 'final']
  const minutes = isFinal
    ? [
        randomInt(rng, 8, 26),
        randomInt(rng, 31, 48),
        randomInt(rng, 54, 70),
        randomInt(rng, 77, 88)
      ]
    : [randomInt(rng, 8, 28), randomInt(rng, 36, 66), randomInt(rng, 76, 88)]

  // Los goles de fondo son menos que en un partido normal: el resto depende de tus jugadas.
  const own = clubStrengthWithPlayer(career)
  const opp = seasonStrength(career.id, getClub(fixture.opponentId), career.season)
  const diff = own - opp + (fixture.neutral ? 0 : fixture.home ? 3 : -3)
  const lambdaFor = clamp(1.25 + diff * 0.045, 0.25, 3.4) * 0.55
  const lambdaAgainst = clamp(1.15 - diff * 0.04, 0.2, 3) * 0.75
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
    momentGoalsAgainst: 0
  }
  return withMoment(career, live, 0)
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

/** Resuelve la jugada actual. Igual que en los eventos, la tirada no cambia al recargar. */
export function resolveMoment(career: Career, optionIndex: number): ResolvedMoment {
  const progress = career.seasonProgress
  const live = progress?.liveMatch
  if (!progress || !live) throw new Error('No hay partido en juego')
  const index = live.resolutions.length
  const moment = currentMoment(live)
  if (!moment) throw new Error('El partido ya terminó')
  const option = moment.options[optionIndex]
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
  const successes = live.resolutions.filter((r) => r.roll?.success).length
  const rating = Math.min(
    10,
    matchRating(career, live.playerGoals, live.playerAssists, score.for, score.against, rng) +
      successes * 0.15
  )
  return {
    slot: live.slot,
    competition: live.competition,
    opponentId: live.opponentId,
    home: live.home,
    goalsFor: score.for,
    goalsAgainst: score.against,
    penalties,
    played: true,
    playerGoals: live.playerGoals,
    playerAssists: live.playerAssists,
    rating: Math.round(rating * 10) / 10,
    important: true
  }
}

/** Cierra el partido importante: guarda el resultado y sigue el calendario. */
export function finishLiveMatch(career: Career): Career {
  const progress = career.seasonProgress
  const live = progress?.liveMatch
  if (!progress || !live || !isLiveMatchOver(live)) return career
  return {
    ...career,
    seasonProgress: {
      ...progress,
      clubMatches: [...progress.clubMatches, liveMatchResult(career, live)],
      playedSlots: live.slot + 1,
      liveMatch: null
    }
  }
}
