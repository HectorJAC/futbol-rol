import { describe, expect, it } from 'vitest'
import { ATTRIBUTES, emptyAttributes } from '../data/attributes'
import { ALL_CLUBS, getClub, getClubOffers, randomFirstOffers } from '../data/clubs'
import { getEvent } from '../data/events'
import { defaultMode } from '../data/gameModes'
import { MATCH_MOMENTS } from '../data/matchMoments'
import { NATIONALITIES } from '../data/nationalities'
import type { Career, ClubMatch } from '../types/career'
import { createCareer } from './career'
import { CUP_ROUND_NAMES, type ClubFixture } from './competitions'
import {
  createLiveMatch,
  finishLiveMatch,
  getMoment,
  isLiveMatchOver,
  liveMatchResult,
  momentCount,
  momentMinute,
  resolveMoment,
  startLiveMatch
} from './match'
import { notPlayedText, playedRoleText } from './notPlayed'
import {
  advanceSeason,
  driftMorale,
  matchMood,
  moraleTarget,
  START_MORALE,
  startSeason
} from './season'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'Test Doce',
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
  return { ...base, id: 'test-doce', ...overrides }
}

const fixture = (over: Partial<ClubFixture> = {}): ClubFixture => ({
  slot: 0,
  competition: 'liga',
  round: 0,
  opponentId: 'eng-chelsey-fc',
  home: true,
  knockout: false,
  neutral: false,
  ...over
})

const cupRound = (fromEnd: number): Partial<ClubFixture> => ({
  competition: 'copa',
  round: CUP_ROUND_NAMES.length - 1 - fromEnd,
  knockout: true,
  neutral: fromEnd === 0
})

describe('ofertas del primer contrato al azar', () => {
  it('Inglaterra: uno de 5 estrellas, uno de 4 o 3 y uno de 3 o 2, distintos en cada partida', () => {
    const sets = new Set<string>()
    const middle = new Set<number>()
    const modest = new Set<number>()
    for (let seed = 1; seed <= 40; seed++) {
      const ids = randomFirstOffers('ENG', seed)
      const stars = ids.map((id) => getClub(id).prestige)
      expect(new Set(ids).size).toBe(3)
      expect(stars[0]).toBe(5)
      expect([4, 3]).toContain(stars[1])
      expect([3, 2]).toContain(stars[2])
      middle.add(stars[1])
      modest.add(stars[2])
      sets.add(ids.join(','))
    }
    expect(middle).toEqual(new Set([4, 3]))
    expect(modest).toEqual(new Set([3, 2]))
    // Ya no salen siempre Arsenel, West Hamm y Sunderlant.
    expect(sets.size).toBeGreaterThan(20)
  })

  it('todos los países tienen tres ofertas distintas; sin 5 estrellas, cuenta desde su mejor nivel', () => {
    for (const { id } of NATIONALITIES) {
      const top = Math.max(...ALL_CLUBS.filter((c) => c.countryId === id).map((c) => c.prestige))
      for (let seed = 1; seed <= 15; seed++) {
        const ids = randomFirstOffers(id, seed)
        expect(new Set(ids).size).toBe(3)
        expect(getClub(ids[0]).prestige).toBe(top)
        for (const clubId of ids) expect(getClub(clubId).countryId).toBe(id)
      }
    }
  })

  it('la carrera se crea con el club ofrecido en esa partida (y no con otro)', () => {
    const offers = getClubOffers('ENG', 'eng-academia-londres', 99)
    const input = {
      character: {
        name: 'Test Doce',
        sex: 'M' as const,
        foot: 'derecha' as const,
        position: 'DC' as const,
        nationalityId: 'ENG' as const
      },
      mode: defaultMode('completa'),
      originId: 'eng-academia-londres' as const,
      allocation: emptyAttributes(),
      offerSeed: 99
    }
    const c = createCareer({ ...input, clubId: offers[1].club.id })
    expect(c.clubId).toBe(offers[1].club.id)
    expect(String(c.flags.rejectedFirstOffers).split(',')).toEqual([
      offers[0].club.id,
      offers[2].club.id
    ])
    const notOffered = ALL_CLUBS.find(
      (club) => club.countryId === 'ENG' && !offers.some((o) => o.club.id === club.id)
    )
    expect(() => createCareer({ ...input, clubId: notOffered!.id })).toThrow()
  })
})

