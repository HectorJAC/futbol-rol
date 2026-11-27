import { getLanguage } from './language'
import type { EventText, MomentText, OptionText, MomentOptionText } from './packs'

/** Textos originales (español) de los campos ligados, por objeto. */
const ORIGINALS = new WeakMap<object, Record<string, string>>()

/**
 * Texto original (español) de un campo, aunque el idioma activo sea otro. Para
 * la lógica que lee datos del texto (p. ej. el minuto de una jugada): así la
 * mecánica no cambia con el idioma.
 */
export function originalText(target: object, key: string): string {
  return ORIGINALS.get(target)?.[key] ?? String((target as Record<string, unknown>)[key] ?? '')
}

/**
 * Sustituye un campo de texto de un objeto de datos por una propiedad que
 * devuelve el texto del idioma actual: el original (español) o el del paquete
 * inglés. Así la lógica y la interfaz leen `event.title`, `origin.name`… como
 * siempre y reciben el idioma activo, sin copiar ni cambiar la mecánica.
 */
export function bindText(target: object, key: string, en: string | undefined): void {
  if (en === undefined) return
  const record = target as Record<string, unknown>
  const original = record[key]
  if (typeof original !== 'string') return
  const saved = ORIGINALS.get(target) ?? {}
  saved[key] ??= original
  ORIGINALS.set(target, saved)
  Object.defineProperty(target, key, {
    get: () => (getLanguage() === 'en' ? en : original),
    enumerable: true,
    configurable: true
  })
}

/** Campos de texto de cualquier objeto: `bindFields(item, { name: '…', description: '…' })`. */
export function bindFields(target: object, texts: Record<string, string | undefined>): void {
  for (const [key, value] of Object.entries(texts)) bindText(target, key, value)
}

interface OptionShape {
  label: string
  outcome?: { text: string }
  check?: { success: { text: string }; failure: { text: string } }
  asCaptain?: { label: string; success?: string; failure?: string }
}

function bindOption(option: OptionShape, text: OptionText | MomentOptionText | undefined): void {
  if (!text) return
  bindText(option, 'label', text.label)
  if (option.outcome) bindText(option.outcome, 'text', text.outcome)
  if (option.check) {
    bindText(option.check.success, 'text', text.success)
    bindText(option.check.failure, 'text', text.failure)
  }
  const captain = (text as MomentOptionText).asCaptain
  if (option.asCaptain && captain) {
    bindFields(option.asCaptain, {
      label: captain.label,
      success: captain.success,
      failure: captain.failure
    })
  }
}

/** Liga los textos de un evento de temporada (título, texto y cada opción). */
export function bindEvent(
  event: { title: string; text: string; options: OptionShape[] },
  text: EventText | undefined
): void {
  if (!text) return
  bindFields(event, { title: text.title, text: text.text })
  event.options.forEach((option, i) => bindOption(option, text.options[i]))
}

/** Liga los textos de una jugada de partido importante. */
export function bindMoment(
  moment: { title: string; text: string; youngText?: string; options: OptionShape[] },
  text: MomentText | undefined
): void {
  if (!text) return
  bindFields(moment, { title: text.title, text: text.text, youngText: text.youngText })
  moment.options.forEach((option, i) => bindOption(option, text.options[i]))
}
