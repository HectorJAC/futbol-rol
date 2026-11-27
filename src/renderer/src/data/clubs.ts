import { LEAGUES, type ClubSeed } from './leagues'
import { NATIONALITIES, type NationalityId } from './nationalities'
import { getOrigin, type OriginId } from './origins'
import { createRng } from '../logic/random'

export type ClubTier = 'grande' | 'medio' | 'modesto'
export type Division = 1 | 2

export interface Club {
  id: string
  /** Parecido al nombre real pero con una o dos letras cambiadas (sin licencias). */
  name: string
  city: string
  countryId: NationalityId
  tier: ClubTier
  /** 1–5 estrellas. */
  prestige: number
  /** Calidad de la formación de jóvenes, 1–5. */
  development: number
  colors: [string, string]
  /** Nivel del equipo en los partidos simulados (≈50–88). */
  strength: number
  /** División en la que empieza la partida (luego hay ascensos y descensos). */
  division: Division
  /** Rival clásico, si lo tiene. */
  rival?: string
}

export interface ClubOffer {
  club: Club
  /** Papel del club en la oferta (primer contrato): grande, medio o modesto. */
  slot: ClubTier
  /** Minutos que el club promete a un juvenil. */
  minutes: 'Pocos' | 'Algunos' | 'Muchos'
  /** Sueldo semanal orientativo. */
  weeklyWage: number
  pitch: string
  /** Vínculo especial con el origen del jugador, si lo hay. */
  originTag?: string
}

export function tierFromStrength(strength: number): ClubTier {
  return strength >= 80 ? 'grande' : strength >= 68 ? 'medio' : 'modesto'
}

function toClub(seed: ClubSeed, countryId: NationalityId, division: Division): Club {
  const prestige =
    seed.strength >= 85
      ? 5
      : seed.strength >= 78
        ? 4
        : seed.strength >= 70
          ? 3
          : seed.strength >= 62
            ? 2
            : 1
  return {
    ...seed,
    countryId,
    division,
    tier: tierFromStrength(seed.strength),
    prestige,
    development: prestige >= 4 ? 4 : 3
  }
}

/** Todos los clubes del juego: primera y segunda división de cada país. */
export const ALL_CLUBS: readonly Club[] = NATIONALITIES.flatMap(({ id }) => [
  ...LEAGUES[id].division1.map((seed) => toClub(seed, id, 1)),
  ...LEAGUES[id].division2.map((seed) => toClub(seed, id, 2))
])

const CLUB_INDEX = new Map(ALL_CLUBS.map((c) => [c.id, c]))

export function getClub(id: string): Club {
  const found = CLUB_INDEX.get(id)
  if (!found) throw new Error(`Club desconocido: ${id}`)
  return found
}

export function isClubId(id: unknown): id is string {
  return typeof id === 'string' && CLUB_INDEX.has(id)
}

/** Clubes con los que empieza cada división (ordenados del más fuerte al más débil). */
export function initialDivision(countryId: NationalityId, division: Division): string[] {
  const seeds = division === 1 ? LEAGUES[countryId].division1 : LEAGUES[countryId].division2
  return seeds.map((s) => s.id)
}

export function divisionName(countryId: NationalityId, division: Division): string {
  return division === 1 ? LEAGUES[countryId].division1Name : LEAGUES[countryId].division2Name
}

export function cupName(countryId: NationalityId): string {
  return LEAGUES[countryId].cupName
}

/** Los clubes más fuertes del país (para los partidos importantes). */
export function biggestClubs(countryId: NationalityId, count = 3): string[] {
  return ALL_CLUBS.filter((c) => c.countryId === countryId)
    .sort((a, b) => b.strength - a.strength || a.id.localeCompare(b.id))
    .slice(0, count)
    .map((c) => c.id)
}

/** ¿Son dos clubes de la misma ciudad (y del mismo país)? */
export function isSameCity(clubId: string, opponentId: string): boolean {
  const club = getClub(clubId)
  const opponent = getClub(opponentId)
  return club.city === opponent.city && club.countryId === opponent.countryId
}

