import {
  ATTRIBUTES,
  clampAttribute,
  normalizeAttributes,
  scaleDelta,
  SET_PIECE_ATTRIBUTES,
  type Attributes,
  type SetPieceId
} from '../data/attributes'
import { attributeScale, setPieceMinimum, type AttributeScale } from '../data/gameModes'
import type { Career } from '../types/career'

/**
 * Los atributos se guardan en la escala del modo (1–20, 1–30 o 1–50). Las
 * fórmulas del juego (tiradas, media, partidos) usan la escala de 20: estas
 * funciones hacen la conversión.
 */

/** Valor máximo de los atributos en esta carrera. */
export function careerScale(career: Pick<Career, 'mode'>): AttributeScale {
  return attributeScale(career.mode)
}

/** Atributos en la escala de 20 (con decimales) para las fórmulas. */
export function baseAttributes(career: Pick<Career, 'mode' | 'attributes'>): Attributes {
  return normalizeAttributes(career.attributes, careerScale(career))
}

/**
 * Suma cambios definidos en la escala de 20 (eventos, jugadas, tienda) a los
 * atributos de la carrera, ya escalados y sin pasar del máximo.
 * Devuelve los atributos nuevos y lo que se ganó de verdad en cada uno.
 */
export function addAttributeDeltas(
  career: Pick<Career, 'mode' | 'attributes'>,
  deltas: Partial<Attributes>
): { attributes: Attributes; gained: Partial<Attributes> } {
  const max = careerScale(career)
  const attributes = { ...career.attributes }
  const gained: Partial<Attributes> = {}
  for (const [id, delta] of Object.entries(deltas)) {
    const key = id as keyof Attributes
    const next = clampAttribute(attributes[key] + scaleDelta(delta ?? 0, max), max)
    if (next !== attributes[key]) gained[key] = next - attributes[key]
    attributes[key] = next
  }
  return { attributes, gained }
}

/** Cambios en la escala de 20 → escala de la carrera (para mostrarlos: "+3 Liderazgo"). */
export function scaledDeltas(deltas: Partial<Attributes>, max: number): Partial<Attributes> {
  const result: Partial<Attributes> = {}
  for (const { id } of ATTRIBUTES) {
    const delta = deltas[id]
    if (delta) result[id] = scaleDelta(delta, max)
  }
  return result
}

/** Valor mínimo para ser el lanzador de un balón parado en esta carrera. */
export function setPieceThreshold(career: Pick<Career, 'mode'>): number {
  return setPieceMinimum(career.mode)
}

/** ¿Eres el lanzador de córners, faltas y penaltis de tu equipo? */
export function setPieceRoles(
  career: Pick<Career, 'mode' | 'attributes'>
): Record<SetPieceId, boolean> {
  const min = setPieceThreshold(career)
  return Object.fromEntries(
    SET_PIECE_ATTRIBUTES.map((id) => [id, career.attributes[id] >= min])
  ) as Record<SetPieceId, boolean>
}

export const SET_PIECE_LABELS: Record<SetPieceId, string> = {
  corners: 'Córners',
  freeKicks: 'Faltas',
  penalties: 'Penaltis'
}
