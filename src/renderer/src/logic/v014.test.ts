import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { EVENTS, getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import { t } from '../i18n'
import type { Career } from '../types/career'
import { createCareer } from './career'
import { canRequestRaise, raiseOptions, requestRaise } from './contractTalks'
import { describeRelationships } from './relationships'
import {
  applyEffects,
  isEventEligible,
  isOptionLocked,
  optionCost,
  pickSeasonEvents,
  resolveChoice,
  squadStatus,
  startSeason,
  timesFlag
} from './season'
import { mentionedTeammates, teammateByRole } from './teammates'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'TEST CATORCE',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ARG'
      },
      mode: defaultMode('completa'),
      originId: 'arg-potrero',
      allocation: emptyAttributes(),
      clubId: 'arg-lanuz'
    },
    new Date('2026-11-24T12:00:00Z')
  )
  return { ...base, id: 'test-catorce', ...overrides }
}

/** La temporada en curso con este evento como el siguiente. */
function atEvent(c: Career, eventId: string): Career {
  const started = startSeason(c)
  const p = started.seasonProgress as NonNullable<Career['seasonProgress']>
  return {
    ...started,
    seasonProgress: { ...p, eventIds: [eventId], eventSlots: [4], playedSlots: 4 }
  }
}

describe('v0.14: barras del míster y la afición', () => {
  it('el míster y la afición tienen barra; el padre y la pareja no', () => {
    const people = describeRelationships(career({ trust: 64, reputation: 41, fansOffset: 0 }))
    expect(people.find((r) => r.id === 'coach')?.value).toBe(64)
    expect(people.find((r) => r.id === 'fans')?.value).toBe(41)
    for (const r of people.filter((p) => p.id !== 'coach' && p.id !== 'fans')) {
      expect(r.value).toBeUndefined()
    }
  })

  it('un choque con el míster baja su barra; la afición se mueve con lo que ve (v0.17)', () => {
    const c = career({ trust: 80, reputation: 70, fansOffset: 0 })
    const angry = describeRelationships({ ...c, flags: { ...c.flags, coachConflict: true } })
    expect(angry.find((r) => r.id === 'coach')?.value).toBeLessThanOrEqual(15)
    // Escuchar a otro club baja a la afición; la lealtad la sube.
    const doubts = describeRelationships(applyEffects(c, { fans: -15 }))
    expect(doubts.find((r) => r.id === 'fans')?.value).toBe(55)
    const loyal = describeRelationships(applyEffects(c, { fans: 10 }))
    expect(loyal.find((r) => r.id === 'fans')?.value).toBe(80)
  })
})

describe('v0.14: titularidad', () => {
  it('va de reserva a titular indiscutible con la confianza del míster', () => {
    const levels = ['reserva', 'suplente', 'rotacion', 'titular', 'indiscutible']
    const low = squadStatus(career({ trust: 0, clubId: 'arg-boka-juniors' }))
    const high = squadStatus(career({ trust: 100 }))
    expect(levels.indexOf(high.status)).toBeGreaterThan(levels.indexOf(low.status))
    expect(high.share).toBeGreaterThan(low.share)
    for (const status of levels) expect(t.hub.squadLevels).toHaveProperty(status)
  })
})

describe('v0.14: pedir una mejora de contrato', () => {
  const settled = (over: Partial<Career> = {}): Career => {
    const c = career({ season: 2, ...over })
    return { ...c, contract: { ...c.contract, signedSeason: 1, endSeason: 3 } }
  }

  it('tres peticiones: cuanto más pides, menos probable es que acepten', () => {
    const [moderada, mercado, ambiciosa] = raiseOptions(settled())
    const wage = settled().contract.weeklyWage
    expect(moderada.weeklyWage).toBeGreaterThan(wage)
    expect(mercado.weeklyWage).toBeGreaterThan(moderada.weeklyWage)
    expect(ambiciosa.weeklyWage).toBeGreaterThan(mercado.weeklyWage)
    expect(moderada.chance).toBeGreaterThanOrEqual(mercado.chance)
    expect(mercado.chance).toBeGreaterThanOrEqual(ambiciosa.chance)
    expect(ambiciosa.onReject.trust).toBeLessThan(moderada.onReject.trust)
  })

  it('con más confianza del míster es más fácil que acepten', () => {
    const doubted = raiseOptions(settled({ trust: 20 }))[1].chance
    const trusted = raiseOptions(settled({ trust: 90 }))[1].chance
    expect(trusted).toBeGreaterThan(doubted)
  })

  it('no se puede pedir la temporada en que firmaste ni dos veces la misma temporada', () => {
    expect(canRequestRaise(career()).ok).toBe(false) // firmó en la temporada 1
    const c = settled()
    expect(canRequestRaise(c).ok).toBe(true)
    const { career: after } = requestRaise(c, 'moderada')
    expect(after.flags.raiseSeason).toBe(2)
    expect(canRequestRaise(after).ok).toBe(false)
    expect(() => requestRaise(after, 'moderada')).toThrow()
    expect(canRequestRaise({ ...after, season: 3 }).ok).toBe(true)
  })

  it('si aceptan, nuevo contrato con ese sueldo; si no, baja la confianza y la moral', () => {
    // Una mejora pequeña con la confianza al máximo casi siempre sale; una enorme sin confianza, casi nunca.
    let accepted = 0
    let rejected = 0
    for (let i = 0; i < 40; i++) {
      const sure = settled({ id: `raise-${i}`, trust: 100 })
      const yes = requestRaise(sure, 'moderada')
      if (yes.accepted) {
        accepted++
        const option = raiseOptions(sure)[0]
        expect(yes.career.contract.weeklyWage).toBe(option.weeklyWage)
        expect(yes.career.contract.signedSeason).toBe(2)
        expect(yes.career.contract.endSeason).toBeGreaterThanOrEqual(4)
        expect(yes.career.flags.raiseResult).toBe('aceptada')
      }
      const greedy = settled({ id: `raise-${i}`, trust: 10, morale: 50 })
      const no = requestRaise(greedy, 'ambiciosa')
      if (!no.accepted) {
        rejected++
        expect(no.career.contract).toEqual(greedy.contract)
        expect(no.career.trust).toBe(5)
        expect(no.career.morale).toBe(45)
        expect(no.career.flags.raiseResult).toBe('rechazada')
      }
    }
    expect(accepted).toBeGreaterThan(30)
    expect(rejected).toBeGreaterThan(30)
  })

  it('la respuesta no cambia al recargar (semilla fija)', () => {
    const c = settled()
    expect(requestRaise(c, 'mercado').accepted).toBe(requestRaise(c, 'mercado').accepted)
  })

  it('la pestaña de la tienda se llama Compras', () => {
    expect(t.contract.shopTab).toBe('Compras')
    expect(t.contract.raiseTab).toBe('Mejorar contrato')
  })
})

