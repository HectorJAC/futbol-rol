export type AttributeId =
  | 'finishing'
  | 'heading'
  | 'dribbling'
  | 'shortPassing'
  | 'longPassing'
  | 'offTheBall'
  | 'pace'
  | 'strength'
  | 'stamina'
  | 'physique'
  | 'composure'
  | 'leadership'
  | 'corners'
  | 'freeKicks'
  | 'penalties'

export type AttributeGroup = 'Técnico' | 'Físico' | 'Mental' | 'Balón parado'

/** Grupos en el orden en que se muestran. */
export const ATTRIBUTE_GROUPS: readonly AttributeGroup[] = [
  'Técnico',
  'Físico',
  'Mental',
  'Balón parado'
]

export interface AttributeInfo {
  id: AttributeId
  name: string
  group: AttributeGroup
  description: string
}

export type Attributes = Record<AttributeId, number>

/**
 * Escala de referencia: 1 (muy malo) a 20 (de otro planeta). Cada modo de juego
 * tiene su propia escala (20, 30 o 50, ver `attributeScale` en gameModes); las
 * fórmulas del juego trabajan siempre sobre esta escala de 20.
 */
export const ATTRIBUTE_MIN = 1
export const ATTRIBUTE_MAX = 20
/** Ningún atributo puede pasar de este valor al crear el personaje (escala de 20). */
export const CREATION_CAP = 15
/** Puntos libres que el jugador reparte al crear su personaje (escala de 20). */
export const FREE_POINTS = 8

export const ATTRIBUTES: readonly AttributeInfo[] = [
  {
    id: 'finishing',
    name: 'Definición',
    group: 'Técnico',
    description: 'Precisión y frialdad al rematar a portería.'
  },
  {
    id: 'heading',
    name: 'Cabezazo',
    group: 'Técnico',
    description: 'Remate y juego aéreo.'
  },
  {
    id: 'dribbling',
    name: 'Regate',
    group: 'Técnico',
    description: 'Capacidad de superar rivales con el balón.'
  },
  {
    id: 'shortPassing',
    name: 'Pase corto',
    group: 'Técnico',
    description: 'Combinar en corto, descargar de espaldas y jugar a un toque.'
  },
  {
    id: 'longPassing',
    name: 'Pase largo',
    group: 'Técnico',
    description: 'Cambios de orientación y balones en profundidad.'
  },
  {
    id: 'offTheBall',
    name: 'Desmarque',
    group: 'Técnico',
    description: 'Moverse sin balón y aparecer en el sitio justo.'
  },
  {
    id: 'pace',
    name: 'Velocidad',
    group: 'Físico',
    description: 'Aceleración y punta de velocidad.'
  },
  {
    id: 'strength',
    name: 'Potencia',
    group: 'Físico',
    description: 'Fuerza en el disparo y en el salto.'
  },
  {
    id: 'stamina',
    name: 'Resistencia',
    group: 'Físico',
    description: 'Aguantar el ritmo los 90 minutos y toda la temporada.'
  },
  {
    id: 'physique',
    name: 'Físico',
    group: 'Físico',
    description: 'Complexión para aguantar choques y evitar lesiones.'
  },
  {
    id: 'composure',
    name: 'Compostura',
    group: 'Mental',
    description: 'Mantener la calma en los momentos de presión.'
  },
  {
    id: 'leadership',
    name: 'Liderazgo',
    group: 'Mental',
    description: 'Influencia en el vestuario y en el campo.'
  },
  {
    id: 'corners',
    name: 'Tiros de esquina',
    group: 'Balón parado',
    description: 'Poner el córner donde quieres: al primer palo, al punto de penalti o en corto.'
  },
  {
    id: 'freeKicks',
    name: 'Faltas',
    group: 'Balón parado',
    description: 'Lanzamientos directos y centros desde una falta.'
  },
  {
    id: 'penalties',
    name: 'Penaltis',
    group: 'Balón parado',
    description: 'Sangre fría y técnica desde los once metros.'
  }
]

/** Atributos de balón parado: con un valor alto eres el lanzador del equipo. */
export const SET_PIECE_ATTRIBUTES = ['corners', 'freeKicks', 'penalties'] as const
export type SetPieceId = (typeof SET_PIECE_ATTRIBUTES)[number]

