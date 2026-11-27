import { describe, expect, it } from 'vitest'
import { BASE_ATTRIBUTES, emptyAttributes, toScale } from '../data/attributes'
import { getClub } from '../data/clubs'
import { defaultMode } from '../data/gameModes'
import type { Career } from '../types/career'
import { createCareer } from './career'
import { careerFromSaveFile, SAVE_VERSION, toSaveFile } from './saveGame'
import { advanceSeason, startSeason } from './season'

const career = createCareer(
  {
    character: {
      name: 'Diego Rivera',
      sex: 'M',
      foot: 'derecha',
      position: 'DC',
      nationalityId: 'ARG'
    },
    mode: defaultMode('normal'),
    originId: 'arg-potrero',
    allocation: { ...emptyAttributes(), finishing: 4, pace: 4 },
    clubId: 'arg-quilmez'
  },
  new Date('2026-11-23T12:00:00Z')
)

/** Partida tal y como la guardaba la v0.6 (formato v2). */
function v2Career(): Record<string, unknown> {
  const { mode, money, contract, purchases, divisions, continentalTeams, pendingPoints, ...rest } =
    career
  void mode
  void money
  void contract
  void purchases
  void divisions
  void continentalTeams
  void pendingPoints
  const oldAttributes = {
    finishing: 13,
    heading: 7,
    dribbling: 10,
    offTheBall: 7,
    pace: 12,
    strength: 8,
    composure: 8,
    leadership: 5
  }
  return {
    ...rest,
    clubId: 'arg-puertosur', // club de antes de la v0.8
    originId: 'barrio',
    attributes: oldAttributes,
    season: 3,
    seasonProgress: {
      eventIds: ['fiesta', 'prensa', 'extra', 'penalti'],
      resolutions: [{ eventId: 'fiesta', optionIndex: 2, text: '...' }],
      bonusGoals: 0
    },
    history: [
      {
        season: 1,
        yearLabel: '2026/27',
        clubId: 'arg-puertosur',
        age: 17,
        matches: 30,
        goals: 8,
        assists: 3,
        rating: 6.8,
        leaguePosition: 9,
        trophies: [],
        attributeChanges: {}
      }
    ]
  }
}

describe('guardado de partidas', () => {
  it('el resumen tiene lo necesario para la lista de partidas', () => {
    const file = toSaveFile(career)
    expect(file.version).toBe(SAVE_VERSION)
    expect(file.summary).toEqual({
      id: career.id,
      playerName: 'Diego Rivera',
      nationalityId: 'ARG',
      clubName: getClub('arg-quilmez').name,
      season: 1,
      updatedAt: career.updatedAt
    })
  })

  it('guardar y cargar devuelve la misma carrera (pasando por JSON)', () => {
    const roundTrip = JSON.parse(JSON.stringify(toSaveFile(career)))
    expect(careerFromSaveFile(roundTrip)).toEqual(career)
  })

  it('una temporada a medias (con partidos jugados) también se guarda y se carga', () => {
    const playing: Career = advanceSeason(startSeason({ ...career, season: 2 }))
    expect(playing.seasonProgress?.clubMatches.length).toBeGreaterThan(0)
    const roundTrip = JSON.parse(JSON.stringify(toSaveFile(playing)))
    expect(careerFromSaveFile(roundTrip)).toEqual(playing)
  })

  it('rechaza versiones desconocidas', () => {
    expect(careerFromSaveFile({ ...toSaveFile(career), version: 999 })).toBeNull()
  })

  it('rechaza partidas manipuladas o dañadas', () => {
    const file = toSaveFile(career)
    const tamper = (patch: object): unknown => ({ ...file, career: { ...career, ...patch } })
    expect(careerFromSaveFile(tamper({ clubId: 'club-inventado' }) as never)).toBeNull()
    expect(careerFromSaveFile(tamper({ originId: 'marciano' }) as never)).toBeNull()
    expect(
      careerFromSaveFile(tamper({ attributes: { ...career.attributes, pace: 99 } }) as never)
    ).toBeNull()
    expect(careerFromSaveFile(tamper({ id: '../../windows' }) as never)).toBeNull()
    expect(careerFromSaveFile(tamper({ money: -5 }) as never)).toBeNull()
    expect(careerFromSaveFile(tamper({ mode: { id: 'eterna', seasons: 99 } }) as never)).toBeNull()
    expect(careerFromSaveFile({ ...file, career: null })).toBeNull()
  })
})

