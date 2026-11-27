import { ATTRIBUTES, DC_WEIGHTS, type Attributes } from '../data/attributes'
import { formatBigMoney, type CurrencyId } from '../data/currencies'
import type { Career, SeasonRecord } from '../types/career'
import { baseAttributes } from './playerAttributes'
import { clamp } from './random'

/**
 * Valoración solo por atributos (0–99). Un juvenil de media 8 ronda 45 y un
 * delantero con todo a 18 llega a 90.
 */
export function attributeScore(attributes: Attributes): number {
  const weighted = ATTRIBUTES.reduce((sum, { id }) => sum + attributes[id] * DC_WEIGHTS[id], 0)
  return clamp(45 + (weighted - 8) * 4.5, 1, 99)
}

/** Temporadas recientes con minutos (las dos últimas). */
function recentSeasons(history: SeasonRecord[]): SeasonRecord[] {
  return history.filter((r) => r.matches >= 5).slice(-2)
}

/**
 * Valoración por rendimiento (0–99): nota media, goles y asistencias por
 * partido de las últimas temporadas, fama y títulos de toda la carrera.
 * `null` si aún no hay temporadas con minutos.
 */
export function performanceScore(career: Career): number | null {
  const recent = recentSeasons(career.history)
  if (recent.length === 0) return null
  const matches = recent.reduce((s, r) => s + r.matches, 0)
  const rating = recent.reduce((s, r) => s + r.rating * r.matches, 0) / matches
  const goals = recent.reduce((s, r) => s + r.goals, 0) / matches
  const assists = recent.reduce((s, r) => s + r.assists, 0) / matches
  const titles = career.history.reduce((s, r) => s + r.trophies.length, 0)
  return clamp(
    40 +
      (rating - 6.3) * 16 +
      goals * 18 +
      assists * 10 +
      career.reputation * 0.15 +
      Math.min(6, titles * 0.3),
    20,
    99
  )
}

/**
 * Media del jugador (la que se ve en el juego): atributos y, cuando ya hay
 * carrera, también estadísticas, fama y títulos.
 */
export function playerRating(career: Career): number {
  const attributes = attributeScore(baseAttributes(career))
  const performance = performanceScore(career)
  const value = performance === null ? attributes : attributes * 0.55 + performance * 0.45
  return Math.round(clamp(value, 1, 99))
}

/** Valor de mercado en euros: media, edad, fama y años de contrato. */
export function marketValue(career: Career): number {
  const rating = playerRating(career)
  const base = 1_000_000 * Math.pow(5, (rating - 60) / 10)
  const age = career.age
  const ageFactor =
    age <= 21 ? 1.3 : age <= 25 ? 1.15 : age <= 29 ? 1 : age <= 31 ? 0.7 : age <= 33 ? 0.45 : 0.25
  const fame = 0.8 + career.reputation / 250
  const yearsLeft = Math.max(0, career.contract.endSeason - career.season + 1)
  const contract = yearsLeft <= 1 ? 0.75 : 1
  return roundValue(base * ageFactor * fame * contract)
}

/** Redondea a cifras "de mercado": 2 cifras significativas. */
export function roundValue(value: number): number {
  if (value <= 0) return 0
  const digits = Math.floor(Math.log10(value)) - 1
  const step = Math.pow(10, Math.max(3, digits))
  return Math.round(value / step) * step
}

/** "25,3 M€", "850.000 €" (o en la moneda del país donde juegas). */
export function formatMarketValue(value: number, currency: CurrencyId = 'EUR'): string {
  return formatBigMoney(value, currency)
}
