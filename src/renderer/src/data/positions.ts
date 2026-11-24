export interface Position {
  id: PositionId
  short: string
  name: string
}

export type PositionId = 'DC'

/** v0.1: solo delantero centro. */
export const POSITIONS: readonly Position[] = [{ id: 'DC', short: 'DC', name: 'Delantero centro' }]

export const DEFAULT_POSITION_ID: PositionId = 'DC'

export function getPosition(id: PositionId): Position {
  const position = POSITIONS.find((p) => p.id === id)
  if (!position) throw new Error(`Posición desconocida: ${id}`)
  return position
}