describe('migración de partidas antiguas', () => {
  it('una partida v1 (juego v0.2) se carga con valores iniciales de temporada', () => {
    const old = v2Career()
    const { trust, morale, reputation, seasonProgress, history, ...v1Career } = old
    void trust
    void morale
    void reputation
    void seasonProgress
    void history
    const migrated = careerFromSaveFile({ ...toSaveFile(career), version: 1, career: v1Career })
    expect(migrated).not.toBeNull()
    expect(migrated?.history).toEqual([])
    expect(migrated?.seasonProgress).toBeNull()
    expect(migrated?.trust).toBe(65) // club modesto
    expect(migrated?.clubId).toBe('arg-quilmez') // el club antiguo pasa a uno de ahora
    expect(migrated?.originId).toBe('arg-potrero') // "barrio" de Argentina
    expect(migrated?.reputation).toBe(7)
  })

  it('una partida v2 (juego v0.3–v0.6) pasa al modo Completa sin perder nada', () => {
    const migrated = careerFromSaveFile({ ...toSaveFile(career), version: 2, career: v2Career() })
    expect(migrated).not.toBeNull()
    if (!migrated) return
    expect(migrated.originId).toBe('arg-potrero')
    expect(migrated.mode).toEqual({ id: 'completa', seasons: 20, decisionInterval: 1 })
    // Los atributos de antes se conservan y los nuevos empiezan con el valor base.
    // La Completa usa atributos de 1 a 50: los antiguos (1–20) se escalan.
    expect(migrated.attributes.finishing).toBe(toScale(13, 50))
    expect(migrated.attributes.shortPassing).toBe(toScale(BASE_ATTRIBUTES.shortPassing, 50))
    expect(migrated.attributes.stamina).toBe(toScale(BASE_ATTRIBUTES.stamina, 50))
    expect(migrated.attributes.penalties).toBe(toScale(BASE_ATTRIBUTES.penalties, 50))
    expect(migrated.teammates).toHaveLength(5)
    expect(migrated.captaincy).toBeNull()
    // Cobra lo que habría ganado y tiene contrato con su club.
    expect(migrated.money).toBe(600 * 52)
    expect(migrated.clubId).toBe('arg-quilmez')
    expect(migrated.contract.clubId).toBe('arg-quilmez')
    expect(migrated.history[0].clubId).toBe('arg-quilmez')
    expect(migrated.divisions.ARG[1]).toContain('arg-quilmez')
    expect(migrated.continentalTeams.intercontinental).toHaveLength(16)
    expect(migrated.pendingPoints).toBe(0)
    expect(migrated.purchases).toEqual([])
    // La temporada en curso sigue donde estaba, ahora con calendario.
    expect(migrated.seasonProgress?.eventIds).toHaveLength(4)
    expect(migrated.seasonProgress?.resolutions).toHaveLength(1)
    expect(migrated.seasonProgress?.playedSlots).toBe(0)
    expect(migrated.seasonProgress?.eventSlots).toHaveLength(4)
    expect(migrated.seasonProgress?.setup.league).toHaveLength(20)
    expect(migrated.history).toHaveLength(1)
    // Y se puede seguir jugando.
    const next = advanceSeason(migrated)
    expect(next.seasonProgress!.playedSlots).toBeGreaterThan(0)
  })

  it('una partida v4 (juego v0.8–v0.9) gana balón parado, compañeros y copas europeas', () => {
    // Temporada a medias con el formato antiguo: atributos 1–20 sin balón parado,
    // una sola lista de clasificados internacionales y sin compañeros.
    const started = advanceSeason(startSeason({ ...career, season: 3 }))
    const { teammates, exTeammates, captaincy, transferTarget, ...rest } = started
    void teammates
    void exTeammates
    void captaincy
    void transferTarget
    const { corners, freeKicks, penalties, ...attributes20 } = {
      ...BASE_ATTRIBUTES,
      finishing: 12
    }
    void corners
    void freeKicks
    void penalties
    const v4 = {
      ...rest,
      attributes: attributes20,
      pendingPoints: 4,
      continentalTeams: started.continentalTeams.intercontinental,
      seasonProgress: {
        ...started.seasonProgress,
        setup: { ...started.seasonProgress!.setup, continentalCup: undefined }
      },
      history: [
        { season: 1, clubId: 'arg-boka-juniors' },
        { season: 2, clubId: 'arg-quilmez' }
      ].map((r) => ({
        yearLabel: '',
        age: 18,
        matches: 30,
        goals: 5,
        assists: 1,
        rating: 6.5,
        leaguePosition: 8,
        trophies: [],
        attributeChanges: {},
        ...r
      })),
      flags: { ...started.flags, captainRespect: true }
    }
    const migrated = careerFromSaveFile({
      version: 4,
      summary: toSaveFile(career).summary,
      career: v4 as never
    })
    expect(migrated).not.toBeNull()
    if (!migrated) return
    // Normal: atributos de 1 a 30.
    expect(migrated.attributes.finishing).toBe(toScale(12, 30))
    expect(migrated.attributes.penalties).toBe(toScale(BASE_ATTRIBUTES.penalties, 30))
    expect(migrated.pendingPoints).toBe(6)
    expect(migrated.continentalTeams.campeones).toHaveLength(20)
    expect(migrated.teammates.find((t) => t.role === 'capitan')?.relation).toBe(72)
    expect(migrated.exTeammates.length).toBeGreaterThan(0)
    expect(migrated.exTeammates.every((t) => t.clubId === 'arg-boka-juniors')).toBe(true)
    // La temporada a medias sigue con su copa antigua.
    expect(migrated.seasonProgress?.setup.continentalCup).toBeUndefined()
    expect(advanceSeason(migrated).seasonProgress!.playedSlots).toBeGreaterThanOrEqual(
      migrated.seasonProgress!.playedSlots
    )
  })
})
