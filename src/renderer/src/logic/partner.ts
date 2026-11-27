import { PARTNER_NAMES } from '../data/partnerNames'
import type { Career, ExPartner, Flags } from '../types/career'
import { clamp, createRng, seedFor } from './random'

/**
 * Pareja con relación de 0 a 100 (v0.17).
 * - Al conocer a alguien empezáis en `PARTNER_START` ("os estáis conociendo").
 * - A 50 sois novios y a 100 os casáis.
 * - Si baja a 0, lo dejáis: pasa a tus exparejas y la temporada siguiente
 *   aparece otra persona.
 *
 * Flags que usa: `partner` (etapa), `partnerRelation`, `partnerName`,
 * `partnerSince`, `partnerStageSince`, `livingTogether`, `engaged`, `cheated`,
 * `noMoreChildren` y `lastBreakupSeason`. Los hijos (`children`) se quedan
 * contigo aunque lo dejéis.
 */

export type PartnerStage = 'conociendo' | 'pareja' | 'casados'

/** Etapas en las que hay relación. */
export const ACTIVE_PARTNER: readonly PartnerStage[] = ['conociendo', 'pareja', 'casados']

/** Relación al conocer a alguien. */
export const PARTNER_START = 25
/** A partir de aquí sois novios. */
export const COUPLE_AT = 50
/** A partir de aquí os casáis. */
export const MARRIED_AT = 100

export const STAGE_LABELS: Record<PartnerStage, string> = {
  conociendo: 'Os estáis conociendo',
  pareja: 'Novios',
  casados: 'Casados'
}

/** Etapa actual de la relación (`null` = sin pareja). */
export function partnerStage(flags: Flags): PartnerStage | null {
  const stage = flags.partner
  return ACTIVE_PARTNER.includes(stage as PartnerStage) ? (stage as PartnerStage) : null
}

/** Relación con tu pareja (0 si no tienes). */
export function partnerRelation(flags: Flags): number {
  return partnerStage(flags) ? clamp(Number(flags.partnerRelation ?? PARTNER_START), 0, 100) : 0
}

export function partnerName(flags: Flags): string | null {
  return partnerStage(flags) && typeof flags.partnerName === 'string' ? flags.partnerName : null
}

/** Flags de la relación que se borran al dejarlo. */
const RELATION_FLAGS = [
  'partner',
  'partnerRelation',
  'partnerName',
  'partnerSince',
  'livingTogether',
  'engaged',
  'cheated',
  'noMoreChildren'
]

export interface PartnerUpdate {
  flags: Flags
  exPartners: ExPartner[]
  /** Lo que cambió de etapa ("Ya sois novios."), para añadirlo al resultado. */
  note?: string
}

/** Nombre para una persona nueva (distinto de tus exparejas). */
function newPartnerName(
  career: Pick<Career, 'id' | 'season' | 'character' | 'exPartners'>
): string {
  const all = PARTNER_NAMES[career.character.nationalityId]
  const used = new Set(career.exPartners.map((p) => p.name))
  const names = all.filter((n) => !used.has(n))
  const pool = names.length > 0 ? names : all
  const rng = createRng(seedFor(career.id, 'partner', career.season, career.exPartners.length))
  return pool[Math.floor(rng() * pool.length)]
}

/**
 * Aplica a la pareja lo que dejó una decisión. `flags` ya lleva los flags de
 * la decisión; `delta` es el cambio de relación y `reason`, el título del
 * evento (se guarda como motivo si lo dejáis).
 */
export function applyPartnerEffects(
  career: Pick<Career, 'id' | 'season' | 'character' | 'flags' | 'exPartners'>,
  flags: Flags,
  delta: number,
  reason = ''
): PartnerUpdate {
  const next: Flags = { ...flags }
  let exPartners = career.exPartners
  const before = partnerStage(career.flags)
  // Partidas antiguas: 'pareja' sin relación previa también empieza a conocerse.
  const starts = !before && (next.partner === 'conociendo' || next.partner === 'pareja')
  if (starts) {
    next.partner = 'conociendo'
    next.partnerName = newPartnerName(career)
    next.partnerSince = career.season
    next.partnerStageSince = career.season
    next.partnerRelation = PARTNER_START
  }
  // 'ruptura' (como antes de la v0.17) también corta la relación que había.
  const breaks = next.partner === 'ruptura'
  const stage = breaks ? before : partnerStage(next)
  if (!stage) {
    if (breaks) delete next.partner
    return { flags: next, exPartners }
  }

  const relation = breaks
    ? 0
    : clamp(Number(next.partnerRelation ?? PARTNER_START) + delta, 0, MARRIED_AT)
  const name = String(next.partnerName ?? '')

  if (relation <= 0 && !starts) {
    exPartners = [
      ...exPartners,
      {
        name,
        since: Number(next.partnerSince ?? career.season),
        until: career.season,
        stage: before ?? stage,
        reason
      }
    ]
    for (const key of RELATION_FLAGS) delete next[key]
    next.partnerStageSince = career.season
    next.lastBreakupSeason = career.season
    return { flags: next, exPartners, note: `Lo dejáis: ${name} sale de tu vida.` }
  }

  next.partnerRelation = Math.max(1, relation)
  let note: string | undefined
  if (stage === 'conociendo' && relation >= COUPLE_AT) {
    next.partner = 'pareja'
    next.partnerStageSince = career.season
    note = `La relación llega a ${COUPLE_AT}: ${name} y tú ya sois novios.`
  }
  if (next.partner === 'pareja' && relation >= MARRIED_AT) {
    next.partner = 'casados'
    next.partnerStageSince = career.season
    note = `La relación llega a ${MARRIED_AT}: ${name} y tú os casáis.`
  }
  return { flags: next, exPartners, note }
}

/** "Casado con Lucía · 2 hijos", "Novio de Lucía · vivís juntos"… */
export function familyStatus(career: Pick<Career, 'flags'>): string {
  const f = career.flags
  const name = partnerName(f) ?? ''
  const children = Number(f.children ?? 0)
  const stage = partnerStage(f)
  const extra = f.engaged ? ' · prometidos' : f.livingTogether ? ' · vivís juntos' : ''
  const base =
    stage === 'conociendo'
      ? `Conociendo a ${name}`
      : stage === 'pareja'
        ? `Novio de ${name}${extra}`
        : stage === 'casados'
          ? `Casado con ${name}`
          : 'Soltero'
  return children > 0 ? `${base} · ${children} ${children === 1 ? 'hijo' : 'hijos'}` : base
}