/** Valores de partida de un delantero centro juvenil, antes del origen y los puntos libres. */
export const BASE_ATTRIBUTES: Attributes = {
  finishing: 9,
  heading: 7,
  dribbling: 7,
  shortPassing: 7,
  longPassing: 5,
  offTheBall: 8,
  pace: 8,
  strength: 7,
  stamina: 8,
  physique: 7,
  composure: 7,
  leadership: 5,
  corners: 5,
  freeKicks: 5,
  penalties: 7
}

/** Peso de cada atributo en la media de un DC. Suman 1. */
export const DC_WEIGHTS: Attributes = {
  finishing: 0.2,
  offTheBall: 0.12,
  composure: 0.12,
  heading: 0.08,
  dribbling: 0.08,
  pace: 0.08,
  shortPassing: 0.07,
  strength: 0.06,
  leadership: 0.04,
  stamina: 0.04,
  longPassing: 0.02,
  physique: 0.03,
  penalties: 0.03,
  freeKicks: 0.02,
  corners: 0.01
}

export function emptyAttributes(): Attributes {
  return {
    finishing: 0,
    heading: 0,
    dribbling: 0,
    shortPassing: 0,
    longPassing: 0,
    offTheBall: 0,
    pace: 0,
    strength: 0,
    stamina: 0,
    physique: 0,
    composure: 0,
    leadership: 0,
    corners: 0,
    freeKicks: 0,
    penalties: 0
  }
}

export function clampAttribute(value: number, max: number = ATTRIBUTE_MAX): number {
  return Math.min(max, Math.max(ATTRIBUTE_MIN, value))
}

/** Pasa un valor de la escala de 20 a la escala `max` (20, 30 o 50). */
export function toScale(value: number, max: number): number {
  return Math.round((value * max) / ATTRIBUTE_MAX)
}

/**
 * Cambio de atributo de la escala de 20 a la escala `max`: un +1 en la escala
 * de 20 es un +3 en la de 50. Nunca se queda en 0.
 */
export function scaleDelta(delta: number, max: number): number {
  if (!delta) return 0
  const scaled = Math.round((delta * max) / ATTRIBUTE_MAX)
  return scaled === 0 ? Math.sign(delta) : scaled
}

/** Atributos en la escala de 20 (con decimales) para las fórmulas del juego. */
export function normalizeAttributes(attributes: Attributes, max: number): Attributes {
  if (max === ATTRIBUTE_MAX) return attributes
  const result = emptyAttributes()
  for (const { id } of ATTRIBUTES) result[id] = (attributes[id] * ATTRIBUTE_MAX) / max
  return result
}

/** Suma base + modificadores del origen + puntos repartidos, respetando los límites 1–20. */
export function combineAttributes(...layers: Partial<Attributes>[]): Attributes {
  const result = emptyAttributes()
  for (const { id } of ATTRIBUTES) {
    result[id] = clampAttribute(layers.reduce((sum, layer) => sum + (layer[id] ?? 0), 0))
  }
  return result
}

/**
 * Atributos al crear el personaje en la escala `max`: la base y el origen
 * (definidos en la escala de 20) se escalan y se suman los puntos repartidos.
 */
export function combineScaled(
  max: number,
  base: Partial<Attributes>,
  origin: Partial<Attributes>,
  allocation: Partial<Attributes>
): Attributes {
  const result = emptyAttributes()
  for (const { id } of ATTRIBUTES) {
    const scaled = toScale((base[id] ?? 0) + (origin[id] ?? 0), max)
    result[id] = clampAttribute(scaled + (allocation[id] ?? 0), max)
  }
  return result
}

export function spentPoints(allocation: Attributes): number {
  return ATTRIBUTES.reduce((sum, { id }) => sum + allocation[id], 0)
}

/** Media general (0–99) de un delantero centro a partir de sus atributos (escala de 20). */
export function overallRating(attributes: Attributes): number {
  const weighted = ATTRIBUTES.reduce((sum, { id }) => sum + attributes[id] * DC_WEIGHTS[id], 0)
  return Math.min(99, Math.round(weighted * 5))
}
