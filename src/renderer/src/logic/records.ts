import { getTrophy } from '../data/trophies'
import type { Career } from '../types/career'
import { careerTotals } from './season'

export interface CareerRecordRow {
  id: string
  playerName: string
  nationalityId: string
  seasons: number
  matches: number
  goals: number
  assists: number
  collective: number
  individual: number
  caps: number
  bestSeason: { yearLabel: string; goals: number } | null
}

/** Resumen de una carrera para la pantalla de Records. */
export function careerRecordRow(career: Career): CareerRecordRow {
  const totals = careerTotals(career.history)
  const trophies = career.history.flatMap((r) => r.trophies.map(getTrophy))
  const best = career.history.reduce<Career['history'][number] | null>(
    (top, r) => (!top || r.goals > top.goals ? r : top),
    null
  )
  return {
    id: career.id,
    playerName: career.character.name,
    nationalityId: career.character.nationalityId,
    seasons: career.history.length,
    ...totals,
    collective: trophies.filter((t) => t.kind === 'colectivo').length,
    individual: trophies.filter((t) => t.kind === 'individual').length,
    caps: career.history.reduce((sum, r) => sum + (r.nationalTeam?.caps ?? 0), 0),
    bestSeason: best ? { yearLabel: best.yearLabel, goals: best.goals } : null
  }
}

/** Ordena por títulos totales, luego goles, luego temporadas. */
export function rankCareers(rows: CareerRecordRow[]): CareerRecordRow[] {
  return [...rows].sort(
    (a, b) =>
      b.collective + b.individual - (a.collective + a.individual) ||
      b.goals - a.goals ||
      b.seasons - a.seasons
  )
}