describe('moral', () => {
  const match = (over: Partial<ClubMatch>): ClubMatch => ({
    slot: 0,
    competition: 'liga',
    opponentId: 'eng-chelsey-fc',
    home: true,
    goalsFor: 1,
    goalsAgainst: 1,
    played: true,
    playerGoals: 0,
    playerAssists: 0,
    rating: 6.6,
    ...over
  })

  it('empieza en 50', () => {
    expect(START_MORALE).toBe(50)
    expect(career().morale).toBe(50)
  })

  it('ganar y marcar sube; quedarte fuera baja', () => {
    expect(matchMood(match({ goalsFor: 3, goalsAgainst: 0, playerGoals: 2, rating: 8.4 }))).toBe(2)
    expect(matchMood(match({ goalsFor: 0, goalsAgainst: 2, rating: 5.9 }))).toBe(-0.75)
    expect(matchMood(match({ played: false, squad: 'fuera', rating: undefined }))).toBe(-1)
    expect(matchMood(match({ played: false, squad: 'banca', rating: undefined }))).toBe(-0.5)
  })

  it('el objetivo depende de la confianza del míster y del vestuario', () => {
    const c = startSeason(career())
    const trusted = moraleTarget({ ...c, trust: 90 })
    const ignored = moraleTarget({ ...c, trust: 10 })
    expect(trusted).toBeGreaterThan(ignored)
    const friends = moraleTarget({
      ...c,
      teammates: c.teammates.map((t) => ({ ...t, relation: 95 }))
    })
    const enemies = moraleTarget({
      ...c,
      teammates: c.teammates.map((t) => ({ ...t, relation: 5 }))
    })
    expect(friends).toBeGreaterThan(enemies)
  })

  it('tras los partidos se acerca a su objetivo poco a poco', () => {
    const c = { ...startSeason(career()), trust: 95, morale: 20 }
    let moved = c
    for (let slot = 0; slot < 30; slot++) moved = driftMorale(moved, slot)
    expect(moved.morale).toBeGreaterThan(20)
    expect(moved.morale).toBeLessThanOrEqual(moraleTarget(moved))
  })

  it('a lo largo de la temporada la moral cambia según tus partidos', () => {
    const play = (trust: number): number => {
      let c = startSeason(career({ id: `moral-${trust}`, trust }))
      for (let i = 0; i < 400; i++) {
        const p = c.seasonProgress!
        if (p.liveMatch) {
          c = finishLiveMatch({
            ...c,
            seasonProgress: { ...p, liveMatch: { ...p.liveMatch, phases: [] } }
          })
          continue
        }
        // Sin decisiones: solo cuentan los partidos.
        c = { ...c, seasonProgress: { ...p, eventIds: [], eventSlots: [] } }
        const next = advanceSeason(c)
        if (next.seasonProgress!.playedSlots === p.playedSlots && !next.seasonProgress!.liveMatch) {
          break
        }
        c = next
      }
      return c.morale
    }
    const starter = play(95)
    const benched = play(5)
    expect(starter).not.toBe(50)
    expect(starter).toBeGreaterThan(benched)
  })
})

