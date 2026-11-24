import { describe, expect, it } from 'vitest'
import {
  BASE_ATTRIBUTES,
  combineAttributes,
  emptyAttributes,
  FREE_POINTS,
  overallRating,
  toScale
} from '../data/attributes'
import { ALL_CLUBS, getClubOffers } from '../data/clubs'
import { attributeScale, defaultMode, freePointsFor, setPieceMinimum } from '../data/gameModes'
import { NATIONALITIES } from '../data/nationalities'
import { EXTRA_ORIGINS } from '../data/originCatalog'
import { ORIGINS, originsForNationality } from '../data/origins'
import {
  canAllocate,
  computeAttributes,
  createCareer,
  generateCareerId,
  remainingPoints
} from './career'

describe('atributos', () => {
  it('el origen modifica los atributos base', () => {
    const attrs = computeAttributes('arg-potrero', emptyAttributes())
    expect(attrs.dribbling).toBe(BASE_ATTRIBUTES.dribbling + 3)
    expect(attrs.longPassing).toBe(BASE_ATTRIBUTES.longPassing - 1)
  })

  it('nunca baja de 1 ni sube de 20', () => {
    const attrs = combineAttributes({ finishing: 30, heading: -10 })
    expect(attrs.finishing).toBe(20)
    expect(attrs.heading).toBe(1)
  })

  it('no deja repartir más puntos de los disponibles', () => {
    const allocation = { ...emptyAttributes(), finishing: 3, pace: FREE_POINTS - 3 }
    expect(canAllocate('esp-cantera', allocation, 'heading', 1)).toBe(false)
    expect(canAllocate('esp-cantera', allocation, 'pace', -1)).toBe(true)
    expect(canAllocate('esp-cantera', emptyAttributes(), 'pace', -1)).toBe(false)
  })

  it('no deja pasar de 15 al crear el personaje', () => {
    // esp-cantera: pase corto 7 + 4 = 11 → con 4 puntos llega a 15 y ya no puede subir.
    const allocation = { ...emptyAttributes(), shortPassing: 4 }
    expect(computeAttributes('esp-cantera', allocation).shortPassing).toBe(15)
    expect(canAllocate('esp-cantera', allocation, 'shortPassing', 1)).toBe(false)
  })

  it('la media sube al mejorar la definición', () => {
    const base = overallRating(BASE_ATTRIBUTES)
    expect(overallRating({ ...BASE_ATTRIBUTES, finishing: 15 })).toBeGreaterThan(base)
    expect(base).toBeGreaterThan(30)
    expect(base).toBeLessThan(50)
  })
})

describe('escala de atributos por modo', () => {
  it('Rápida 1–20, Normal 1–30 y Completa 1–50 (con más puntos libres)', () => {
    expect(attributeScale(defaultMode('rapida'))).toBe(20)
    expect(attributeScale(defaultMode('normal'))).toBe(30)
    expect(attributeScale(defaultMode('completa'))).toBe(50)
    expect(freePointsFor(defaultMode('rapida'))).toBe(8)
    expect(freePointsFor(defaultMode('normal'))).toBe(12)
    expect(freePointsFor(defaultMode('completa'))).toBe(20)
    // Lanzadores: 10 en la Rápida, 15 en la Normal y 30 en la Completa.
    expect(setPieceMinimum(defaultMode('rapida'))).toBe(10)
    expect(setPieceMinimum(defaultMode('normal'))).toBe(15)
    expect(setPieceMinimum(defaultMode('completa'))).toBe(30)
  })

  it('los atributos de partida se escalan al modo', () => {
    const completa = defaultMode('completa')
    const attrs = computeAttributes('arg-potrero', emptyAttributes(), completa)
    expect(attrs.dribbling).toBe(toScale(BASE_ATTRIBUTES.dribbling + 3, 50))
    expect(attrs.penalties).toBe(toScale(BASE_ATTRIBUTES.penalties, 50))
    expect(remainingPoints(emptyAttributes(), completa)).toBe(20)
    // El tope al crear también se escala (37 en la Completa).
    const allocation = { ...emptyAttributes(), shortPassing: 20 }
    expect(canAllocate('esp-cantera', allocation, 'shortPassing', 1, completa)).toBe(false)
  })

  it('hay 15 atributos, con tres de balón parado', () => {
    expect(Object.keys(BASE_ATTRIBUTES)).toHaveLength(15)
    expect(BASE_ATTRIBUTES.corners).toBeGreaterThan(0)
    expect(BASE_ATTRIBUTES.freeKicks).toBeGreaterThan(0)
    expect(BASE_ATTRIBUTES.penalties).toBeGreaterThan(0)
  })
})

