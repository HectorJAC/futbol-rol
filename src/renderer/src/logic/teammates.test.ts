import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import type { Career, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import { createLiveMatch, getMoment, resolveMoment, scoreBefore } from './match'
import { setPieceRoles } from './playerAttributes'
import {
  applyEffects,
  fillEventText,
  isEventEligible,
  pickSeasonEvents,
  resolveChoice,
  startSeason
} from './season'
import {
  averageRelation,
  canBeCaptain,
  captaincyChecks,
  seasonsAtClub,
  teammateByRole
} from './teammates'
import {
  applyTransferDecision,
  generateTransferMarket,
  isMarketPending,
  setTransferTarget,
  signingChecks
} from './transfers'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: { name: 'Test Vestuario', sex: 'M', position: 'DC', nationalityId: 'ESP' },
      mode: defaultMode('completa'),
      originId: 'esp-cantera',
      allocation: emptyAttributes(),
      clubId: 'esp-valensia-cf'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  return { ...base, id: 'test-vestuario', ...overrides }
}

const record = (season: number, clubId = 'esp-valensia-cf'): SeasonRecord => ({
  season,
  yearLabel: '',
  clubId,
  age: 17 + season,
  matches: 30,
  goals: 10,
  assists: 3,
  rating: 6.8,
  leaguePosition: 6,
  trophies: [],
  attributeChanges: {}
})

describe('compañeros', () => {
  it('cada club tiene 5 compañeros con nombre y papel', () => {
    const c = career()
    expect(c.teammates.map((t) => t.role).sort()).toEqual([
      'amigo',
      'capitan',
      'joven',
      'rival',
      'veterano'
    ])
    expect(new Set(c.teammates.map((t) => t.name)).size).toBe(5)
  })

  it('los textos nombran a los compañeros y las decisiones cambian la relación', () => {
    const c = career()
    const captain = teammateByRole(c, 'capitan')
    expect(fillEventText('Te habla {capitan}.', c)).toBe(`Te habla ${captain?.name}.`)
    const after = applyEffects(c, { teammates: { capitan: 15, todos: 5 } })
    expect(teammateByRole(after, 'capitan')?.relation).toBe((captain?.relation ?? 0) + 20)
    expect(averageRelation(after)).toBeGreaterThan(averageRelation(c))
  })

  it('las decisiones antiguas (flags) también cuentan', () => {
    const c = career()
    const after = applyEffects(c, { flags: { internalRival: 'enemigo' } })
    expect(teammateByRole(after, 'rival')?.relation).toBeLessThan(
      teammateByRole(c, 'rival')?.relation ?? 0
    )
  })

  it('un evento de compañero depende de la relación', () => {
    const truce = getEvent('comp-tregua-rival')
    const c = { ...career({ season: 3, age: 19 }) }
    const low = {
      ...c,
      teammates: c.teammates.map((t) => (t.role === 'rival' ? { ...t, relation: 20 } : t))
    }
    const high = {
      ...c,
      teammates: c.teammates.map((t) => (t.role === 'rival' ? { ...t, relation: 80 } : t))
    }
    expect(isEventEligible(truce, low)).toBe(true)
    expect(isEventEligible(truce, high)).toBe(false)
  })

  it('al fichar, tus compañeros pasan a excompañeros y los eventos de excompañeros pueden salir', () => {
    const c = career({ season: 2, age: 18, reputation: 70, money: 50_000 })
    const offer = generateTransferMarket(c).offers[0]
    const { career: moved } = applyTransferDecision(c, offer.club.id)
    expect(moved.exTeammates).toHaveLength(5)
    expect(moved.teammates.every((t) => t.clubId === offer.club.id)).toBe(true)
    // Un evento de excompañero nombra a uno de ellos y su club.
    const ex = getEvent('ex-provocacion-partido')
    expect(isEventEligible(ex, moved)).toBe(true)
    const started = startSeason(moved)
    const p = started.seasonProgress as NonNullable<Career['seasonProgress']>
    const atEvent = { ...started, seasonProgress: { ...p, eventIds: [ex.id], eventSlots: [0] } }
    const { resolution, career: after } = resolveChoice(atEvent, 1)
    expect(resolution.featured).toBeDefined()
    const featured = after.exTeammates.find((t) => t.id === resolution.featured)
    expect(featured).toBeDefined()
    expect(fillEventText('{excompanero} de {exclub}', after, featured?.id)).not.toContain('{')
  })
})

describe('capitanía', () => {
  it('hacen falta 3 temporadas en el club, liderazgo, confianza y buena relación', () => {
    const c = career({ season: 4, history: [record(1), record(2), record(3)], trust: 70 })
    expect(seasonsAtClub(c)).toBe(3)
    const leader = {
      ...c,
      attributes: { ...c.attributes, leadership: 35 },
      teammates: c.teammates.map((t) => ({ ...t, relation: 70 }))
    }
    expect(captaincyChecks(leader).every((x) => x.ok)).toBe(true)
    expect(canBeCaptain(leader)).toBe(true)
    // Con 2 temporadas todavía no.
    expect(canBeCaptain({ ...leader, history: [record(1), record(2)] })).toBe(false)
    // Si el vestuario no te quiere, tampoco.
    const disliked = { ...leader, teammates: leader.teammates.map((t) => ({ ...t, relation: 30 })) }
    expect(canBeCaptain(disliked)).toBe(false)
    // La propuesta sale la primera en una temporada con decisiones.
    expect(pickSeasonEvents(leader)[0]).toBe('capitania-oferta')
    // Aceptar te hace capitán.
    const offer = getEvent('capitania-oferta')
    const accept = offer.options.findIndex((o) => o.outcome?.effects.becomeCaptain)
    const started = startSeason(leader)
    expect(started.seasonProgress?.eventIds[0]).toBe('capitania-oferta')
    const { career: captain } = resolveChoice(started, accept)
    expect(captain.captaincy).toEqual({ clubId: 'esp-valensia-cf', since: 4 })
  })

  it('sin decisiones esa temporada, te nombran capitán directamente; al fichar lo pierdes', () => {
    const c = career({
      mode: defaultMode('normal'),
      season: 4,
      history: [record(1), record(2), record(3)],
      trust: 70
    })
    const leader = {
      ...c,
      attributes: { ...c.attributes, leadership: 25 },
      teammates: c.teammates.map((t) => ({ ...t, relation: 70 }))
    }
    const started = startSeason(leader)
    expect(started.captaincy).toEqual({ clubId: 'esp-valensia-cf', since: 4 })
    const moved = applyTransferDecision(
      { ...started, seasonProgress: null, season: 5, reputation: 80 },
      generateTransferMarket({ ...started, seasonProgress: null, season: 5, reputation: 80 })
        .offers[0].club.id
    ).career
    expect(moved.captaincy).toBeNull()
  })
})

