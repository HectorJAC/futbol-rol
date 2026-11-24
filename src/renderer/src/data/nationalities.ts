import flagAr from 'flag-icons/flags/4x3/ar.svg'
import flagBr from 'flag-icons/flags/4x3/br.svg'
import flagEs from 'flag-icons/flags/4x3/es.svg'
import flagFr from 'flag-icons/flags/4x3/fr.svg'
import flagGbEng from 'flag-icons/flags/4x3/gb-eng.svg'
import flagDe from 'flag-icons/flags/4x3/de.svg'
import flagIt from 'flag-icons/flags/4x3/it.svg'
import flagJp from 'flag-icons/flags/4x3/jp.svg'
import flagUs from 'flag-icons/flags/4x3/us.svg'

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

export const DEFAULT_NATIONALITY_ID: NationalityId = 'ARG'

export function getNationality(id: NationalityId): Nationality {
  const nationality = NATIONALITIES.find((n) => n.id === id)
  if (!nationality) throw new Error(`Nacionalidad desconocida: ${id}`)
  return nationality
}

/** Devuelve la nacionalidad anterior (-1) o siguiente (+1), dando la vuelta en los extremos. */
export function cycleNationality(currentId: NationalityId, step: 1 | -1): NationalityId {
  const index = NATIONALITIES.findIndex((n) => n.id === currentId)
  const total = NATIONALITIES.length
  const next = (((index + step) % total) + total) % total
  return NATIONALITIES[next].id
}
