import { describe, expect, it } from 'vitest'
import { ATTRIBUTES, emptyAttributes, toScale, type Attributes } from '../data/attributes'
import { EVENTS, getEvent } from '../data/events'
import { defaultMode, EVENTS_PER_SEASON_FULL, EVENTS_PER_SEASON_SHORT } from '../data/gameModes'
import { TOURNAMENT_ROUNDS, tournamentForSeasonEnd } from '../data/nationalTeams'
import { getOrigin } from '../data/origins'
import { TROPHIES } from '../data/trophies'
import type { Career } from '../types/career'
import { createCareer } from './career'
import { totalSlots } from './competitions'
import { finishLiveMatch, isLiveMatchOver, resolveMoment } from './match'
import { createRng, shuffle } from './random'
import {
  advanceSeason,
  applyEffects,
  buildSeasonRecord,
  checkChance,
  finishSeason,
  isCalledUp,
  isCareerOver,
  isSeasonReadyToFinish,
  pickSeasonEvents,
  resolveChoice,
  seasonStep,
  seasonYearLabel,
  simulateNationalTeam,
  startSeason,
  trophyCounts
} from './season'

const ORIGIN = 'esp-cantera'

function newCareer(overrides: Partial<Career> = {}): Career {
  const career = createCareer(
    {
      character: {
        name: 'Test Nueve',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ESP'
      },
      mode: defaultMode('completa'),
      originId: ORIGIN,
      allocation: { ...emptyAttributes(), finishing: 4, offTheBall: 4 },
      clubId: 'esp-atletico-de-madrit'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  return { ...career, id: 'test-nueve-fijo', ...overrides }
}

const STAR20: Attributes = {
  finishing: 18,
  heading: 15,
  dribbling: 15,
  shortPassing: 15,
  longPassing: 12,
  offTheBall: 18,
  pace: 16,
  strength: 15,
  stamina: 15,
  physique: 15,
  composure: 17,
  leadership: 14,
  corners: 12,
  freeKicks: 13,
  penalties: 15
}
/** El mismo crack en la escala de 50 del modo Completa. */
const scaled = (attrs: Attributes, max: number): Attributes =>
  Object.fromEntries(Object.entries(attrs).map(([id, v]) => [id, toScale(v, max)])) as Attributes
const STAR = scaled(STAR20, 50)

/** Juega una temporada entera eligiendo siempre la primera opción (eventos y jugadas). */
function playWholeSeason(career: Career): Career {
  let c = career.seasonProgress ? career : startSeason(career)
  for (let guard = 0; guard < 500; guard++) {
    c = advanceSeason(c)
    if (isSeasonReadyToFinish(c)) return finishSeason(c).career
    if (seasonStep(c) === 'event') {
      c = resolveChoice(c, 0).career
    } else if (seasonStep(c) === 'match') {
      while (!isLiveMatchOver(c.seasonProgress!.liveMatch!)) c = resolveMoment(c, 0).career
      c = finishLiveMatch(c)
    }
  }
  throw new Error('La temporada no terminó')
}

describe('aleatoriedad reproducible', () => {
  it('la misma semilla da la misma secuencia', () => {
    const a = createRng(42)
    const b = createRng(42)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })

  it('barajar no pierde elementos', () => {
    expect(shuffle(createRng(1), [1, 2, 3, 4, 5]).sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('eventos', () => {
  it('todos los eventos tienen opciones con resultado o tirada', () => {
    for (const event of EVENTS) {
      expect(event.options.length, event.id).toBeGreaterThanOrEqual(2)
      for (const option of event.options) {
        expect(!!option.outcome || !!option.check, `${event.id}: ${option.label}`).toBe(true)
        const check = option.check
        if (check) expect(ATTRIBUTES.map((a) => a.id)).toContain(check.attribute)
      }
    }
  })

  it('los ids de evento no se repiten', () => {
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length)
  })

  it('modo completo: 10 eventos distintos y el primero es el debut', () => {
    const ids = pickSeasonEvents(newCareer())
    expect(ids).toHaveLength(EVENTS_PER_SEASON_FULL)
    expect(ids[0]).toBe('debut')
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('modos rápida y normal: 4 eventos por temporada con decisiones', () => {
    expect(pickSeasonEvents(newCareer({ mode: defaultMode('normal') }))).toHaveLength(
      EVENTS_PER_SEASON_SHORT
    )
    expect(pickSeasonEvents(newCareer({ mode: defaultMode('rapida') }))).toHaveLength(
      EVENTS_PER_SEASON_SHORT
    )
  })

  it('respeta las condiciones de arquetipo, edad, temporada y club', () => {
    const career = newCareer({ season: 2, age: 18 })
    const archetype = getOrigin(ORIGIN).archetype
    for (const id of pickSeasonEvents(career)) {
      const event = getEvent(id)
      expect(event.onlySeason, id).toBeUndefined()
      if (event.archetypes) expect(event.archetypes).toContain(archetype)
      if (event.minAge) expect(career.age).toBeGreaterThanOrEqual(event.minAge)
      if (event.maxAge) expect(career.age).toBeLessThanOrEqual(event.maxAge)
    }
  })

  it('a los 32 años salen eventos de veterano y no de juvenil', () => {
    const ids = pickSeasonEvents(newCareer({ season: 15, age: 32 }))
    expect(ids.some((id) => getEvent(id).minAge !== undefined)).toBe(true)
    expect(ids.some((id) => getEvent(id).maxAge !== undefined)).toBe(false)
  })

  it('no repite siempre los mismos eventos: prefiere los que menos han salido', () => {
    const first = pickSeasonEvents(newCareer({ season: 2 }))
    const flags = Object.fromEntries(first.map((id) => [`times:${id}`, 1]))
    const second = pickSeasonEvents(newCareer({ season: 3, flags }))
    expect(second.filter((id) => first.includes(id))).toHaveLength(0)
  })

  it('la probabilidad de una tirada sube con el atributo y tiene límites', () => {
    const check = { attribute: 'finishing' as const, difficulty: 12 }
    const base = newCareer()
    const at = (finishing: number): Career => ({
      ...base,
      attributes: { ...base.attributes, finishing }
    })
    // Completa: atributos de 1 a 50 (30 en la escala de 50 = 12 en la de 20).
    expect(checkChance(at(30), check)).toBeCloseTo(0.5)
    expect(checkChance(at(5), check)).toBe(0.05)
    expect(checkChance(at(50), check)).toBeCloseTo(0.9)
  })

  it('los efectos respetan los límites y el dinero de los eventos se suma', () => {
    const started = startSeason(newCareer())
    const career = applyEffects(started, {
      trust: 500,
      morale: -500,
      attributes: { leadership: -50 },
      money: 25_000,
      flags: { probado: true }
    })
    expect(career.trust).toBe(100)
    expect(career.morale).toBe(0)
    expect(career.attributes.leadership).toBe(1)
    expect(career.money).toBe(25_000)
    expect(career.seasonProgress?.eventMoney).toBe(25_000)
    expect(career.flags.probado).toBe(true)
  })

  it('resolver una decisión es determinista (recargar no cambia la tirada)', () => {
    const started = advanceSeason(startSeason(newCareer()))
    const a = resolveChoice(started, 0)
    const b = resolveChoice(started, 0)
    expect(a.resolution).toEqual(b.resolution)
    expect(a.career.seasonProgress?.resolutions).toHaveLength(1)
    expect(a.career.flags['times:debut']).toBe(1)
  })
})

describe('calendario de la temporada', () => {
  it('los eventos se reparten por el calendario y entre medias se juegan partidos', () => {
    let c = advanceSeason(startSeason(newCareer()))
    expect(seasonStep(c)).toBe('event')
    expect(c.seasonProgress?.playedSlots).toBe(0) // el debut, al empezar
    c = advanceSeason(resolveChoice(c, 0).career)
    // Hasta el siguiente evento se juegan partidos (los importantes, jugada a jugada).
    while (seasonStep(c) === 'match') {
      while (!isLiveMatchOver(c.seasonProgress!.liveMatch!)) c = resolveMoment(c, 0).career
      c = advanceSeason(finishLiveMatch(c))
    }
    expect(c.seasonProgress!.playedSlots).toBeGreaterThan(0)
    expect(c.seasonProgress!.clubMatches.length).toBeGreaterThan(0)
  })

  it('en el modo completo hay partidos importantes jugada a jugada', () => {
    let c = startSeason(newCareer({ attributes: STAR, trust: 90 }))
    let sawMatch = false
    for (let guard = 0; guard < 500 && !isSeasonReadyToFinish(c); guard++) {
      c = advanceSeason(c)
      if (seasonStep(c) === 'event') c = resolveChoice(c, 0).career
      else if (seasonStep(c) === 'match') {
        sawMatch = true
        const live = c.seasonProgress!.liveMatch!
        expect(live.momentIds).toHaveLength(1)
        // Las jugadas van en orden de minuto.
        while (!isLiveMatchOver(c.seasonProgress!.liveMatch!)) c = resolveMoment(c, 0).career
        const minutes = c.seasonProgress!.liveMatch!.resolutions.map((r) => r.minute)
        expect([...minutes].sort((a, b) => a - b)).toEqual(minutes)
        c = finishLiveMatch(c)
        expect(c.seasonProgress!.clubMatches.at(-1)?.important).toBe(true)
      }
    }
    expect(sawMatch).toBe(true)
  })

  it('en el modo normal la temporada 2 no tiene decisiones y se juega de golpe', () => {
    const career = newCareer({ mode: defaultMode('normal'), season: 2, age: 18 })
    const started = startSeason(career)
    expect(started.seasonProgress?.eventIds).toEqual([])
    const done = advanceSeason(started)
    expect(isSeasonReadyToFinish(done)).toBe(true)
    expect(done.seasonProgress?.playedSlots).toBe(totalSlots(done.seasonProgress!.setup))
    expect(done.seasonProgress?.clubMatches.some((m) => m.important)).toBe(false)
  })
})

describe('fin de temporada', () => {
  it('etiqueta de año', () => {
    expect(seasonYearLabel(1)).toBe('2026/27')
    expect(seasonYearLabel(4)).toBe('2029/30')
  })

  it('genera estadísticas coherentes con los partidos jugados', () => {
    const c = advanceSeason(startSeason(newCareer({ mode: defaultMode('normal'), season: 2 })))
    const record = buildSeasonRecord(c)
    const played = c.seasonProgress!.clubMatches.filter((m) => m.played)
    expect(record.matches).toBe(played.length)
    expect(record.matches).toBeLessThanOrEqual(52)
    expect(record.goals).toBe(played.reduce((s, m) => s + m.playerGoals, 0))
    expect(record.assists).toBe(played.reduce((s, m) => s + m.playerAssists, 0))
    expect(record.leaguePosition).toBeGreaterThanOrEqual(1)
    expect(record.leaguePosition).toBeLessThanOrEqual(20)
    expect(record.finalTable).toHaveLength(20)
    expect(record.trainingPoints).toBeGreaterThanOrEqual(0)
    expect(record.trainingPoints).toBeLessThanOrEqual(5)
    for (const t of record.trophies) expect(TROPHIES.map((x) => x.id)).toContain(t)
    if (record.leaguePosition === 1) expect(record.trophies).toContain('liga')
  })

  it('cerrar la temporada suma edad, temporada, historial y sueldo', () => {
    const next = playWholeSeason(newCareer())
    expect(next.season).toBe(2)
    expect(next.age).toBe(18)
    expect(next.seasonProgress).toBeNull()
    expect(next.history).toHaveLength(1)
    expect(next.history[0].yearLabel).toBe('2026/27')
    // 12 mensualidades: unas durante la temporada y el resto al acabarla.
    const monthly = Math.round((next.contract.weeklyWage * 52) / 12)
    expect(next.history[0].earnings?.salary).toBe(monthly * 12)
    expect(next.money).toBeGreaterThanOrEqual(monthly * 12)
    expect(next.pendingPoints).toBe(next.history[0].trainingPoints)
  })

  it('una carrera larga acumula títulos en la vitrina', () => {
    let career = newCareer({
      mode: defaultMode('normal'),
      attributes: STAR,
      trust: 90,
      morale: 90,
      reputation: 80
    })
    for (let i = 0; i < 8; i++) career = playWholeSeason(career)
    expect(career.history).toHaveLength(8)
    const counts = trophyCounts(career.history)
    const total = [...counts.values()].reduce((sum, seasons) => sum + seasons.length, 0)
    expect(total).toBeGreaterThan(0)
  })

  it('la carrera termina al jugar las temporadas del modo', () => {
    let career = newCareer({ mode: { id: 'personalizada', seasons: 2, decisionInterval: 3 } })
    expect(isCareerOver(career)).toBe(false)
    career = playWholeSeason(playWholeSeason(career))
    expect(career.season).toBe(3)
    expect(isCareerOver(career)).toBe(true)
  })

  it('a partir de los 30 años los atributos físicos empiezan a bajar', () => {
    let declines = 0
    // Temporadas sin decisiones (cada tres temporadas) para simularlas de golpe.
    for (const s of [2, 3, 5, 6, 8]) {
      const veteran = newCareer({
        id: `veterano-${s}`,
        age: 32,
        season: s,
        mode: { id: 'personalizada', seasons: 25, decisionInterval: 3 },
        attributes: { ...scaled(STAR20, 30), physique: 15 }
      })
      const record = buildSeasonRecord(advanceSeason(startSeason(veteran)))
      const physical = ['pace', 'strength', 'stamina', 'physique'] as const
      if (physical.some((id) => (record.attributeChanges[id] ?? 0) < 0)) declines++
    }
    expect(declines).toBeGreaterThan(0)
  })
})

describe('consecuencias de decisiones anteriores', () => {
  it('un evento de consecuencia no sale si no se tomó la decisión previa', () => {
    const ids = pickSeasonEvents(newCareer({ season: 2 }))
    expect(ids.some((id) => getEvent(id).requiresFlags)).toBe(false)
  })

  it('si la temporada pasada fuiste de fiesta, esta temporada vuelve la foto', () => {
    const ids = pickSeasonEvents(newCareer({ season: 2, flags: { partyAnimal: true } }))
    expect(ids).toContain('consecuencia-fiesta')
  })

  it('cada consecuencia se vive una sola vez y como máximo 2 por temporada', () => {
    const flags = {
      partyAnimal: true,
      captainRespect: true,
      publicComplaint: true,
      foreignInterest: true
    }
    const career = newCareer({ season: 3, flags })
    const ids = pickSeasonEvents(career)
    const consequences = ids.filter((id) => getEvent(id).requiresFlags)
    expect(consequences).toHaveLength(2)

    // Resolver la primera consecuencia la marca como vista.
    const started = advanceSeason(startSeason(career))
    const first = started.seasonProgress!.eventIds[0]
    const { career: after } = resolveChoice(started, 1)
    expect(after.flags[`seen:${first}`]).toBe(true)
    expect(pickSeasonEvents({ ...after, season: 4, seasonProgress: null })).not.toContain(first)
  })
})

describe('selección nacional', () => {
  it('los torneos se juegan cada dos veranos, alternando mundial y continental', () => {
    expect(tournamentForSeasonEnd(2027)).toBeNull()
    expect(tournamentForSeasonEnd(2028)).toBe('copa-naciones')
    expect(tournamentForSeasonEnd(2029)).toBeNull()
    expect(tournamentForSeasonEnd(2030)).toBe('mundial')
  })

  it('un juvenil desconocido no va convocado; una figura sí', () => {
    const rookie = newCareer({ age: 17, reputation: 10 })
    expect(isCalledUp(rookie, 6.5)).toBe(false)
    expect(simulateNationalTeam(rookie, 6.5, 0.3)).toEqual({ calledUp: false, caps: 0, goals: 0 })
    const star = newCareer({ age: 24, reputation: 70 })
    expect(isCalledUp(star, 6.5)).toBe(true)
  })

  it('en verano de mundial el convocado juega el torneo', () => {
    // Temporada 4 = 2029/30 → termina en 2030 → mundial.
    const star = newCareer({ age: 24, reputation: 70, season: 4 })
    const result = simulateNationalTeam(star, 7.8, 0.5)
    expect(result.calledUp).toBe(true)
    expect(result.tournament?.id).toBe('mundial')
    expect(TOURNAMENT_ROUNDS).toContain(result.tournament?.round)
    expect(result.caps).toBeGreaterThanOrEqual(6)
  })

  it('ganar el torneo suma el trofeo de selección al palmarés', () => {
    let found = false
    for (let i = 0; i < 40 && !found; i++) {
      const star = newCareer({
        id: `estrella-${i}`,
        age: 25,
        reputation: 80,
        season: 4,
        mode: defaultMode('normal'),
        attributes: STAR
      })
      const record = buildSeasonRecord(advanceSeason(startSeason(star)))
      if (record.nationalTeam?.tournament?.round === 'Campeón') {
        expect(record.trophies).toContain('mundial')
        found = true
      }
    }
    expect(found).toBe(true)
  })
})
