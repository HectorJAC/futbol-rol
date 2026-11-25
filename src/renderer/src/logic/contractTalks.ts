import { getClub } from '../data/clubs'
import type { Career } from '../types/career'
import { buildContract, contractYearsLeft, marketWage } from './finance'
import { clamp, createRng, seedFor } from './random'
import { isCareerOver, minutesShare } from './season'

/** Lo que puedes pedir al club: una subida pequeña, lo que vale tu rendimiento o mucho más. */
export type RaiseLevel = 'moderada' | 'mercado' | 'ambiciosa'

export const RAISE_LEVELS: readonly RaiseLevel[] = ['moderada', 'mercado', 'ambiciosa']

export interface RaiseOption {
  level: RaiseLevel
  /** Sueldo semanal que pides. */
  weeklyWage: number
  /** Probabilidad de que el club diga que sí (0–1). */
  chance: number
  /** Lo que pierdes si te dicen que no. */
  onReject: { trust: number; morale: number }
}

/** Si el club acepta, tu moral sube. */
export const RAISE_ACCEPTED_MORALE = 6

const REJECT: Record<RaiseLevel, { trust: number; morale: number }> = {
  moderada: { trust: -1, morale: -3 },
  mercado: { trust: -3, morale: -4 },
  ambiciosa: { trust: -5, morale: -5 }
}

const roundTo = (value: number, step: number): number => Math.round(value / step) * step

/**
 * Sueldo que el club cree que mereces: el de mercado para tu fama, ajustado
 * por tu última temporada aquí (nota y goles) y por lo que juegas.
 */
export function deservedWage(career: Career): number {
  const tier = getClub(career.clubId).tier
  const base = Math.max(career.contract.weeklyWage, marketWage(career, tier))
  const last = career.history.at(-1)
  const lastHere = last && last.clubId === career.clubId ? last : undefined
  const rating = lastHere?.rating ?? 6.8
  const goals = Math.min(lastHere?.goals ?? 0, 30)
  const performance = clamp(
    1 + (rating - 6.8) * 0.3 + (minutesShare(career) - 0.5) * 0.4 + goals * 0.005,
    0.75,
    1.6
  )
  return roundTo(base * performance, 50)
}

/** Las tres peticiones posibles, cada una con su sueldo y su probabilidad. */
export function raiseOptions(career: Career): RaiseOption[] {
  const current = career.contract.weeklyWage
  const deserved = deservedWage(career)
  const moderada = roundTo(current * 1.1, 50)
  const mercado = Math.max(roundTo(current * 1.2, 50), deserved, moderada + 50)
  const ambiciosa = Math.max(roundTo(current * 1.5, 50), roundTo(deserved * 1.3, 50), mercado + 50)
  const wages: Record<RaiseLevel, number> = { moderada, mercado, ambiciosa }
  return RAISE_LEVELS.map((level) => {
    const wage = wages[level]
    const chance = clamp(
      0.55 + ((deserved - wage) / deserved) * 1.5 + (career.trust - 50) / 150,
      0.05,
      0.95
    )
    return { level, weeklyWage: wage, chance, onReject: REJECT[level] }
  })
}

export type RaiseCheck = { ok: true } | { ok: false; reason: string }

/** Solo se puede pedir una vez por temporada, y no la misma temporada en que firmaste. */
export function canRequestRaise(career: Career): RaiseCheck {
  if (isCareerOver(career)) return { ok: false, reason: 'Tu carrera ha terminado.' }
  if (career.flags.raiseSeason === career.season) {
    return { ok: false, reason: 'Ya lo pediste esta temporada. Vuelve a intentarlo la próxima.' }
  }
  if (career.contract.signedSeason === career.season) {
    return {
      ok: false,
      reason: 'Acabas de firmar tu contrato: espera a la próxima temporada para pedir una mejora.'
    }
  }
  return { ok: true }
}

/**
 * Pide la mejora. Si el club acepta, firmas un contrato nuevo con ese sueldo
 * (y, como mínimo, 3 temporadas). Si no, bajan la confianza y la moral. La
 * respuesta usa una semilla fija: recargar la partida no la cambia.
 */
export function requestRaise(
  career: Career,
  level: RaiseLevel
): { career: Career; accepted: boolean } {
  const check = canRequestRaise(career)
  if (!check.ok) throw new Error(check.reason)
  const option = raiseOptions(career).find((o) => o.level === level)
  if (!option) throw new Error(`Petición desconocida: ${level}`)
  const rng = createRng(seedFor(career.id, 'raise', career.season, RAISE_LEVELS.indexOf(level)))
  const accepted = rng() < option.chance
  const flags = {
    ...career.flags,
    raiseSeason: career.season,
    raiseLevel: level,
    raiseResult: accepted ? 'aceptada' : 'rechazada'
  }
  if (!accepted) {
    return {
      accepted,
      career: {
        ...career,
        flags,
        trust: clamp(career.trust + option.onReject.trust, 0, 100),
        morale: clamp(career.morale + option.onReject.morale, 0, 100)
      }
    }
  }
  const years = Math.max(contractYearsLeft(career), 3)
  return {
    accepted,
    career: {
      ...career,
      flags,
      morale: clamp(career.morale + RAISE_ACCEPTED_MORALE, 0, 100),
      contract: buildContract(
        career.clubId,
        option.weeklyWage,
        career.contract.role,
        career.season,
        years
      )
    }
  }
}
