import { overallRating } from '../data/attributes'
import { ALL_CLUBS, getClub, type Club, type ClubTier } from '../data/clubs'
import { COUNTRY_CURRENCY, CURRENCIES, formatMoney } from '../data/currencies'
import { isDecisionSeason } from '../data/gameModes'
import { isNationalityAvailable, type NationalityId } from '../data/nationalities'
import type { Career } from '../types/career'
import {
  buildContract,
  contractYearsLeft,
  marketWage,
  renewedContract,
  roleFromMinutes
} from './finance'
import { baseAttributes } from './playerAttributes'
import { clamp, createRng, randomInt, seedFor, type Rng } from './random'
import { playerRating } from './rating'
import { initialFansOffset, logRelationChanges, startEntries } from './relationLog'
import { hasProvenRecord, initialStanding, isCareerOver } from './season'
import { teammatesAfterTransfer } from './teammates'

export interface TransferOffer {
  club: Club
  minutes: 'Pocos' | 'Algunos' | 'Muchos'
  weeklyWage: number
  /** Años de contrato que ofrecen. */
  years: number
  pitch: string
  note?: string
}

export interface TransferMarket {
  offers: TransferOffer[]
  /** Clubes que te habrían llamado pero no lo hacen por decisiones pasadas. */
  closedDoors: Array<{ club: Club; reason: string }>
  /** El club que buscaste en el buscador: si aceptó y, si no, por qué. */
  target?: { club: Club; accepted: boolean; reasons: string[] }
}

// ---------------------------------------------------------------------------
// Buscador de equipos: fichar por un club concreto al acabar la temporada
// ---------------------------------------------------------------------------

/** Fama mínima que pide un club según sus estrellas. */
const FAME_BY_PRESTIGE: Record<number, number> = { 1: 0, 2: 10, 3: 25, 4: 40, 5: 55 }
/** Lo máximo que puede pagar de cláusula un club de cada tipo (euros). */
export const CLAUSE_BUDGET: Record<ClubTier, number> = {
  grande: 150_000_000,
  medio: 25_000_000,
  modesto: 4_000_000
}

/** Media mínima que pide un club para ficharte. */
export function requiredRating(club: Club): number {
  return Math.round(clamp(club.strength - 18, 30, 80))
}

export interface SigningCheck {
  label: string
  ok: boolean
  detail: string
}

/**
 * Requisitos para que un club te fiche al final de la temporada. `atMarket`
 * indica que ya estás en el mercado (el contrato se mira tal cual); si no, se
 * mira cómo quedará al acabar la temporada en curso.
 */
export function signingChecks(career: Career, clubId: string, atMarket = false): SigningCheck[] {
  const club = getClub(clubId)
  const rating = playerRating(career)
  const needRating = requiredRating(club)
  const needFame = FAME_BY_PRESTIGE[club.prestige] ?? 0
  const yearsLeft = atMarket
    ? contractYearsLeft(career)
    : Math.max(0, career.contract.endSeason - career.season)
  const currency = COUNTRY_CURRENCY[getClub(career.clubId).countryId]
  const clause = career.contract.releaseClause
  const budget = CLAUSE_BUDGET[club.tier]
  const checks: SigningCheck[] = [
    { label: 'Tu media', ok: rating >= needRating, detail: `${rating} / ${needRating}` },
    {
      label: 'Fama',
      ok: career.reputation >= needFame,
      detail: `${career.reputation} / ${needFame}`
    },
    yearsLeft === 0
      ? { label: 'Contrato', ok: true, detail: 'Termina tu contrato: sales libre' }
      : {
          label: 'Cláusula',
          ok: clause <= budget,
          detail:
            clause <= budget
              ? `Pueden pagar tu cláusula (${formatMoney(clause, currency)})`
              : `Tu cláusula (${formatMoney(clause, currency)}) es demasiado para ellos`
        }
  ]
  if (rejectedClubIds(career).includes(clubId)) {
    checks.push({
      label: 'Historia',
      ok: false,
      detail: 'No olvidan que rechazaste su oferta de primer contrato'
    })
  }
  return checks
}

