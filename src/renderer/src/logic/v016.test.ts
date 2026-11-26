import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { getClub } from '../data/clubs'
import { getEvent } from '../data/events'
import { defaultMode, GAME_MODES } from '../data/gameModes'
import { isNationalityAvailable } from '../data/nationalities'
import { POSITIONS } from '../data/positions'
import { t } from '../i18n/es'
import { useGameStore } from '../store/gameStore'
import type { Career, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import { clubFixtureAt, leagueTable, slotsFor, type ClubFixture } from './competitions'
import { buyItem, canBuy, shopOffer } from './finance'
import { finishLiveMatch, getMoment, momentOptions } from './match'
import {
  advanceSeason,
  importanceOf,
  isEventEligible,
  isRegularStarter,
  RELEGATION_FIGHT_ZONE,
  seasonContext,
  startSeason
} from './season'
import { canTarget, generateTransferMarket, isCountryOpen } from './transfers'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'TEST DIECISEIS',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ESP'
      },
      mode: defaultMode('completa'),
      originId: 'esp-plaza-del-pueblo',
      allocation: emptyAttributes(),
      clubId: 'esp-valensia-cf'
    },
    new Date('2026-11-25T12:00:00Z')
  )
  return { ...base, id: 'test-dieciseis', ...overrides }
}

/** Una temporada de liga jugada entera (sin decisiones; los partidos importantes, sin jugadas). */
function playWholeSeason(c: Career): Career {
  let current = startSeason(c)
  for (let i = 0; i < 400; i++) {
    const p = current.seasonProgress as NonNullable<Career['seasonProgress']>
    if (p.liveMatch) {
      current = finishLiveMatch({
        ...current,
        seasonProgress: { ...p, liveMatch: { ...p.liveMatch, phases: [] } }
      })
      continue
    }
    const next = advanceSeason({
      ...current,
      seasonProgress: { ...p, eventIds: [], eventSlots: [] }
    })
    const np = next.seasonProgress as NonNullable<Career['seasonProgress']>
    if (np.playedSlots === p.playedSlots && !np.liveMatch) return next
    current = next
  }
  return current
}

describe('v0.16: lo que se puede elegir en la primera versión', () => {
  it('seis posiciones, solo el delantero centro disponible', () => {
    expect(POSITIONS.map((p) => p.short)).toEqual(['POR', 'DFC', 'LAT', 'MCD', 'MP', 'DC'])
    expect(POSITIONS.filter((p) => p.available).map((p) => p.id)).toEqual(['DC'])
  })

  it('solo el modo Completa', () => {
    expect(GAME_MODES.filter((m) => m.available).map((m) => m.id)).toEqual(['completa'])
  })
})

describe('v0.16: nacionalidades bloqueadas también en el mercado', () => {
  it('a un español nunca le llaman clubes de Argentina, Brasil, Japón ni EE. UU.', () => {
    for (let i = 0; i < 25; i++) {
      const c = career({
        id: `mercado-${i}`,
        season: 2 + (i % 8),
        age: 18 + i,
        reputation: 30 + i * 2
      })
      for (const offer of generateTransferMarket(c).offers) {
        expect(isNationalityAvailable(offer.club.countryId)).toBe(true)
      }
    }
  })

  it('ni se pueden buscar en el buscador de equipos', () => {
    const c = career()
    expect(isCountryOpen(c, 'ARG')).toBe(false)
    expect(canTarget(c, 'arg-boka-juniors')).toBe(false)
    expect(canTarget(c, 'eng-arsenel')).toBe(true)
  })

  it('una partida antigua que ya juega en Argentina sigue abierta a su país', () => {
    const old = { ...career(), clubId: 'arg-lanuz' }
    expect(isCountryOpen(old, 'ARG')).toBe(true)
    expect(isCountryOpen(old, 'BRA')).toBe(false)
  })
})

describe('v0.16: pelea por el descenso', () => {
  // El club más flojo de primera, con un jugador sin confianza: acaba abajo.
  const weakest = career()
    .divisions.ESP[0].map(getClub)
    .sort((a, b) => a.strength - b.strength)[0].id
  const base = career({ id: 'descenso-test', trust: 20 })
  const season = playWholeSeason({
    ...base,
    clubId: weakest,
    contract: { ...base.contract, clubId: weakest }
  })
  const ctx = seasonContext(season)
  const fixtures = slotsFor(ctx.setup)
    .map((_, slot) => clubFixtureAt(ctx, slot))
    .filter((f): f is ClubFixture => f !== null && f.competition === 'liga')

  it('abajo en la tabla, los partidos contra rivales cercanos son "Pelea por el descenso"', () => {
    let fights = 0
    for (const fixture of fixtures) {
      const table = leagueTable({ ...ctx, playedSlots: fixture.slot })
      if ((table[0]?.played ?? 0) < 4) continue
      const pos = (id: string): number => table.findIndex((r) => r.clubId === id)
      const mine = pos(weakest)
      const reason = importanceOf(season, fixture)
      if (mine >= table.length - RELEGATION_FIGHT_ZONE) {
        // En la pelea por no bajar ya no cuenta "contra un grande" ni el duelo de arriba.
        expect(reason === 'grande' || reason === 'segundo').toBe(false)
        if (reason === 'descenso') {
          fights++
          const theirs = pos(fixture.opponentId)
          const close =
            theirs >= table.length - RELEGATION_FIGHT_ZONE || Math.abs(theirs - mine) <= 3
          expect(close).toBe(true)
        }
      } else {
        expect(reason).not.toBe('descenso')
      }
    }
    expect(fights).toBeGreaterThan(0)
    expect(t.match.reasons.descenso).toBe('Pelea por el descenso')
  })
})

