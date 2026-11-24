export type GameModeId = 'rapida' | 'normal' | 'completa' | 'personalizada'
export type DecisionInterval = 1 | 2 | 3

/** Modo elegido al crear la partida: duración de la carrera y cada cuánto se decide. */
export interface GameMode {
  id: GameModeId
  /** Temporadas hasta la retirada. */
  seasons: number
  /** Cada cuántas temporadas hay decisiones (1 = todas). */
  decisionInterval: DecisionInterval
}

export interface GameModeInfo {
  id: GameModeId
  name: string
  description: string
  /** Valores fijos (la personalizada los elige el jugador). */
  defaults: Omit<GameMode, 'id'>
}

export const MIN_CUSTOM_SEASONS = 5
export const MAX_CUSTOM_SEASONS = 25

/** Decisiones por temporada con decisiones: 10 si se decide cada temporada, 4 si no. */
export const EVENTS_PER_SEASON_FULL = 10
export const EVENTS_PER_SEASON_SHORT = 4

export const GAME_MODES: readonly GameModeInfo[] = [
  {
    id: 'rapida',
    name: 'Rápida',
    description: '15 temporadas. Tomas decisiones cada dos temporadas. Atributos de 1 a 20.',
    defaults: { seasons: 15, decisionInterval: 2 }
  },
  {
    id: 'normal',
    name: 'Normal',
    description: '20 temporadas. Tomas decisiones cada dos temporadas. Atributos de 1 a 30.',
    defaults: { seasons: 20, decisionInterval: 2 }
  },
  {
    id: 'completa',
    name: 'Completa',
    description:
      '20 temporadas. Decisiones en todas las temporadas y partidos importantes jugada a jugada. Atributos de 1 a 50.',
    defaults: { seasons: 20, decisionInterval: 1 }
  },
  {
    id: 'personalizada',
    name: 'Personalizada',
    description: `Eliges cuántas temporadas (hasta ${MAX_CUSTOM_SEASONS}) y cada cuánto tomas decisiones.`,
    defaults: { seasons: 20, decisionInterval: 1 }
  }
]

export function getGameModeInfo(id: GameModeId): GameModeInfo {
  const info = GAME_MODES.find((m) => m.id === id)
  if (!info) throw new Error(`Modo desconocido: ${id}`)
  return info
}

export function defaultMode(id: GameModeId = 'normal'): GameMode {
  return { id, ...getGameModeInfo(id).defaults }
}

export type AttributeScale = 20 | 30 | 50

/**
 * Valor máximo de los atributos: 20 en la Rápida, 30 en la Normal y 50 en la
 * Completa. La personalizada usa 50 si se decide cada temporada; si no, 20 hasta
 * 15 temporadas y 30 a partir de ahí.
 */
export function attributeScale(
  mode: Pick<GameMode, 'id' | 'seasons' | 'decisionInterval'>
): AttributeScale {
  if (mode.id === 'rapida') return 20
  if (mode.id === 'normal') return 30
  if (mode.id === 'completa') return 50
  if (mode.decisionInterval === 1) return 50
  return mode.seasons <= 15 ? 20 : 30
}

/** Valor mínimo para ser el lanzador de córners, faltas o penaltis: 10, 15 o 30. */
export function setPieceMinimum(
  mode: Pick<GameMode, 'id' | 'seasons' | 'decisionInterval'>
): number {
  return { 20: 10, 30: 15, 50: 30 }[attributeScale(mode)]
}

/** Puntos libres al crear el personaje: 8 en la Rápida, 12 en la Normal y 10 en la Completa. */
export function freePointsFor(mode: Pick<GameMode, 'id' | 'seasons' | 'decisionInterval'>): number {
  return { 20: 8, 30: 12, 50: 10 }[attributeScale(mode)]
}

/** Tope de cualquier atributo al crear el personaje: 15, 22 o 37. */
export function creationCapFor(
  mode: Pick<GameMode, 'id' | 'seasons' | 'decisionInterval'>
): number {
  return { 20: 15, 30: 22, 50: 37 }[attributeScale(mode)]
}

/** Máximo de puntos de atributo que da una temporada: 5, 8 o 13. */
export function maxTrainingPointsFor(
  mode: Pick<GameMode, 'id' | 'seasons' | 'decisionInterval'>
): number {
  return { 20: 5, 30: 8, 50: 13 }[attributeScale(mode)]
}

/** ¿Hay decisiones en esta temporada? (la primera siempre las tiene) */
export function isDecisionSeason(mode: GameMode, season: number): boolean {
  return (season - 1) % mode.decisionInterval === 0
}

/** Cuando se decide cada temporada hay 10 decisiones y partidos importantes jugada a jugada. */
export function hasFullSeasons(mode: GameMode): boolean {
  return mode.decisionInterval === 1
}

export function eventsPerDecisionSeason(mode: GameMode): number {
  return hasFullSeasons(mode) ? EVENTS_PER_SEASON_FULL : EVENTS_PER_SEASON_SHORT
}

export function isValidMode(value: unknown): value is GameMode {
  if (typeof value !== 'object' || value === null) return false
  const m = value as Record<string, unknown>
  return (
    GAME_MODES.some((info) => info.id === m.id) &&
    typeof m.seasons === 'number' &&
    Number.isInteger(m.seasons) &&
    m.seasons >= 1 &&
    m.seasons <= MAX_CUSTOM_SEASONS &&
    (m.decisionInterval === 1 || m.decisionInterval === 2 || m.decisionInterval === 3)
  )
}

export function intervalLabel(interval: DecisionInterval): string {
  return interval === 1
    ? 'Cada temporada'
    : interval === 2
      ? 'Cada dos temporadas'
      : 'Cada tres temporadas'
}
