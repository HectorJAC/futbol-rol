import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import { EXCLUB_MOMENTS } from '../data/matchMomentsExClub'
import { getShopItem, SHOP_ITEMS, SHOP_PRICE_BANDS, shopPoints } from '../data/shop'
import { useGameStore } from '../store/gameStore'
import type { Career, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import type { ClubFixture } from './competitions'
import { buyItem, shopDeltas, shopOffer } from './finance'
import { injurySeverity, INJURY_ATTRIBUTES } from './injury'
import { createLiveMatch } from './match'
import { partnerRelation, partnerStage } from './partner'
import { coachValue, fansValue, relationHistory } from './relationLog'
import { careerFromSaveFile, toSaveFile } from './saveGame'
import {
  applyEffects,
  exClubKind,
  importanceOf,
  isEventEligible,
  pickSeasonEvents,
  resolveChoice,
  startSeason
} from './season'
import { captaincyChecks } from './teammates'
import { applyTransferDecision, generateTransferMarket } from './transfers'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'TEST DIECISIETE',
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
  return { ...base, id: 'test-diecisiete', ...overrides }
}

/** Temporada empezada con estos eventos en estos huecos; el primero toca ya. */
function atEvents(c: Career, events: Array<[string, number]>): Career {
  const started = startSeason(c)
  const p = started.seasonProgress as NonNullable<Career['seasonProgress']>
  return {
    ...started,
    seasonProgress: {
      ...p,
      eventIds: events.map(([id]) => id),
      eventSlots: events.map(([, slot]) => slot),
      playedSlots: events[0][1]
    }
  }
}

const record = (over: Partial<SeasonRecord>): SeasonRecord => ({
  season: 1,
  yearLabel: '2026/27',
  clubId: 'esp-valensia-cf',
  age: 18,
  matches: 30,
  goals: 5,
  assists: 2,
  rating: 6.8,
  leaguePosition: 8,
  trophies: [],
  attributeChanges: {},
  ...over
})

const fixture = (over: Partial<ClubFixture>): ClubFixture => ({
  slot: 3,
  competition: 'liga',
  round: 3,
  opponentId: 'esp-girone-fc',
  home: true,
  knockout: false,
  neutral: false,
  ...over
})

describe('v0.17: "Los sesenta de tu madre"', () => {
  it('no sale con 17–19 años, sí a partir de los 25', () => {
    const event = getEvent('cumple-madre')
    expect(isEventEligible(event, career({ age: 18 }))).toBe(false)
    expect(isEventEligible(event, career({ age: 24 }))).toBe(false)
    expect(isEventEligible(event, career({ age: 25 }))).toBe(true)
  })
})

describe('v0.17: historial de relaciones', () => {
  it('cada decisión que mueve al míster queda apuntada, en orden', () => {
    const c = atEvents(career({ age: 26, money: 50_000 }), [['cumple-madre', 4]])
    // "Escaparte sin avisar": −8 de confianza.
    const { career: after } = resolveChoice(c, 1)
    const coach = relationHistory(after, 'coach')
    expect(coach[0].kind).toBe('inicio')
    expect(coach.at(-1)).toMatchObject({
      kind: 'evento',
      title: 'Los sesenta de tu madre',
      detail: 'Escaparte sin avisar',
      delta: -8,
      value: coachValue(after)
    })
  })

  it('la afición se mueve con la fama y con lo que ve en tu club', () => {
    const c = career({ reputation: 40, fansOffset: 0 })
    expect(fansValue(c)).toBe(40)
    expect(fansValue(applyEffects(c, { reputation: 5 }))).toBe(45)
    expect(fansValue(applyEffects(c, { fans: -15 }))).toBe(25)
  })
})

describe('v0.17: pantalla del historial', () => {
  it('se abre desde Relaciones y vuelve a Relaciones', () => {
    useGameStore.setState({ career: career(), screen: 'relationships' })
    useGameStore.getState().openRelationHistory('partner', 'Lucía')
    expect(useGameStore.getState().screen).toBe('relationHistory')
    expect(useGameStore.getState().relationView).toEqual({ target: 'partner', name: 'Lucía' })
    useGameStore.getState().openRelationships()
    expect(useGameStore.getState().screen).toBe('relationships')
    expect(useGameStore.getState().relationView).toBeNull()
  })
})