describe('decisiones en los partidos importantes', () => {
  const c = startSeason(career())

  it('de 3 a 5 según la relevancia', () => {
    expect(momentCount(c, fixture({ opponentId: 'eng-manchester-citi' }))).toBe(3) // un grande
    expect(momentCount(c, fixture({ opponentId: 'eng-tottenam-hotspur' }))).toBe(4) // clásico
    expect(momentCount(c, fixture({ ...cupRound(2), opponentId: 'eng-everten-fc' }))).toBe(3) // cuartos
    expect(momentCount(c, fixture({ ...cupRound(1), opponentId: 'eng-everten-fc' }))).toBe(4) // semis
    expect(momentCount(c, fixture({ ...cupRound(0), opponentId: 'eng-everten-fc' }))).toBe(5) // final
  })

  it('titular: tantas jugadas como relevancia (al menos 3 si te cambian); suplente: 2', () => {
    const seen = { titular: 0, cambio: 0, suplente: 0 }
    for (let i = 0; i < 160; i++) {
      const base = startSeason(
        career({ id: `jugadas-${i}`, trust: 85, clubId: 'eng-west-hamm-united' })
      )
      const fx = fixture({ ...cupRound(0), opponentId: 'eng-everten-fc', slot: 10 })
      const live = createLiveMatch(base, fx)
      if (live.role === 'titular' && live.exitMinute === undefined) {
        seen.titular++
        expect(live.phases).toHaveLength(5)
      } else if (live.role === 'titular') {
        seen.cambio++
        expect(live.phases.length).toBeGreaterThanOrEqual(3)
      } else if (live.role === 'suplente') {
        seen.suplente++
        expect(live.phases).toHaveLength(2)
      }
    }
    expect(seen.titular).toBeGreaterThan(0)
    expect(seen.cambio).toBeGreaterThan(0)
    expect(seen.suplente).toBeGreaterThan(0)
  })

  it('las jugadas van en orden, mientras estás en el campo y en el minuto que cuenta su texto', () => {
    let checked = 0
    for (let i = 0; i < 120; i++) {
      let cur = startSeason(career({ id: `orden-${i}`, trust: 70 }))
      const opponents = ['eng-everten-fc', 'eng-tottenam-hotspur', 'eng-manchester-citi']
      const fromEnd = i % 3
      const fx = fixture({ ...cupRound(fromEnd), opponentId: opponents[i % 3], slot: 12 })
      const live = createLiveMatch(cur, fx)
      if (live.phases.length === 0) continue
      cur = startLiveMatch({ ...cur, seasonProgress: { ...cur.seasonProgress!, liveMatch: live } })
      while (!isLiveMatchOver(cur.seasonProgress!.liveMatch!)) {
        cur = resolveMoment(cur, i % 2).career
      }
      const end = cur.seasonProgress!.liveMatch!
      const minutes = end.resolutions.map((r) => r.minute)
      for (let k = 1; k < minutes.length; k++) expect(minutes[k]).toBeGreaterThan(minutes[k - 1])
      for (const r of end.resolutions) {
        expect(r.minute).toBeGreaterThan(end.enterMinute ?? 0)
        expect(r.minute).toBeLessThan(end.exitMinute ?? 100)
        const textMinute = momentMinute(getMoment(r.momentId))
        if (textMinute !== null && textMinute < (end.exitMinute ?? 100)) {
          expect(r.minute).toBe(textMinute)
        }
      }
      const result = liveMatchResult(cur, end)
      expect(result.squad).toBe(
        end.role === 'suplente' ? 'suplente' : end.role === 'titular' ? 'titular' : 'fuera'
      )
      checked++
    }
    expect(checked).toBeGreaterThan(80)
  })

  it('hay jugadas nuevas del minuto 15 al 30 y del 70 al 82', () => {
    const minutes = MATCH_MOMENTS.map(momentMinute).filter((m): m is number => m !== null)
    expect(minutes.filter((m) => m >= 15 && m <= 30).length).toBeGreaterThanOrEqual(3)
    expect(minutes.filter((m) => m >= 70 && m <= 82).length).toBeGreaterThanOrEqual(3)
  })
})

describe('resultados de la temporada: titular o suplente', () => {
  it('cada partido jugado dice si fuiste titular o saliste desde el banquillo', () => {
    let c = startSeason(career({ trust: 55 }))
    for (let i = 0; i < 40; i++) {
      const p = c.seasonProgress!
      if (p.clubMatches.length >= 15) break
      if (p.liveMatch) {
        // El partido importante se juega aparte (aquí, sin jugadas).
        const live = { ...p.liveMatch, phases: [] }
        c = finishLiveMatch({ ...c, seasonProgress: { ...p, liveMatch: live } })
        continue
      }
      c = advanceSeason({ ...c, seasonProgress: { ...p, eventIds: [], eventSlots: [] } })
    }
    const matches = c.seasonProgress!.clubMatches
    const played = matches.filter((m) => m.played)
    expect(played.length).toBeGreaterThan(0)
    for (const m of played) {
      expect(['titular', 'suplente']).toContain(m.squad)
      expect(['Titular', 'Suplente']).toContain(playedRoleText(m))
    }
    for (const m of matches.filter((x) => !x.played)) {
      expect(playedRoleText(m)).toBeNull()
      expect(notPlayedText(m)).not.toBe('')
    }
  })

  it('los partidos antiguos (sin papel) no dicen nada', () => {
    const old: ClubMatch = {
      slot: 0,
      competition: 'liga',
      opponentId: 'eng-chelsey-fc',
      home: true,
      goalsFor: 1,
      goalsAgainst: 0,
      played: true,
      playerGoals: 1,
      playerAssists: 0
    }
    expect(playedRoleText(old)).toBeNull()
  })
})

describe('textos', () => {
  it('el atributo se llama Corners', () => {
    expect(ATTRIBUTES.find((a) => a.id === 'corners')?.name).toBe('Corners')
  })

  it('"Tu primera nómina de verdad" enseña lo que cambia cada opción', () => {
    const event = getEvent('primer-sueldo')
    expect(event.showEffects).toBe(true)
    for (const option of event.options) expect(option.outcome?.effects).toBeDefined()
  })
})
