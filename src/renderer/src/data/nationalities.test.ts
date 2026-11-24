import { describe, expect, it } from 'vitest'
import {
  cycleNationality,
  DEFAULT_NATIONALITY_ID,
  getNationality,
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

  it('Argentina es la nacionalidad por defecto', () => {
    expect(getNationality(DEFAULT_NATIONALITY_ID).name).toBe('Argentina')
  })

  it('cada nacionalidad tiene bandera', () => {
    for (const n of NATIONALITIES) expect(n.flag).toBeTruthy()
  })

  it('la flecha derecha avanza y da la vuelta al final', () => {
    expect(cycleNationality('ARG', 1)).toBe('BRA')
    expect(cycleNationality('USA', 1)).toBe('ARG')
  })

  it('la flecha izquierda retrocede y da la vuelta al principio', () => {
    expect(cycleNationality('BRA', -1)).toBe('ARG')
    expect(cycleNationality('ARG', -1)).toBe('USA')
  })

  it('9 pulsaciones a la derecha vuelven al país inicial', () => {
    let id = DEFAULT_NATIONALITY_ID
    for (let i = 0; i < NATIONALITIES.length; i++) id = cycleNationality(id, 1)
    expect(id).toBe(DEFAULT_NATIONALITY_ID)
  })
})
