import { toScale } from '../data/attributes'
import { getClub } from '../data/clubs'
import type { EventEffects, GameEvent } from '../data/events'
import type { Career, Flags, Teammate, TeammateRole } from '../types/career'
import { clubRoster } from './competitions'
import { baseAttributes, careerScale } from './playerAttributes'
import { clamp, createRng, seedFor } from './random'

/**
 * Compañeros destacados de tu club (los mismos 5 jugadores que salen en las
 * tablas de goleadores) y excompañeros de tus clubes anteriores. Cada uno
 * tiene una relación contigo (0–100) que cambian tus decisiones.
 */

/** Papel de cada jugador de la plantilla, en el orden de `clubRoster`. */
export const ROSTER_ROLES: readonly TeammateRole[] = [
  'rival',
  'capitan',
  'veterano',
  'amigo',
  'joven'
]

export const ROLE_LABELS: Record<TeammateRole, string> = {
  capitan: 'Capitán',
  rival: 'Rival de puesto',
  veterano: 'Veterano del vestuario',
  amigo: 'Tu amigo en el vestuario',
  joven: 'Joven de la cantera'
}

/** Placeholder de los textos de los eventos para cada papel. */
export const ROLE_PLACEHOLDERS: Record<TeammateRole, string> = {
  capitan: '{capitan}',
  rival: '{rivalPuesto}',
  veterano: '{veterano}',
  amigo: '{amigo}',
  joven: '{joven}'
}

const START_RELATION: Record<TeammateRole, number> = {
  capitan: 50,
  rival: 40,
  veterano: 50,
  amigo: 62,
  joven: 50
}

/** Máximo de excompañeros que se recuerdan. */
export const MAX_EX_TEAMMATES = 12

/** Compañeros de un club al llegar (si ya coincidiste con alguno, se recupera la relación). */
export function generateTeammates(
  clubId: string,
  season: number,
  previous: readonly Teammate[] = []
): Teammate[] {
  return clubRoster(getClub(clubId)).map((name, i) => {
    const id = `${clubId}#${i}`
    const role = ROSTER_ROLES[i]
    const known = previous.find((t) => t.id === id)
    return {
      id,
      name,
      role,
      clubId,
      relation: known?.relation ?? START_RELATION[role],
      since: known?.since ?? season
    }
  })
}

/** Ajuste de las relaciones según decisiones de antes de la v0.10 (flags antiguos). */
export function relationsFromFlags(teammates: Teammate[], flags: Flags): Teammate[] {
  return teammates.map((t) => {
    let relation = t.relation
    if (t.role === 'capitan') {
      if (flags.captainRespect === true) relation = 72
      else if (flags.partyAnimal === true) relation = 40
    }
    if (t.role === 'rival' && typeof flags.internalRival === 'string') {
      relation = { enemigo: 15, tregua: 45, derrotado: 55 }[flags.internalRival] ?? relation
    }
    return { ...t, relation }
  })
}

/** Flags de decisiones antiguas que también cambian la relación con un compañero. */
const FLAG_RELATIONS: Array<{
  flag: string
  value: string | number | boolean
  role: TeammateRole
  delta: number
}> = [
  { flag: 'captainRespect', value: true, role: 'capitan', delta: 20 },
  { flag: 'partyAnimal', value: true, role: 'capitan', delta: -10 },
  { flag: 'internalRival', value: 'enemigo', role: 'rival', delta: -25 },
  { flag: 'internalRival', value: 'tregua', role: 'rival', delta: 10 },
  { flag: 'internalRival', value: 'derrotado', role: 'rival', delta: -5 }
]

export function teammateByRole(
  career: Pick<Career, 'teammates'>,
  role: TeammateRole
): Teammate | undefined {
  return career.teammates.find((t) => t.role === role)
}

/** Relación media con el vestuario (50 si no hay datos). */
export function averageRelation(career: Pick<Career, 'teammates'>): number {
  if (career.teammates.length === 0) return 50
  return Math.round(career.teammates.reduce((s, t) => s + t.relation, 0) / career.teammates.length)
}

export type RelationLevel = 'aliado' | 'bien' | 'neutral' | 'tenso' | 'enemigo'

export function relationLevel(relation: number): RelationLevel {
  if (relation >= 75) return 'aliado'
  if (relation >= 58) return 'bien'
  if (relation >= 42) return 'neutral'
  if (relation >= 25) return 'tenso'
  return 'enemigo'
}

/** Excompañeros que encajan con la condición de un evento. */
export function exTeammateCandidates(
  career: Pick<Career, 'exTeammates'>,
  event: GameEvent
): Teammate[] {
  const range = event.exTeammate
  if (!range) return []
  return career.exTeammates.filter(
    (t) =>
      (range.min === undefined || t.relation >= range.min) &&
      (range.max === undefined || t.relation <= range.max)
  )
}

/** Excompañero protagonista de un evento (siempre el mismo para la misma temporada). */
export function featuredExTeammate(
  career: Pick<Career, 'exTeammates' | 'id' | 'season'>,
  event: GameEvent
): Teammate | undefined {
  const candidates = exTeammateCandidates(career, event)
  if (candidates.length === 0) return undefined
  const rng = createRng(seedFor(career.id, 'ex-teammate', career.season, event.id))
  return candidates[Math.floor(rng() * candidates.length)]
}