describe('v0.14: eventos', () => {
  it('"Alguien especial" tiene varios escenarios, uno con tu amiga de la infancia', () => {
    const meet = EVENTS.filter((e) => e.title === 'Alguien especial')
    expect(meet.length).toBeGreaterThanOrEqual(4)
    expect(new Set(meet.map((e) => e.text)).size).toBe(meet.length)
    expect(meet.some((e) => e.text.includes('amiga de la infancia'))).toBe(true)
    const single = career({ age: 20 })
    for (const e of meet) expect(isEventEligible(e, single)).toBe(true)
  })

  it('sale primero el escenario que menos veces ha salido', () => {
    const single = career({ age: 20 })
    const seenAllButChildhood = {
      ...single,
      flags: Object.fromEntries(
        EVENTS.filter(
          (e) => e.title === 'Alguien especial' && e.id !== 'pareja-conocer-infancia'
        ).map((e) => [timesFlag(e.id), 1])
      )
    }
    expect(pickSeasonEvents(seenAllButChildhood)).toContain('pareja-conocer-infancia')
  })

  it('"Una última petición" (dejarle un penalti al veterano) solo si tiras los penaltis', () => {
    const event = getEvent('comp-ultima-temporada-veterano')
    const base = career({ season: 3 })
    const veteran = teammateByRole(base, 'veterano')
    expect(veteran).toBeDefined()
    const teammates = base.teammates.map((m) =>
      m.role === 'veterano' ? { ...m, relation: 70 } : m
    )
    const notTaker = { ...base, teammates, attributes: { ...base.attributes, penalties: 10 } }
    const taker = { ...base, teammates, attributes: { ...base.attributes, penalties: 40 } }
    expect(isEventEligible(event, notTaker)).toBe(false)
    expect(isEventEligible(event, taker)).toBe(true)
  })

  it('"Tu primera nómina": lo que no puedes pagar sale bloqueado, y ahorrar siempre se puede', () => {
    const event = getEvent('primer-sueldo')
    expect(event.lockUnaffordable).toBe(true)
    const [car, parents, save] = event.options
    expect(optionCost(car)).toBe(60000)
    expect(optionCost(save)).toBe(0)
    const poor = career({ age: 17, money: 40000 })
    expect(isOptionLocked(event, car, poor)).toBe(true)
    expect(isOptionLocked(event, parents, poor)).toBe(false)
    expect(isOptionLocked(event, save, { ...poor, money: 0 })).toBe(false)
    expect(isOptionLocked(event, car, { ...poor, money: 60000 })).toBe(false)
    expect(() => resolveChoice(atEvent(poor, 'primer-sueldo'), 0)).toThrow('dinero')
    const before = atEvent(poor, 'primer-sueldo')
    const { career: after } = resolveChoice(before, 1)
    expect(after.money).toBe(before.money - 35000)
  })

  it('en los eventos con opciones bloqueadas siempre hay una gratis', () => {
    for (const e of EVENTS.filter((e) => e.lockUnaffordable)) {
      expect(e.options.some((o) => optionCost(o) === 0)).toBe(true)
    }
  })

  it('los compañeros nombrados en un evento llevan su relación', () => {
    const c = career()
    const veteran = teammateByRole(c, 'veterano')
    const mates = mentionedTeammates(c, ['{veterano} te pide algo', 'Nadie más'])
    expect(mates).toEqual([
      { name: veteran?.name, label: 'Veterano del vestuario', relation: veteran?.relation }
    ])
    expect(mentionedTeammates(c, ['Sin compañeros'])).toEqual([])
  })
})