/** ¿Es un clásico o un derbi de la misma ciudad? */
export function isRivalry(clubId: string, opponentId: string): 'clasico' | 'derbi' | null {
  const club = getClub(clubId)
  const opponent = getClub(opponentId)
  if (club.rival === opponentId || opponent.rival === clubId) return 'clasico'
  if (club.city === opponent.city && club.countryId === opponent.countryId) return 'derbi'
  return null
}

const SLOT_TERMS: Record<ClubTier, Pick<ClubOffer, 'minutes' | 'weeklyWage'>> = {
  grande: { minutes: 'Pocos', weeklyWage: 2500 },
  medio: { minutes: 'Algunos', weeklyWage: 1200 },
  modesto: { minutes: 'Muchos', weeklyWage: 600 }
}

/** Texto de la oferta según su papel y la división del club. */
function pitchFor(slot: ClubTier, division: Division): string {
  if (slot === 'grande') {
    return 'Un gigante con vitrinas llenas. Empezarás en el filial y tendrás que ganarte cada minuto.'
  }
  if (slot === 'medio') {
    return division === 1
      ? 'Un club de primera que busca jóvenes con hambre. Rotarás con el primer equipo.'
      : 'Un club ambicioso de segunda que quiere subir. Rotarás con el primer equipo.'
  }
  return division === 1
    ? 'Un club humilde de primera que te quiere como titular desde el primer día.'
    : 'Un club de segunda que te quiere como titular desde el primer día. Escaparate perfecto.'
}

const SLOTS: ClubTier[] = ['grande', 'medio', 'modesto']

/**
 * Tres clubes al azar de tu país para el primer contrato: uno de 5 estrellas,
 * uno de 4 o 3 y uno de 3 o 2. En los países sin clubes de 5 estrellas se
 * cuenta desde el mejor nivel del país (4–3–2 o 3–2–1).
 */
export function randomFirstOffers(countryId: NationalityId, seed: number): string[] {
  const rng = createRng(seed)
  const clubs = ALL_CLUBS.filter((c) => c.countryId === countryId)
  const top = Math.max(...clubs.map((c) => c.prestige))
  const levels = [[top], [top - 1, top - 2], [top - 2, top - 3]]
  const picked: string[] = []
  for (const options of levels) {
    // Primero las estrellas (mitad y mitad), luego el club; si no hay, el otro nivel.
    const order = rng() < 0.5 ? options : [...options].reverse()
    const fallback = clubs
      .filter((c) => c.prestige <= Math.min(...options))
      .sort((a, b) => b.prestige - a.prestige)
    const pool =
      order
        .map((stars) => clubs.filter((c) => c.prestige === stars && !picked.includes(c.id)))
        .find((list) => list.length > 0) ?? fallback.filter((c) => !picked.includes(c.id))
    if (pool.length > 0) picked.push(pool[Math.floor(rng() * pool.length)].id)
  }
  return picked
}

/** Semilla nueva para las ofertas de una partida. */
export function newOfferSeed(): number {
  return Math.floor(Math.random() * 2 ** 31)
}

/**
 * Ofertas de primer contrato: un grande, un club medio y uno modesto. Con
 * `seed`, los clubes salen al azar (cada partida es distinta); sin ella, los
 * de siempre (partidas antiguas y tests).
 */
export function getClubOffers(
  nationalityId: NationalityId,
  originId: OriginId,
  seed?: number
): ClubOffer[] {
  const bond = getOrigin(originId).clubBond
  const ids =
    seed === undefined ? LEAGUES[nationalityId].firstOffers : randomFirstOffers(nationalityId, seed)
  return ids.map((id, i) => {
    const slot = SLOTS[i]
    const club = getClub(id)
    return {
      club,
      slot,
      ...SLOT_TERMS[slot],
      pitch: pitchFor(slot, club.division),
      originTag: bond && slot === bond.tier ? bond.tag : undefined
    }
  })
}
