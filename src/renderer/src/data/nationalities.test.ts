import { describe, expect, it } from 'vitest'
import {
  AVAILABLE_NATIONALITIES,
  cycleNationality,
  DEFAULT_NATIONALITY_ID,
  getNationality,
  isNationalityAvailable,
  NATIONALITIES
} from './nationalities'

describe('nacionalidades', () => {
  it('tiene las 9 nacionalidades de la v0.1 en orden', () => {
    expect(NATIONALITIES.map((n) => n.name)).toEqual([
      'Argentina',
      'Brasil',
      'España',
      'Francia',
      'Inglaterra',
      'Alemania',
      'Italia',
      'Japón',
      'Estados Unidos'
    ])
  })

  it('no tiene países repetidos', () => {
    expect(new Set(NATIONALITIES.map((n) => n.id)).size).toBe(NATIONALITIES.length)
  })

  it('España es la nacionalidad por defecto', () => {
    expect(getNationality(DEFAULT_NATIONALITY_ID).name).toBe('España')
  })

  it('por ahora solo se eligen las europeas: Argentina, Brasil, Japón y EE. UU. bloqueadas', () => {
    expect(AVAILABLE_NATIONALITIES.map((n) => n.id)).toEqual(['ESP', 'FRA', 'ENG', 'GER', 'ITA'])
    for (const id of ['ARG', 'BRA', 'JPN', 'USA'] as const) {
      expect(isNationalityAvailable(id)).toBe(false)
    }
  })

  it('cada nacionalidad tiene bandera', () => {
    for (const n of NATIONALITIES) expect(n.flag).toBeTruthy()
  })

  it('la flecha derecha avanza (saltando las bloqueadas) y da la vuelta al final', () => {
    expect(cycleNationality('ESP', 1)).toBe('FRA')
    expect(cycleNationality('ITA', 1)).toBe('ESP')
  })

  it('la flecha izquierda retrocede y da la vuelta al principio', () => {
    expect(cycleNationality('FRA', -1)).toBe('ESP')
    expect(cycleNationality('ESP', -1)).toBe('ITA')
  })

  it('desde una bloqueada se pasa a una elegible', () => {
    expect(isNationalityAvailable(cycleNationality('ARG', 1))).toBe(true)
    expect(isNationalityAvailable(cycleNationality('USA', -1))).toBe(true)
  })

  it('5 pulsaciones a la derecha vuelven al país inicial', () => {
    let id = DEFAULT_NATIONALITY_ID
    for (let i = 0; i < AVAILABLE_NATIONALITIES.length; i++) id = cycleNationality(id, 1)
    expect(id).toBe(DEFAULT_NATIONALITY_ID)
  })
})
