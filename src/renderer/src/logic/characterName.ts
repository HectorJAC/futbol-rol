export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 24

export type NameError = 'empty' | 'tooShort' | 'tooLong'

/** Quita espacios al principio/final y deja un solo espacio entre palabras. */
export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

/** Devuelve el error del nombre o `null` si es válido. */
export function validateName(raw: string): NameError | null {
  const name = normalizeName(raw)
  if (name.length === 0) return 'empty'
  if (name.length < NAME_MIN_LENGTH) return 'tooShort'
  if (name.length > NAME_MAX_LENGTH) return 'tooLong'
  return null
}
