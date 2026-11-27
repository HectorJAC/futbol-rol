import {
  ATTRIBUTES,
  clampAttribute,
  DC_WEIGHTS,
  overallRating,
  scaleDelta,
  type AttributeId
} from '../data/attributes'
import { TRAINING_FOCUS } from '../data/trainingFocus'
import { CONTINENTAL_FORMATS } from '../data/continentalCups'
import { biggestClubs, getClub, isRivalry, isSameCity, type ClubTier } from '../data/clubs'
import { COUNTRY_CURRENCY, formatMoney, type CurrencyId } from '../data/currencies'
import {
  EVENTS,
  getEvent,
  type EventContext,
  type EventEffects,
  type EventOption,
  type FlagCondition,
  type GameEvent,
  type SkillCheck
} from '../data/events'
import {
  eventsPerDecisionSeason,
  hasFullSeasons,
  isDecisionSeason,
  maxTrainingPointsFor
} from '../data/gameModes'
import { NATIONAL_STRENGTH, TOURNAMENT_ROUNDS, tournamentForSeasonEnd } from '../data/nationalTeams'
import { getOrigin } from '../data/origins'
import type { TrophyId } from '../data/trophies'
import type {
  Career,
  ClubMatch,
  EventResolution,
  InjuryRecord,
  NationalTeamSeason,
  SeasonProgress,
  SeasonRecord
} from '../types/career'
import {
  buildSeasonSetup,
  clubFixtureAt,
  continentalCup,
  continentalFormat,
  continentalNames,
  CUP_ROUND_NAMES,
  cupBracket,
  FIRST_YEAR,
  knockoutReach,
  leagueStats,
  leagueTable,
  nextSeasonState,
  penaltyShootout,
  seasonMonth,
  seasonStrength,
  seasonYearLabel,
  simulateScore,
  totalSlots,
  type ClubFixture,
  type SeasonContext
} from './competitions'
import { contractAfterSeason, monthlyWage, seasonEarnings } from './finance'
import { applyInjury } from './injury'
import { createLiveMatch } from './match'
import { applyPartnerEffects } from './partner'
import { addAttributeDeltas, baseAttributes, careerScale, setPieceRoles } from './playerAttributes'
import { clamp, createRng, randomInt, seedFor, shuffle, type Rng } from './random'
import { logRelationChanges } from './relationLog'
import {
  applyRelationEffects,
  averageRelation,
  canBeCaptain,
  featuredExTeammate,
  losesCaptaincy,
  ROLE_PLACEHOLDERS,
  ROSTER_ROLES,
  teammateByRole
} from './teammates'

export { FIRST_YEAR, seasonYearLabel } from './competitions'

/** Valores iniciales de confianza, moral y fama según club y origen. */
export function initialStanding(
  tier: ClubTier,
  originId: Career['originId']
): Pick<Career, 'trust' | 'morale' | 'reputation'> {
  const trust = { grande: 35, medio: 50, modesto: 65 }[tier]
  return { trust, morale: START_MORALE, reputation: getOrigin(originId).reputation }
}

/** Moral con la que empieza la carrera. */
export const START_MORALE = 50

/**
 * Cómo te deja un partido, de −1 (lesionado o sin convocar) a +2 (victoria con
 * gol y gran nota). Jugar ya anima; quedarte en el banquillo pesa.
 */
export function matchMood(m: ClubMatch): number {
  if (m.injured) return -1
  if (!m.played) return m.squad === 'banca' ? -0.5 : -1
  const result = m.goalsFor > m.goalsAgainst ? 0.5 : m.goalsFor < m.goalsAgainst ? -0.5 : 0
  const contribution = m.playerGoals > 0 ? 0.75 : m.playerAssists > 0 ? 0.4 : 0
  const rating = m.rating ?? 6.5
  return 0.25 + result + contribution + (rating >= 7.5 ? 0.5 : rating < 6.2 ? -0.5 : 0)
}

/**
 * Hacia dónde tiende tu moral: cómo te han ido los últimos cinco partidos, la
 * confianza del míster, la relación con el vestuario, la capitanía y la familia.
 */
export function moraleTarget(career: Career): number {
  const recent = (career.seasonProgress?.clubMatches ?? []).slice(-5)
  const form = recent.length > 0 ? recent.reduce((s, m) => s + matchMood(m), 0) / recent.length : 0
  const team = career.teammates.length > 0 ? averageRelation(career) : 50
  const target =
    50 +
    form * 10 +
    (career.trust - 50) * 0.25 +
    (team - 50) * 0.2 +
    (career.captaincy ? 4 : 0) +
    (career.flags.partner === 'casados' ? 3 : 0)
  return Math.round(clamp(target, 10, 95))
}

/**
 * Tras cada partido la moral se acerca un punto a su objetivo (dos si está muy
 * lejos). Cuanto más lejos, más probable: lo que te dio o quitó una decisión
 * dura un tiempo, pero no para siempre.
 */
export function driftMorale(career: Career, slot: number): Career {
  const diff = moraleTarget(career) - career.morale
  if (Math.abs(diff) < 3) return career
  const rng = createRng(seedFor(career.id, 'morale', career.season, slot))
  if (rng() >= Math.min(0.85, Math.abs(diff) / 18)) return career
  const step = Math.abs(diff) >= 15 ? 2 : 1
  return { ...career, morale: clamp(career.morale + Math.sign(diff) * step, 0, 100) }
}