describe('v0.17: fichar reinicia al míster y a la afición', () => {
  const pending = (): Career => {
    const c = career({ season: 2, trust: 90, reputation: 50 })
    return {
      ...c,
      fansOffset: 30,
      flags: { ...c.flags, coachConflict: true, foreignInterest: true }
    }
  }

  it('en el club nuevo empiezan de cero y se olvidan las cuentas del anterior', () => {
    const c = pending()
    const offer = generateTransferMarket(c).offers[0]
    const { career: moved } = applyTransferDecision(c, offer.club.id)
    expect(moved.flags.coachConflict).toBeUndefined()
    expect(moved.flags.foreignInterest).toBeUndefined()
    expect(coachValue(moved)).toBeLessThan(90)
    expect(fansValue(moved)).toBe(Math.round(40 + moved.reputation / 4))
    // El historial del míster empieza en el club nuevo.
    expect(relationHistory(moved, 'coach')).toHaveLength(1)
    expect(relationHistory(moved, 'coach')[0]).toMatchObject({ kind: 'inicio', delta: 0 })
  })

  it('"La afición se entera" solo sale si sigues en el mismo club', () => {
    const c = pending()
    const event = getEvent('consecuencia-ojeador')
    const { career: stayed } = applyTransferDecision(c, null)
    expect(isEventEligible(event, { ...stayed, season: 3 })).toBe(true)
    const offer = generateTransferMarket(c).offers[0]
    const { career: moved } = applyTransferDecision(c, offer.club.id)
    expect(isEventEligible(event, { ...moved, season: 3 })).toBe(false)
  })
})

describe('v0.17: capitanía', () => {
  const atClub = (leadership: number): Career => {
    const c = career({ season: 2, history: [record({})] })
    return { ...c, attributes: { ...c.attributes, leadership } }
  }

  it('con 40 de liderazgo no hace falta esperar 3 temporadas', () => {
    expect(captaincyChecks(atClub(40))[0].ok).toBe(true)
    expect(captaincyChecks(atClub(39))[0].ok).toBe(false)
  })
})

describe('v0.17: lesiones', () => {
  it('la gravedad depende de los partidos de baja', () => {
    expect(injurySeverity(2)).toBe('leve')
    expect(injurySeverity(6)).toBe('moderada')
    expect(injurySeverity(10)).toBe('grave')
  })

  it('te pierdes los partidos y las decisiones de la baja', () => {
    const c = atEvents(career(), [
      ['lesion-tobillo', 4],
      ['rondo', 6],
      ['hospital-infantil', 20]
    ])
    // "Respetar los plazos de los médicos": 4 partidos, sin perder atributos.
    const { career: after, resolution } = resolveChoice(c, 0)
    const p = after.seasonProgress as NonNullable<Career['seasonProgress']>
    expect(p.injuredUntil).toBe(8)
    expect(p.eventIds).toEqual(['lesion-tobillo', 'hospital-infantil'])
    expect(resolution.injury).toMatchObject({ matches: 4, severity: 'moderada', losses: {} })
    expect(after.attributes).toEqual(c.attributes)
  })

  it('una lesión mal curada baja atributos de la zona, de 1 a 10 puntos', () => {
    const c = atEvents(career(), [['rehabilitacion', 4]])
    // "Estudiar al equipo desde la grada": 8 partidos (moderada), lesión muscular.
    const { career: after, resolution } = resolveChoice(c, 2)
    const losses = Object.entries(resolution.injury?.losses ?? {})
    expect(losses.length).toBeGreaterThanOrEqual(1)
    expect(losses.length).toBeLessThanOrEqual(2)
    for (const [id, lost] of losses) {
      expect(INJURY_ATTRIBUTES.muscular).toContain(id)
      expect(lost).toBeLessThanOrEqual(-2)
      expect(lost).toBeGreaterThanOrEqual(-6)
      const key = id as keyof Career['attributes']
      // El evento sube el desmarque, no toca los atributos lesionados.
      expect(after.attributes[key]).toBe(c.attributes[key] + (lost ?? 0))
    }
  })
})

