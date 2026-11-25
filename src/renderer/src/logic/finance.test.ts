import { describe, expect, it } from 'vitest'
import { emptyAttributes, scaleDelta } from '../data/attributes'
import { defaultMode } from '../data/gameModes'
import { MATCH_MOMENTS } from '../data/matchMoments'
import { getShopItem, SHOP_ITEMS } from '../data/shop'
import type { Career } from '../types/career'
import { createCareer } from './career'
import {
  buildContract,
  buyItem,
  canBuy,
  contractAfterSeason,
  monthlyWage,
  purchaseSummary,
  shopOffer,
  SHOP_SIZE
} from './finance'
import { createLiveMatch, finalScore, getMoment, isLiveMatchOver, resolveMoment } from './match'
import type { ClubFixture } from './competitions'
import { advanceSeason, importanceOf, startSeason } from './season'
import { careerScale } from './playerAttributes'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'Test Dinero',
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
  return { ...base, id: 'test-dinero', ...overrides }
}

describe('contrato', () => {
  it('las primas y la cláusula salen del sueldo', () => {
    const c = buildContract('esp-real-madrik', 2500, 'Promesa', 1, 3)
    expect(c.endSeason).toBe(3)
    expect(c.goalBonus).toBe(1000)
    expect(c.titleBonus).toBe(15000)
    expect(c.releaseClause).toBe(1_040_000)
  })

  it('un contrato terminado se renueva solo si no hay mercado ese verano', () => {
    const expired = career({ season: 4, mode: defaultMode('normal') }) // temp. 4: sin decisiones
    const renewed = contractAfterSeason(expired)
    expect(renewed.endSeason).toBe(5)
    expect(renewed.weeklyWage).toBeGreaterThan(expired.contract.weeklyWage)
    const withMarket = career({ season: 4 }) // modo completo: hay mercado
    expect(contractAfterSeason(withMarket)).toBe(withMarket.contract)
  })
})

describe('sueldo mensual', () => {
  it('se cobra cada mes durante la temporada', () => {
    const start = startSeason(career({ money: 0 }))
    const monthly = monthlyWage(start.contract)
    expect(monthly).toBe(Math.round((start.contract.weeklyWage * 52) / 12))
    // Al jugar las primeras jornadas ya se cobra agosto (y quizá septiembre).
    const later = advanceSeason(start)
    const paid = later.seasonProgress?.salaryPaid ?? 0
    expect(later.money).toBeGreaterThanOrEqual(paid * monthly)
  })
})

describe('tienda de mejoras', () => {
  it('cada temporada ofrece una selección distinta y lo comprado se sustituye', () => {
    const rich = career({ money: 5_000_000 })
    const offer1 = shopOffer(rich)
    expect(offer1.length).toBeLessThanOrEqual(SHOP_SIZE)
    const bought = buyItem(rich, offer1[0].id)
    // Lo comprado sigue en la tienda esta temporada (como "comprado")…
    expect(shopOffer(bought).map((i) => i.id)).toContain(offer1[0].id)
    // …y la temporada siguiente ya no está.
    const nextSeason = { ...bought, season: 2 }
    expect(shopOffer(nextSeason).map((i) => i.id)).not.toContain(offer1[0].id)
    expect(shopOffer(nextSeason).map((i) => i.id)).not.toEqual(offer1.map((i) => i.id))
    // Las compras de lujo aparecen más tarde.
    for (const item of shopOffer(rich)) expect(item.minSeason ?? 1).toBeLessThanOrEqual(1)
  })

  it('todas las mejoras tienen precio y algún efecto', () => {
    for (const item of SHOP_ITEMS) {
      expect(item.cost).toBeGreaterThan(0)
      expect(!!item.attributes || !!item.morale || !!item.reputation).toBe(true)
    }
    expect(getShopItem('casa-padres').attributes?.composure).toBe(2)
  })

  it('comprar cobra, sube atributos y se apunta en los gastos', () => {
    const rich = career({ money: 5_000_000 })
    const item = shopOffer(rich).find((i) => i.attributes && Object.keys(i.attributes).length > 0)
    if (!item) throw new Error('la tienda no tiene mejoras de atributos')
    const after = buyItem(rich, item.id)
    expect(after.money).toBe(rich.money - item.cost)
    const max = careerScale(rich)
    for (const [id, delta] of Object.entries(item.attributes ?? {})) {
      const key = id as keyof typeof rich.attributes
      expect(after.attributes[key]).toBe(
        Math.min(max, rich.attributes[key] + scaleDelta(delta ?? 0, max))
      )
    }
    expect(after.purchases).toHaveLength(1)
    expect(after.purchases[0]).toMatchObject({ itemId: item.id, season: 1, cost: item.cost })
    expect(purchaseSummary(after.purchases[0])).toMatch(/^\+/)
  })

  it('la tienda ofrece 15 mejoras y la mayoría son de atributos', () => {
    const offer = shopOffer(career({ season: 3 }))
    expect(offer).toHaveLength(SHOP_SIZE)
    expect(SHOP_SIZE).toBe(15)
    expect(offer.filter((i) => i.attributes).length).toBeGreaterThanOrEqual(11)
    expect(offer.some((i) => i.category === 'Entrenamiento')).toBe(true)
  })

  it('no deja comprar sin dinero, ni repetir, ni pasar del máximo, ni lo que no está en la tienda', () => {
    const poor = career({ money: 1000 })
    const expensive = shopOffer(poor).find((i) => i.cost > 1000)
    if (!expensive) throw new Error('sin mejoras caras')
    expect(canBuy(poor, expensive)).toMatchObject({
      ok: false,
      reason: 'No tienes dinero suficiente'
    })
    const rich = career({ money: 5_000_000 })
    const once = shopOffer(rich).find((i) => i.limit === 'once')
    if (once) expect(canBuy(buyItem(rich, once.id), once).ok).toBe(false)
    const staff = shopOffer(rich).find((i) => i.limit === 'season')
    if (staff) expect(canBuy(buyItem(rich, staff.id), staff).ok).toBe(false)
    const notOffered = SHOP_ITEMS.find((i) => !shopOffer(rich).some((o) => o.id === i.id))
    if (notOffered) expect(canBuy(rich, notOffered)).toMatchObject({ ok: false })
    const boost = shopOffer(rich).find((i) => i.attributes && Object.keys(i.attributes).length > 0)
    if (boost) {
      const maxed = { ...rich, attributes: { ...rich.attributes } }
      for (const id of Object.keys(boost.attributes ?? {})) {
        maxed.attributes[id as keyof typeof maxed.attributes] = careerScale(maxed)
      }
      expect(canBuy(maxed, boost)).toMatchObject({ ok: false, short: 'Al máximo' })
    }
  })
})

