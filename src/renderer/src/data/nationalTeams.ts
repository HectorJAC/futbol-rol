import type { NationalityId } from './nationalities'

export type TournamentId = 'mundial' | 'copa-naciones'

/** Nivel de cada selección: probabilidad de ganar cada torneo (antes de tu aportación). */
export const NATIONAL_STRENGTH: Record<NationalityId, Record<TournamentId, number>> = {
  ARG: { mundial: 0.14, 'copa-naciones': 0.3 },
  BRA: { mundial: 0.14, 'copa-naciones': 0.3 },
  ESP: { mundial: 0.12, 'copa-naciones': 0.2 },
  FRA: { mundial: 0.14, 'copa-naciones': 0.2 },
  ENG: { mundial: 0.1, 'copa-naciones': 0.16 },
  GER: { mundial: 0.11, 'copa-naciones': 0.16 },
  ITA: { mundial: 0.07, 'copa-naciones': 0.14 },
  JPN: { mundial: 0.02, 'copa-naciones': 0.28 },
  USA: { mundial: 0.02, 'copa-naciones': 0.3 }
}

export const TOURNAMENT_NAMES: Record<TournamentId, string> = {
  mundial: 'Copa Mundial de Naciones',
  'copa-naciones': 'Copa de Naciones'
}

/**
 * Torneo de selecciones que se juega en el verano en que termina la temporada.
 * Mundial los años 2030, 2034…; torneo continental los años 2028, 2032…
 */
export function tournamentForSeasonEnd(endYear: number): TournamentId | null {
  if (endYear % 4 === 2) return 'mundial'
  if (endYear % 4 === 0) return 'copa-naciones'
  return null
}

/** Rondas posibles, de peor a mejor. */
export const TOURNAMENT_ROUNDS = [
  'Fase de grupos',
  'Octavos de final',
  'Cuartos de final',
  'Semifinales',
  'Final',
  'Campeón'
] as const

export type TournamentRound = (typeof TOURNAMENT_ROUNDS)[number]
