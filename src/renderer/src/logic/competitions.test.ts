import { describe, expect, it } from 'vitest'
import { ALL_CLUBS, getClub, isRivalry } from '../data/clubs'
import { LEAGUES } from '../data/leagues'
import { NATIONALITIES } from '../data/nationalities'
import type { SeasonSetup } from '../types/career'
import {
  buildSeasonSetup,
  buildSeasonView,
  continentalCup,
  cupBracket,
  initialContinentalTeams,
  initialDivisions,
  leagueFixtures,
  leagueRounds,
  leagueStats,
  leagueTable,
  nextSeasonState,
  PROMOTION_SPOTS,
  roundRobin,
  seasonMonth,
  slotDate,
  slotsFor,
  totalSlots,
  type SeasonContext
} from './competitions'

const divisions = initialDivisions()
const continental = initialContinentalTeams(divisions)

function setupFor(clubId: string): SeasonSetup {
  return buildSeasonSetup(divisions, continental, clubId)
}

function ctx(setup: SeasonSetup, overrides: Partial<SeasonContext> = {}): SeasonContext {
  return {
    careerId: 'test-competiciones',
    season: 1,
    clubId: '',
    clubMatches: [],
    playedSlots: totalSlots(setup),
    bonusGoals: 0,
    setup,
    ...overrides
  }
}

describe('clubes y divisiones', () => {
  it('cada país tiene primera y segunda división de 18 o 20 equipos', () => {
    for (const { id } of NATIONALITIES) {
      const [first, second] = divisions[id]
      expect([18, 20]).toContain(first.length)
      expect([18, 20]).toContain(second.length)
      expect(LEAGUES[id].division1Name).toMatch(/^Primera División de /)
      expect(LEAGUES[id].division2Name).toMatch(/^Segunda División de /)
    }
    expect(ALL_CLUBS.length).toBeGreaterThan(340)
    expect(new Set(ALL_CLUBS.map((c) => c.id)).size).toBe(ALL_CLUBS.length)
  })

  it('los rivales clásicos son mutuos y los derbis salen por ciudad', () => {
    for (const club of ALL_CLUBS) {
      if (club.rival) expect(getClub(club.rival).rival, club.id).toBe(club.id)
    }
    expect(isRivalry('esp-real-madrik', 'esp-fc-barkelone')).toBe('clasico')
    expect(isRivalry('esp-real-madrik', 'esp-atletico-de-madrit')).toBe('derbi')
    expect(isRivalry('esp-real-madrik', 'esp-valensia-cf')).toBeNull()
  })

  it('plazas internacionales: 20 + 10 + 5 en Europa, 16 en la Intercontinental; 32 en la copa', () => {
    expect(continental.campeones).toHaveLength(20)
    expect(continental.europa).toHaveLength(10)
    expect(continental.conferencia).toHaveLength(5)
    expect(continental.intercontinental).toHaveLength(16)
    // Nadie juega dos copas internacionales.
    const all = Object.values(continental).flat()
    expect(new Set(all).size).toBe(all.length)
    expect(setupFor('esp-real-madrik').continentalCup).toBe('campeones')
    expect(setupFor('arg-boka-juniors').continentalCup).toBe('intercontinental')
    const setup = setupFor('esp-real-madrik')
    expect(setup.division).toBe(1)
    expect(setup.cup).toHaveLength(32)
    expect(setup.cup).toContain('esp-real-madrik')
    const second = setupFor('esp-deportibo-de-la-coruna')
    expect(second.division).toBe(2)
    expect(second.cup).toContain('esp-deportibo-de-la-coruna')
  })
})