describe('partidos importantes', () => {
  it('las jugadas tienen opciones y textos con minuto', () => {
    for (const moment of MATCH_MOMENTS) {
      expect(moment.options.length).toBeGreaterThanOrEqual(2)
      expect(moment.text).toMatch(/Minuto \d+/)
    }
  })

  it('importantes: grandes, clásico, derbi, segundo de la tabla y desde cuartos de copa', () => {
    const c = startSeason(career({ clubId: 'esp-valensia-cf' }))
    const fixture = (over: Partial<ClubFixture>): ClubFixture => ({
      slot: 0,
      competition: 'liga',
      round: 0,
      opponentId: 'esp-girone-fc',
      home: true,
      knockout: false,
      neutral: false,
      ...over
    })
    // Los 3 clubes más grandes del país.
    expect(importanceOf(c, fixture({ opponentId: 'esp-real-madrik' }))).toBe('grande')
    // Derbi de la misma ciudad y clásico.
    const madrid = startSeason(career())
    expect(importanceOf(madrid, fixture({ opponentId: 'esp-real-madrik' }))).toBe('derbi')
    const real = startSeason(career({ clubId: 'esp-real-madrik' }))
    expect(importanceOf(real, fixture({ opponentId: 'esp-fc-barkelone' }))).toBe('clasico')
    // Copas: desde cuartos de final.
    expect(importanceOf(c, fixture({ competition: 'copa', round: 1, knockout: true }))).toBeNull()
    expect(importanceOf(c, fixture({ competition: 'copa', round: 2, knockout: true }))).toBe(
      'cuartos'
    )
    // Copa de Campeones: 5 jornadas de grupos y cuartos (5), semifinales (6) y final (7).
    expect(importanceOf(c, fixture({ competition: 'continental', round: 7, knockout: true }))).toBe(
      'final'
    )
    expect(importanceOf(c, fixture({ competition: 'continental', round: 5, knockout: true }))).toBe(
      'cuartos'
    )
    expect(importanceOf(c, fixture({ competition: 'continental', round: 4 }))).toBeNull()
    // Un partido de liga normal no lo es.
    expect(importanceOf(c, fixture({}))).toBeNull()
  })

  it('cada decisión cambia el marcador y el partido acaba tras la última jugada', () => {
    let c = startSeason(career())
    const fixture = {
      slot: 0,
      competition: 'copa' as const,
      round: 3,
      opponentId: 'esp-real-madrik',
      home: true,
      knockout: true,
      neutral: true
    }
    // Un titular que juega los 90 minutos de una final vive 4 jugadas.
    let live = createLiveMatch(c, fixture)
    for (let i = 0; live.role !== 'titular' || live.exitMinute !== undefined; i++) {
      c = startSeason(career({ id: `final-${i}`, trust: 95 }))
      live = createLiveMatch(c, fixture)
    }
    expect(live.phases).toHaveLength(4)
    c = { ...c, seasonProgress: { ...c.seasonProgress!, liveMatch: live } }
    while (!isLiveMatchOver(c.seasonProgress!.liveMatch!)) {
      const before = c.seasonProgress!.liveMatch!
      const index = before.resolutions.length
      expect(getMoment(before.momentIds[index])).toBeDefined()
      // Las jugadas van en orden de minuto.
      if (index > 0) expect(before.minutes[index]).toBeGreaterThan(before.minutes[index - 1])
      c = resolveMoment(c, 0).career
    }
    const end = c.seasonProgress!.liveMatch!
    expect(end.resolutions).toHaveLength(4)
    const score = finalScore(end)
    expect(score.for).toBeGreaterThanOrEqual(end.momentGoalsFor)
    expect(score.against).toBeGreaterThanOrEqual(end.momentGoalsAgainst)
  })
})
