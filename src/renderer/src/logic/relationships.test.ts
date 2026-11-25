import { describe, expect, it } from 'vitest'
import { emptyAttributes } from '../data/attributes'
import { defaultMode } from '../data/gameModes'
import type { Career } from '../types/career'
import { createCareer } from './career'
import { describeRelationships, describeTeammate } from './relationships'

function career(overrides: Partial<Career> = {}): Career {
  const base = createCareer(
    {
      character: {
        name: 'Test Relaciones',
        sex: 'M',
        foot: 'derecha',
        position: 'DC',
        nationalityId: 'ITA'
      },
      mode: defaultMode(),
      originId: 'ita-hijo-del-halcon',
      allocation: emptyAttributes(),
      clubId: 'ita-torrino'
    },
    new Date('2026-11-23T12:00:00Z')
  )
  return { ...base, ...overrides }
}

const find = (
  c: Career,
  id: string
): ReturnType<typeof describeRelationships>[number] | undefined =>
  describeRelationships(c).find((r) => r.id === id)

describe('relaciones', () => {
  it('al empezar: míster, padre (por el origen) y afición; los compañeros van aparte', () => {
    const ids = describeRelationships(career()).map((r) => r.id)
    expect(ids).toEqual(['coach', 'father', 'fans'])
    const mates = career().teammates.map((m) => describeTeammate(m, career()))
    expect(mates.map((m) => m.role)).toContain('Capitán')
    expect(mates.map((m) => m.role)).toContain('Rival de puesto')
  })

  it('las decisiones cambian cómo te ven', () => {
    expect(find(career({ flags: { coachConflict: true } }), 'coach')?.level).toBe('enemigo')
    expect(find(career({ flags: { fatherRelation: 'tensa' } }), 'father')?.level).toBe('tenso')
    expect(find(career({ flags: { brokenPromise: true } }), 'fans')?.level).toBe('tenso')
  })

  it('la confianza del míster define la relación si no hay conflictos', () => {
    expect(find(career({ trust: 80 }), 'coach')?.level).toBe('aliado')
    expect(find(career({ trust: 20 }), 'coach')?.level).toBe('tenso')
  })
})
