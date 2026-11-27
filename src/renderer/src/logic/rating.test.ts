import { describe, expect, it } from 'vitest'
import {
  BASE_ATTRIBUTES,
  emptyAttributes,
  normalizeAttributes,
  toScale,
  type Attributes
} from '../data/attributes'
import { getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import { STORY_EVENTS } from '../data/storyEvents'
import type { Career, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import { attributeScore, formatMarketValue, marketValue, playerRating } from './rating'
import { familyStatus } from './relationships'
import {
  applyEffects,
  applyTrainingPoints,
  isEventEligible,
  pickSeasonEvents,
  trainingPoints
} from './season'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'Test Media',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ESP'
      },
      mode: defaultMode('completa'),
      originId: 'esp-cantera',
      allocation: emptyAttributes(),
      clubId: 'esp-atletico-de-madrit'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  return { ...base, id: 'test-media', ...overrides }
}

/** Buen delantero en la escala de 20. */
const GOOD20: Attributes = {
  finishing: 16,
  heading: 13,
  dribbling: 14,
  shortPassing: 14,
  longPassing: 11,
  offTheBall: 16,
  pace: 14,
  strength: 13,
  stamina: 14,
  physique: 13,
  composure: 15,
  leadership: 12,
  corners: 10,
  freeKicks: 11,
  penalties: 14
}
/** Lo mismo en la escala de 50 del modo Completa (el de estas carreras). */
const GOOD = Object.fromEntries(
  Object.entries(GOOD20).map(([id, v]) => [id, toScale(v, 50)])
) as Attributes

function season(n: number, goals: number, matches: number, rating: number): SeasonRecord {
  return {
    season: n,
    yearLabel: '',
    clubId: 'esp-real-madrik',
    age: 17 + n,
    matches,
    goals,
    assists: Math.round(goals / 3),
    rating,
    leaguePosition: 1,
    trophies: ['liga'],
    attributeChanges: {}
  }
}

describe('media del jugador', () => {
  it('un juvenil recién creado ronda 45 (solo atributos)', () => {
    const rookie = career()
    expect(playerRating(rookie)).toBe(
      Math.round(attributeScore(normalizeAttributes(rookie.attributes, 50)))
    )
    expect(Math.round(attributeScore(BASE_ATTRIBUTES))).toBeGreaterThanOrEqual(40)
    expect(Math.round(attributeScore(BASE_ATTRIBUTES))).toBeLessThanOrEqual(46)
  })

  it('un goleador consagrado en un grande supera claramente los 75', () => {
    // 8 temporadas, ~0,67 goles por partido, buena nota y mucha fama.
    const history = Array.from({ length: 8 }, (_, i) => season(i + 1, 15, 23, 7.4))
    const star = career({ attributes: GOOD, reputation: 75, age: 25, season: 9, history })
    const onlyAttributes = Math.round(attributeScore(GOOD20))
    expect(playerRating(star)).toBeGreaterThan(onlyAttributes)
    expect(playerRating(star)).toBeGreaterThanOrEqual(78)
  })

  it('las malas estadísticas no inflan la media', () => {
    const history = [season(1, 0, 20, 5.8), season(2, 1, 22, 5.9)]
    const flop = career({ attributes: GOOD, reputation: 10, season: 3, history })
    expect(playerRating(flop)).toBeLessThanOrEqual(Math.round(attributeScore(GOOD20)) + 1)
  })
})

describe('valor de mercado', () => {
  it('sube con la media y baja con la edad', () => {
    const history = Array.from({ length: 4 }, (_, i) => season(i + 1, 20, 30, 7.6))
    const young = career({ attributes: GOOD, reputation: 70, age: 22, season: 5, history })
    const old = { ...young, age: 34 }
    expect(marketValue(young)).toBeGreaterThan(10_000_000)
    expect(marketValue(old)).toBeLessThan(marketValue(young))
    expect(formatMarketValue(25_300_000)).toBe('25,3 M€')
    expect(formatMarketValue(850_000)).toBe('850.000 €')
  })
})