describe('v0.16: las compras no cambian la tienda', () => {
  it('tras comprar, la tienda sigue siendo la misma y lo comprado sale como comprado', () => {
    const c = { ...career({ season: 3 }), money: 10_000_000 }
    const before = shopOffer(c).map((i) => i.id)
    const item = shopOffer(c).find((i) => canBuy(c, i).ok)
    expect(item).toBeDefined()
    const after = buyItem(c, item?.id ?? '')
    expect(shopOffer(after).map((i) => i.id)).toEqual(before)
    expect(canBuy(after, shopOffer(after).find((i) => i.id === item?.id) ?? item!).ok).toBe(false)
  })
})

describe('v0.16: decisiones que encajan con tu situación', () => {
  const record = (over: Partial<SeasonRecord>): SeasonRecord => ({
    season: 1,
    yearLabel: '2026/27',
    clubId: 'esp-valensia-cf',
    age: 26,
    matches: 30,
    goals: 10,
    assists: 3,
    rating: 7,
    leaguePosition: 8,
    trophies: [],
    attributeChanges: {},
    ...over
  })

  it('"El gran partido" (titular por sorpresa) no sale si eres titular habitual o capitán', () => {
    const event = getEvent('clasico')
    const captain = career({
      season: 4,
      trust: 90,
      captaincy: { clubId: 'esp-valensia-cf', since: 2 }
    })
    expect(isRegularStarter(captain)).toBe(true)
    expect(isEventEligible(event, captain)).toBe(false)
    const bench = career({ trust: 0, clubId: 'esp-real-madrik' })
    expect(isRegularStarter(bench)).toBe(false)
    expect(isEventEligible(event, bench)).toBe(true)
  })

  it('"En el centro del rondo" solo con 25 años o menos, o recién llegado al club', () => {
    const event = getEvent('rondo')
    const veteranHere = career({ age: 30, season: 5, history: [record({ season: 4 })] })
    expect(isEventEligible(event, veteranHere)).toBe(false)
    const veteranNew = career({
      age: 30,
      season: 5,
      history: [record({ season: 4, clubId: 'esp-sevilla-fk' })]
    })
    expect(isEventEligible(event, veteranNew)).toBe(true)
    expect(isEventEligible(event, career({ age: 24, history: [record({})] }))).toBe(true)
  })

  it('los penaltis que te "da el capitán" no salen si el capitán eres tú', () => {
    const captain = career({ season: 3, captaincy: { clubId: 'esp-valensia-cf', since: 2 } })
    expect(isEventEligible(getEvent('penalti'), captain)).toBe(false)
    expect(isEventEligible(getEvent('penalti'), career({ season: 3 }))).toBe(true)
  })

  it('"El árbitro no ve nada": si eres el capitán, hablas tú', () => {
    const moment = getMoment('medio-arbitro')
    const plain = momentOptions(moment, career())
    expect(plain[1].label).toBe('Calmar a tus compañeros y que hable solo el capitán')
    const captain = momentOptions(moment, career({ captaincy: { clubId: 'x', since: 1 } }))
    expect(captain[1].label).toBe('Calmar a tus compañeros y hablar solo tú')
    expect(captain[1].check?.success.text).toContain('solo hablas tú')
    expect(captain[1].check?.success.effects).toEqual(plain[1].check?.success.effects)
  })
})

describe('v0.16: Records → ficha de una carrera', () => {
  it('se abre desde Records y se vuelve a Records', () => {
    const store = useGameStore.getState()
    const c = career()
    store.openRecords()
    useGameStore.getState().openRecordDetail(c)
    expect(useGameStore.getState().screen).toBe('careerDetail')
    expect(useGameStore.getState().recordCareer?.id).toBe(c.id)
    useGameStore.getState().backToRecords()
    expect(useGameStore.getState().screen).toBe('records')
    expect(useGameStore.getState().recordCareer).toBeNull()
  })
})
