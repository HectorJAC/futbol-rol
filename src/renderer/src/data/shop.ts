import type { Attributes } from './attributes'
import { SHOP_CATALOG } from './shopCatalog'
import { TRAINING_ITEMS } from './shopTraining'

export type ShopCategory =
  'Entrenamiento' | 'Familia' | 'Equipo personal' | 'Equipamiento' | 'Formación'

/** Mejora que se puede comprar con el dinero de la carrera. */
export interface ShopItem {
  id: string
  name: string
  category: ShopCategory
  description: string
  /** Precio en euros. */
  cost: number
  /** 'once' = una vez por carrera; 'season' = se puede repetir una vez por temporada. */
  limit: 'once' | 'season'
  /**
   * Puntos que sube cada atributo, en la escala de 50 (v0.17): de 1 a 3. Si
   * mejora dos atributos, lo normal es 1 y 2; las compras más caras suben
   * hasta 3 atributos 3 puntos cada uno (ver `SHOP_PRICE_BANDS`).
   */
  attributes?: Partial<Attributes>
  morale?: number
  reputation?: number
  /** Desde qué temporada puede aparecer en la tienda (las compras de lujo llegan más tarde). */
  minSeason?: number
}

/** Escala en la que se cuentan los puntos de la tienda. */
export const SHOP_SCALE = 50

/**
 * Precio según los puntos que da una compra de entrenamiento, equipo personal,
 * equipamiento o formación (v0.17): a más puntos, más cara, sin solaparse.
 * Las compras de la familia tienen su propio precio (una casa no es un
 * entrenamiento), pero sus puntos siguen las mismas reglas.
 */
export const SHOP_PRICE_BANDS: Record<number, [number, number]> = {
  1: [5_000, 25_000],
  2: [30_000, 60_000],
  3: [70_000, 150_000],
  6: [250_000, 400_000],
  9: [600_000, 900_000]
}

/** Puntos totales de una compra. */
export function shopPoints(item: Pick<ShopItem, 'attributes'>): number {
  return Object.values(item.attributes ?? {}).reduce((sum, n) => sum + (n ?? 0), 0)
}

/** Catálogo completo; cada temporada la tienda ofrece una selección (ver `logic/finance.ts`). */
export const SHOP_ITEMS: readonly ShopItem[] = [...TRAINING_ITEMS, ...SHOP_CATALOG]

export function getShopItem(id: string): ShopItem {
  const item = SHOP_ITEMS.find((i) => i.id === id)
  if (!item) throw new Error(`Mejora desconocida: ${id}`)
  return item
}

export { formatMoney } from './currencies'
