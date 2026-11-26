export interface Position {
  id: PositionId
  short: string
  name: string
  /** Por ahora solo se juega de delantero centro; el resto se ve bloqueado. */
  available: boolean
}

export type PositionId = 'POR' | 'DFC' | 'LAT' | 'MCD' | 'MP' | 'DC'

/** De la portería al ataque. */
export const POSITIONS: readonly Position[] = [
  { id: 'POR', short: 'POR', name: 'Portero', available: false },
  { id: 'DFC', short: 'DFC', name: 'Defensa central', available: false },
  { id: 'LAT', short: 'LAT', name: 'Lateral', available: false },
  { id: 'MCD', short: 'MCD', name: 'Mediocentro defensivo', available: false },
  { id: 'MP', short: 'MP', name: 'Mediapunta', available: false },
  { id: 'DC', short: 'DC', name: 'Delantero centro', available: true }
]

export const DEFAULT_POSITION_ID: PositionId = 'DC'

export function getPosition(id: PositionId): Position {
  const position = POSITIONS.find((p) => p.id === id)
  if (!position) throw new Error(`Posición desconocida: ${id}`)
  return position
}
