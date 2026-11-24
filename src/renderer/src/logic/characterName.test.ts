import { describe, expect, it } from 'vitest'
import { normalizeName, validateName } from './characterName'

describe('nombre del personaje', () => {
  it('quita espacios sobrantes', () => {
    expect(normalizeName('   Leo    Gómez  ')).toBe('Leo Gómez')
  })

  it('vacío o solo espacios no es válido', () => {
    expect(validateName('')).toBe('empty')
    expect(validateName('    ')).toBe('empty')
  })

  it('exige al menos 2 caracteres', () => {
    expect(validateName('A')).toBe('tooShort')
    expect(validateName('Al')).toBeNull()
  })

  it('no permite más de 24 caracteres', () => {
    expect(validateName('A'.repeat(24))).toBeNull()
    expect(validateName('A'.repeat(25))).toBe('tooLong')
  })

  it('acepta acentos y ñ', () => {
    expect(validateName('Iñaki Núñez')).toBeNull()
  })
})
