/** Ajustes del juego. Se guardan en `settings.json` dentro de la carpeta de datos del usuario. */

export const WINDOW_SIZES = ['1280x720', '1600x900', '1920x1080'] as const
export type WindowSize = (typeof WINDOW_SIZES)[number]

export const LANGUAGES = ['es', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

export interface GameSettings {
  fullscreen: boolean
  windowSize: WindowSize
  /** Animaciones y transiciones de la interfaz. */
  animations: boolean
  language: Language
}

export const DEFAULT_SETTINGS: GameSettings = {
  fullscreen: false,
  windowSize: '1280x720',
  animations: true,
  language: 'es'
}

/** Idiomas disponibles. Cada uno tiene sus propios textos (el inglés no es una traducción). */
export const AVAILABLE_LANGUAGES: readonly Language[] = ['es', 'en']

/** Acepta cualquier cosa (p. ej. un JSON editado a mano) y devuelve ajustes válidos. */
export function sanitizeSettings(value: unknown): GameSettings {
  const v = (typeof value === 'object' && value !== null ? value : {}) as Partial<
    Record<keyof GameSettings, unknown>
  >
  return {
    fullscreen: typeof v.fullscreen === 'boolean' ? v.fullscreen : DEFAULT_SETTINGS.fullscreen,
    windowSize: WINDOW_SIZES.includes(v.windowSize as WindowSize)
      ? (v.windowSize as WindowSize)
      : DEFAULT_SETTINGS.windowSize,
    animations: typeof v.animations === 'boolean' ? v.animations : DEFAULT_SETTINGS.animations,
    language: AVAILABLE_LANGUAGES.includes(v.language as Language)
      ? (v.language as Language)
      : DEFAULT_SETTINGS.language
  }
}

export function parseWindowSize(size: WindowSize): { width: number; height: number } {
  const [width, height] = size.split('x').map(Number)
  return { width, height }
}
