import type { NationalityId } from './nationalities'
import { bindText } from '../i18n/bind'
import { CURRENCIES_EN } from '../i18n/en/data'
import { getLanguage } from '../i18n/language'

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

/** Miles con punto en español ("1.250.000") y con coma en inglés ("1,250,000"). */
const group = (n: number): string =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, getLanguage() === 'en' ? ',' : '.')

/** En inglés el símbolo va delante y pegado: "€1,250,000", "£1,062,500". */
function symbols(c: Currency): { prefix: string; suffix: string } {
  if (getLanguage() !== 'en') return { prefix: c.prefix ?? '', suffix: c.suffix ?? '' }
  const symbol = (c.prefix ?? c.suffix ?? '').trim()
  return { prefix: symbol, suffix: '' }
}

/**
 * Formatea una cantidad (el juego la guarda en euros) en la moneda indicada:
 * "1.250.000 €", "£ 1.062.500", "AR$ 1.375.000.000".
 */
export function formatMoney(amountEur: number, currency: CurrencyId = 'EUR'): string {
  const c = CURRENCIES[currency]
  const value = Math.round(amountEur * c.perEuro)
  const text = group(Math.abs(value))
  const { prefix, suffix } = symbols(c)
  return `${value < 0 ? '−' : ''}${prefix}${text}${suffix}`
}

/** "25,3 M€", "£ 21,5 M", "AR$ 27.830 M". */
export function formatBigMoney(amountEur: number, currency: CurrencyId = 'EUR'): string {
  const c = CURRENCIES[currency]
  const value = amountEur * c.perEuro
  if (value < 1_000_000) return formatMoney(amountEur, currency)
  const millions = value / 1_000_000
  const english = getLanguage() === 'en'
  const text = millions.toLocaleString(english ? 'en-GB' : 'es-ES', {
    maximumFractionDigits: millions >= 100 ? 0 : 1
  })
  if (english) return `${symbols(c).prefix}${text}m`
  return currency === 'EUR' ? `${text} M€` : `${c.prefix ?? ''}${text} M`
}

// Nombre de cada moneda en inglés (p. ej. al cambiar de país).
for (const c of Object.values(CURRENCIES)) bindText(c, 'name', CURRENCIES_EN[c.id])