describe('calendario', () => {
  it('liga de 20 equipos: 38 jornadas, 5 rondas de copa y 8 de la Copa de Campeones', () => {
    const setup = setupFor('esp-real-madrik')
    const slots = slotsFor(setup)
    const count = (c: string): number => slots.filter((s) => s.competition === c).length
    expect(leagueRounds(setup)).toBe(38)
    expect(count('liga')).toBe(38)
    expect(count('copa')).toBe(5)
    // 5 jornadas de grupos (de 5 equipos) + cuartos, semifinales y final.
    expect(count('continental')).toBe(8)
    // La temporada antigua (sin copa) sigue con sus 9 rondas.
    const legacy = { ...setup, continentalCup: undefined }
    expect(slotsFor(legacy).filter((s) => s.competition === 'continental')).toHaveLength(9)
  })

  it('liga de 18 equipos: 34 jornadas', () => {
    expect(leagueRounds(setupFor('ger-bayern-munchem'))).toBe(34)
  })

  it('las fechas van en orden de agosto a mayo, con la liga en domingo', () => {
    const setup = setupFor('esp-real-madrik')
    const total = totalSlots(setup)
    for (let i = 1; i < total; i++) {
      expect(slotDate(setup, 1, i).getTime()).toBeGreaterThan(slotDate(setup, 1, i - 1).getTime())
    }
    expect(slotDate(setup, 1, 0).getUTCMonth()).toBe(7) // agosto
    expect(slotDate(setup, 1, 0).getUTCDay()).toBe(0) // domingo
    expect(slotDate(setup, 1, total - 1).getUTCMonth()).toBeLessThanOrEqual(5)
    expect(seasonMonth(setup, 1, 0)).toBe(1)
    expect(seasonMonth(setup, 1, total - 1)).toBeLessThanOrEqual(11)
  })

  it('calendario equilibrado: nadie encadena más de 3 partidos seguidos en casa o fuera', () => {
    const ids = divisions.ESP[0]
    const rounds = roundRobin(ids, true)
    for (const team of ids) {
      const homes = rounds.map((round) => round.some((f) => f.home === team))
      expect(homes.filter(Boolean)).toHaveLength(19)
      let run = 1
      let longest = 1
      for (let i = 1; i < homes.length; i++) {
        run = homes[i] === homes[i - 1] ? run + 1 : 1
        longest = Math.max(longest, run)
      }
      expect(longest, team).toBeLessThanOrEqual(3)
    }
  })

  it('liga a doble vuelta: cada equipo juega con todos dos veces, una en casa', () => {
    const ids = divisions.ESP[0]
    const rounds = roundRobin(ids)
    expect(rounds).toHaveLength(38)
    for (const round of rounds) {
      expect(new Set(round.flatMap((f) => [f.home, f.away])).size).toBe(20)
    }
    const pairs = rounds.flat().map((f) => `${f.home}>${f.away}`)
    expect(new Set(pairs).size).toBe(20 * 19)
  })
})

