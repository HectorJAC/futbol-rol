import type { NationalityId } from './nationalities'
import type { TrophyId } from './trophies'
import { bindText } from '../i18n/bind'
import { CONTINENTAL_EN } from '../i18n/en/data'

/**
 * Copas internacionales de clubes (desde la v0.10).
 * - Europa: los 4 primeros de cada liga van a la Copa de Campeones, el 5º y el
 *   6º a la Copa de Europa y el 7º a la Copa Conferencia.
 * - América y Asia: la Copa Intercontinental.
 * Las temporadas de antes de la v0.10 no tienen copa y usan el formato antiguo
 * ('legacy': 16 equipos de todos los países).
 */
export type ContinentalCupId = 'campeones' | 'europa' | 'conferencia' | 'intercontinental'
export type ContinentalFormatId = ContinentalCupId | 'legacy'

export interface ContinentalFormat {
  id: ContinentalFormatId
  name: string
  trophy: TrophyId
  /** Equipos de la copa. */
  teams: number
  /** Grupos y equipos por grupo (los de 4 juegan ida y vuelta; los de 5, una vuelta). */
  groups: number
  groupSize: 4 | 5
  /** Pasan los 2 primeros de cada grupo a las eliminatorias. */
}

export const CONTINENTAL_FORMATS: Record<ContinentalFormatId, ContinentalFormat> = {
  campeones: {
    id: 'campeones',
    name: 'Copa de Campeones',
    trophy: 'continental',
    teams: 20,
    groups: 4,
    groupSize: 5
  },
  europa: {
    id: 'europa',
    name: 'Copa de Europa',
    trophy: 'copa-europa',
    teams: 10,
    groups: 2,
    groupSize: 5
  },
  conferencia: {
    id: 'conferencia',
    name: 'Copa Conferencia',
    trophy: 'conferencia',
    teams: 5,
    groups: 1,
    groupSize: 5
  },
  intercontinental: {
    id: 'intercontinental',
    name: 'Copa Intercontinental',
    trophy: 'intercontinental',
    teams: 16,
    groups: 4,
    groupSize: 4
  },
  legacy: {
    id: 'legacy',
    name: 'Copa de Campeones',
    trophy: 'continental',
    teams: 16,
    groups: 4,
    groupSize: 4
  }
}

/** Países europeos (juegan las tres copas de Europa). */
export const EUROPEAN_COUNTRIES: readonly NationalityId[] = ['ESP', 'ENG', 'FRA', 'GER', 'ITA']

export function isEuropean(countryId: NationalityId): boolean {
  return EUROPEAN_COUNTRIES.includes(countryId)
}

/** Puestos de liga que dan plaza en cada copa europea (1 = campeón). */
export const EUROPEAN_SPOTS: Record<'campeones' | 'europa' | 'conferencia', number[]> = {
  campeones: [1, 2, 3, 4],
  europa: [5, 6],
  conferencia: [7]
}

/** Plazas de cada país en la Copa Intercontinental (16 equipos). */
export const INTERCONTINENTAL_SPOTS: Partial<Record<NationalityId, number>> = {
  ARG: 5,
  BRA: 5,
  USA: 3,
  JPN: 3
}

/** Clasificados de cada copa para una temporada. */
export type ContinentalQualifiers = Record<ContinentalCupId, string[]>

export const CONTINENTAL_CUP_IDS: readonly ContinentalCupId[] = [
  'campeones',
  'europa',
  'conferencia',
  'intercontinental'
]

/** Copa principal de la zona de un país (la que se muestra si no te clasificas). */
export function mainCupFor(countryId: NationalityId): ContinentalCupId {
  return isEuropean(countryId) ? 'campeones' : 'intercontinental'
}

/** Jornadas de la fase de grupos. */
export function groupRounds(format: ContinentalFormat): number {
  return format.groupSize === 4 ? 6 : 5
}

/** Rondas de eliminatoria: cuartos (8), semifinales (4) y final (2). */
export function knockoutRounds(format: ContinentalFormat): number {
  return Math.log2(format.groups * 2)
}

const KNOCKOUT_NAMES = ['Cuartos de final', 'Semifinales', 'Final']

/** Nombres de todas las rondas: "Grupos · J1" … "Final". */
export function continentalRoundNames(format: ContinentalFormat): string[] {
  const groups = Array.from({ length: groupRounds(format) }, (_, i) => `Grupos · J${i + 1}`)
  return [...groups, ...KNOCKOUT_NAMES.slice(-knockoutRounds(format))]
}

// Nombre de cada copa internacional en inglés.
for (const [id, format] of Object.entries(CONTINENTAL_FORMATS)) {
  bindText(format, 'name', CONTINENTAL_EN[id as ContinentalFormatId])
}
