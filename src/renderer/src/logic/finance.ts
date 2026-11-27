import { ATTRIBUTES, clampAttribute, type Attributes } from '../data/attributes'
import { getClub, type ClubTier } from '../data/clubs'
import { isDecisionSeason } from '../data/gameModes'
import { getShopItem, SHOP_ITEMS, SHOP_SCALE, type ShopItem } from '../data/shop'
import type {
  Career,
  Contract,
  ContractRole,
  Purchase,
  SeasonEarnings,
  SeasonRecord
} from '../types/career'
import { careerScale } from './playerAttributes'
import { clamp, createRng, seedFor, shuffle } from './random'
import { t } from '../i18n'

/** Sueldo semanal de referencia por tipo de club al empezar. */
export const TIER_WAGE: Record<ClubTier, number> = { grande: 2500, medio: 1200, modesto: 600 }

const COLLECTIVE_CLUB_TROPHIES = [
  'liga',
  'segunda',
  'copa',
  'continental',
  'copa-europa',
  'conferencia',
  'intercontinental'
]

/** El sueldo se cobra en 12 mensualidades (de agosto a julio). */
export function monthlyWage(contract: Pick<Contract, 'weeklyWage'>): number {
  return Math.round((contract.weeklyWage * 52) / 12)
}

const roundTo = (value: number, step: number): number => Math.round(value / step) * step

/** Sueldo que pagaría un club de ese tipo según tu fama y tus años de carrera. */
export function marketWage(career: Pick<Career, 'reputation' | 'season'>, tier: ClubTier): number {
  const growth = 1 + (career.reputation / 100) * 0.8 + (career.season - 1) * 0.15
  return roundTo(TIER_WAGE[tier] * growth, 50)
}

export function roleFromMinutes(minutes: 'Pocos' | 'Algunos' | 'Muchos'): ContractRole {
  return minutes === 'Muchos' ? 'Titular' : minutes === 'Algunos' ? 'Rotación' : 'Promesa'
}

/** Contrato completo a partir del sueldo semanal: primas y cláusula salen del sueldo. */
export function buildContract(
  clubId: string,
  weeklyWage: number,
  role: ContractRole,
  signedSeason: number,
  years: number
): Contract {
  return {
    clubId,
    signedSeason,
    endSeason: signedSeason + years - 1,
    weeklyWage,
    goalBonus: roundTo(weeklyWage * 0.4, 50),
    titleBonus: roundTo(weeklyWage * 6, 500),
    role,
    releaseClause: roundTo(weeklyWage * 52 * 8, 10_000)
  }
}

/** Años que quedan de contrato contando la temporada actual. */
export function contractYearsLeft(career: Career): number {
  return Math.max(0, career.contract.endSeason - career.season + 1)
}

/** Renovación con el club actual: sube el sueldo (nunca lo baja). */
export function renewedContract(career: Career, years = 3): Contract {
  const tier = getClub(career.clubId).tier
  const wage = Math.max(roundTo(career.contract.weeklyWage * 1.1, 50), marketWage(career, tier))
  return buildContract(career.clubId, wage, career.contract.role, career.season, years)
}

/**
 * Tras cerrar una temporada (`career` ya está en la siguiente): si el contrato
 * terminó y no hay mercado este verano, se renueva solo.
 */
export function contractAfterSeason(career: Career): Contract {
  const expired = career.contract.endSeason < career.season
  const marketComing = isDecisionSeason(career.mode, career.season)
  if (!expired || marketComing || career.season > career.mode.seasons) return career.contract
  return renewedContract(career, 2)
}

/** Lo que cobraste en la temporada: sueldo, primas por gol y por título, y eventos. */
export function seasonEarnings(career: Career, record: SeasonRecord): SeasonEarnings {
  const c = career.contract
  const titles = record.trophies.filter((t) => COLLECTIVE_CLUB_TROPHIES.includes(t)).length
  return {
    salary: monthlyWage(c) * 12,
    goalBonus: c.goalBonus * record.goals,
    titleBonus: c.titleBonus * titles,
    events: career.seasonProgress?.eventMoney ?? 0
  }
}

// ---------------------------------------------------------------------------
// Tienda de mejoras
// ---------------------------------------------------------------------------

/** Mejoras que ofrece la tienda en cada temporada. */
export const SHOP_SIZE = 15
/** De ellas, cuántas mejoran atributos (la tienda se centra en entrenar). */
export const SHOP_ATTRIBUTE_ITEMS = 11

/**
 * Selección de la tienda de esta temporada. Cambia cada temporada: lo que
 * compraste la temporada pasada se sustituye por otras cosas, lo que ya tienes
 * para siempre no vuelve y las compras de lujo aparecen más adelante. La
 * mayoría de lo que se ofrece mejora atributos.
 *
 * Dentro de la temporada es siempre la misma: no depende de lo que compres en
 * ella (lo comprado sigue en su sitio, marcado como comprado) ni de tus atributos.
 */
