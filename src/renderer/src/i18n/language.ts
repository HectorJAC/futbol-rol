import type { Language } from '../../../shared/settings'

/**
 * Idioma actual del juego. Vive aparte (sin dependencias) para que los datos,
 * la lógica y la interfaz lo puedan leer sin ciclos de importación.
 */
let current: Language = 'es'

export function getLanguage(): Language {
  return current
}

export function setLanguage(language: Language): void {
  current = language
}

/** Locale para formatear números y fechas en el idioma actual. */
export function currentLocale(): string {
  return current === 'en' ? 'en-GB' : 'es-ES'
}