/** ¿Se acabó la carrera? (se juegan las temporadas que marca el modo) */
export function isCareerOver(career: Career): boolean {
  return career.season > career.mode.seasons
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------

/** Etapas de la pareja en las que hay relación (ver `logic/partner.ts`). */
export { ACTIVE_PARTNER } from './partner'

function conditionMet(condition: FlagCondition, career: Career): boolean {
  const value = career.flags[condition.flag]
  if (condition.oneOf && !condition.oneOf.includes(value ?? null)) return false
  const n = typeof value === 'number' ? value : 0
  if (condition.min !== undefined && n < condition.min) return false
  if (condition.max !== undefined && n > condition.max) return false
  if (condition.seasonsSince !== undefined) {
    if (typeof value !== 'number' || career.season - value < condition.seasonsSince) return false
  }
  return true
}

/** Moneda del país en el que juegas ahora. */
export function careerCurrency(career: Career): CurrencyId {
  return COUNTRY_CURRENCY[getClub(career.clubId).countryId]
}

/** ¿El evento depende del último partido? (se decide en el momento, no al empezar la temporada) */
export function isReactiveEvent(event: GameEvent): boolean {
  const c = event.context
  return (
    !!c &&
    (c.lastResult !== undefined ||
      c.minGoalDiff !== undefined ||
      c.minPlayerGoals !== undefined ||
      c.goalDrought !== undefined)
  )
}

/** Último partido de tu club en la temporada en curso. */
export function lastClubMatch(career: Career): ClubMatch | undefined {
  return career.seasonProgress?.clubMatches.at(-1)
}

export function matchResult(m: ClubMatch): 'victoria' | 'empate' | 'derrota' {
  if (m.goalsFor > m.goalsAgainst) return 'victoria'
  if (m.goalsFor < m.goalsAgainst) return 'derrota'
  if (m.penalties) return m.penalties.for > m.penalties.against ? 'victoria' : 'derrota'
  return 'empate'
}

/** ¿Es la primera temporada en un club nuevo tras un fichaje? */
export function isNewClubSeason(career: Career): boolean {
  const previous = career.history.at(-1)
  return previous !== undefined && previous.clubId !== career.clubId
}

function contextMet(context: EventContext, career: Career): boolean {
  const club = getClub(career.clubId)
  if (context.newClub && !isNewClubSeason(career)) return false
  if (context.minPrestige !== undefined && club.prestige < context.minPrestige) return false
  if (context.abroad && club.countryId === career.character.nationalityId) return false
  const matches = career.seasonProgress?.clubMatches ?? []
  const last = matches.at(-1)
  if (
    context.lastResult ||
    context.minGoalDiff !== undefined ||
    context.minPlayerGoals !== undefined
  ) {
    if (!last) return false
    if (context.lastResult && !context.lastResult.includes(matchResult(last))) return false
    if (
      context.minGoalDiff !== undefined &&
      Math.abs(last.goalsFor - last.goalsAgainst) < context.minGoalDiff
    ) {
      return false
    }
    if (context.minPlayerGoals !== undefined && last.playerGoals < context.minPlayerGoals) {
      return false
    }
  }
  if (context.goalDrought !== undefined) {
    const played = matches.filter((m) => m.played).slice(-context.goalDrought)
    if (played.length < context.goalDrought || played.some((m) => m.playerGoals > 0)) return false
  }
  return true
}

export function isEventEligible(event: GameEvent, career: Career): boolean {
  if (event.onlySeason !== undefined && event.onlySeason !== career.season) return false
  if (event.once && career.flags[seenFlag(event.id)]) return false
  if (event.context && !contextMet(event.context, career)) return false
  if (event.minSeason !== undefined && career.season < event.minSeason) return false
  if (event.minAge !== undefined && career.age < event.minAge) return false
  if (event.maxAge !== undefined && career.age > event.maxAge) return false
  if (event.archetypes && !event.archetypes.includes(getOrigin(career.originId).archetype)) {
    return false
  }
  if (event.tiers && !event.tiers.includes(getClub(career.clubId).tier)) return false
  if (event.conditions && !event.conditions.every((c) => conditionMet(c, career))) return false
  if (event.story && !event.story.repeatable && career.flags[seenFlag(event.id)]) return false
  if (event.captain !== undefined && event.captain !== !!career.captaincy) return false
  if (event.setPieceTaker && !setPieceRoles(career)[event.setPieceTaker]) return false
  if (event.notRegularStarter && isRegularStarter(career)) return false
  if (
    event.maxAgeUnlessNew !== undefined &&
    career.age > event.maxAgeUnlessNew &&
    career.history.length > 0 &&
    !isNewClubSeason(career)
  ) {
    return false
  }
  if (event.captaincyOffer && !canBeCaptain(career)) return false
  if (event.teammate) {
    const mate = teammateByRole(career, event.teammate.role)
    if (!mate) return false
    if (event.teammate.min !== undefined && mate.relation < event.teammate.min) return false
    if (event.teammate.max !== undefined && mate.relation > event.teammate.max) return false
  }
  if (event.exTeammate && !featuredExTeammate(career, event)) return false
  if (event.requiresFlags) {
    // Evento de consecuencia: una sola vez por carrera y solo si se dio la decisión previa.
    if (career.flags[seenFlag(event.id)]) return false
    const matches = Object.entries(event.requiresFlags).every(
      ([key, value]) => career.flags[key] === value
    )
    if (!matches) return false
  }
  return true
}

/** Flag que marca un evento de consecuencia (o de historia) como ya vivido. */
export const seenFlag = (eventId: string): string => `seen:${eventId}`
/** Flag con las veces que ha salido un evento (para no repetir siempre los mismos). */
export const timesFlag = (eventId: string): string => `times:${eventId}`

/** Máximo de eventos de consecuencia por temporada (para dejar sitio a eventos nuevos). */
export const MAX_CONSEQUENCES_PER_SEASON = 2

/**
 * Elige los eventos de la temporada, en este orden:
 * 1) fijos (el debut), 2) un capítulo de la historia de la pareja,
 * 3) consecuencias de decisiones anteriores, 4) eventos normales,
 * primero los que menos veces han salido.
 */
export function pickSeasonEvents(
  career: Career,
  count = eventsPerDecisionSeason(career.mode)
): string[] {
  const rng = createRng(seedFor(career.id, 'events', career.season))
  const eligible = EVENTS.filter((e) => isEventEligible(e, career))
  const fixed = eligible.filter((e) => e.onlySeason !== undefined)
  const times = (e: GameEvent): number => Number(career.flags[timesFlag(e.id)] ?? 0)
  const story = shuffle(
    rng,
    eligible.filter((e) => e.story)
  )
    .sort((a, b) => (b.story?.priority ?? 0) - (a.story?.priority ?? 0) || times(a) - times(b))
    .slice(0, 1)
  const consequences = shuffle(
    rng,
    eligible.filter((e) => e.requiresFlags)
  ).slice(0, MAX_CONSEQUENCES_PER_SEASON)
  // Lo que pasa al cambiar de club (la nómina de un grande, otro país) y la
  // propuesta de capitanía salen los primeros.
  const situational = eligible.filter(
    (e) => e.captaincyOffer || (e.context && !isReactiveEvent(e) && !e.requiresFlags)
  )
  const rest = shuffle(
    rng,
    eligible.filter(
      (e) =>
        e.onlySeason === undefined &&
        !e.requiresFlags &&
        !e.story &&
        !e.context &&
        !e.captaincyOffer &&
        !isReactiveEvent(e)
    )
  ).sort((a, b) => times(a) - times(b))
  return [...fixed, ...situational, ...story, ...consequences, ...rest]
    .slice(0, count)
    .map((e) => e.id)
}

/**
 * Al llegar a un evento, mira el último partido: si toca uno que reacciona al
 * resultado (una goleada, un hat-trick…) puede sustituir a un evento normal, y
 * un evento que ya no encaja con lo que ha pasado se cambia por otro.
 */
export function adaptCurrentEvent(career: Career): Career {
  const p = career.seasonProgress
  const id = currentEventId(career)
  if (!p || !id) return career
  const index = p.resolutions.length
  const scheduled = getEvent(id)
  const times = (e: GameEvent): number => Number(career.flags[timesFlag(e.id)] ?? 0)
  const unused = (e: GameEvent): boolean => !p.eventIds.includes(e.id)
  const replaceWith = (next: GameEvent): Career => {
    const eventIds = [...p.eventIds]
    eventIds[index] = next.id
    return { ...career, seasonProgress: { ...p, eventIds } }
  }

  const fits = isEventEligible(scheduled, career)
  const replaceable =
    scheduled.onlySeason === undefined &&
    !scheduled.requiresFlags &&
    !scheduled.story &&
    !scheduled.context &&
    !scheduled.captaincyOffer
  const reactive = EVENTS.filter(
    (e) => isReactiveEvent(e) && unused(e) && isEventEligible(e, career)
  ).sort((a, b) => times(a) - times(b))
  const rng = createRng(seedFor(career.id, 'reactive', career.season, index))
  if (reactive.length > 0 && (replaceable || !fits) && rng() < 0.65) return replaceWith(reactive[0])
  if (fits) return career

  const fallback = shuffle(
    rng,
    EVENTS.filter(
      (e) =>
        unused(e) &&
        e.onlySeason === undefined &&
        !e.requiresFlags &&
        !e.story &&
        !e.context &&
        !e.captaincyOffer &&
        isEventEligible(e, career)
    )
  ).sort((a, b) => times(a) - times(b))
  return fallback.length > 0 ? replaceWith(fallback[0]) : career
}

/**
 * Cambia los huecos del texto por los datos de la carrera: `{pareja}`, `{hijos}`,
 * el último partido (`{marcador}`, `{rival}`, `{goles}`), el dinero
 * (`{dinero:150000}`, en la moneda del país donde juegas), los compañeros
 * (`{capitan}`, `{rivalPuesto}`, `{veterano}`, `{amigo}`, `{joven}`) y el
 * excompañero protagonista (`{excompanero}`, `{exclub}`).
 */
export function fillEventText(text: string, career: Career, featuredId?: string): string {
  let result = text
  for (const role of ROSTER_ROLES) {
    const placeholder = ROLE_PLACEHOLDERS[role]
    if (result.includes(placeholder)) {
      result = result.replaceAll(placeholder, teammateByRole(career, role)?.name ?? 'un compañero')
    }
  }
  if (result.includes('{excompanero}') || result.includes('{exclub}')) {
    const ex = career.exTeammates.find((t) => t.id === featuredId)
    result = result
      .replaceAll('{excompanero}', ex?.name ?? 'un excompañero')
      .replaceAll('{exclub}', ex ? getClub(ex.clubId).name : 'tu antiguo club')
  }
  return fillBasicText(result, career)
}

function fillBasicText(text: string, career: Career): string {
  const partner =
    typeof career.flags.partnerName === 'string' ? career.flags.partnerName : 'tu pareja'
  const last = lastClubMatch(career)
  const score = last
    ? `${Math.max(last.goalsFor, last.goalsAgainst)}-${Math.min(last.goalsFor, last.goalsAgainst)}`
    : ''
  const currency = careerCurrency(career)
  const ex = (career.exPartners ?? []).at(-1)?.name ?? 'tu expareja'
  return text
    .replaceAll('{pareja}', partner)
    .replaceAll('{expareja}', ex)
    .replaceAll('{hijos}', String(Number(career.flags.children ?? 0)))
    .replaceAll('{marcador}', score)
    .replaceAll('{rival}', last ? getClub(last.opponentId).name : 'el rival')
    .replaceAll('{goles}', String(last?.playerGoals ?? 0))
    .replace(/\{dinero:(\d+)\}/g, (_, n: string) => formatMoney(Number(n), currency))
}

/**
 * Atributos que tu equipo más necesita que mejores: los importantes para un
 * delantero en los que estás más lejos de lo que pide el nivel de tu club.
 */
export function teamNeeds(career: Career, count = 3): AttributeId[] {
  const club = getClub(career.clubId)
  const values = baseAttributes(career)
  const max = careerScale(career)
  const target = clamp(6 + club.strength / 9, 10, 16.5)
  return ATTRIBUTES.map(({ id }) => id)
    .filter((id) => career.attributes[id] < max)
    .map((id) => {
      const gap = target - values[id]
      return { id, need: DC_WEIGHTS[id] * gap + gap * 0.005 }
    })
    .sort((a, b) => b.need - a.need || a.id.localeCompare(b.id))
    .slice(0, count)
    .map((x) => x.id)
}

/** Opciones de un evento: las fijas o, en "Horas extra", las que necesita tu equipo. */
export function eventOptions(event: GameEvent, career: Career): EventOption[] {
  if (!event.trainingOptions) return event.options
  const needs = teamNeeds(career)
  if (needs.length === 0) return event.options
  return needs.map((id) => {
    const focus = TRAINING_FOCUS[id]
    const name = ATTRIBUTES.find((a) => a.id === id)?.name ?? id
    return {
      label: `${name}: ${focus.label}`,
      outcome: { text: focus.text, effects: { attributes: { [id]: 1 }, ...focus.extra } }
    }
  })
}

/** Dinero que cuesta una opción (el peor caso si hay tirada). 0 si no cuesta nada. */
export function optionCost(option: EventOption): number {
  const spent = [option.outcome, option.check?.success, option.check?.failure].map(
    (outcome) => -(outcome?.effects.money ?? 0)
  )
  return Math.max(0, ...spent)
}

/**
 * En los eventos con `lockUnaffordable`, una opción que cuesta más de lo que
 * tienes se ve pero no se puede elegir.
 */
export function isOptionLocked(event: GameEvent, option: EventOption, career: Career): boolean {
  return !!event.lockUnaffordable && optionCost(option) > career.money
}

export interface ConsequenceSource {
  /** Temporada de la decisión (si se apuntó al tomarla). */
  season?: number
  eventTitle: string
  optionLabel: string
}

/** Decisiones anteriores que han llevado a este evento de consecuencia. */
export function consequenceSources(event: GameEvent, career: Career): ConsequenceSource[] {
  const result: ConsequenceSource[] = []
  for (const [flag, value] of Object.entries(event.requiresFlags ?? {})) {
    const recorded = career.flagSources?.[flag]
    if (recorded) {
      const source = getEvent(recorded.eventId)
      result.push({
        season: recorded.season,
        eventTitle: fillEventText(source.title, career),
        optionLabel: fillEventText(
          eventOptions(source, career)[recorded.optionIndex]?.label ?? '',
          career
        )
      })
      continue
    }
    // Partidas anteriores a la v0.9: se busca qué opción deja ese flag.
    for (const candidate of EVENTS) {
      const option = candidate.options.find((o) =>
        [o.outcome, o.check?.success, o.check?.failure].some(
          (outcome) => outcome?.effects.flags?.[flag] === value
        )
      )
      if (option) {
        result.push({
          eventTitle: fillEventText(candidate.title, career),
          optionLabel: fillEventText(option.label, career)
        })
        break
      }
    }
  }
  return result
}

/** Probabilidad de superar una tirada: 50 % si atributo = dificultad, ±5 % por punto. */
export function checkChance(
  career: Career,
  check: Pick<SkillCheck, 'attribute' | 'difficulty'>
): number {
  const value = baseAttributes(career)[check.attribute]
  return clamp(0.5 + (value - check.difficulty) * 0.05, 0.05, 0.95)
}

/**
 * Aplica los efectos de una decisión a la carrera (sin mutar el original).
 * `featuredId` es el excompañero protagonista del evento, si lo hay.
 */
export function applyEffects(career: Career, effects: EventEffects, featuredId?: string): Career {
  return applyEffectsDetailed(career, effects, featuredId).career
}

export interface AppliedEffects {
  career: Career
  /** Cambio de etapa con la pareja ("Ya sois novios."), para el texto del resultado. */
  note?: string
  /** Lesión que dejó la decisión. */
  injury?: InjuryRecord
}

/**
 * Como `applyEffects`, pero también devuelve el cambio de etapa con la pareja
 * y la lesión. `reason` es el título del evento (motivo si lo dejáis).
 */
export function applyEffectsDetailed(
  career: Career,
  effects: EventEffects,
  featuredId?: string,
  reason = ''
): AppliedEffects {
  const { attributes } = addAttributeDeltas(career, effects.attributes ?? {})
  const relations = applyRelationEffects(career, effects, featuredId)
  const captaincy =
    effects.becomeCaptain && !career.captaincy
      ? { clubId: career.clubId, since: career.season }
      : career.captaincy
  // Un gasto nunca te deja en negativo: se paga lo que tengas.
  const money = Math.max(-career.money, effects.money ?? 0)
  const merged = { ...career.flags, ...effects.flags }
  for (const [key, delta] of Object.entries(effects.addFlags ?? {})) {
    merged[key] = Number(merged[key] ?? 0) + delta
  }
  // Pareja: relación de 0 a 100, etapas y exparejas (v0.17).
  const partner = applyPartnerEffects(career, merged, effects.partner ?? 0, reason)
  const updated: Career = {
    ...career,
    ...relations,
    captaincy,
    attributes,
    trust: clamp(career.trust + (effects.trust ?? 0), 0, 100),
    morale: clamp(career.morale + (effects.morale ?? 0), 0, 100),
    reputation: clamp(career.reputation + (effects.reputation ?? 0), 0, 100),
    fansOffset: clamp((career.fansOffset ?? 0) + (effects.fans ?? 0), -100, 100),
    money: Math.max(0, career.money + money),
    flags: partner.flags,
    exPartners: partner.exPartners,
    seasonProgress: career.seasonProgress && {
      ...career.seasonProgress,
      bonusGoals: career.seasonProgress.bonusGoals + (effects.goals ?? 0),
      eventMoney: career.seasonProgress.eventMoney + money
    }
  }
  if (!effects.injury) return { career: updated, note: partner.note }
  const injured = applyInjury(updated, effects.injury)
  return { career: injured.career, note: partner.note, injury: injured.record }
}

export interface ResolvedChoice {
  career: Career
  resolution: EventResolution
  effects: EventEffects
}

/** Evento que toca ahora (si el calendario ya llegó a su fecha). */
export function currentEventId(career: Career): string | null {
  const p = career.seasonProgress
  if (!p || p.liveMatch) return null
  const index = p.resolutions.length
  if (index >= p.eventIds.length || p.eventSlots[index] > p.playedSlots) return null
  return p.eventIds[index]
}

/**
 * Resuelve la opción elegida del evento actual. La tirada usa una semilla fija
 * por partida, temporada y evento: recargar no cambia el resultado.
 */
export function resolveChoice(career: Career, optionIndex: number): ResolvedChoice {
  const progress = career.seasonProgress
  if (!progress) throw new Error('No hay temporada en curso')
  const eventIndex = progress.resolutions.length
  const eventId = progress.eventIds[eventIndex]
  if (!eventId) throw new Error('No quedan eventos en esta temporada')
  const event = getEvent(eventId)
  const option = eventOptions(event, career)[optionIndex]
  if (!option) throw new Error(`Opción ${optionIndex} no existe en ${eventId}`)
  if (isOptionLocked(event, option, career)) throw new Error('No tienes dinero suficiente')
  const featured = featuredExTeammate(career, event)?.id

  let resolution: EventResolution
  let effects: EventEffects
  if (option.check) {
    const chance = checkChance(career, option.check)
    const rng = createRng(seedFor(career.id, 'roll', career.season, eventIndex))
    const roll = rng()
    const success = roll < chance
    const outcome = success ? option.check.success : option.check.failure
    effects = outcome.effects
    resolution = {
      eventId,
      optionIndex,
      roll: { attribute: option.check.attribute, chance, roll, success },
      text: outcome.text
    }
  } else {
    const outcome = option.outcome ?? { text: '', effects: {} }
    effects = outcome.effects
    resolution = { eventId, optionIndex, text: outcome.text }
  }

  if (featured) resolution = { ...resolution, featured }
  const eventTitle = fillEventText(event.title, career, featured)
  const applied = applyEffectsDetailed(career, effects, featured, eventTitle)
  const updated = applied.career
  if (applied.injury) resolution = { ...resolution, injury: applied.injury }
  const onceOnly = event.once || event.requiresFlags || (event.story && !event.story.repeatable)
  // Se apunta qué decisión dejó cada flag (para explicar las consecuencias).
  const flagSources = { ...updated.flagSources }
  for (const key of Object.keys(effects.flags ?? {})) {
    flagSources[key] = { eventId, optionIndex, season: career.season }
  }
  const flags = {
    ...updated.flags,
    [timesFlag(eventId)]: Number(updated.flags[timesFlag(eventId)] ?? 0) + 1,
    // Los eventos de consecuencia (y los capítulos únicos de una historia) solo se viven una vez.
    ...(onceOnly ? { [seenFlag(eventId)]: true } : {})
  }
  // Si lo dejáis, el texto todavía nombra a tu expareja.
  const named = updated.flags.partnerName
    ? updated
    : { ...updated, flags: { ...updated.flags, partnerName: career.flags.partnerName ?? '' } }
  const text = [fillEventText(resolution.text, named, featured), applied.note]
    .filter(Boolean)
    .join(' ')
  const final: Career = {
    ...updated,
    flags,
    flagSources,
    seasonProgress: updated.seasonProgress && {
      ...updated.seasonProgress,
      resolutions: [...updated.seasonProgress.resolutions, { ...resolution, text }]
    }
  }
  return {
    effects,
    resolution: { ...resolution, text },
    career: logRelationChanges(career, final, {
      kind: 'evento',
      title: eventTitle,
      detail: fillEventText(option.label, career, featured)
    })
  }
}

/** Reparte los eventos a lo largo del calendario (el primero, al empezar). */
export function spreadEvents(count: number, slots: number): number[] {
  return Array.from({ length: count }, (_, i) => Math.floor((i * slots) / count))
}

export function startSeason(input: Career): Career {
  let career = input
  const decisions = isDecisionSeason(career.mode, career.season)
  // En las temporadas sin decisiones, si el vestuario te quiere de capitán lo eres.
  if (!decisions && canBeCaptain(career)) {
    career = {
      ...career,
      captaincy: { clubId: career.clubId, since: career.season },
      flags: { ...career.flags, captainNamedSeason: career.season }
    }
  }
  const setup = buildSeasonSetup(career.divisions, career.continentalTeams, career.clubId)
  const eventIds = decisions ? pickSeasonEvents(career) : []
  const progress: SeasonProgress = {
    setup,
    salaryPaid: 0,
    eventIds,
    eventSlots: spreadEvents(eventIds.length, totalSlots(setup)),
    resolutions: [],
    bonusGoals: 0,
    eventMoney: 0,
    playedSlots: 0,
    clubMatches: [],
    liveMatch: null,
    injuredUntil: 0
  }
  return { ...career, seasonProgress: progress }
}

/** Huecos del calendario de la temporada en curso. */
export function seasonLength(career: Career): number {
  return career.seasonProgress ? totalSlots(career.seasonProgress.setup) : 0
}

// ---------------------------------------------------------------------------
// Partidos de tu club
// ---------------------------------------------------------------------------

const TIER_MINUTES: Record<ClubTier, number> = { grande: 0.3, medio: 0.55, modesto: 0.8 }
const TIER_LEVEL: Record<ClubTier, number> = { grande: 58, medio: 48, modesto: 40 }

/** Parte de los partidos que juegas: depende de la confianza del míster y de tu nivel. */
export function minutesShare(career: Career): number {
  const club = getClub(career.clubId)
  const overall = overallRating(baseAttributes(career))
  const captain = career.captaincy ? 0.05 : 0
  const share = clamp(
    TIER_MINUTES[club.tier] +
      (career.trust - 50) / 150 +
      (overall - TIER_LEVEL[club.tier]) / 60 +
      captain,
    0.08,
    0.97
  )
  return isUnprovenYoungsterAtGiant(career) ? Math.min(share * 0.55, 0.4) : share
}

export type SquadStatus = 'indiscutible' | 'titular' | 'rotacion' | 'suplente' | 'reserva'

/**
 * Tu sitio en el equipo según los minutos que te da el míster: de titular
 * indiscutible a reserva. `share` es la parte de los partidos que juegas.
 */
export function squadStatus(career: Career): { status: SquadStatus; share: number } {
  const share = minutesShare(career)
  const status: SquadStatus =
    share >= 0.85
      ? 'indiscutible'
      : share >= 0.65
        ? 'titular'
        : share >= 0.45
          ? 'rotacion'
          : share >= 0.25
            ? 'suplente'
            : 'reserva'
  return { status, share }
}

/**
 * ¿Juegas de titular con regularidad? Si eres el capitán, si el míster te da
 * minutos de titular, o si fuiste titular en 3 de tus últimos 5 partidos.
 */
export function isRegularStarter(career: Career): boolean {
  if (career.captaincy) return true
  const { status } = squadStatus(career)
  if (status === 'titular' || status === 'indiscutible') return true
  const recent = (career.seasonProgress?.clubMatches ?? []).slice(-5)
  return recent.filter((m) => m.squad === 'titular').length >= 3
}

/** Títulos colectivos (el resto son premios individuales). */
const TEAM_TROPHIES: TrophyId[] = [
  'liga',
  'segunda',
  'copa',
  'continental',
  'copa-europa',
  'conferencia',
  'intercontinental',
  'mundial',
  'copa-naciones'
]

/** ¿Llega avalado? Buena última temporada, premios individuales o mucha fama. */
export function hasProvenRecord(career: Pick<Career, 'history' | 'reputation'>): boolean {
  const last = career.history.at(-1)
  const individual = career.history
    .flatMap((r) => r.trophies)
    .filter((t) => !TEAM_TROPHIES.includes(t))
  return (
    career.reputation >= 70 ||
    individual.length >= 2 ||
    (last !== undefined && last.rating >= 7.6 && last.goals >= 20)
  )
}

/**
 * En un club de 5 estrellas, un jugador de menos de 22 años en su primera
 * temporada lo tiene muy difícil para ser titular, salvo que llegue avalado.
 */
export function isUnprovenYoungsterAtGiant(career: Career): boolean {
  const club = getClub(career.clubId)
  const firstSeasonHere = career.history.at(-1)?.clubId !== career.clubId
  return club.prestige >= 5 && career.age < 22 && firstSeasonHere && !hasProvenRecord(career)
}

/** Nivel de tu club con tu aportación (un crack que juega mucho sube el nivel del equipo). */
export function clubStrengthWithPlayer(career: Career): number {
  const club = getClub(career.clubId)
  const boost = (overallRating(baseAttributes(career)) - 55) * 0.25 * minutesShare(career)
  return seasonStrength(career.id, club, career.season) + boost
}

/** Probabilidad de que cada gol de tu equipo lo marques tú / lo asistas tú. */
export function scoringChances(career: Career): { goal: number; assist: number } {
  const a = baseAttributes(career)
  return {
    goal: clamp(
      0.1 +
        (a.finishing - 8) * 0.025 +
        (a.offTheBall - 8) * 0.015 +
        (a.composure - 8) * 0.01 +
        (a.heading - 7) * 0.006 +
        (career.morale - 50) / 400,
      0.04,
      0.62
    ),
    assist: clamp(
      0.07 +
        (a.shortPassing - 7) * 0.014 +
        (a.longPassing - 5) * 0.01 +
        (a.dribbling - 7) * 0.008 +
        (a.offTheBall - 8) * 0.004,
      0.02,
      0.38
    )
  }
}

/**
 * Nota de un partido (5–10), al estilo de Sofascore: todos parten de 6,6 y la
 * nota sube con los goles (+1 el primero, +0,9 los siguientes y un extra por
 * el hat-trick) y las asistencias (+0,65), y algo con tu nivel y el resultado.
 * Un suplente con pocos minutos se queda cerca de 6,5. Así, marcar suele dar
 * 7,4–8 y un goleador de 0,75 goles por partido promedia ~7,5 en la temporada.
 */
export function matchRating(
  career: Career,
  goals: number,
  assists: number,
  goalsFor: number,
  goalsAgainst: number,
  rng: Rng,
  sub = false
): number {
  const margin = goalsFor - goalsAgainst
  const result = margin > 0 ? 0.2 : margin === 0 ? 0 : margin <= -3 ? -0.45 : -0.25
  const level = (overallRating(baseAttributes(career)) - 60) / 60
  const goalPoints = goals > 0 ? 1 + (goals - 1) * 0.9 + (goals >= 3 ? 0.3 : 0) : 0
  const involvement = sub ? 0.5 : 1
  const value =
    6.6 +
    (level + result) * involvement +
    goalPoints * (sub ? 0.85 : 1) +
    assists * 0.65 +
    (rng() - 0.5) * 0.7 * involvement
  return Math.round(clamp(value, 5, 10) * 10) / 10
}

/** Probabilidad de lesionarse en un partido: el físico la reduce. */
export function injuryChance(career: Career): number {
  return clamp(0.03 - baseAttributes(career).physique * 0.0012, 0.004, 0.03)
}

/** Probabilidad de marcar un penalti (escala de 20 del atributo Penaltis). */
export function penaltyConversion(career: Career): number {
  return clamp(0.55 + (baseAttributes(career).penalties - 10) * 0.04, 0.5, 0.93)
}

/** Simula un partido de tu club (sin decisiones). */
export function simulateClubMatch(career: Career, fixture: ClubFixture): ClubMatch {
  const p = career.seasonProgress
  const rng = createRng(seedFor(career.id, 'club-match', career.season, fixture.slot))
  const own = clubStrengthWithPlayer(career)
  const opp = seasonStrength(career.id, getClub(fixture.opponentId), career.season)
  const [home, away] = fixture.home
    ? simulateScore(rng, own, opp, fixture.neutral)
    : simulateScore(rng, opp, own, fixture.neutral)
  const goalsFor = fixture.home ? home : away
  const goalsAgainst = fixture.home ? away : home

  let penalties: ClubMatch['penalties']
  if (fixture.knockout && goalsFor === goalsAgainst) {
    const [pf, pa] = penaltyShootout(rng)
    penalties = { for: pf, against: pa }
  }

  const injured = !!p && fixture.slot < p.injuredUntil
  const share = minutesShare(career)
  const roll = rng()
  const starter = !injured && roll < share * 0.85
  const sub = !injured && !starter && roll < share
  const played = starter || sub
  // Si no juegas: en el banquillo sin salir o, si cuentas poco, ni convocado.
  const squad: ClubMatch['squad'] = starter
    ? 'titular'
    : sub
      ? 'suplente'
      : injured
        ? undefined
        : rng() < clamp(0.35 + share * 0.6, 0.3, 0.9)
          ? 'banca'
          : 'fuera'
  const stamina = 0.8 + baseAttributes(career).stamina * 0.01
  const factor = (starter ? 1 : sub ? 0.35 : 0) * stamina
  const chances = scoringChances(career)
  // Si eres el lanzador, algunos goles del equipo salen de tus penaltis, faltas y córners.
  const roles = setPieceRoles(career)
  const free = baseAttributes(career).freeKicks

  let playerGoals = 0
  let playerAssists = 0
  for (let i = 0; i < goalsFor; i++) {
    if (factor > 0 && roles.penalties && rng() < 0.1 * penaltyConversion(career) * factor) {
      playerGoals++
    } else if (factor > 0 && roles.freeKicks && rng() < (0.02 + free * 0.002) * factor) {
      playerGoals++
    } else if (rng() < chances.goal * factor) {
      playerGoals++
    } else if (factor > 0 && roles.corners && rng() < 0.09 * factor) {
      playerAssists++
    } else if (rng() < chances.assist * factor) {
      playerAssists++
    }
  }

  return {
    slot: fixture.slot,
    competition: fixture.competition,
    opponentId: fixture.opponentId,
    home: fixture.home,
    goalsFor,
    goalsAgainst,
    penalties,
    played,
    ...(injured ? { injured: true } : {}),
    ...(squad ? { squad } : {}),
    playerGoals,
    playerAssists,
    rating: played
      ? matchRating(career, playerGoals, playerAssists, goalsFor, goalsAgainst, rng, sub)
      : undefined
  }
}

export function seasonContext(career: Career): SeasonContext {
  const p = career.seasonProgress
  return {
    careerId: career.id,
    season: career.season,
    clubId: career.clubId,
    clubMatches: p?.clubMatches ?? [],
    playedSlots: p?.playedSlots ?? 0,
    bonusGoals: p?.bonusGoals ?? 0,
    setup: p?.setup ?? buildSeasonSetup(career.divisions, career.continentalTeams, career.clubId)
  }
}

export type ImportanceReason =
  | 'grande'
  | 'segundo'
  | 'descenso'
  | 'clasico'
  | 'derbi'
  | 'cuartos'
  | 'semifinal'
  | 'final'
  | 'exClub'

/** Partido contra un club en el que jugaste: derbi de la traición (misma ciudad) o reencuentro. */
export type ExClubKind = 'traicion' | 'exclub'

/**
 * ¿Jugaste en el club rival? (v0.17). Si además es de tu misma ciudad, es un
 * derbi contra el club al que dejaste por su vecino: la traición.
 */
export function exClubKind(
  career: Pick<Career, 'clubId' | 'history'>,
  opponentId: string
): ExClubKind | null {
  if (opponentId === career.clubId) return null
  if (!career.history.some((r) => r.clubId === opponentId)) return null
  return isSameCity(career.clubId, opponentId) ? 'traicion' : 'exclub'
}

/** Puestos de abajo de primera división que cuentan como pelea por no bajar (3 de descenso + 3). */
export const RELEGATION_FIGHT_ZONE = 6
/** Diferencia de puestos con el rival para que sea un duelo directo por la permanencia. */
const RELEGATION_RIVAL_GAP = 3

/** Rondas de las eliminatorias que cuentan como partido importante (desde cuartos). */
const CUP_IMPORTANT_FROM = CUP_ROUND_NAMES.length - 3
const KNOCKOUT_REASONS: Record<string, ImportanceReason> = {
  'Cuartos de final': 'cuartos',
  Semifinales: 'semifinal',
  Final: 'final'
}

/**
 * ¿Por qué es importante un partido? En liga: el clásico y el derbi de la
 * ciudad; contra los 3 clubes más grandes del país y contra el otro equipo de
 * los dos primeros puestos. Si tu club está en descenso o cerca (en primera),
 * lo importante es la pelea por la permanencia: los partidos contra rivales
 * cercanos en la tabla, y ya no los de contra un grande. En las copas: cuartos,
 * semifinales y final.
 */
export function importanceOf(career: Career, fixture: ClubFixture): ImportanceReason | null {
  // Contra un club en el que jugaste, el partido siempre se vive (v0.17).
  const reason = baseImportance(career, fixture)
  return reason ?? (exClubKind(career, fixture.opponentId) ? 'exClub' : null)
}

function baseImportance(career: Career, fixture: ClubFixture): ImportanceReason | null {
  if (fixture.competition === 'copa') {
    const index = fixture.round - CUP_IMPORTANT_FROM
    return index < 0 ? null : (['cuartos', 'semifinal', 'final'] as const)[index]
  }
  if (fixture.competition === 'continental') {
    const names = continentalNames(seasonContext(career).setup)
    return KNOCKOUT_REASONS[names[fixture.round] ?? ''] ?? null
  }
  const rivalry = isRivalry(career.clubId, fixture.opponentId)
  if (rivalry) return rivalry
  const ctx = { ...seasonContext(career), playedSlots: fixture.slot }
  const table = leagueTable(ctx)
  const started = (table[0]?.played ?? 0) >= 4
  // Pelea por no bajar (a partir de la 4ª jornada y solo en primera: de segunda no se baja).
  if (started && ctx.setup.division === 1) {
    const position = (id: string): number => table.findIndex((r) => r.clubId === id)
    const mine = position(career.clubId)
    const fightFrom = table.length - RELEGATION_FIGHT_ZONE
    if (mine >= fightFrom) {
      const theirs = position(fixture.opponentId)
      const close = theirs >= fightFrom || Math.abs(theirs - mine) <= RELEGATION_RIVAL_GAP
      return theirs >= 0 && close ? 'descenso' : null
    }
  }
  const club = getClub(career.clubId)
  if (biggestClubs(club.countryId).includes(fixture.opponentId)) return 'grande'
  // El rival por arriba en la tabla (a partir de la 4ª jornada).
  if (started) {
    const top = table.slice(0, 2).map((r) => r.clubId)
    if (top.includes(fixture.opponentId) && top.includes(career.clubId)) return 'segundo'
    if (table[1]?.clubId === fixture.opponentId) return 'segundo'
  }
  return null
}

export function isImportantFixture(career: Career, fixture: ClubFixture): boolean {
  return importanceOf(career, fixture) !== null
}

/** ¿Esta temporada tiene partidos jugada a jugada? */
export function hasLiveMatches(career: Career): boolean {
  return hasFullSeasons(career.mode) && isDecisionSeason(career.mode, career.season)
}

/** Paga las mensualidades del sueldo que tocan hasta este hueco del calendario. */
function paySalary(career: Career, slot: number): Career {
  const p = career.seasonProgress
  if (!p) return career
  const due = clamp(seasonMonth(p.setup, career.season, slot), 1, 12)
  if (due <= p.salaryPaid) return career
  return {
    ...career,
    money: career.money + (due - p.salaryPaid) * monthlyWage(career.contract),
    seasonProgress: { ...p, salaryPaid: due }
  }
}

/**
 * Juega el calendario hasta la próxima decisión: un evento, un partido
 * importante o el final de la temporada. No muta la carrera original.
 */
export function advanceSeason(career: Career): Career {
  let current = career
  for (;;) {
    const p = current.seasonProgress
    if (!p || p.liveMatch) return current
    if (currentEventId(current)) return adaptCurrentEvent(current)
    if (p.playedSlots >= totalSlots(p.setup)) return current

    const slot = p.playedSlots
    current = paySalary(current, slot)
    const progress = current.seasonProgress as SeasonProgress
    const fixture = clubFixtureAt(seasonContext(current), slot)
    if (
      fixture &&
      hasLiveMatches(current) &&
      slot >= progress.injuredUntil &&
      isImportantFixture(current, fixture)
    ) {
      return {
        ...current,
        seasonProgress: { ...progress, liveMatch: createLiveMatch(current, fixture) }
      }
    }

    let injuredUntil = progress.injuredUntil
    let morale = current.morale
    const clubMatches = [...progress.clubMatches]
    if (fixture) {
      const match = simulateClubMatch(current, fixture)
      clubMatches.push(match)
      const rng = createRng(seedFor(current.id, 'injury', current.season, slot))
      if (match.played && rng() < injuryChance(current)) {
        injuredUntil = slot + 1 + randomInt(rng, 1, 5)
        morale = Math.max(0, morale - 3) // lesionarse duele
      }
    }
    current = {
      ...current,
      morale,
      seasonProgress: { ...progress, clubMatches, playedSlots: slot + 1, injuredUntil }
    }
    if (fixture) current = driftMorale(current, slot)
  }
}

export type SeasonStep = 'event' | 'match' | 'done'

/** Qué toca ahora en la temporada en curso (tras `advanceSeason`). */
export function seasonStep(career: Career): SeasonStep {
  const p = career.seasonProgress
  if (p?.liveMatch) return 'match'
  if (currentEventId(career)) return 'event'
  return 'done'
}

export function isSeasonReadyToFinish(career: Career): boolean {
  const p = career.seasonProgress
  return (
    !!p &&
    !p.liveMatch &&
    p.playedSlots >= totalSlots(p.setup) &&
    p.resolutions.length >= p.eventIds.length
  )
}

// ---------------------------------------------------------------------------
// Fin de temporada
// ---------------------------------------------------------------------------

/** ¿Te convoca tu selección? Depende de la nota de la temporada, la fama y la edad. */
export function isCalledUp(career: Career, rating: number): boolean {
  return career.age >= 18 && (rating >= 7.1 || career.reputation >= 50)
}

/** Partidos con la selección y, en verano de torneo, hasta dónde llegáis. */
export function simulateNationalTeam(
  career: Career,
  rating: number,
  goalRate: number
): NationalTeamSeason {
  if (!isCalledUp(career, rating)) return { calledUp: false, caps: 0, goals: 0 }
  const rng = createRng(seedFor(career.id, 'national', career.season))
  const endYear = FIRST_YEAR + career.season
  const tournamentId = tournamentForSeasonEnd(endYear)

  let caps = randomInt(rng, 3, 8)
  let goals = Math.round(caps * goalRate * (0.7 + rng() * 0.6))
  let tournament: NationalTeamSeason['tournament']

  if (tournamentId) {
    const base = NATIONAL_STRENGTH[career.character.nationalityId][tournamentId]
    // Tu nivel suma: una estrella puede llevar a su selección lejos.
    const boost = clamp((rating - 7.1) * 0.06, -0.05, 0.15)
    const winChance = clamp(base + boost, 0.01, 0.6)
    const roll = rng()
    let roundIndex: number
    if (roll < winChance) roundIndex = TOURNAMENT_ROUNDS.length - 1
    else
      roundIndex = Math.min(TOURNAMENT_ROUNDS.length - 2, Math.floor(rng() * 5 * (0.6 + base * 2)))
    const round = TOURNAMENT_ROUNDS[roundIndex]
    const tournamentMatches = 3 + roundIndex
    caps += tournamentMatches
    goals += Math.round(tournamentMatches * goalRate * (0.7 + rng() * 0.8))
    tournament = { id: tournamentId, round }
  }

  return { calledUp: true, caps, goals, tournament }
}

/**
 * Progresión natural de atributos al final de la temporada (edad, minutos y
 * cantera del club). Es pequeña: el resto lo reparte el jugador con sus puntos.
 */
export function seasonGrowth(
  career: Career,
  minutes: number,
  rng: Rng
): Partial<Career['attributes']> {
  const club = getClub(career.clubId)
  const max = careerScale(career)
  const ageFactor = career.age <= 21 ? 1 : career.age <= 25 ? 0.6 : career.age <= 29 ? 0.25 : -0.5
  let base = Math.round((club.development * 0.5 + minutes * 2) * ageFactor * 0.6 + rng())
  // Un buen físico frena el declive de los veteranos.
  if (base < 0 && baseAttributes(career).physique >= 15) base++
  // En las escalas de 30 y 50 hay más puntos que repartir (cada uno vale menos).
  const points = base === 0 ? 0 : scaleDelta(base, max)

  const changes: Partial<Career['attributes']> = {}
  if (points >= 0) {
    // Mejora: más probable en los atributos clave de un delantero.
    const pool: AttributeId[] = [
      'finishing',
      'finishing',
      'offTheBall',
      'offTheBall',
      'composure',
      'heading',
      'dribbling',
      'shortPassing',
      'longPassing',
      'pace',
      'strength',
      'stamina',
      'physique',
      'leadership',
      'penalties'
    ]
    for (let i = 0; i < points; i++) {
      const id = pool[Math.floor(rng() * pool.length)]
      if (career.attributes[id] + (changes[id] ?? 0) < max) changes[id] = (changes[id] ?? 0) + 1
    }
    // El capitán crece como líder cada temporada.
    if (career.captaincy && career.attributes.leadership + (changes.leadership ?? 0) < max) {
      changes.leadership = (changes.leadership ?? 0) + 1
    }
  } else {
    // Declive físico con la edad.
    const physical: AttributeId[] = ['pace', 'stamina', 'strength', 'physique']
    for (let i = 0; i < -points; i++) {
      const id = physical[i % physical.length]
      changes[id] = (changes[id] ?? 0) - 1
    }
  }
  return changes
}

/** Máximo de puntos de atributo que da una temporada en la escala de 20 (5, 8 o 13 según el modo). */
export const MAX_TRAINING_POINTS = 5

/** Puntos pendientes que se pueden acumular si no los repartes. */
export const MAX_PENDING_POINTS = 60

/**
 * Puntos para repartir al acabar la temporada (0–5 en la Rápida, 0–8 en la
 * Normal y 0–13 en la Completa): partidos jugados, goles, asistencias, nota,
 * títulos y lo bien que salieron tus decisiones.
 */
export function trainingPoints(career: Career, record: SeasonRecord): number {
  let points = 0
  if (record.matches >= 10) points++
  if (record.goals >= 15) points++
  if (record.goals >= 30) points++
  if (record.assists >= 10) points++
  if (record.rating >= 7.4) points++
  if (record.trophies.length > 0) points++
  const rolls = (career.seasonProgress?.resolutions ?? []).filter((r) => r.roll)
  const wins = rolls.filter((r) => r.roll?.success).length
  if (rolls.length >= 2 && wins / rolls.length >= 0.6) points++
  const max = maxTrainingPointsFor(career.mode)
  return Math.min(
    max,
    Math.round((Math.min(MAX_TRAINING_POINTS, points) * max) / MAX_TRAINING_POINTS)
  )
}

/** Calcula el registro de la temporada a partir de los partidos jugados. Función pura. */
export function buildSeasonRecord(career: Career): SeasonRecord {
  const base = seasonContext(career)
  const ctx: SeasonContext = { ...base, playedSlots: totalSlots(base.setup) }
  const p = career.seasonProgress
  const matches = (p?.clubMatches ?? []).filter((m) => m.played)
  const goals = matches.reduce((s, m) => s + m.playerGoals, 0) + (p?.bonusGoals ?? 0)
  const assists = matches.reduce((s, m) => s + m.playerAssists, 0)
  // Nota media de los partidos jugados; los goles de las decisiones también cuentan.
  const bonusBoost = matches.length > 0 ? ((p?.bonusGoals ?? 0) * 0.9) / matches.length : 0
  const rating =
    matches.length > 0
      ? Math.round(
          clamp(
            matches.reduce((s, m) => s + (m.rating ?? 6.6), 0) / matches.length + bonusBoost,
            5,
            10
          ) * 10
        ) / 10
      : 5.5

  const table = leagueTable(ctx)
  const leaguePosition = table.findIndex((r) => r.clubId === career.clubId) + 1
  const cupRound = ctx.setup.cup.includes(career.clubId)
    ? knockoutReach(cupBracket(ctx), career.clubId, CUP_ROUND_NAMES)
    : null
  const continental = continentalCup(ctx)
  const format = continentalFormat(ctx.setup)
  const names = continentalNames(ctx.setup)
  const reach = continental.qualified
    ? (knockoutReach(
        continental.knockout,
        career.clubId,
        names,
        names.length - continental.knockout.length
      ) ?? 'Fase de grupos')
    : undefined
  const continentalRound = reach

  const trophies: TrophyId[] = []
  if (leaguePosition === 1) trophies.push(ctx.setup.division === 1 ? 'liga' : 'segunda')
  if (cupRound === 'Campeón') trophies.push('copa')
  if (reach === 'Campeón') trophies.push(CONTINENTAL_FORMATS[format.id].trophy)

  const rng = createRng(seedFor(career.id, 'season', career.season))
  const goalRate = matches.length > 0 ? goals / matches.length : 0
  const nationalTeam = simulateNationalTeam(career, rating, goalRate)
  if (nationalTeam.tournament?.round === 'Campeón') trophies.push(nationalTeam.tournament.id)
  if (nationalTeam.tournament && nationalTeam.goals >= 5) trophies.push('bota-torneo')
  const wonWorldCup =
    nationalTeam.tournament?.id === 'mundial' && nationalTeam.tournament.round === 'Campeón'

  // Premios individuales (los de liga, solo en primera división).
  const stats = leagueStats(ctx, career.character.name)
  const top = (rows: typeof stats.scorers): boolean => rows[0]?.isPlayer === true
  const firstDivision = ctx.setup.division === 1
  if (firstDivision && top(stats.scorers)) trophies.push('goleador')
  if (firstDivision && top(stats.assists)) trophies.push('asistente')
  if (
    career.reputation >= 60 &&
    ((rating >= 8.1 && goals >= 30) || (wonWorldCup && rating >= 7.8 && goals >= 20))
  ) {
    trophies.push('balon-dorado')
  }
  if (firstDivision && rating >= 7.9 && matches.length >= 25) trophies.push('mvp')
  if (firstDivision && rating >= 7.4 && matches.length >= 20) trophies.push('equipo-ideal')
  if (career.age <= 21 && rating >= 7.0 && matches.length >= 15) trophies.push('joven')

  const share = matches.length / Math.max(1, (p?.clubMatches ?? []).length)
  const record: SeasonRecord = {
    nationalTeam,
    season: career.season,
    yearLabel: seasonYearLabel(career.season),
    clubId: career.clubId,
    age: career.age,
    matches: matches.length,
    goals,
    assists,
    rating,
    leaguePosition,
    trophies,
    attributeChanges: seasonGrowth(career, share, rng),
    clubMatches: p?.clubMatches ?? [],
    finalTable: table.map((r) => r.clubId),
    cupRound: cupRound ?? undefined,
    continentalRound,
    setup: ctx.setup,
    division: ctx.setup.division,
    ...(career.captaincy ? { captain: true } : {}),
    ...(career.captaincy?.since === career.season ? { becameCaptain: true } : {})
  }
  return {
    ...record,
    earnings: seasonEarnings(career, record),
    trainingPoints: trainingPoints(career, record)
  }
}

/** Cierra la temporada: guarda el registro, cobra, aplica la progresión y prepara la siguiente. */
export function finishSeason(career: Career): { career: Career; record: SeasonRecord } {
  const built = buildSeasonRecord(career)
  const setup = career.seasonProgress?.setup ?? built.setup
  const next = setup
    ? nextSeasonState(
        career.id,
        career.season,
        career.divisions,
        career.clubId,
        setup,
        built.finalTable ?? []
      )
    : { divisions: career.divisions, continentalTeams: career.continentalTeams }
  const lostCaptaincy = losesCaptaincy(career)
  const record: SeasonRecord = {
    ...built,
    movement: next.movement,
    ...(lostCaptaincy ? { lostCaptaincy: true } : {})
  }

  const max = careerScale(career)
  const attributes = { ...career.attributes }
  for (const { id } of ATTRIBUTES) {
    attributes[id] = clampAttribute(attributes[id] + (record.attributeChanges[id] ?? 0), max)
  }

  // Los títulos suben la fama; una mala temporada baja la moral; la familia da estabilidad.
  const captain = career.captaincy && !lostCaptaincy ? 1 : 0
  const reputationGain = record.trophies.length * 4 + Math.round(record.goals / 5) + captain
  const family = career.flags.partner === 'casados' ? 2 : 0
  const moraleChange =
    (record.rating >= 7.1 ? 5 : record.rating < 6.4 ? -5 : 0) + family + captain * 2
  // El sueldo que faltaba (meses de verano) y las primas se cobran al acabar.
  const salaryLeft = (12 - (career.seasonProgress?.salaryPaid ?? 0)) * monthlyWage(career.contract)
  const bonuses = record.earnings ? record.earnings.goalBonus + record.earnings.titleBonus : 0

  const nextCareer: Career = {
    ...career,
    attributes,
    age: career.age + 1,
    season: career.season + 1,
    reputation: clamp(career.reputation + reputationGain, 0, 100),
    morale: clamp(career.morale + moraleChange, 0, 100),
    money: career.money + Math.max(0, salaryLeft) + bonuses,
    divisions: next.divisions,
    continentalTeams: next.continentalTeams,
    captaincy: lostCaptaincy ? null : career.captaincy,
    // Los puntos que no repartiste se guardan para más adelante.
    pendingPoints: isCareerOver({ ...career, season: career.season + 1 })
      ? 0
      : Math.min(MAX_PENDING_POINTS, career.pendingPoints + (record.trainingPoints ?? 0)),
    seasonProgress: null,
    history: [...career.history, record]
  }
  // La fama ganada en la temporada también sube a la afición de tu club (v0.17).
  const { relationLog } = logRelationChanges(
    career,
    { ...nextCareer, season: career.season, seasonProgress: career.seasonProgress },
    {
      kind: 'temporada',
      title: `Balance de la temporada ${record.yearLabel}`,
      detail: `${record.goals} goles y ${record.trophies.length} títulos`
    }
  )
  return {
    record,
    career: { ...nextCareer, relationLog, contract: contractAfterSeason(nextCareer) }
  }
}

/** Reparte los puntos de fin de temporada (sin pasar del máximo del modo en ningún atributo). */
export function applyTrainingPoints(
  career: Career,
  allocation: Partial<Career['attributes']>
): Career {
  const total = Object.values(allocation).reduce((s, n) => s + (n ?? 0), 0)
  if (total > career.pendingPoints || Object.values(allocation).some((n) => (n ?? 0) < 0)) {
    throw new Error('Reparto de puntos no válido')
  }
  const max = careerScale(career)
  const attributes = { ...career.attributes }
  for (const [id, n] of Object.entries(allocation)) {
    attributes[id as AttributeId] = clampAttribute(attributes[id as AttributeId] + (n ?? 0), max)
  }
  return { ...career, attributes, pendingPoints: career.pendingPoints - total }
}

/** Totales de toda la carrera para la vitrina. */
export function trophyCounts(history: SeasonRecord[]): Map<TrophyId, number[]> {
  const counts = new Map<TrophyId, number[]>()
  for (const record of history) {
    for (const trophy of record.trophies) {
      counts.set(trophy, [...(counts.get(trophy) ?? []), record.season])
    }
  }
  return counts
}

export function careerTotals(history: SeasonRecord[]): {
  matches: number
  goals: number
  assists: number
} {
  return history.reduce(
    (t, r) => ({
      matches: t.matches + r.matches,
      goals: t.goals + r.goals,
      assists: t.assists + r.assists
    }),
    { matches: 0, goals: 0, assists: 0 }
  )
}
