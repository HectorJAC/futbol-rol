import { describe, expect, it } from 'vitest'
import { emptyAttributes, toScale, type Attributes } from '../data/attributes'
import { getClub } from '../data/clubs'
import { getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import type { Career, ClubMatch, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import type { ClubFixture } from './competitions'
import {
  createLiveMatch,
  getMoment,
  isLiveMatchOver,
  liveMatchResult,
  momentMinute,
  momentText,
  needsLineup,
  resolveMoment,
  startLiveMatch
} from './match'
import { createRng } from './random'
import {
  advanceSeason,
  buildSeasonRecord,
  eventOptions,
  matchRating,
  startSeason,
  teamNeeds
} from './season'
import { generateTransferMarket, marketWeight } from './transfers'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'Test Jornada',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ENG'
      },
      mode: defaultMode('completa'),
      originId: 'eng-academia-londres',
      allocation: emptyAttributes(),
      clubId: 'eng-arsenel'
    },
    new Date('2026-11-24T12:00:00Z')
  )
  return { ...base, id: 'test-jornada', ...overrides }
}

const FIXTURE: ClubFixture = {
  slot: 0,
  competition: 'liga',
  round: 0,
  opponentId: 'eng-chelsey-fc',
  home: true,
  knockout: false,
  neutral: false
}

const record = (over: Partial<SeasonRecord>): SeasonRecord => ({
  season: 1,
  yearLabel: '2026/27',
  clubId: 'eng-arsenel',
  age: 17,
  matches: 25,
  goals: 4,
  assists: 2,
  rating: 6.8,
  leaguePosition: 6,
  trophies: [],
  attributeChanges: {},
  ...over
})

describe('convocatoria de los partidos importantes', () => {
  it('puedes ser titular, suplente o no ir convocado, y se ve antes de empezar', () => {
    const roles = new Set<string>()
    for (let i = 0; i < 80; i++) {
      const c = startSeason(career({ id: `convocatoria-${i}`, trust: 40 }))
      const live = createLiveMatch(c, FIXTURE)
      roles.add(live.role ?? '')
      expect(needsLineup(live)).toBe(true)
      if (live.role === 'noConvocado') {
        expect(live.phases).toHaveLength(0)
        expect(isLiveMatchOver(live)).toBe(true)
        const result = liveMatchResult(c, live)
        expect(result.played).toBe(false)
        expect(result.squad).toBe('fuera')
      }
      if (live.role === 'suplente') {
        // Solo vives jugadas desde que entras.
        for (const id of live.momentIds) {
          expect(momentMinute(getMoment(id)) ?? 99).toBeGreaterThan(live.enterMinute ?? 0)
        }
      }
    }
    expect(roles).toEqual(new Set(['titular', 'suplente', 'noConvocado']))
  })

  it('un titular sustituido no vive jugadas después del cambio', () => {
    let checked = 0
    for (let i = 0; i < 150 && checked < 5; i++) {
      let c = startSeason(career({ id: `cambio-${i}`, trust: 95 }))
      const live = createLiveMatch(c, FIXTURE)
      if (live.role !== 'titular' || live.exitMinute === undefined) continue
      checked++
      c = startLiveMatch({ ...c, seasonProgress: { ...c.seasonProgress!, liveMatch: live } })
      while (!isLiveMatchOver(c.seasonProgress!.liveMatch!)) c = resolveMoment(c, 0).career
      const end = c.seasonProgress!.liveMatch!
      for (const r of end.resolutions) expect(r.minute).toBeLessThan(end.exitMinute ?? 0)
      expect(liveMatchResult(c, end).played).toBe(true)
    }
    expect(checked).toBeGreaterThan(0)
  })

  it('advanceSeason prepara el partido importante con su convocatoria', () => {
    const c = advanceSeason(startSeason(career()))
    const live = c.seasonProgress?.liveMatch
    if (live) expect(live.role).toBeDefined()
  })
})

