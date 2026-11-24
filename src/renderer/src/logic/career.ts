import {
  BASE_ATTRIBUTES,
  combineScaled,
  spentPoints,
  type AttributeId,
  type Attributes
} from '../data/attributes'
import { getClubOffers } from '../data/clubs'
import { attributeScale, creationCapFor, freePointsFor, type GameMode } from '../data/gameModes'
import { getOrigin, type OriginId } from '../data/origins'
import type { Career } from '../types/career'
import type { Character } from '../types/character'
import { initialContinentalTeams, initialDivisions } from './competitions'
import { buildContract, roleFromMinutes } from './finance'
import { initialStanding } from './season'
import { generateTeammates } from './teammates'

type ModeScale = Pick<GameMode, 'id' | 'seasons' | 'decisionInterval'>

/**
 * Atributos finales: base de DC + origen (escalados al modo) + puntos
 * repartidos por el jugador. Sin modo, en la escala de 20.
 */
export function computeAttributes(
  originId: OriginId,
  allocation: Attributes,
  mode?: ModeScale
): Attributes {
  const max = mode ? attributeScale(mode) : 20
  return combineScaled(max, BASE_ATTRIBUTES, getOrigin(originId).modifiers, allocation)
}

export function remainingPoints(allocation: Attributes, mode?: ModeScale): number {
  return (mode ? freePointsFor(mode) : 8) - spentPoints(allocation)
}

/** ¿Se puede sumar (+1) o quitar (-1) un punto a este atributo? */
export function canAllocate(
  originId: OriginId,
  allocation: Attributes,
  id: AttributeId,
  step: 1 | -1,
  mode?: ModeScale
): boolean {
  if (step === -1) return allocation[id] > 0
  if (remainingPoints(allocation, mode) <= 0) return false
  return computeAttributes(originId, allocation, mode)[id] < (mode ? creationCapFor(mode) : 15)
}

/** Id de archivo seguro a partir del nombre: "Iñaki Núñez" → "inaki-nunez-<marca de tiempo>". */
export function generateCareerId(
  name: string,
  now: Date,
  random: () => number = Math.random
): string {
  const slug =
    name
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '') // quita tildes: "Núñez" → "Nunez"
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'jugador'
  const suffix = Math.floor(random() * 36 ** 3)
    .toString(36)
    .padStart(3, '0')
  return `${slug}-${now.getTime().toString(36)}${suffix}`
}

interface NewCareerInput {
  character: Character
  mode: GameMode
  originId: OriginId
  allocation: Attributes
  clubId: string
}

/** Crea la carrera al firmar el primer contrato. */
export function createCareer(input: NewCareerInput, now: Date = new Date()): Career {
  const { character, mode, originId, allocation, clubId } = input
  const offers = getClubOffers(character.nationalityId, originId)
  const chosen = offers.find((o) => o.club.id === clubId)
  if (!chosen) throw new Error(`El club ${clubId} no ofreció contrato`)

  const flags: Career['flags'] = {
    // Semillas de consecuencias: los clubes rechazados lo recordarán.
    rejectedFirstOffers: offers
      .filter((o) => o.club.id !== clubId)
      .map((o) => o.club.id)
      .join(',')
  }
  if (chosen.originTag) flags.firstClubOriginBond = true

  const timestamp = now.toISOString()
  const divisions = initialDivisions()
  return {
    id: generateCareerId(character.name, now),
    createdAt: timestamp,
    updatedAt: timestamp,
    character,
    originId,
    mode,
    attributes: computeAttributes(originId, allocation, mode),
    clubId,
    age: getOrigin(originId).startAge,
    season: 1,
    ...initialStanding(chosen.club.tier, originId),
    money: 0,
    contract: buildContract(clubId, chosen.weeklyWage, roleFromMinutes(chosen.minutes), 1, 3),
    purchases: [],
    divisions,
    continentalTeams: initialContinentalTeams(divisions),
    pendingPoints: 0,
    seasonProgress: null,
    history: [],
    flags,
    teammates: generateTeammates(clubId, 1),
    exTeammates: [],
    captaincy: null,
    transferTarget: null
  }
}
