import { ATTRIBUTE_MIN, type AttributeId, type Attributes } from '../data/attributes'
import type { InjuryEffect, InjuryZone } from '../data/events'
import type { Career, InjuryRecord } from '../types/career'
import { careerScale } from './playerAttributes'
import { createRng, randomInt, seedFor, shuffle } from './random'
import { liveRecord, t } from '../i18n'

/**
 * Lesiones de las decisiones (v0.17). Te pierdes los partidos de la baja (y
 * las decisiones que caían en esas semanas) y, según la gravedad, uno o varios
 * atributos de la zona lesionada bajan de 1 a 10 puntos.
 */

/** Atributos que se resienten en cada zona. */
export const INJURY_ATTRIBUTES: Record<InjuryZone, readonly AttributeId[]> = {
  tobillo: ['pace', 'dribbling', 'physique'],
  muscular: ['pace', 'stamina', 'strength'],
  rodilla: ['pace', 'strength', 'physique'],
  espalda: ['strength', 'heading', 'physique']
}

export const ZONE_NAMES: Record<InjuryZone, string> = liveRecord(() => t.game.injury.zones)

export type InjurySeverity = InjuryRecord['severity']

/** Hasta 3 partidos, leve; hasta 8, moderada; más, grave. */
export function injurySeverity(matches: number): InjurySeverity {
  if (matches <= 3) return 'leve'
  if (matches <= 8) return 'moderada'
  return 'grave'
}

/** Cuántos atributos bajan y cuántos puntos (en la escala de 50). */
export const INJURY_LOSS: Record<
  InjurySeverity,
  { attributes: [number, number]; points: [number, number] }
> = {
  leve: { attributes: [1, 1], points: [1, 3] },
  moderada: { attributes: [1, 2], points: [2, 6] },
  grave: { attributes: [2, 3], points: [4, 10] }
}

/** Puntos de la escala de 50 en la escala del modo (nunca 0). */
function toCareerScale(points: number, max: number): number {
  return max === 50 ? points : Math.max(1, Math.round((points * max) / 50))
}

/**
 * Atributos que pierde la lesión (negativos, en la escala del modo). Usa una
 * semilla fija: recargar la partida no cambia el resultado.
 */
export function injuryLosses(career: Career, injury: InjuryEffect): Partial<Attributes> {
  if (injury.attributeLoss === false) return {}
  const severity = injurySeverity(injury.matches)
  const { attributes, points } = INJURY_LOSS[severity]
  const slot = career.seasonProgress?.playedSlots ?? 0
  const rng = createRng(seedFor(career.id, 'injury-loss', career.season, slot))
  const count = randomInt(rng, attributes[0], attributes[1])
  const max = careerScale(career)
  const losses: Partial<Attributes> = {}
  for (const id of shuffle(rng, [...INJURY_ATTRIBUTES[injury.zone]]).slice(0, count)) {
    const lost = Math.min(
      toCareerScale(randomInt(rng, points[0], points[1]), max),
      career.attributes[id] - ATTRIBUTE_MIN
    )
    if (lost > 0) losses[id] = -lost
  }
  return losses
}

/**
 * Aplica una lesión: baja hasta el hueco `from + matches`, quita las
 * decisiones que caían en la baja y resta los atributos.
 */
export function applyInjury(
  career: Career,
  injury: InjuryEffect
): { career: Career; record: InjuryRecord } {
  const losses = injuryLosses(career, injury)
  const attributes = { ...career.attributes }
  for (const [id, delta] of Object.entries(losses)) {
    attributes[id as AttributeId] += delta ?? 0
  }
  const record: InjuryRecord = {
    matches: injury.matches,
    severity: injurySeverity(injury.matches),
    zone: injury.zone,
    losses
  }
  const p = career.seasonProgress
  if (!p) return { career: { ...career, attributes }, record }

  const from = p.playedSlots
  const injuredUntil = Math.max(p.injuredUntil, from + injury.matches)
  // Las decisiones que caían durante la baja no llegan a pasar (la actual sí).
  const current = p.resolutions.length
  const keep = p.eventIds.map((_, i) => i <= current || p.eventSlots[i] >= injuredUntil)
  return {
    record,
    career: {
      ...career,
      attributes,
      seasonProgress: {
        ...p,
        injuredUntil,
        eventIds: p.eventIds.filter((_, i) => keep[i]),
        eventSlots: p.eventSlots.filter((_, i) => keep[i])
      }
    }
  }
}

/** "Baja de 6 partidos (moderada)". */
export function injuryText(record: InjuryRecord): string {
  const severity = t.game.injury.severity[record.severity] ?? record.severity
  return t.game.injury.out(record.matches, severity)
}