/** ¿Se puede marcar este club como objetivo? (no tu club actual ni en la última temporada) */
export function canTarget(career: Career, clubId: string): boolean {
  return (
    clubId !== career.clubId &&
    isCountryOpen(career, getClub(clubId).countryId) &&
    !isCareerOver({ ...career, season: career.season + 1 })
  )
}

/**
 * ¿Puedes fichar por clubes de ese país? Los de las nacionalidades bloqueadas,
 * no; salvo en partidas antiguas que ya juegan allí o son de allí.
 */
export function isCountryOpen(career: Career, countryId: NationalityId): boolean {
  return (
    isNationalityAvailable(countryId) ||
    countryId === getClub(career.clubId).countryId ||
    countryId === career.character.nationalityId
  )
}

/** Marca (o quita, con `null`) el club que quieres fichar al final de la temporada. */
export function setTransferTarget(career: Career, clubId: string | null): Career {
  if (clubId === null) return { ...career, transferTarget: null }
  if (!canTarget(career, clubId)) throw new Error('No puedes fichar por ese club')
  return { ...career, transferTarget: { clubId, season: career.season } }
}

/** ¿Toca decidir ya el fichaje del buscador? (al acabar la temporada en la que lo marcaste) */
export function isTargetDue(career: Career): boolean {
  return !!career.transferTarget && career.season > career.transferTarget.season
}

const TIER_LEVEL: Record<ClubTier, number> = { grande: 58, medio: 48, modesto: 40 }
const TIER_RANK: Record<ClubTier, number> = { grande: 0, medio: 1, modesto: 2 }
const PITCH: Record<ClubTier, string> = {
  grande: 'Un gigante quiere sumarte a su proyecto. Competencia feroz y focos de todo el mundo.',
  medio: 'Un club con ambición que te ve como pieza importante de su crecimiento.',
  modesto: 'Te ofrecen ser la estrella del equipo y jugarlo todo.'
}

/**
 * ¿Hay mercado pendiente antes de empezar la temporada? Desde la 2ª temporada,
 * solo en los veranos que dan paso a una temporada con decisiones.
 */
export function isMarketPending(career: Career): boolean {
  return (
    career.season >= 2 &&
    !isCareerOver(career) &&
    (isDecisionSeason(career.mode, career.season) || isTargetDue(career)) &&
    !career.seasonProgress &&
    career.flags.marketDone !== career.season
  )
}

/** ¿Quedarse implica renovar? (el contrato actual ya terminó) */
export function stayRenews(career: Career): boolean {
  return contractYearsLeft(career) === 0
}

function rejectedClubIds(career: Career): string[] {
  const value = career.flags.rejectedFirstOffers
  return typeof value === 'string' && value ? value.split(',') : []
}

type Region = 'europa' | 'sudamerica' | 'norteamerica' | 'asia'

const REGION: Record<NationalityId, Region> = {
  ESP: 'europa',
  ENG: 'europa',
  FRA: 'europa',
  GER: 'europa',
  ITA: 'europa',
  ARG: 'sudamerica',
  BRA: 'sudamerica',
  USA: 'norteamerica',
  JPN: 'asia'
}

/**
 * Probabilidad relativa de que un club te llame (0 = nunca). Pesa mucho tu
 * nacionalidad: un chaval inglés de 18 años recibe ofertas de clubes ingleses
 * y, solo si ha hecho una gran temporada, de algún club europeo. Las ligas de
 * otros continentes llegan con la experiencia (y la MLS o Japón, al final de
 * la carrera).
 */