describe('v0.17: tienda', () => {
  const family = (id: string): boolean => getShopItem(id).category === 'Familia'

  it('cada atributo sube de 1 a 3 puntos; con dos atributos, 1 y 2 o 3 y 3', () => {
    for (const item of SHOP_ITEMS) {
      const points = Object.values(item.attributes ?? {}).sort()
      if (points.length === 0) continue
      for (const p of points) expect([1, 2, 3]).toContain(p)
      if (points.length === 2) expect([[1, 2].join(), [3, 3].join()]).toContain(points.join())
      if (points.length === 3) expect(points).toEqual([3, 3, 3])
    }
  })

  it('a más puntos, más cara: los precios no se solapan', () => {
    for (const item of SHOP_ITEMS.filter((i) => i.attributes && !family(i.id))) {
      const band = SHOP_PRICE_BANDS[shopPoints(item)]
      expect(band, item.id).toBeDefined()
      expect(item.cost, item.id).toBeGreaterThanOrEqual(band[0])
      expect(item.cost, item.id).toBeLessThanOrEqual(band[1])
    }
    // Lo que te pasó en tu partida: dos compras de +3 de físico ya no cuestan 50.000 y 20.000.
    const physique3 = SHOP_ITEMS.filter(
      (i) => !family(i.id) && i.attributes?.physique === 3 && shopPoints(i) === 3
    )
    for (const item of physique3) expect(item.cost).toBeGreaterThanOrEqual(70_000)
    expect(getShopItem('preparador-estiramientos').attributes).toEqual({ physique: 1 })
    expect(getShopItem('campo-privado').attributes).toEqual({
      finishing: 3,
      longPassing: 3,
      dribbling: 3
    })
  })

  it('comprar suma los puntos tal cual en la escala de 50', () => {
    const item = getShopItem('fisioterapeuta')
    expect(shopDeltas(item, 50)).toEqual({ physique: 3 })
    expect(shopDeltas(item, 20)).toEqual({ physique: 1 })
    const c = career({ money: 5_000_000, season: 3 })
    const bought = shopOffer(c).find((i) => i.attributes && shopPoints(i) > 0)
    if (!bought) throw new Error('la tienda no tiene mejoras de atributos')
    const after = buyItem(c, bought.id)
    for (const [id, points] of Object.entries(bought.attributes ?? {})) {
      const key = id as keyof Career['attributes']
      expect(after.attributes[key]).toBe(Math.min(50, c.attributes[key] + (points ?? 0)))
    }
  })
})

describe('v0.17: pareja con puntos', () => {
  it('a 50 sois novios, a 100 os casáis y a 0 lo dejáis', () => {
    const c = career({ age: 22, season: 3 })
    const met = applyEffects(c, { partner: 15, flags: { partner: 'conociendo' } })
    expect(partnerStage(met.flags)).toBe('conociendo')
    expect(partnerRelation(met.flags)).toBe(40)
    const couple = applyEffects(met, { partner: 10 })
    expect(partnerStage(couple.flags)).toBe('pareja')
    const married = applyEffects(couple, { partner: 50 })
    expect(partnerStage(married.flags)).toBe('casados')
    expect(partnerRelation(married.flags)).toBe(100)
    const broken = applyEffects(married, { partner: -100 })
    expect(partnerStage(broken.flags)).toBeNull()
    expect(broken.exPartners).toEqual([
      expect.objectContaining({ name: married.flags.partnerName, stage: 'casados', until: 3 })
    ])
    expect(broken.flags.lastBreakupSeason).toBe(3)
  })

  it('la temporada siguiente aparece otra persona', () => {
    const c = career({ age: 22, season: 3 })
    const met = applyEffects(c, { partner: 10, flags: { partner: 'conociendo' } })
    const broken = applyEffects(met, { partner: -100 })
    const next = { ...broken, season: 4, age: 23 }
    const meetings = pickSeasonEvents(next).filter((id) => id.startsWith('pareja-conocer'))
    expect(meetings).toHaveLength(1)
    const other = applyEffects(next, { partner: 10, flags: { partner: 'conociendo' } })
    expect(other.flags.partnerName).not.toBe(broken.exPartners[0].name)
  })

  it('las opciones de la historia de la pareja dicen cuánto suman o restan', () => {
    const withDelta = ['pareja-familia', 'pareja-celos', 'pareja-convivir', 'pareja-boda'].map(
      (id) =>
        getEvent(id).options.every(
          (o) =>
            (o.outcome?.effects.partner ?? 0) !== 0 ||
            (o.check?.success.effects.partner ?? 0) !== 0 ||
            (o.check?.failure.effects.partner ?? 0) !== 0
        )
    )
    expect(withDelta).toEqual([true, true, true, true])
  })

  it('el historial de la pareja guarda la relación con cada persona', () => {
    const c = atEvents(career({ age: 22, season: 3 }), [['pareja-conocer', 4]])
    // "Pedirle el número y dejar que las cosas fluyan": empezáis en 25 y suma 10.
    const { career: after } = resolveChoice(c, 1)
    const history = relationHistory(after, 'partner')
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({ kind: 'inicio', value: 35 })
  })
})