/** Aplica los cambios de relación de una decisión. */
export function applyRelationEffects(
  career: Pick<Career, 'teammates' | 'exTeammates'>,
  effects: EventEffects,
  featuredId?: string
): Pick<Career, 'teammates' | 'exTeammates'> {
  const deltas: Partial<Record<TeammateRole, number>> = {}
  const all = effects.teammates?.todos ?? 0
  for (const role of ROSTER_ROLES) {
    deltas[role] = (effects.teammates?.[role] ?? 0) + all
  }
  for (const rule of FLAG_RELATIONS) {
    if (effects.flags?.[rule.flag] === rule.value) {
      deltas[rule.role] = (deltas[rule.role] ?? 0) + rule.delta
    }
  }
  const teammates = career.teammates.map((t) =>
    deltas[t.role] ? { ...t, relation: clamp(t.relation + (deltas[t.role] ?? 0), 0, 100) } : t
  )
  const exTeammates =
    effects.exTeammate && featuredId
      ? career.exTeammates.map((t) =>
          t.id === featuredId
            ? { ...t, relation: clamp(t.relation + (effects.exTeammate ?? 0), 0, 100) }
            : t
        )
      : career.exTeammates
  return { teammates, exTeammates }
}

/** Al fichar por otro club: tus compañeros pasan a ser excompañeros y conoces a los nuevos. */
export function teammatesAfterTransfer(
  career: Pick<Career, 'teammates' | 'exTeammates'>,
  newClubId: string,
  season: number
): Pick<Career, 'teammates' | 'exTeammates'> {
  const known = [...career.teammates, ...career.exTeammates]
  const teammates = generateTeammates(newClubId, season, known)
  const ids = new Set(teammates.map((t) => t.id))
  const exTeammates = [...career.teammates, ...career.exTeammates]
    .filter((t, i, list) => !ids.has(t.id) && list.findIndex((x) => x.id === t.id) === i)
    .slice(0, MAX_EX_TEAMMATES)
  return { teammates, exTeammates }
}

// ---------------------------------------------------------------------------
// Capitanía
// ---------------------------------------------------------------------------

/** Temporadas completas seguidas en tu club actual. */
export function seasonsAtClub(career: Pick<Career, 'history' | 'clubId'>): number {
  let count = 0
  for (let i = career.history.length - 1; i >= 0; i--) {
    if (career.history[i].clubId !== career.clubId) break
    count++
  }
  return count
}

export const CAPTAIN_MIN_SEASONS = 3
/** Requisitos (liderazgo en la escala de 20, confianza y relación media). */
const CAPTAIN_LEADERSHIP = 10
const CAPTAIN_TRUST = 55
const CAPTAIN_RELATION = 55

export interface CaptaincyCheck {
  label: string
  ok: boolean
  /** "4 / 3", "12 / 15"… */
  detail: string
}

/** Lo que hace falta para que el vestuario te proponga ser capitán. */
export function captaincyChecks(career: Career): CaptaincyCheck[] {
  const seasons = seasonsAtClub(career)
  const leadership = baseAttributes(career).leadership
  const neededLeadership = toScale(CAPTAIN_LEADERSHIP, careerScale(career))
  const relation = averageRelation(career)
  return [
    {
      label: 'Temporadas en el club',
      ok: seasons >= CAPTAIN_MIN_SEASONS,
      detail: `${seasons} / ${CAPTAIN_MIN_SEASONS}`
    },
    {
      label: 'Liderazgo',
      ok: leadership >= CAPTAIN_LEADERSHIP,
      detail: `${career.attributes.leadership} / ${neededLeadership}`
    },
    {
      label: 'Confianza del míster',
      ok: career.trust >= CAPTAIN_TRUST,
      detail: `${career.trust} / ${CAPTAIN_TRUST}`
    },
    {
      label: 'Relación con el vestuario',
      ok: relation >= CAPTAIN_RELATION,
      detail: `${relation} / ${CAPTAIN_RELATION}`
    }
  ]
}

/** ¿Te pueden proponer la capitanía ahora? (si la rechazaste, hasta dos temporadas después no) */
export function canBeCaptain(career: Career): boolean {
  if (career.captaincy) return false
  if (career.flags.declinedCaptaincy === true) {
    const declined = career.flagSources?.declinedCaptaincy?.season ?? 0
    if (career.season - declined < 2) return false
  }
  return captaincyChecks(career).every((c) => c.ok)
}

/** ¿Pierdes la capitanía al acabar la temporada? (el míster o el vestuario te dan la espalda) */
export function losesCaptaincy(career: Career): boolean {
  return !!career.captaincy && (career.trust < 30 || averageRelation(career) < 30)
}

/** Un compañero (o excompañero) que sale nombrado en un evento. */
export interface MentionedMate {
  name: string
  /** Papel en el vestuario ("Veterano del vestuario") o el club donde coincidisteis. */
  label: string
  relation: number
}

/**
 * Compañeros que nombra un evento (por sus `{veterano}`, `{amigo}`… o el
 * `{excompanero}` protagonista), para enseñar la relación al pasar el cursor.
 */
export function mentionedTeammates(
  career: Pick<Career, 'teammates' | 'exTeammates'>,
  texts: readonly string[],
  featuredExId?: string
): MentionedMate[] {
  const all = texts.join('\n')
  const result: MentionedMate[] = []
  for (const role of ROSTER_ROLES) {
    const mate = teammateByRole(career, role)
    if (mate && all.includes(ROLE_PLACEHOLDERS[role])) {
      result.push({ name: mate.name, label: ROLE_LABELS[role], relation: mate.relation })
    }
  }
  const ex = career.exTeammates.find((x) => x.id === featuredExId)
  if (ex && all.includes('{excompanero}')) {
    result.push({
      name: ex.name,
      label: `Excompañero en el ${getClub(ex.clubId).name}`,
      relation: ex.relation
    })
  }
  return result
}