export function marketWeight(career: Career, club: Club, rating: number): number {
  const home = career.character.nationalityId
  const current = getClub(career.clubId).countryId
  const age = career.age
  const rep = career.reputation
  if (club.countryId === home) return 6
  if (club.countryId === current) return 4
  const target = REGION[club.countryId]
  const sameRegion = target === REGION[home] || target === REGION[current]
  if (sameRegion) {
    if (age <= 20) return rating >= 7.2 || rep >= 45 ? 1.5 : 0
    return rating >= 6.8 || rep >= 30 ? 2 : 0.7
  }
  if (target === 'europa') {
    // Dar el salto a Europa desde otro continente: hace falta destacar.
    if (age <= 20) return rating >= 7.5 || rep >= 60 ? 1 : 0
    return rating >= 7.2 || rep >= 45 ? 1.2 : 0.3
  }
  if (target === 'sudamerica') return age >= 30 ? 0.3 : 0
  // Estados Unidos y Japón: destino de veteranos.
  if (age >= 30) return 2.5
  if (age >= 24) return 0.4
  return 0
}

/** Elige `count` clubes al azar según su peso (sin repetir). */
function weightedPick(rng: Rng, clubs: Club[], weights: number[], count: number): Club[] {
  const pool = clubs.map((club, i) => ({ club, weight: weights[i] })).filter((x) => x.weight > 0)
  const picked: Club[] = []
  while (picked.length < count && pool.length > 0) {
    const total = pool.reduce((s, x) => s + x.weight, 0)
    let roll = rng() * total
    let index = 0
    while (index < pool.length - 1 && roll >= pool[index].weight) {
      roll -= pool[index].weight
      index++
    }
    picked.push(pool[index].club)
    pool.splice(index, 1)
  }
  return picked
}

/** Ofertas del mercado de verano. Deterministas por partida y temporada. */
export function generateTransferMarket(career: Career): TransferMarket {
  const rng = createRng(seedFor(career.id, 'market', career.season))
  const last = career.history.at(-1)
  const rating = last?.rating ?? 6
  const rep = career.reputation
  const overall = overallRating(baseAttributes(career))

  const tierOpen: Record<ClubTier, boolean> = {
    grande: rep >= 55 || rating >= 7.5,
    medio: rep >= 25 || rating >= 6.8,
    modesto: true
  }

  // Llaman clubes de primera y los de segunda de tu país (o del país donde juegas).
  const country = getClub(career.clubId).countryId
  const home = career.character.nationalityId
  const inFirst = new Set(Object.values(career.divisions).flatMap(([first]) => first))
  const candidates = ALL_CLUBS.filter(
    (c) =>
      c.id !== career.clubId &&
      isCountryOpen(career, c.countryId) &&
      tierOpen[c.tier] &&
      (inFirst.has(c.id) || c.countryId === country || c.countryId === home) &&
      marketWeight(career, c, rating) > 0
  )
  const rejected = rejectedClubIds(career)
  const closedDoors = candidates
    .filter((c) => rejected.includes(c.id))
    .map((club) => ({
      club,
      reason: 'No olvidan que rechazaste su oferta de primer contrato.'
    }))

  const count = clamp(1 + Math.floor(rep / 30) + (rating >= 7.3 ? 1 : 0), 1, 3)

  // El club del buscador: si cumples los requisitos te hace una oferta.
  let target: TransferMarket['target']
  const targetId = isTargetDue(career) ? career.transferTarget?.clubId : undefined
  if (targetId && targetId !== career.clubId) {
    const checks = signingChecks(career, targetId, true)
    target = {
      club: getClub(targetId),
      accepted: checks.every((c) => c.ok),
      reasons: checks.filter((c) => !c.ok).map((c) => `${c.label}: ${c.detail}`)
    }
  }

  const open = candidates.filter((c) => !rejected.includes(c.id) && c.id !== targetId)
  const randomClubs = weightedPick(
    rng,
    open,
    open.map((c) => marketWeight(career, c, rating)),
    count
  ).sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier] || b.prestige - a.prestige)
  const clubs = [...(target?.accepted ? [target.club] : []), ...randomClubs]
  const offers = clubs.map((club): TransferOffer => {
    const diff = overall - TIER_LEVEL[club.tier]
    return {
      club,
      // En un club de 5 estrellas un joven sin aval empieza como suplente.
      minutes:
        club.prestige >= 5 && career.age < 22 && !hasProvenRecord(career)
          ? 'Pocos'
          : diff >= 8
            ? 'Muchos'
            : diff >= 0
              ? 'Algunos'
              : 'Pocos',
      weeklyWage: marketWage(career, club.tier),
      years: randomInt(rng, 2, 5),
      pitch: PITCH[club.tier],
      note:
        club.id === targetId
          ? 'El club que buscaste'
          : club.countryId !== career.character.nationalityId
            ? 'Aventura en el extranjero'
            : undefined
    }
  })

  return { offers, closedDoors, target }
}

