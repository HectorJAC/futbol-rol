import type { NationalityId } from '../nationalities'

/**
 * Club de una liga. Los nombres se parecen a los reales pero cambian una o dos
 * letras (p. ej. "FC Barkelone"), porque el juego no tiene licencias.
 */
export interface ClubSeed {
  /** '<país en minúsculas>-<slug>', p. ej. 'esp-fc-barkelone'. Solo [a-z0-9-]. */
  id: string
  name: string
  /** Ciudad real del club (en español si tiene forma española: Múnich, Londres…). */
  city: string
  /** Nivel del equipo en la simulación (≈50–88). */
  strength: number
  /** Colores principales [primario, secundario] en #rrggbb. */
  colors: [string, string]
  /** Id del rival clásico (mismo país), si lo tiene. Los derbis de la misma ciudad se detectan solos. */
  rival?: string
}

export interface CountryLeagues {
  countryId: NationalityId
  /** "Primera División de España" */
  division1Name: string
  /** "Segunda División de España" */
  division2Name: string
  /** "Copa de España" */
  cupName: string
  division1: ClubSeed[]
  division2: ClubSeed[]
  /** Clubes que ofrecen el primer contrato: [grande de primera, medio de primera, club de segunda]. */
  firstOffers: [string, string, string]
}
