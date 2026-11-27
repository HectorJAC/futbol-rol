import flagAr from 'flag-icons/flags/4x3/ar.svg'
import flagBr from 'flag-icons/flags/4x3/br.svg'
import flagEs from 'flag-icons/flags/4x3/es.svg'
import flagFr from 'flag-icons/flags/4x3/fr.svg'
import flagGbEng from 'flag-icons/flags/4x3/gb-eng.svg'
import flagDe from 'flag-icons/flags/4x3/de.svg'
import flagIt from 'flag-icons/flags/4x3/it.svg'
import flagJp from 'flag-icons/flags/4x3/jp.svg'
import flagUs from 'flag-icons/flags/4x3/us.svg'
import { bindText } from '../i18n/bind'
import { NATIONALITIES_EN } from '../i18n/en/data'

export type NationalityId = 'ARG' | 'BRA' | 'ESP' | 'FRA' | 'ENG' | 'GER' | 'ITA' | 'JPN' | 'USA'

export interface Nationality {
  id: NationalityId
  name: string
  /** Ruta al SVG de la bandera (empaquetado con el juego, funciona offline). */
  flag: string
}

/** Orden en el que aparecen al pulsar las flechas. */
export const NATIONALITIES: readonly Nationality[] = [
  { id: 'ARG', name: 'Argentina', flag: flagAr },
  { id: 'BRA', name: 'Brasil', flag: flagBr },
  { id: 'ESP', name: 'España', flag: flagEs },
  { id: 'FRA', name: 'Francia', flag: flagFr },
  { id: 'ENG', name: 'Inglaterra', flag: flagGbEng },
  { id: 'GER', name: 'Alemania', flag: flagDe },
  { id: 'ITA', name: 'Italia', flag: flagIt },
  { id: 'JPN', name: 'Japón', flag: flagJp },
  { id: 'USA', name: 'Estados Unidos', flag: flagUs }
]

/**
 * Para la primera versión solo se juega con las nacionalidades europeas. Las
 * demás (y sus ligas, clubes y orígenes) están bloqueadas: se ven, pero no se
 * pueden elegir. Las partidas antiguas con esas nacionalidades se siguen jugando.
 */
export const LOCKED_NATIONALITIES: readonly NationalityId[] = ['ARG', 'BRA', 'JPN', 'USA']

export function isNationalityAvailable(id: NationalityId): boolean {
  return !LOCKED_NATIONALITIES.includes(id)
}

/** Las que se pueden elegir, en el orden de las flechas. */
export const AVAILABLE_NATIONALITIES: readonly Nationality[] = NATIONALITIES.filter((n) =>
  isNationalityAvailable(n.id)
)

export const DEFAULT_NATIONALITY_ID: NationalityId = 'ESP'

export function getNationality(id: NationalityId): Nationality {
  const nationality = NATIONALITIES.find((n) => n.id === id)
  if (!nationality) throw new Error(`Nacionalidad desconocida: ${id}`)
  return nationality
}

/**
 * Devuelve la nacionalidad elegible anterior (-1) o siguiente (+1), dando la
 * vuelta en los extremos. Las bloqueadas se saltan.
 */
export function cycleNationality(currentId: NationalityId, step: 1 | -1): NationalityId {
  const list = AVAILABLE_NATIONALITIES
  const index = list.findIndex((n) => n.id === currentId)
  if (index < 0) return list[step === 1 ? 0 : list.length - 1].id
  const total = list.length
  const next = (((index + step) % total) + total) % total
  return list[next].id
}

// Nombre de cada país en inglés.
for (const n of NATIONALITIES) bindText(n, 'name', NATIONALITIES_EN[n.id])
