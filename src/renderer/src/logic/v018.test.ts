import { afterEach, describe, expect, it } from 'vitest'
import { ATTRIBUTES, emptyAttributes } from '../data/attributes'
import { getClub, getClubOffers } from '../data/clubs'
import { formatMoney } from '../data/currencies'
import { EVENTS, getEvent } from '../data/events'
import { defaultMode, GAME_MODES, maxTrainingPointsFor } from '../data/gameModes'
import { MATCH_MOMENTS } from '../data/matchMoments'
import { EXCLUB_MOMENTS } from '../data/matchMomentsExClub'
import { NATIONALITIES } from '../data/nationalities'
import { ORIGINS } from '../data/origins'
import { POSITIONS } from '../data/positions'
import { SHOP_ITEMS } from '../data/shop'
import { TRAINING_FOCUS } from '../data/trainingFocus'
import { TROPHIES } from '../data/trophies'
import { ordinal, roundName, t } from '../i18n'
import { en } from '../i18n/en'
import { es } from '../i18n/es'
import { setLanguage } from '../i18n/language'
import { useGameStore } from '../store/gameStore'
import type { Career } from '../types/career'
import { createCareer } from './career'
import { itemCost, SHOP_PRICE_GROWTH } from './finance'
import { momentMinute } from './match'
import { describeRelationships, familyStatus } from './relationships'
import { isEventEligible } from './season'

afterEach(() => setLanguage('es'))

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'TEST DIECIOCHO',
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
    new Date('2026-11-26T12:00:00Z')
  )
  return { ...base, id: 'test-dieciocho', ...overrides }
}

/** Todos los textos (en orden) de un evento o jugada, para compararlos entre idiomas. */
function texts(item: {
  title: string
  text: string
  options: Array<{
    label: string
    outcome?: { text: string }
    check?: { success: { text: string }; failure: { text: string } }
  }>
}): string[] {
  return [
    item.title,
    item.text,
    ...item.options.flatMap((o) => [
      o.label,
      o.outcome?.text ?? '',
      o.check?.success.text ?? '',
      o.check?.failure.text ?? ''
    ])
  ]
}

const tokens = (text: string): string[] => [...new Set(text.match(/\{[a-zA-Z]+(:\d+)?\}/g) ?? [])]

/** Las claves (con su forma) de un diccionario, para comparar idiomas. */
function shape(value: unknown, path = ''): string[] {
  if (typeof value !== 'object' || value === null) return [`${path}:${typeof value}`]
  return Object.entries(value).flatMap(([k, v]) => shape(v, `${path}.${k}`))
}

