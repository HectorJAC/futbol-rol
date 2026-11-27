import { en } from './en'
import { es } from './es'
import { getLanguage } from './language'
import { ROUNDS_EN } from './en/data'

export { currentLocale, getLanguage, setLanguage } from './language'

/** Convierte los textos literales de `es` en `string` (cada idioma tiene los suyos). */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends (...args: infer A) => infer R
      ? (...args: A) => R
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> }

/** Forma de los textos de la interfaz: todos los idiomas tienen exactamente las mismas claves. */
export type Strings = Widen<typeof es>

const DICTIONARIES: Record<'es' | 'en', Strings> = { es, en }

/**
 * Textos de la interfaz en el idioma actual. Se leen al pintar (`t.hub.play`),
 * así que al cambiar de idioma basta con volver a pintar la pantalla.
 */
export const t: Strings = new Proxy({} as Strings, {
  get: (_, key) => DICTIONARIES[getLanguage()][key as keyof Strings]
})

/**
 * Objeto que lee sus valores del idioma actual en cada acceso: sirve para
 * mantener constantes como `ROLE_LABELS[role]` sin congelar el idioma.
 */
export function liveRecord<T extends object>(read: () => T): T {
  return new Proxy({} as T, { get: (_, key) => read()[key as keyof T] })
}

/** Sustituye `{clave}` por su valor: `fill('Hola {name}', { name: 'Ana' })`. */
export function fill(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}

/**
 * Nombre de una ronda para mostrarlo. El juego guarda las rondas con su nombre
 * en español ("Cuartos de final", "Grupos · J3", "Campeón"); aquí se muestran
 * en el idioma actual.
 */
export function roundName(name: string): string {
  if (getLanguage() !== 'en') return name
  const group = /^Grupos · J(\d+)$/.exec(name)
  if (group) return fill(t.game.groupDay, { n: group[1] })
  const day = /^Jornada (\d+)$/.exec(name)
  if (day) return fill(t.game.matchday, { n: day[1] })
  return ROUNDS_EN[name] ?? name
}

/** "1º" / "1st": puesto en una tabla o ronda. */
export function ordinal(n: number): string {
  if (getLanguage() !== 'en') return `${n}º`
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`
}