export function shopOffer(career: Career): ShopItem[] {
  const before = career.purchases.filter((p) => p.season < career.season)
  const boughtLast = before.filter((p) => p.season === career.season - 1).map((p) => p.itemId)
  const ownedForever = before
    .filter((p) => getShopItem(p.itemId).limit === 'once')
    .map((p) => p.itemId)
  const pool = SHOP_ITEMS.filter(
    (item) =>
      (item.minSeason ?? 1) <= career.season &&
      !ownedForever.includes(item.id) &&
      !boughtLast.includes(item.id)
  )
  const rng = createRng(seedFor(career.id, 'shop', career.season))
  const improves = (item: ShopItem): boolean => Object.keys(item.attributes ?? {}).length > 0
  const training = shuffle(rng, pool.filter(improves)).slice(0, SHOP_ATTRIBUTE_ITEMS)
  const others = shuffle(
    rng,
    pool.filter((item) => !training.includes(item))
  ).slice(0, SHOP_SIZE - training.length)
  const items = [...training, ...others]
  // Partidas de antes de la v0.16: lo comprado con la tienda antigua sigue a la vista.
  for (const p of career.purchases.filter((x) => x.season === career.season)) {
    if (!items.some((i) => i.id === p.itemId)) items.push(getShopItem(p.itemId))
  }
  return items.sort((a, b) => a.category.localeCompare(b.category) || a.cost - b.cost)
}

/**
 * Puntos que sube cada atributo una compra, en la escala de la carrera. En la
 * tienda se cuentan en la escala de 50 (de 1 a 3 por atributo, v0.17); en las
 * partidas con otra escala se convierten (nunca menos de 1).
 */
export function shopDeltas(item: Pick<ShopItem, 'attributes'>, max: number): Partial<Attributes> {
  const result: Partial<Attributes> = {}
  for (const [id, points] of Object.entries(item.attributes ?? {})) {
    if (!points) continue
    result[id as keyof Attributes] =
      max === SHOP_SCALE ? points : Math.max(1, Math.round((points * max) / SHOP_SCALE))
  }
  return result
}

/** Lo que sube el precio de la tienda por cada temporada que pasa (10 % del precio base). */
export const SHOP_PRICE_GROWTH = 0.1

/**
 * Precio de un artículo en una temporada: el de la primera temporada y un 10 %
 * más del precio base por cada temporada que pasa (redondeado a 500).
 */
export function itemCost(item: Pick<ShopItem, 'cost'>, season: number): number {
  const factor = 1 + SHOP_PRICE_GROWTH * Math.max(0, season - 1)
  return Math.round((item.cost * factor) / 500) * 500
}

/** `short` es el texto corto que se muestra en el botón. */
export type BuyCheck = { ok: true } | { ok: false; reason: string; short: string }

export function canBuy(career: Career, item: ShopItem): BuyCheck {
  const bought = career.purchases.filter((p) => p.itemId === item.id)
  if (!shopOffer(career).some((i) => i.id === item.id)) {
    return { ok: false, reason: t.game.shop.notInShop, short: t.game.shop.notAvailable }
  }
  if (item.limit === 'once' && bought.length > 0) {
    return { ok: false, reason: t.game.shop.alreadyBought, short: t.game.shop.bought }
  }
  if (item.limit === 'season' && bought.some((p) => p.season === career.season)) {
    return { ok: false, reason: t.game.shop.alreadyHired, short: t.game.shop.hired }
  }
  if (career.money < itemCost(item, career.season)) {
    return { ok: false, reason: t.game.shop.noMoney, short: t.game.shop.noMoneyShort }
  }
  const attrs = Object.entries(item.attributes ?? {})
  const max = careerScale(career)
  if (attrs.length > 0 && attrs.every(([id]) => career.attributes[id as keyof Attributes] >= max)) {
    return { ok: false, reason: t.game.shop.maxed, short: t.game.shop.maxedShort }
  }
  return { ok: true }
}

/** Compra una mejora: cobra, sube los atributos (sin pasar del máximo) y la apunta en la lista de gastos. */
export function buyItem(career: Career, itemId: string): Career {
  const item = getShopItem(itemId)
  const check = canBuy(career, item)
  if (!check.ok) throw new Error(check.reason)

  const max = careerScale(career)
  const attributes = { ...career.attributes }
  const gained: Partial<Attributes> = {}
  for (const [id, delta] of Object.entries(shopDeltas(item, max))) {
    const key = id as keyof Attributes
    const next = clampAttribute(attributes[key] + (delta ?? 0), max)
    if (next !== attributes[key]) gained[key] = next - attributes[key]
    attributes[key] = next
  }
  const purchase: Purchase = {
    itemId,
    season: career.season,
    cost: itemCost(item, career.season),
    attributes: gained,
    ...(item.morale ? { morale: item.morale } : {}),
    ...(item.reputation ? { reputation: item.reputation } : {})
  }
  return {
    ...career,
    attributes,
    money: career.money - itemCost(item, career.season),
    morale: clamp(career.morale + (item.morale ?? 0), 0, 100),
    reputation: clamp(career.reputation + (item.reputation ?? 0), 0, 100),
    purchases: [...career.purchases, purchase]
  }
}

/** Texto de lo obtenido con una compra: "+1 Resistencia · +6 moral". */
export function purchaseSummary(
  purchase: Pick<Purchase, 'attributes' | 'morale' | 'reputation'>
): string {
  const parts = ATTRIBUTES.filter(({ id }) => purchase.attributes[id]).map(
    ({ id, name }) => `+${purchase.attributes[id]} ${name}`
  )
  if (purchase.morale) parts.push(`+${purchase.morale} ${t.game.shop.morale}`)
  if (purchase.reputation) parts.push(`+${purchase.reputation} ${t.game.shop.fame}`)
  return parts.length > 0 ? parts.join(' · ') : t.game.shop.noGain
}

export function totalSpent(career: Career): number {
  return career.purchases.reduce((sum, p) => sum + p.cost, 0)
}

export { SHOP_ITEMS }