describe('puntos de fin de temporada', () => {
  it('como mucho 5 en la Completa (v0.18; 2 y 3 en la Rápida y la Normal) y se reparten sin pasar del máximo', () => {
    const c = career()
    const great = { ...season(1, 35, 38, 8.1), assists: 12 }
    expect(trainingPoints(c, great)).toBe(5)
    expect(trainingPoints({ ...c, mode: defaultMode('rapida') }, great)).toBe(2)
    expect(trainingPoints({ ...c, mode: defaultMode('normal') }, great)).toBe(3)
    expect(trainingPoints(c, { ...season(1, 0, 3, 5.5), trophies: [] })).toBe(0)
    const withPoints = { ...c, pendingPoints: 3 }
    const after = applyTrainingPoints(withPoints, { finishing: 2, pace: 1 })
    expect(after.attributes.finishing).toBe(c.attributes.finishing + 2)
    expect(after.pendingPoints).toBe(0)
    expect(() => applyTrainingPoints(withPoints, { finishing: 4 })).toThrow()
  })
})

describe('historia de la pareja', () => {
  it('soltero: puede salir conocer a alguien; con pareja ya no', () => {
    const single = career({ age: 19, season: 2 })
    expect(isEventEligible(getEvent('pareja-conocer'), single)).toBe(true)
    const dating = { ...single, flags: { partner: 'pareja', partnerStageSince: 2 } }
    expect(isEventEligible(getEvent('pareja-conocer'), dating)).toBe(false)
  })

  it('empezar una relación le pone nombre y la etapa avanza con la relación (v0.17)', () => {
    const c = career({ age: 20, season: 3 })
    const dating = applyEffects(c, { partner: 10, flags: { partner: 'conociendo' } })
    expect(typeof dating.flags.partnerName).toBe('string')
    expect(dating.flags.partnerStageSince).toBe(3)
    expect(dating.flags.partnerRelation).toBe(35)
    expect(familyStatus(dating)).toBe(`Conociendo a ${dating.flags.partnerName}`)
    const couple = applyEffects(dating, { partner: 15 })
    expect(familyStatus(couple)).toBe(`Novio de ${couple.flags.partnerName}`)
    // Para irse a vivir juntos hace falta una temporada de novios y 55 de relación.
    const fond = { ...couple, flags: { ...couple.flags, partnerRelation: 60 } }
    expect(isEventEligible(getEvent('pareja-convivir'), fond)).toBe(false)
    expect(isEventEligible(getEvent('pareja-convivir'), { ...fond, season: 4 })).toBe(true)
  })

  it('casados con hijos: la ficha lo cuenta y los hijos se suman', () => {
    const married = applyEffects(career({ age: 28, season: 10 }), {
      flags: { partner: 'pareja' }
    })
    const wed = applyEffects(
      { ...married, season: 12 },
      {
        flags: { partner: 'casados' },
        addFlags: { children: 1 }
      }
    )
    const twoKids = applyEffects(wed, { addFlags: { children: 1 } })
    expect(familyStatus(twoKids)).toBe(`Casado con ${twoKids.flags.partnerName} · 2 hijos`)
  })

  it('cada temporada sale como mucho un capítulo de la historia', () => {
    const c = career({ age: 20, season: 4, flags: { partner: 'pareja', partnerStageSince: 2 } })
    const ids = pickSeasonEvents(c)
    expect(ids.filter((id) => getEvent(id).story)).toHaveLength(1)
  })

  it('si hubo infidelidad, que se entere tiene prioridad', () => {
    const c = career({
      age: 24,
      season: 6,
      flags: { partner: 'casados', partnerStageSince: 3, partnerName: 'Lucía', cheated: true }
    })
    expect(pickSeasonEvents(c)).toContain('pareja-descubre')
  })

  it('todos los capítulos de la historia tienen opciones válidas', () => {
    expect(STORY_EVENTS.length).toBeGreaterThanOrEqual(12)
    for (const event of STORY_EVENTS) {
      expect(event.story?.id).toBe('pareja')
      expect(event.options.length).toBeGreaterThanOrEqual(2)
    }
  })
})