describe('buscador de equipos', () => {
  it('el club objetivo se decide al acabar la temporada según los requisitos', () => {
    const c = career({ season: 2, age: 19, reputation: 90 })
    const strong = {
      ...c,
      attributes: Object.fromEntries(
        Object.entries(c.attributes).map(([id]) => [id, 45])
      ) as Career['attributes']
    }
    const target = setTransferTarget(strong, 'esp-real-madrik')
    expect(target.transferTarget).toEqual({ clubId: 'esp-real-madrik', season: 2 })
    expect(signingChecks(target, 'esp-real-madrik').every((x) => x.ok)).toBe(true)
    // Aún no toca: se decide en el mercado de la temporada siguiente.
    expect(generateTransferMarket(target).target).toBeUndefined()
    const summer = { ...target, season: 3 }
    expect(isMarketPending(summer)).toBe(true)
    const market = generateTransferMarket(summer)
    expect(market.target?.accepted).toBe(true)
    expect(market.offers[0].club.id).toBe('esp-real-madrik')
    // Fichar limpia el objetivo.
    const { career: signed } = applyTransferDecision(summer, 'esp-real-madrik')
    expect(signed.clubId).toBe('esp-real-madrik')
    expect(signed.transferTarget).toBeNull()
  })

  it('si no cumples, el club dice que no y explica por qué', () => {
    const c = career({ season: 2, age: 18, reputation: 5 })
    const summer = { ...setTransferTarget(c, 'esp-real-madrik'), season: 3 }
    const market = generateTransferMarket(summer)
    expect(market.target?.accepted).toBe(false)
    expect(market.target?.reasons.length).toBeGreaterThan(0)
    expect(market.offers.some((o) => o.club.id === 'esp-real-madrik')).toBe(false)
  })

  it('en un año sin mercado, tener objetivo abre el mercado', () => {
    // En la Normal hay mercado antes de las temporadas 3, 5, 7…: la 4 no tiene.
    const c = career({ mode: defaultMode('normal'), season: 3 })
    const summer = { ...setTransferTarget(c, 'esp-sevilla-fk'), season: 4 }
    expect(isMarketPending({ ...c, season: 4 })).toBe(false)
    expect(isMarketPending(summer)).toBe(true)
  })
})

describe('balón parado', () => {
  it('eres el lanzador con 30 o más en la Completa (15 en la Normal, 10 en la Rápida)', () => {
    const c = career()
    const taker = { ...c, attributes: { ...c.attributes, penalties: 30, corners: 29 } }
    expect(setPieceRoles(taker)).toMatchObject({ penalties: true, corners: false })
    const normal = {
      ...c,
      mode: defaultMode('normal'),
      attributes: { ...c.attributes, freeKicks: 15 }
    }
    expect(setPieceRoles(normal).freeKicks).toBe(true)
  })

  it('las jugadas de penalti solo salen si eres el lanzador', () => {
    const fixture = {
      slot: 0,
      competition: 'copa' as const,
      round: 4,
      opponentId: 'esp-real-madrik',
      home: true,
      knockout: true,
      neutral: true
    }
    for (let i = 0; i < 25; i++) {
      const c = startSeason(career({ id: `penaltis-${i}` }))
      const low = { ...c, attributes: { ...c.attributes, penalties: 5, freeKicks: 5, corners: 5 } }
      const live = createLiveMatch(low, fixture)
      for (const id of live.momentIds) expect(getMoment(id).setPiece).toBeUndefined()
    }
  })
})

describe('jugadas según el marcador real', () => {
  it('"vais por detrás" solo sale si de verdad vais perdiendo en ese minuto', () => {
    const fixture = {
      slot: 0,
      competition: 'copa' as const,
      round: 4,
      opponentId: 'esp-real-madrik',
      home: true,
      knockout: true,
      neutral: true
    }
    for (let i = 0; i < 60; i++) {
      let c = startSeason(career({ id: `marcador-${i}` }))
      let live = createLiveMatch(c, fixture)
      c = { ...c, seasonProgress: { ...c.seasonProgress!, liveMatch: live } }
      for (let step = 0; step < live.phases.length; step++) {
        const moment = getMoment(live.momentIds[step])
        if (moment.situations) {
          const score = scoreBefore(live, live.minutes[step])
          const situation =
            score.for > score.against
              ? 'ganando'
              : score.for < score.against
                ? 'perdiendo'
                : 'empatando'
          expect(moment.situations).toContain(situation)
        }
        if (step + 1 < live.phases.length) {
          c = resolveMoment(c, 0).career
          live = c.seasonProgress!.liveMatch!
        }
      }
    }
  })
})
