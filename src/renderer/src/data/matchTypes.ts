import type { AttributeId, SetPieceId } from './attributes'
import type { EventEffects } from './events'

/**
 * Efectos de un momento de partido importante. Además de los efectos normales
 * de un evento (moral, confianza, flags…), cambian el marcador en directo.
 */
export interface MatchMomentEffects extends Omit<EventEffects, 'goals'> {
  /** Goles tuyos en esta jugada (también suben el marcador de tu equipo). */
  playerGoals?: number
  /** Asistencias tuyas (el gol lo marca un compañero: también sube el marcador). */
  playerAssists?: number
  /** Goles de tu equipo que no marcas ni asistes tú. */
  teamGoals?: number
  /** Goles del rival. */
  opponentGoals?: number
}

export interface MatchMomentOutcome {
  text: string
  effects: MatchMomentEffects
}

export interface MatchMomentOption {
  label: string
  check?: {
    attribute: AttributeId
    difficulty: number
    success: MatchMomentOutcome
    failure: MatchMomentOutcome
  }
  outcome?: MatchMomentOutcome
}

/** Fase del partido en la que puede salir el momento. */
export type MatchPhase = 'inicio' | 'medio' | 'final'

/** Situación del marcador (desde el punto de vista de tu equipo) en la que tiene sentido. */
export type ScoreSituation = 'ganando' | 'empatando' | 'perdiendo'

/**
 * Jugada clave de un partido importante. En los textos se puede usar
 * `{rival}` (nombre del rival) y `{club}` (tu club).
 */
export interface MatchMoment {
  id: string
  title: string
  text: string
  phase: MatchPhase
  /** Si se indica, solo sale con el marcador en esa situación. */
  situations?: ScoreSituation[]
  /** Jugada de balón parado: solo sale si eres el lanzador (ver `setPieceRoles`). */
  setPiece?: SetPieceId
  /** Texto para jugadores de menos de 25 años (si el normal no encaja con su edad). */
  youngText?: string
  options: MatchMomentOption[]
}
