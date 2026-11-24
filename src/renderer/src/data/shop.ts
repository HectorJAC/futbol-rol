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
  attributes?: Partial<Attributes>
  morale?: number
  reputation?: number
  /** Desde qué temporada puede aparecer en la tienda (las compras de lujo llegan más tarde). */
  minSeason?: number
}

/** Catálogo completo; cada temporada la tienda ofrece una selección (ver `logic/finance.ts`). */
export const SHOP_ITEMS: readonly ShopItem[] = [...TRAINING_ITEMS, ...SHOP_CATALOG]

export function getShopItem(id: string): ShopItem {
  const item = SHOP_ITEMS.find((i) => i.id === id)
  if (!item) throw new Error(`Mejora desconocida: ${id}`)
  return item
}

export { formatMoney } from './currencies'
