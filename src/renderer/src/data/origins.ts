import type { Attributes } from './attributes'
import type { ClubTier } from './clubs'
import type { NationalityId } from './nationalities'
import { EXTRA_ORIGINS, NATIONAL_ORIGINS } from './originCatalog'
import { bindFields } from '../i18n/bind'
import { ORIGINS_EN } from '../i18n/en/origins'

export type OriginId = string

/**
 * Tipo de historia que hay detrás de un origen. Decide qué eventos exclusivos
 * pueden salir (p. ej. los del padre leyenda) y las relaciones que aparecen.
 * - barrio: se formó en la calle.
 * - academia: cantera de élite.
 * - herencia: hijo de un ídolo (aparece "Tu padre" en Relaciones).
 * - tardio: llegó tarde al fútbol profesional.
 * - singular: historia única, sin eventos de arquetipo.
 */
export type OriginArchetype = 'barrio' | 'academia' | 'herencia' | 'tardio' | 'singular'

export interface Origin {
  id: OriginId
  /** País al que pertenece el origen. `null` = origen extra (vale para cualquier nacionalidad). */
  nationalityId: NationalityId | null
  archetype: OriginArchetype
  name: string
  tagline: string
  story: string
  advantage: string
  drawback: string
  /** Edad con la que empieza la carrera profesional. */
  startAge: number
  /** Fama inicial (0–100). */
  reputation: number
  /** Modificadores sobre los atributos base. */
  modifiers: Partial<Attributes>
  /** Vínculo especial con uno de los clubes que te ofrecen el primer contrato. */
  clubBond?: { tier: ClubTier; tag: string }
}

/** 4 orígenes por país + 10 orígenes extra. */
export const ORIGINS: readonly Origin[] = [...NATIONAL_ORIGINS, ...EXTRA_ORIGINS]

export function getOrigin(id: OriginId): Origin {
  const origin = ORIGINS.find((o) => o.id === id)
  if (!origin) throw new Error(`Origen desconocido: ${id}`)
  return origin
}

export function originsForNationality(nationalityId: NationalityId): Origin[] {
  return NATIONAL_ORIGINS.filter((o) => o.nationalityId === nationalityId)
}

/** Origen del país con ese arquetipo (para migrar partidas de antes de la v0.7). */
export function nationalOriginByArchetype(
  nationalityId: NationalityId,
  archetype: OriginArchetype
): Origin | undefined {
  return NATIONAL_ORIGINS.find(
    (o) => o.nationalityId === nationalityId && o.archetype === archetype
  )
}

/** Un origen extra al azar para la pantalla de selección. */
export function randomExtraOrigin(random: () => number = Math.random): Origin {
  return EXTRA_ORIGINS[Math.floor(random() * EXTRA_ORIGINS.length)]
}

// Textos en inglés de cada origen.
for (const origin of ORIGINS) {
  const en = ORIGINS_EN[origin.id]
  if (!en) continue
  bindFields(origin, {
    name: en.name,
    tagline: en.tagline,
    story: en.story,
    advantage: en.advantage,
    drawback: en.drawback
  })
  if (origin.clubBond) bindFields(origin.clubBond, { tag: en.clubBondTag })
}