/** Flags que son de tu club actual: al fichar por otro se olvidan (v0.17). */
export const CLUB_BOUND_FLAGS = ['coachConflict', 'publicComplaint', 'foreignInterest']

export interface TransferDecision {
  career: Career
  message: string
}

/** Aplica la decisión del mercado: `null` = quedarse en el club actual. */
export function applyTransferDecision(career: Career, clubId: string | null): TransferDecision {
  const flags = { ...career.flags, marketDone: career.season }

  if (clubId === null || clubId === career.clubId) {
    const renews = stayRenews(career)
    const stayed: Career = {
      ...career,
      trust: clamp(career.trust + 4, 0, 100),
      contract: renews ? renewedContract(career) : career.contract,
      transferTarget: null,
      flags: { ...flags, lastMarketDecision: 'stay' }
    }
    return {
      message: renews
        ? 'Renuevas con tu club. El club valora tu compromiso.'
        : 'Te quedas. El club valora tu compromiso.',
      career: logRelationChanges(career, stayed, {
        kind: 'mercado',
        title: 'Mercado de fichajes',
        detail: renews ? 'Renuevas con tu club' : 'Te quedas en el club'
      })
    }
  }

  const club = getClub(clubId)
  const offer = generateTransferMarket(career).offers.find((o) => o.club.id === clubId)
  if (!offer) throw new Error(`El club ${clubId} no te ha hecho ninguna oferta`)
  const brokePromise = career.flags.loyalToClub === true
  const transfers = typeof career.flags.transfers === 'number' ? career.flags.transfers : 0
  const oldCurrency = COUNTRY_CURRENCY[getClub(career.clubId).countryId]
  const newCurrency = COUNTRY_CURRENCY[club.countryId]
  const exchange =
    oldCurrency !== newCurrency
      ? ` Tu dinero se cambia a ${CURRENCIES[newCurrency].name}: ${formatMoney(career.money, newCurrency)}.`
      : ''
  // En el club nuevo el míster y la afición empiezan de cero (v0.17): se olvidan
  // las cuentas pendientes del club anterior (el choque con el míster, la queja
  // pública y el interés de otro club que se filtró a la grada).
  const keptFlags = { ...flags }
  for (const key of CLUB_BOUND_FLAGS) delete keptFlags[key]
  const reputation = clamp(career.reputation - (brokePromise ? 6 : 0), 0, 100)
  const moved: Career = {
    ...career,
    ...teammatesAfterTransfer(career, clubId, career.season),
    // En el club nuevo no eres el capitán (hay que ganárselo otra vez).
    captaincy: null,
    transferTarget: null,
    clubId,
    contract: buildContract(
      clubId,
      offer.weeklyWage,
      roleFromMinutes(offer.minutes),
      career.season,
      offer.years
    ),
    // En un club nuevo hay que ganarse otra vez la confianza del entrenador.
    trust: initialStanding(club.tier, career.originId).trust,
    morale: clamp(career.morale + 5, 0, 100),
    reputation,
    fansOffset: initialFansOffset(reputation),
    flags: {
      ...keptFlags,
      lastMarketDecision: 'transfer',
      transfers: transfers + 1,
      loyalToClub: false,
      ...(brokePromise ? { brokenPromise: true } : {})
    }
  }
  return {
    career: {
      ...moved,
      relationLog: [...(career.relationLog ?? []), ...startEntries(moved, `Llegas a ${club.name}`)]
    },
    message:
      (brokePromise
        ? `Fichas por ${club.name}. Tu antigua afición no olvida que dijiste "aquí soy feliz".`
        : `Fichas por ${club.name}. Nueva ciudad, nuevo vestuario, nuevo reto.`) + exchange
  }
}