describe('clasificaciones', () => {
  it('la liga se recalcula igual siempre (determinista)', () => {
    const setup = setupFor('arg-boka-juniors')
    expect(leagueTable(ctx(setup))).toEqual(leagueTable(ctx(setup)))
    expect(leagueFixtures('a', 1, setup.league)).toEqual(leagueFixtures('a', 1, setup.league))
  })

  it('al final de la liga todos han jugado todas las jornadas y los puntos cuadran', () => {
    const setup = setupFor('bra-flamenko')
    const table = leagueTable(ctx(setup))
    for (const row of table) {
      expect(row.played).toBe(38)
      expect(row.won + row.drawn + row.lost).toBe(38)
      expect(row.points).toBe(row.won * 3 + row.drawn)
    }
    expect(table.reduce((s, r) => s + r.goalsFor, 0)).toBe(
      table.reduce((s, r) => s + r.goalsAgainst, 0)
    )
  })

  it('antes de empezar la temporada la tabla está a cero', () => {
    const setup = setupFor('fra-as-monacco')
    for (const row of leagueTable(ctx(setup, { playedSlots: 0 }))) expect(row.played).toBe(0)
  })

  it('la copa tiene 32, 16, 8, 4 y 2 equipos y un campeón', () => {
    const rounds = cupBracket(ctx(setupFor('ita-juventis')))
    expect(rounds.map((r) => r.length)).toEqual([16, 8, 4, 2, 1])
    expect(rounds[4][0].winner).toBeDefined()
    for (const tie of rounds.flat()) {
      if (tie.score && tie.score.home === tie.score.away) expect(tie.score.penalties).toBeDefined()
    }
  })

  it('Copa de Campeones: 4 grupos de 5 a una vuelta y eliminatorias desde cuartos', () => {
    const cup = continentalCup(ctx(setupFor('esp-real-madrik')))
    expect(cup.groups).toHaveLength(4)
    for (const group of cup.groups) {
      expect(group.table).toHaveLength(5)
      for (const row of group.table) expect(row.played).toBe(4)
    }
    expect(cup.knockout.map((r) => r.length)).toEqual([4, 2, 1])
    expect(cup.knockout[2][0].winner).toBeDefined()
  })

  it('Copa de Europa (5º y 6º) y Conferencia (7º): grupos de 5 y semifinales o final', () => {
    const europa = { ...setupFor('esp-real-madrik'), continentalCup: 'europa' as const }
    europa.continental = initialContinentalTeams(divisions).europa
    const cup = continentalCup(ctx(europa))
    expect(cup.groups).toHaveLength(2)
    expect(cup.knockout.map((r) => r.length)).toEqual([2, 1])
    const conference = { ...europa, continentalCup: 'conferencia' as const }
    conference.continental = initialContinentalTeams(divisions).conferencia
    const small = continentalCup(ctx(conference))
    expect(small.groups).toHaveLength(1)
    expect(small.groups[0].table).toHaveLength(5)
    expect(small.knockout.map((r) => r.length)).toEqual([1])
    expect(small.knockout[0][0].winner).toBeDefined()
  })

  it('la Intercontinental mantiene 4 grupos de 4 a ida y vuelta', () => {
    const cup = continentalCup(ctx(setupFor('arg-boka-juniors')))
    expect(cup.groups).toHaveLength(4)
    for (const group of cup.groups) {
      expect(group.table).toHaveLength(4)
      for (const row of group.table) expect(row.played).toBe(6)
    }
  })

  it('al acabar la temporada suben 3 y bajan 3 en cada país', () => {
    const setup = setupFor('esp-real-madrik')
    const table = leagueTable(ctx(setup)).map((r) => r.clubId)
    const next = nextSeasonState('test', 1, divisions, 'esp-real-madrik', setup, table)
    for (const { id } of NATIONALITIES) {
      const [first, second] = next.divisions[id]
      expect(first).toHaveLength(divisions[id][0].length)
      expect(second).toHaveLength(divisions[id][1].length)
      const relegated = divisions[id][0].filter((c) => !first.includes(c))
      expect(relegated).toHaveLength(PROMOTION_SPOTS)
      for (const c of relegated) expect(second).toContain(c)
    }
    // Los 3 últimos de tu liga bajan.
    for (const c of table.slice(-3)) expect(next.divisions.ESP[1]).toContain(c)
    // En Europa: 1º–4º a la Copa de Campeones, 5º y 6º a la de Europa y 7º a la Conferencia.
    expect(next.continentalTeams.campeones).toEqual(expect.arrayContaining(table.slice(0, 4)))
    expect(next.continentalTeams.europa).toEqual(expect.arrayContaining(table.slice(4, 6)))
    expect(next.continentalTeams.conferencia).toContain(table[6])
    expect(next.continentalTeams.campeones).not.toContain(table[4])
  })

  it('hay tabla de goleadores y asistentes con jugadores ficticios', () => {
    const stats = leagueStats(ctx(setupFor('eng-arsenel')), 'Tú')
    expect(stats.scorers.length).toBeGreaterThan(20)
    expect(stats.assists.length).toBeGreaterThan(20)
    expect(stats.scorers[0].value).toBeGreaterThanOrEqual(stats.scorers[1].value)
    expect(stats.scorers.some((r) => r.isPlayer)).toBe(false)
  })

  it('la vista de temporada incluye tu calendario', () => {
    const setup = setupFor('ger-bayern-munchem')
    const view = buildSeasonView(ctx(setup, { clubId: 'ger-bayern-munchem', playedSlots: 0 }), 'Tú')
    expect(view.calendar.filter((e) => e.competition === 'liga')).toHaveLength(34)
    expect(view.calendar.every((e) => e.match === undefined)).toBe(true)
    expect(view.leagueName).toBe('Primera División de Alemania')
  })
})
