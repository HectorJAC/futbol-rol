import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { defaultMode } from '../data/gameModes'
import type { Career, SeasonRecord } from '../types/career'
import { createCareer } from './career'
import { careerRecordRow, rankCareers } from './records'

function careerWith(name: string, history: Partial<SeasonRecord>[]): Career {
  const base = createCareer(
    {
      character: { name, sex: 'M', foot: 'derecha', position: 'DC', nationalityId: 'BRA' },
      mode: defaultMode(),
      originId: 'bra-futsal',
      allocation: emptyAttributes(),
      clubId: 'bra-santoz'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  const full = history.map((r, i): SeasonRecord => ({
    season: i + 1,
    yearLabel: `${2026 + i}/${27 + i}`,
    clubId: 'bra-santoz',
    age: 17 + i,
    matches: 30,
    goals: 10,
    assists: 3,
    rating: 7,
    leaguePosition: 5,
    trophies: [],
    attributeChanges: {},
    ...r
  }))
  return { ...base, history: full }
}

describe('records', () => {
  it('resume una carrera: totales, títulos separados y mejor temporada', () => {
    const row = careerRecordRow(
      careerWith('Goleador', [
        { goals: 12, trophies: ['copa'] },
        {
          goals: 25,
          trophies: ['liga', 'goleador'],
          nationalTeam: { calledUp: true, caps: 6, goals: 2 }
        }
      ])
    )
    expect(row.seasons).toBe(2)
    expect(row.goals).toBe(37)
    expect(row.collective).toBe(2)
    expect(row.individual).toBe(1)
    expect(row.caps).toBe(6)
    expect(row.bestSeason).toEqual({ yearLabel: '2027/28', goals: 25 })
  })

  it('ordena por títulos y luego por goles', () => {
    const a = careerRecordRow(careerWith('Sin títulos', [{ goals: 40 }]))
    const b = careerRecordRow(careerWith('Campeón', [{ goals: 5, trophies: ['liga'] }]))
    const c = careerRecordRow(careerWith('Nuevo', []))
    expect(rankCareers([a, c, b]).map((r) => r.playerName)).toEqual([
      'Campeón',
      'Sin títulos',
      'Nuevo'
    ])
  })
})
