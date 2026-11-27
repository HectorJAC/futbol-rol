/**
 * Tipos compartidos entre el proceso principal (que escribe en disco)
 * y el juego (renderer). No importa nada de Electron ni de React.
 */

/** Resumen que se muestra en la pantalla "Cargar Partida" sin leer toda la partida. */
export interface SaveSummary {
  id: string
  playerName: string
  nationalityId: string
  clubName: string
  season: number
  updatedAt: string
}

/** Archivo de guardado tal y como se escribe en disco. */
export interface SaveFile {
  version: number
  summary: SaveSummary
  career: unknown
}

/** Solo letras minúsculas, números y guiones: evita rutas raras en el nombre del archivo. */
export const SAVE_ID_PATTERN = /^[a-z0-9-]{1,64}$/

export function isValidSaveId(id: unknown): id is string {
  return typeof id === 'string' && SAVE_ID_PATTERN.test(id)
}