describe('notas como en la vida real', () => {
  const rng = (): (() => number) => createRng(42)
  it('marcar sube mucho la nota; un hat-trick ronda el 9', () => {
    const c = career()
    const none = matchRating(c, 0, 0, 1, 1, rng())
    const goal = matchRating(c, 1, 0, 1, 0, rng())
    const hatTrick = matchRating(c, 3, 0, 3, 1, rng())
    expect(none).toBeGreaterThanOrEqual(5.8)
    expect(none).toBeLessThanOrEqual(7)
    expect(goal).toBeGreaterThanOrEqual(7.2)
    expect(hatTrick).toBeGreaterThanOrEqual(8.9)
    // Un suplente sin participar se queda cerca de 6,5.
    const sub = matchRating(c, 0, 0, 1, 1, rng(), true)
    expect(Math.abs(sub - 6.5)).toBeLessThan(0.5)
  })

  it('20 partidos, 15 goles y 7 asistencias dan una media de notable', () => {
    const c = startSeason(career())
    const random = createRng(7)
    const goals = [1, 1, 0, 2, 1, 0, 1, 0, 1, 2, 0, 1, 0, 1, 1, 0, 2, 0, 1, 0]
    const assists = [0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]
    const matches: ClubMatch[] = goals.map((g, i) => ({
      slot: i * 2,
      competition: 'liga',
      opponentId: 'eng-chelsey-fc',
      home: i % 2 === 0,
      goalsFor: g + 1,
      goalsAgainst: 1,
      played: true,
      playerGoals: g,
      playerAssists: assists[i],
      rating: matchRating(c, g, assists[i], g + 1, 1, random)
    }))
    const p = c.seasonProgress!
    const season = buildSeasonRecord({
      ...c,
      seasonProgress: { ...p, clubMatches: matches, playedSlots: 40 }
    })
    expect(season.goals).toBe(15)
    expect(season.rating).toBeGreaterThanOrEqual(7.3)
  })
})

describe('no jugar: no convocado o en la banca', () => {
  it('los partidos simulados sin jugar dicen por qué', () => {
    let c = startSeason(career({ trust: 5 }))
    for (let i = 0; i < 6; i++) {
      c = advanceSeason(c)
      if (c.seasonProgress?.liveMatch) break
      const p = c.seasonProgress!
      if (
        p.resolutions.length < p.eventIds.length &&
        p.eventSlots[p.resolutions.length] <= p.playedSlots
      ) {
        c = { ...c, seasonProgress: { ...p, eventIds: [], eventSlots: [] } }
      }
    }
    const benched = c.seasonProgress!.clubMatches.filter((m) => !m.played && !m.injured)
    for (const m of benched) expect(['banca', 'fuera']).toContain(m.squad)
  })
})

describe('Horas extra', () => {
  it('las opciones son los atributos que más necesita tu equipo y dicen qué mejoran', () => {
    const c = career({ season: 2, age: 18 })
    const needs = teamNeeds(c)
    expect(needs).toHaveLength(3)
    const options = eventOptions(getEvent('extra'), c)
    expect(options).toHaveLength(3)
    options.forEach((o, i) => {
      expect(Object.keys(o.outcome?.effects.attributes ?? {})).toEqual([needs[i]])
    })
    // Si mejoras mucho la definición, deja de ser lo que más se necesita.
    const sharp = { ...c, attributes: { ...c.attributes, finishing: 50 } as Attributes }
    expect(teamNeeds(sharp)).not.toContain('finishing')
  })
})

describe('Un estadio en contra', () => {
  it('con menos de 25 años el texto no habla de "tus compañeros más jóvenes"', () => {
    const moment = getMoment('inicio-estadio-en-contra')
    expect(momentText(moment, { age: 18 })).not.toContain('más jóvenes')
    expect(momentText(moment, { age: 28 })).toContain('más jóvenes')
    expect(momentMinute({ ...moment, text: momentText(moment, { age: 18 }) })).toBe(4)
  })
})

describe('mercado según la nacionalidad', () => {
  it('un inglés de 18 años recibe ofertas de Inglaterra (y Europa si destaca), nunca de Argentina', () => {
    for (let i = 0; i < 30; i++) {
      const c = career({
        id: `mercado-${i}`,
        season: 2,
        age: 18,
        reputation: 30,
        history: [record({ rating: 6.9 })]
      })
      for (const offer of generateTransferMarket(c).offers) {
        expect(offer.club.countryId).toBe('ENG')
      }
    }
    const c = career({ age: 18, reputation: 30 })
    expect(marketWeight(c, getClub('arg-boka-juniors'), 8)).toBe(0)
    expect(marketWeight(c, getClub('esp-real-madrik'), 6.9)).toBe(0)
    expect(marketWeight(c, getClub('esp-real-madrik'), 7.6)).toBeGreaterThan(0)
    // Un veterano sí puede acabar en la MLS.
    expect(marketWeight({ ...c, age: 32 }, getClub('usa-inter-miani'), 7)).toBeGreaterThan(0)
  })
})

it('escala de 50: el valor de partida no pasa de 50', () => {
  expect(toScale(20, 50)).toBe(50)
})
