import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import {
  DEFAULT_MODE_ID,
  defaultMode,
  GAME_MODES,
  getGameModeInfo,
  isModeAvailable
} from '../data/gameModes'
import { createCareer } from './career'
import { upperName, validateName } from './characterName'
import { careerFromSaveFile, SAVE_VERSION, toSaveFile } from './saveGame'

const career = createCareer(
  {
    character: {
      name: 'ZURDO TEST',
      sex: 'M',
      foot: 'izquierda',
      position: 'DC',
      nationalityId: 'ARG'
    },
    mode: defaultMode('completa'),
    originId: 'arg-potrero',
    allocation: emptyAttributes(),
    clubId: 'arg-quilmez'
  },
  new Date('2026-11-24T12:00:00Z')
)

describe('v0.13: modos de juego', () => {
  it('la Completa dura 15 temporadas y decide en todas', () => {
    expect(defaultMode('completa')).toEqual({ id: 'completa', seasons: 15, decisionInterval: 1 })
    expect(getGameModeInfo('completa').description).toMatch(/^15 temporadas/)
  })

  it('por ahora solo se eligen la Completa y la Personalizada', () => {
    expect(GAME_MODES.filter((m) => m.available).map((m) => m.id)).toEqual([
      'completa',
      'personalizada'
    ])
    expect(isModeAvailable('rapida')).toBe(false)
    expect(isModeAvailable('normal')).toBe(false)
    expect(DEFAULT_MODE_ID).toBe('completa')
  })
})

describe('v0.13: nombre en mayúsculas', () => {
  it('pasa a mayúsculas con tildes, eñes y diéresis', () => {
    expect(upperName('josé ñúñez güemes')).toBe('JOSÉ ÑÚÑEZ GÜEMES')
    expect(validateName(upperName('ab'))).toBeNull()
  })
})

describe('v0.13: pierna buena', () => {
  it('la carrera guarda la pierna buena y se carga igual', () => {
    expect(career.character.foot).toBe('izquierda')
    const loaded = careerFromSaveFile(JSON.parse(JSON.stringify(toSaveFile(career))))
    expect(loaded?.character.foot).toBe('izquierda')
    expect(SAVE_VERSION).toBe(6)
  })

  it('una partida v5 (juego v0.11–v0.12) se carga como diestro', () => {
    const { foot, ...oldCharacter } = career.character
    void foot
    const migrated = careerFromSaveFile({
      ...toSaveFile(career),
      version: 5,
      career: { ...career, character: oldCharacter } as never
    })
    expect(migrated?.character.foot).toBe('derecha')
    expect(migrated?.character.name).toBe('ZURDO TEST')
  })

  it('rechaza una pierna que no existe', () => {
    const bad = { ...career, character: { ...career.character, foot: 'ambas' } }
    expect(careerFromSaveFile({ ...toSaveFile(career), career: bad as never })).toBeNull()
  })
})