describe('v0.17: contra tu exequipo', () => {
  const atInter = (history: SeasonRecord[]): Career =>
    startSeason(career({ clubId: 'ita-inter-de-milam', season: 4, trust: 100, history }))

  it('distingue el derbi de la traición (misma ciudad) del reencuentro', () => {
    const c = atInter([record({ clubId: 'ita-ac-milen' }), record({ clubId: 'ita-napolli' })])
    expect(exClubKind(c, 'ita-ac-milen')).toBe('traicion')
    expect(exClubKind(c, 'ita-napolli')).toBe('exclub')
    expect(exClubKind(c, 'ita-juventis')).toBeNull()
  })

  it('el partido se vive siempre y tiene una jugada más, la del exequipo', () => {
    const c = atInter([record({ clubId: 'ita-ac-milen' }), record({ clubId: 'ita-atalante' })])
    expect(importanceOf(c, fixture({ opponentId: 'ita-atalante' }))).not.toBeNull()
    let checked = 0
    for (let slot = 0; slot < 40 && checked < 4; slot++) {
      for (const opponentId of ['ita-ac-milen', 'ita-atalante']) {
        const live = createLiveMatch(c, fixture({ slot, opponentId }))
        if (live.phases.length === 0) continue
        const kind = opponentId === 'ita-ac-milen' ? 'traicion' : 'exclub'
        expect(live.exClub).toBe(kind)
        const first = EXCLUB_MOMENTS.find((m) => m.id === live.momentIds[0])
        expect(first?.exClub).toBe(kind)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(0)
  })
})

describe('v0.17: partidas guardadas', () => {
  it('la pareja de antes pasa a puntos y la ruptura, a exparejas', () => {
    const c = career({ season: 6, reputation: 50 })
    const old = (flags: Career['flags']): Career | null => {
      const file = toSaveFile({ ...c, flags: { ...c.flags, ...flags } })
      const legacy: Partial<Career> = { ...(file.career as Career) }
      delete legacy.fansOffset
      delete legacy.relationLog
      delete legacy.exPartners
      return careerFromSaveFile({ ...file, version: 6, career: legacy as Career })
    }
    const engaged = old({ partner: 'prometidos', partnerName: 'Lucía', partnerStageSince: 4 })
    expect(engaged?.flags).toMatchObject({
      partner: 'pareja',
      engaged: true,
      livingTogether: true,
      partnerRelation: 85
    })
    const broken = old({ partner: 'ruptura', partnerName: 'Lucía', partnerStageSince: 5 })
    expect(broken?.exPartners).toEqual([expect.objectContaining({ name: 'Lucía', until: 5 })])
    expect(broken?.flags.partner).toBeUndefined()
    const loyal = old({ loyalToClub: true })
    expect(loyal && fansValue(loyal)).toBe(75)
  })
})