describe('v0.18: inglés escrito aparte', () => {
  it('la interfaz en inglés tiene exactamente las mismas claves que en español', () => {
    expect(shape(en)).toEqual(shape(es))
  })

  it('cada evento y cada jugada tienen su texto en inglés, con la misma forma y los mismos marcadores', () => {
    for (const item of [...EVENTS, ...MATCH_MOMENTS, ...EXCLUB_MOMENTS]) {
      setLanguage('es')
      const spanish = texts(item)
      setLanguage('en')
      const english = texts(item)
      expect(english.length, item.id).toBe(spanish.length)
      spanish.forEach((text, i) => {
        // Cada campo con texto en español lo tiene en inglés, y distinto.
        expect(english[i] === '', `${item.id} #${i}`).toBe(text === '')
        if (text.length > 12) expect(english[i], `${item.id} #${i}`).not.toBe(text)
        for (const token of tokens(text)) expect(english[i], `${item.id} ${token}`).toContain(token)
      })
    }
  })

  it('orígenes, tienda, títulos, "Horas extra" y datos base también cambian de idioma', () => {
    setLanguage('en')
    const pairs: Array<[string, string]> = []
    const collect = (read: () => string[]): void => {
      setLanguage('es')
      const before = read()
      setLanguage('en')
      read().forEach((after, i) => pairs.push([before[i], after]))
    }
    collect(() => ORIGINS.flatMap((o) => [o.name, o.story, o.advantage, o.drawback]))
    collect(() => SHOP_ITEMS.flatMap((i) => [i.name, i.description]))
    collect(() => TROPHIES.flatMap((tr) => [tr.name, tr.description]))
    collect(() => Object.values(TRAINING_FOCUS).flatMap((f) => [f.label, f.text]))
    collect(() => ATTRIBUTES.flatMap((a) => [a.description]))
    collect(() => NATIONALITIES.filter((n) => n.id !== 'ARG').map((n) => n.name))
    collect(() => POSITIONS.map((p) => p.name))
    collect(() => GAME_MODES.map((m) => m.description))
    for (const [, english] of pairs) expect(english).toBeTruthy()
    // Casi todo cambia (algún nombre, como "Media training", es igual en los dos idiomas).
    const same = pairs.filter(([spanish, english]) => spanish === english).length
    expect(same / pairs.length).toBeLessThan(0.02)
  })

  it('cambiar de idioma no cambia la mecánica: mismos efectos, mismas condiciones y mismo minuto', () => {
    // Todo menos los textos.
    const mechanics = (): string =>
      JSON.stringify(
        EVENTS.map((e) => e.options.map((o) => [o.outcome, o.check])),
        (key, value) => (key === 'text' ? undefined : value)
      )
    setLanguage('es')
    const effects = mechanics()
    const minutes = MATCH_MOMENTS.map(momentMinute)
    const c = career({ age: 20 })
    const eligible = EVENTS.filter((e) => isEventEligible(e, c)).map((e) => e.id)
    setLanguage('en')
    expect(mechanics()).toBe(effects)
    expect(MATCH_MOMENTS.map(momentMinute)).toEqual(minutes)
    expect(EVENTS.filter((e) => isEventEligible(e, c)).map((e) => e.id)).toEqual(eligible)
  })

  it('el idioma se cambia en vivo: la interfaz, la lógica y los datos leen el idioma activo', () => {
    const c = career()
    setLanguage('es')
    expect(t.mainMenu.newGame).toBe('Nueva Partida')
    expect(getEvent('primer-sueldo').title).toBe('Tu primera nómina de verdad')
    expect(describeRelationships(c)[0].name).toBe('El míster')
    expect(familyStatus(c)).toBe('Soltero')
    setLanguage('en')
    expect(t.mainMenu.newGame).toBe('New Game')
    expect(getEvent('primer-sueldo').title).not.toBe('Tu primera nómina de verdad')
    expect(describeRelationships(c)[0].name).toBe('The manager')
    expect(familyStatus(c)).toBe('Single')
    expect(getClubOffers('ESP', 'esp-plaza-del-pueblo')[0].pitch).toMatch(/^A giant/)
  })

  it('dinero, puestos y rondas con formato inglés', () => {
    setLanguage('es')
    expect(formatMoney(1250000)).toBe('1.250.000 €')
    expect(ordinal(1)).toBe('1º')
    expect(roundName('Cuartos de final')).toBe('Cuartos de final')
    setLanguage('en')
    expect(formatMoney(1250000)).toBe('€1,250,000')
    expect(formatMoney(1000, 'GBP')).toBe('£850')
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22].map(ordinal)).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd'
    ])
    expect(roundName('Cuartos de final')).toBe('Quarter-finals')
    expect(roundName('Grupos · J3')).toBe('Groups · MD3')
    expect(roundName('Campeón')).toBe('Champions')
    expect(getClub('esp-valensia-cf').name).toBe('Valensia CF')
  })

  it('el inglés se puede elegir en el juego y se recuerda en el estado', () => {
    useGameStore.getState().setGameLanguage('en')
    expect(useGameStore.getState().language).toBe('en')
    expect(t.settings.title).toBe('Settings')
    useGameStore.getState().setGameLanguage('es')
    expect(t.settings.title).toBe('Ajustes')
  })
})

describe('v0.18: ajustes de juego', () => {
  it('como mucho 5 puntos de atributo por temporada en la Completa', () => {
    expect(maxTrainingPointsFor(defaultMode('completa'))).toBe(5)
  })

  it('la tienda sube un 10 % del precio base cada temporada', () => {
    const item = { cost: 20000 }
    expect(itemCost(item, 1)).toBe(20000)
    expect(itemCost(item, 2)).toBe(22000)
    expect(itemCost(item, 11)).toBe(20000 * (1 + SHOP_PRICE_GROWTH * 10))
  })

  it('"Rueda de prensa" (¿contento con tus minutos?) no sale si eres titular', () => {
    const event = getEvent('prensa')
    expect(event.notRegularStarter).toBe(true)
    expect(isEventEligible(event, career({ captaincy: { clubId: 'x', since: 1 } }))).toBe(false)
    expect(isEventEligible(event, career({ trust: 0, clubId: 'esp-real-madrik' }))).toBe(true)
  })

  it('Créditos se abre desde el menú', () => {
    useGameStore.getState().backToMenu()
    useGameStore.getState().openCredits()
    expect(useGameStore.getState().screen).toBe('credits')
  })
})
