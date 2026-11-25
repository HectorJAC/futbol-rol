import type { NationalityId } from '../data/nationalities'
import type { PositionId } from '../data/positions'

export type Sex = 'M' | 'F'

/** Pierna buena del jugador. */
export type Foot = 'derecha' | 'izquierda'

export const FEET: readonly Foot[] = ['derecha', 'izquierda']

/** Personaje ya confirmado al pulsar "Comenzar carrera". */
export interface Character {
  name: string
  sex: Sex
  foot: Foot
  position: PositionId
  nationalityId: NationalityId
}

/** Datos mientras el jugador rellena la pantalla de creación (el nombre aún sin validar). */
export type CharacterDraft = Character
