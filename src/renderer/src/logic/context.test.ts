import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { formatMoney } from '../data/currencies'
import { getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import type { Career, ClubMatch, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import { applyTransferDecision, generateTransferMarket } from './transfers'
import {
  adaptCurrentEvent,
  careerCurrency,
  consequenceSources,
  fillEventText,
  isEventEligible,
  isUnprovenYoungsterAtGiant,
  minutesShare,
  pickSeasonEvents,
  resolveChoice,
  startSeason
} from './season'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: { name: 'Test Contexto', sex: 'M', position: 'DC', nationalityId: 'ARG' },
      mode: defaultMode('completa'),
      originId: 'arg-potrero',
      allocation: emptyAttributes(),
      clubId: 'arg-lanuz'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  return { ...base, id: 'test-contexto', ...overrides }
}

function match(over: Partial<ClubMatch>): ClubMatch {
  return {
    slot: 3,
    competition: 'liga',
    opponentId: 'arg-river-plata',
    home: true,
    goalsFor: 2,
    goalsAgainst: 7,
    played: true,
    playerGoals: 0,
    playerAssists: 0,
    ...over
  }
}

/** Temporada empezada con un evento en el hueco 4 y estos partidos jugados. */
function atEvent(c: Career, matches: ClubMatch[], eventId = 'rondo'): Career {
  const started = startSeason(c)
  const p = started.seasonProgress as NonNullable<Career['seasonProgress']>
  return {
    ...started,
    seasonProgress: {
      ...p,
      eventIds: [eventId],
      eventSlots: [4],
      playedSlots: 4,
      clubMatches: matches
    }
  }
}

const record = (over: Partial<SeasonRecord>): SeasonRecord => ({
  season: 1,
  yearLabel: '2026/27',
  clubId: 'arg-lanuz',
  age: 17,
  matches: 30,
  goals: 5,
  assists: 1,
  rating: 6.5,
  leaguePosition: 8,
  trophies: [],
  attributeChanges: {},
  ...over
})

describe('eventos que reaccionan al último partido', () => {
  it('"Después de la goleada" solo sale tras perder por 3 o más', () => {
    const goleada = getEvent('prensa-goleada')
    expect(isEventEligible(goleada, atEvent(career(), [match({})]))).toBe(true)
    const win = atEvent(career(), [match({ goalsFor: 3, goalsAgainst: 1 })])
    expect(isEventEligible(goleada, win)).toBe(false)
    const close = atEvent(career(), [match({ goalsFor: 1, goalsAgainst: 2 })])
    expect(isEventEligible(goleada, close)).toBe(false)
  })

  it('el texto usa el resultado real del partido anterior', () => {
    const c = atEvent(career(), [match({})])
    const text = fillEventText(getEvent('prensa-goleada').text, c)
    expect(text).toContain('7-2')
    expect(text).toContain('River')
    expect(text).not.toContain('cinco a cero')
  })

  it('no se programan al empezar la temporada: se deciden al llegar', () => {
    const ids = pickSeasonEvents(career({ season: 3, age: 19 }))
    expect(ids).not.toContain('prensa-goleada')
    expect(ids).not.toContain('suplencia')
  })

  it('tras una goleada puede sustituir a un evento normal, y nunca sale si no encaja', () => {
    let replaced = false
    for (let i = 0; i < 12; i++) {
      const c = atEvent(career({ id: `ctx-${i}` }), [match({})])
      const id = adaptCurrentEvent(c).seasonProgress?.eventIds[0]
      if (id === 'prensa-goleada') replaced = true
      else expect(id).toBe('rondo')
    }
    expect(replaced).toBe(true)
    // Un evento reactivo que ya no encaja se cambia por otro normal.
    const wrong = atEvent(career(), [match({ goalsFor: 4, goalsAgainst: 0 })], 'prensa-goleada')
    expect(adaptCurrentEvent(wrong).seasonProgress?.eventIds[0]).not.toBe('prensa-goleada')
  })

  it('el dinero de los textos sale en la moneda del país', () => {
    const c = career()
    expect(careerCurrency(c)).toBe('ARS')
    expect(fillEventText('Te ofrecen {dinero:150000}.', c)).toBe(
      `Te ofrecen ${formatMoney(150000, 'ARS')}.`
    )
  })
})

describe('eventos únicos y de fichaje', () => {
  it('"Tu primera nómina" solo sale una vez', () => {
    const c = atEvent(career({ age: 17 }), [], 'primer-sueldo')
    const { career: after } = resolveChoice(c, 0)
    expect(isEventEligible(getEvent('primer-sueldo'), { ...after, season: 2 })).toBe(false)
  })

  it('la nómina de un grande sale la primera vez que fichas por un club de 5 estrellas', () => {
    const atGiant = career({
      clubId: 'esp-real-madrik',
      season: 3,
      age: 19,
      history: [record({}), record({ season: 2 })]
    })
    expect(isEventEligible(getEvent('nomina-grande'), atGiant)).toBe(true)
    expect(pickSeasonEvents(atGiant)).toContain('nomina-grande')
    expect(isEventEligible(getEvent('nuevo-pais'), atGiant)).toBe(true)
    // En su club de siempre no sale.
    const home = career({ season: 3, history: [record({}), record({ season: 2 })] })
    expect(isEventEligible(getEvent('nomina-grande'), home)).toBe(false)
  })
})

describe('consecuencias: de dónde vienen', () => {
  it('se apunta la decisión que dejó el flag', () => {
    const c = atEvent(career({ age: 18 }), [], 'ojeador')
    const option = getEvent('ojeador').options.findIndex((o) =>
      [o.outcome, o.check?.success, o.check?.failure].some(
        (x) => x?.effects.flags?.foreignInterest === true
      )
    )
    const { career: after } = resolveChoice(c, Math.max(0, option))
    if (after.flags.foreignInterest === true) {
      const sources = consequenceSources(getEvent('consecuencia-ojeador'), after)
      expect(sources[0].season).toBe(1)
      expect(sources[0].eventTitle).toBe('Un ojeador extranjero')
    }
    // Sin registro (partidas antiguas) se busca la opción que lo provoca.
    const old = consequenceSources(getEvent('consecuencia-fiesta'), career())
    expect(old[0].eventTitle).toBe('Noche de fiesta')
  })
})

describe('titular en un club de 5 estrellas', () => {
  it('un chaval sin aval juega poco su primera temporada en un grande', () => {
    const young = career({
      clubId: 'esp-real-madrik',
      age: 20,
      season: 3,
      trust: 90,
      history: [record({}), record({ season: 2 })]
    })
    expect(isUnprovenYoungsterAtGiant(young)).toBe(true)
    expect(minutesShare(young)).toBeLessThanOrEqual(0.4)
    // Con una gran temporada anterior sí puede pelear el puesto.
    const proven = {
      ...young,
      history: [record({}), record({ season: 2, rating: 7.9, goals: 28 })]
    }
    expect(isUnprovenYoungsterAtGiant(proven)).toBe(false)
    // Y las ofertas de los grandes lo dicen: "Pocos" minutos.
    const market = generateTransferMarket(career({ season: 2, age: 18, reputation: 60 }))
    for (const offer of market.offers.filter((o) => o.club.prestige >= 5)) {
      expect(offer.minutes).toBe('Pocos')
    }
  })
})

describe('moneda', () => {
  it('formatos de cada moneda', () => {
    expect(formatMoney(1000)).toBe('1.000 €')
    expect(formatMoney(1000, 'GBP')).toBe('£ 850')
    expect(formatMoney(1000, 'ARS')).toBe('AR$ 1.100.000')
    expect(formatMoney(1000, 'JPY')).toBe('¥ 160.000')
  })

  it('al fichar por un club de otro país se avisa del cambio de moneda', () => {
    const c = career({ season: 2, age: 18, reputation: 80, money: 100_000 })
    const abroad = generateTransferMarket(c).offers.find((o) => o.club.countryId !== 'ARG')
    if (abroad) {
      const { career: after, message } = applyTransferDecision(c, abroad.club.id)
      expect(careerCurrency(after)).not.toBe('ARS')
      expect(message).toContain('Tu dinero se cambia a')
      expect(after.money).toBe(c.money)
    }
  })
})