describe('orígenes y clubes', () => {
  it('4 orígenes por país (uno de cada arquetipo) y 10 especiales', () => {
    expect(ORIGINS).toHaveLength(NATIONALITIES.length * 4 + 10)
    expect(EXTRA_ORIGINS).toHaveLength(10)
    for (const n of NATIONALITIES) {
      const archetypes = originsForNationality(n.id).map((o) => o.archetype)
      expect(archetypes.sort()).toEqual(['academia', 'barrio', 'herencia', 'tardio'])
    }
    for (const o of ORIGINS) {
      expect(o.startAge).toBeGreaterThanOrEqual(16)
      expect(o.id).toMatch(/^[a-z0-9-]+$/)
    }
    expect(new Set(ORIGINS.map((o) => o.id)).size).toBe(ORIGINS.length)
  })

  it('ningún id de club se repite', () => {
    expect(new Set(ALL_CLUBS.map((c) => c.id)).size).toBe(ALL_CLUBS.length)
  })

  it('cada nacionalidad ofrece un grande, un club medio de primera y uno de segunda', () => {
    for (const n of NATIONALITIES) {
      const offers = getClubOffers(n.id, originsForNationality(n.id)[0].id)
      expect(offers.map((o) => o.slot)).toEqual(['grande', 'medio', 'modesto'])
      expect(offers[0].club.division).toBe(1)
      expect(offers[1].club.division).toBe(1)
      expect(offers[2].club.division).toBe(2)
    }
  })

  it('las ofertas van de mayor a menor y el origen marca un club especial', () => {
    const offers = getClubOffers('ESP', 'esp-cantera')
    expect(offers.map((o) => o.slot)).toEqual(['grande', 'medio', 'modesto'])
    expect(offers.filter((o) => o.originTag)).toHaveLength(1)
    expect(offers[0].originTag).toBe('Te formaste en su cantera')
  })
})

describe('creación de la carrera', () => {
  const character = {
    name: 'Iñaki Núñez',
    sex: 'M' as const,
    position: 'DC' as const,
    nationalityId: 'ESP' as const
  }

  it('genera ids de archivo seguros', () => {
    const id = generateCareerId('Iñaki Núñez!!', new Date(0), () => 0)
    expect(id).toMatch(/^inaki-nunez-[a-z0-9]+$/)
    expect(generateCareerId('***', new Date(0), () => 0)).toMatch(/^jugador-/)
  })

  it('crea la carrera con la edad del origen y recuerda los clubes rechazados', () => {
    const career = createCareer(
      {
        character,
        mode: defaultMode('rapida'),
        originId: 'esp-camarero-goleador',
        allocation: emptyAttributes(),
        clubId: 'esp-valensia-cf'
      },
      new Date('2026-11-23T12:00:00Z')
    )
    expect(career.age).toBe(19)
    expect(career.season).toBe(1)
    expect(career.createdAt).toBe('2026-11-23T12:00:00.000Z')
    expect(career.flags.rejectedFirstOffers).toBe(
      'esp-atletico-de-madrit,esp-deportibo-de-la-coruna'
    )
    expect(career.flags.firstClubOriginBond).toBeUndefined()
    expect(career.mode).toEqual({ id: 'rapida', seasons: 15, decisionInterval: 2 })
    expect(career.money).toBe(0)
    expect(career.contract.clubId).toBe('esp-valensia-cf')
    expect(career.pendingPoints).toBe(0)
    expect(career.continentalTeams.campeones).toHaveLength(20)
    expect(career.teammates).toHaveLength(5)
    expect(career.exTeammates).toEqual([])
    expect(career.captaincy).toBeNull()
    expect(career.transferTarget).toBeNull()
    expect(career.divisions.ESP[0]).toContain('esp-valensia-cf')
    expect(career.contract.endSeason).toBe(3)
    expect(career.contract.weeklyWage).toBe(1200)
  })

  it('no permite firmar con un club que no hizo oferta', () => {
    expect(() =>
      createCareer({
        character,
        mode: defaultMode(),
        originId: 'esp-plaza-del-pueblo',
        allocation: emptyAttributes(),
        clubId: 'arg-boka-juniors'
      })
    ).toThrow()
  })
})
