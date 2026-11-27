/**
 * Aleatoriedad reproducible: la misma semilla da siempre los mismos resultados.
 * Así una decisión no se puede "repetir" cargando la partida (estilo Ironman)
 * y los tests son deterministas.
 */

export type Rng = () => number

/** Generador mulberry32: rápido y suficiente para un juego. Devuelve números en [0, 1). */
export function createRng(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Convierte un texto (p. ej. el id de la partida) en una semilla numérica. */
export function hashString(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Semilla para un momento concreto de la carrera. */
export function seedFor(careerId: string, ...parts: Array<string | number>): number {
  return hashString([careerId, ...parts].join('|'))
}

export function randomInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

/** Baraja una copia del array (Fisher–Yates). */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/** Número de goles de un partido (distribución de Poisson con media `lambda`). */
export function poisson(rng: Rng, lambda: number): number {
  const limit = Math.exp(-lambda)
  let k = 0
  let p = rng()
  while (p > limit && k < 10) {
    k++
    p *= rng()
  }
  return k
}

/** Elige un índice según los pesos dados. */
export function weightedIndex(rng: Rng, weights: readonly number[]): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = rng() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r < 0) return i
  }
  return weights.length - 1
}
