import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { getClub } from '../data/clubs'
import { defaultMode } from '../data/gameModes'
import type { Career } from '../types/career'
import { createCareer } from './career'
import { initialStanding } from './season'
import { applyTransferDecision, generateTransferMarket, isMarketPending } from './transfers'

function careerAfterSeason1(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'Test Mercado',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ESP'
      },
      mode: defaultMode('completa'),
      originId: 'esp-cantera',
      allocation: { ...emptyAttributes(), finishing: 3, offTheBall: 3 },
      clubId: 'esp-valensia-cf'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  return { ...base, id: 'test-mercado', season: 2, age: 18, ...overrides }
}

describe('mercado de fichajes', () => {
  it('solo hay mercado desde la segunda temporada y una vez por verano', () => {
    expect(isMarketPending({ ...careerAfterSeason1(), season: 1 })).toBe(false)
    const career = careerAfterSeason1()
    expect(isMarketPending(career)).toBe(true)
    const { career: after } = applyTransferDecision(career, null)
    expect(isMarketPending(after)).toBe(false)
  })

  it('en el modo normal solo hay mercado antes de las temporadas con decisiones', () => {
    const normal = careerAfterSeason1({ mode: defaultMode('normal') })
    expect(isMarketPending(normal)).toBe(false) // temporada 2: sin decisiones
    expect(isMarketPending({ ...normal, season: 3 })).toBe(true)
  })

  it('las ofertas traen años de contrato y quedarse con el contrato terminado renueva', () => {
    const career = careerAfterSeason1({ season: 4 })
    for (const offer of generateTransferMarket(career).offers) {
      expect(offer.years).toBeGreaterThanOrEqual(2)
      expect(offer.years).toBeLessThanOrEqual(5)
    }
    const { career: after } = applyTransferDecision(career, null)
    expect(after.contract.endSeason).toBe(6)
    expect(after.contract.weeklyWage).toBeGreaterThan(career.contract.weeklyWage)
  })

  it('siempre hay al menos una oferta y nunca del club actual', () => {
    const market = generateTransferMarket(careerAfterSeason1())
    expect(market.offers.length).toBeGreaterThanOrEqual(1)
    expect(market.offers.length).toBeLessThanOrEqual(3)
    expect(market.offers.map((o) => o.club.id)).not.toContain('esp-valensia-cf')
  })

  it('con poca fama los grandes no llaman', () => {
    const market = generateTransferMarket(careerAfterSeason1({ reputation: 5 }))
    expect(market.offers.every((o) => o.club.tier !== 'grande')).toBe(true)
  })

  it('los clubes rechazados en el primer contrato no vuelven a llamar (consecuencia)', () => {
    const career = careerAfterSeason1({ reputation: 90 })
    const rejected = String(career.flags.rejectedFirstOffers).split(',')
    expect(rejected).toContain('esp-atletico-de-madrit')
    const market = generateTransferMarket(career)
    expect(market.offers.map((o) => o.club.id)).not.toContain('esp-atletico-de-madrit')
    expect(market.closedDoors.map((d) => d.club.id)).toContain('esp-atletico-de-madrit')
  })

  it('las ofertas son deterministas (recargar no cambia el mercado)', () => {
    const career = careerAfterSeason1({ reputation: 60 })
    expect(generateTransferMarket(career)).toEqual(generateTransferMarket(career))
  })

  it('quedarse sube la confianza', () => {
    const career = careerAfterSeason1({ trust: 50 })
    const { career: after } = applyTransferDecision(career, null)
    expect(after.clubId).toBe('esp-valensia-cf')
    expect(after.trust).toBe(54)
  })

  it('fichar cambia de club, reinicia la confianza y cuenta el traspaso', () => {
    const career = careerAfterSeason1({ trust: 90, reputation: 60 })
    const offer = generateTransferMarket(career).offers[0]
    const { career: after } = applyTransferDecision(career, offer.club.id)
    expect(after.clubId).toBe(offer.club.id)
    expect(after.trust).toBe(initialStanding(offer.club.tier, career.originId).trust)
    expect(after.flags.transfers).toBe(1)
    expect(after.contract.clubId).toBe(offer.club.id)
    expect(after.contract.weeklyWage).toBe(offer.weeklyWage)
    expect(after.contract.endSeason).toBe(career.season + offer.years - 1)
    expect(getClub(after.clubId).id).toBe(offer.club.id)
  })

  it('irse tras prometer lealtad cuesta fama', () => {
    const career = careerAfterSeason1({ reputation: 40, flags: { loyalToClub: true } })
    const offer = generateTransferMarket(career).offers[0]
    const { career: after, message } = applyTransferDecision(career, offer.club.id)
    expect(after.reputation).toBe(34)
    expect(after.flags.brokenPromise).toBe(true)
    expect(message).toContain('aquí soy feliz')
  })
})
