import type { NationalityId } from './nationalities'

export type CurrencyId = 'EUR' | 'GBP' | 'USD' | 'ARS' | 'BRL' | 'JPY'

export interface Currency {
  id: CurrencyId
  name: string
  /** Unidades de esta moneda por 1 euro (cambio fijo del juego). */
  perEuro: number
  /** Símbolo delante ("£ 1.000") o detrás ("1.000 €"). */
  prefix?: string
  suffix?: string
}

export const CURRENCIES: Record<CurrencyId, Currency> = {
  EUR: { id: 'EUR', name: 'euros', perEuro: 1, suffix: ' €' },
  GBP: { id: 'GBP', name: 'libras', perEuro: 0.85, prefix: '£ ' },
  USD: { id: 'USD', name: 'dólares', perEuro: 1.1, prefix: 'US$ ' },
  ARS: { id: 'ARS', name: 'pesos argentinos', perEuro: 1100, prefix: 'AR$ ' },
  BRL: { id: 'BRL', name: 'reales', perEuro: 6, prefix: 'R$ ' },
  JPY: { id: 'JPY', name: 'yenes', perEuro: 160, prefix: '¥ ' }
}

/** Moneda de cada país en el que se puede jugar. */
export const COUNTRY_CURRENCY: Record<NationalityId, CurrencyId> = {
  ARG: 'ARS',
  BRA: 'BRL',
  ESP: 'EUR',
  FRA: 'EUR',
  ENG: 'GBP',
  GER: 'EUR',
  ITA: 'EUR',
  JPN: 'JPY',
  USA: 'USD'
}

const group = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

/**
 * Formatea una cantidad (el juego la guarda en euros) en la moneda indicada:
 * "1.250.000 €", "£ 1.062.500", "AR$ 1.375.000.000".
 */
export function formatMoney(amountEur: number, currency: CurrencyId = 'EUR'): string {
  const c = CURRENCIES[currency]
  const value = Math.round(amountEur * c.perEuro)
  const text = group(Math.abs(value))
  return `${value < 0 ? '−' : ''}${c.prefix ?? ''}${text}${c.suffix ?? ''}`
}

/** "25,3 M€", "£ 21,5 M", "AR$ 27.830 M". */
export function formatBigMoney(amountEur: number, currency: CurrencyId = 'EUR'): string {
  const c = CURRENCIES[currency]
  const value = amountEur * c.perEuro
  if (value < 1_000_000) return formatMoney(amountEur, currency)
  const millions = value / 1_000_000
  const text = millions.toLocaleString('es-ES', {
    maximumFractionDigits: millions >= 100 ? 0 : 1
  })
  return currency === 'EUR' ? `${text} M€` : `${c.prefix ?? ''}${text} M`
}
