import { getClub } from '../data/clubs'
import type { Career, RelationChange, RelationTarget } from '../types/career'
import { partnerName, partnerRelation } from './partner'
import { clamp } from './random'

/**
 * Historial de relaciones (v0.17): cada decisión que sube o baja la relación
 * con el míster, la afición o tu pareja queda apuntada. Las del míster y la
 * afición son de cada club: al fichar vuelven a empezar.
 */

/** Barra del míster: su confianza; un choque o una queja pública la limitan. */
export function coachValue(career: Pick<Career, 'trust' | 'flags'>): number {
  const f = career.flags
  if (f.coachConflict) return Math.min(career.trust, 15)
  if (f.publicComplaint) return Math.min(career.trust, 35)
  return career.trust
}

/** Barra de la afición de tu club: tu fama más lo que han visto de ti en este club. */
export function fansValue(career: Pick<Career, 'reputation' | 'fansOffset'>): number {
  return clamp(Math.round(career.reputation + (career.fansOffset ?? 0)), 0, 100)
}

/**
 * Ajuste de la afición al llegar a un club: te reciben según tu fama, pero
 * todavía no te conocen (de 40 sin fama a 65 con la máxima).
 */
export function initialFansOffset(reputation: number): number {
  return Math.round(40 + reputation / 4) - reputation
}

export interface RelationInfo {
  kind: RelationChange['kind']
  title: string
  detail?: string
}

function slotOf(career: Career): number {
  return career.seasonProgress?.playedSlots ?? 0
}

/** Entrada de inicio (club nuevo o principio de la carrera) para el míster y la afición. */
export function startEntries(career: Career, title: string): RelationChange[] {
  const base = { season: career.season, clubId: career.clubId, slot: slotOf(career), delta: 0 }
  return [
    { ...base, target: 'coach', value: coachValue(career), kind: 'inicio', title },
    { ...base, target: 'fans', value: fansValue(career), kind: 'inicio', title }
  ]
}

/**
 * Compara la carrera antes y después de algo (una decisión, una jugada, una
 * negociación) y apunta los cambios de relación en el historial.
 */
export function logRelationChanges(before: Career, after: Career, info: RelationInfo): Career {
  const entries: RelationChange[] = []
  const base = {
    season: after.season,
    clubId: after.clubId,
    slot: slotOf(after),
    kind: info.kind,
    title: info.title,
    ...(info.detail ? { detail: info.detail } : {})
  }
  if (before.clubId === after.clubId) {
    const coach = [coachValue(before), coachValue(after)]
    if (coach[0] !== coach[1]) {
      entries.push({ ...base, target: 'coach', delta: coach[1] - coach[0], value: coach[1] })
    }
    const fans = [fansValue(before), fansValue(after)]
    if (fans[0] !== fans[1]) {
      entries.push({ ...base, target: 'fans', delta: fans[1] - fans[0], value: fans[1] })
    }
  }
  const oldName = partnerName(before.flags)
  const newName = partnerName(after.flags)
  const oldValue = partnerRelation(before.flags)
  const newValue = partnerRelation(after.flags)
  if (oldName && oldName !== newName) {
    // Lo dejasteis.
    entries.push({ ...base, target: 'partner', delta: -oldValue, value: 0, partnerName: oldName })
  }
  if (newName && newName !== oldName) {
    entries.push({ ...base, target: 'partner', delta: 0, value: newValue, partnerName: newName })
    entries[entries.length - 1].kind = 'inicio'
  } else if (newName && oldValue !== newValue) {
    entries.push({
      ...base,
      target: 'partner',
      delta: newValue - oldValue,
      value: newValue,
      partnerName: newName
    })
  }
  if (entries.length === 0) return after
  return { ...after, relationLog: [...(after.relationLog ?? []), ...entries] }
}

/**
 * Cambios de una relación, del primero al último. El míster y la afición:
 * solo los de tu club actual (desde que llegaste). La pareja: los de la
 * persona indicada (por defecto, tu pareja actual).
 */
export function relationHistory(
  career: Career,
  target: RelationTarget,
  name?: string | null
): RelationChange[] {
  const log = career.relationLog ?? []
  if (target === 'partner') {
    const who = name ?? partnerName(career.flags)
    return who ? log.filter((e) => e.target === 'partner' && e.partnerName === who) : []
  }
  const own = log.filter((e) => e.target === target)
  let start = 0
  own.forEach((e, i) => {
    if (e.kind === 'inicio') start = i
  })
  return own.slice(start).filter((e) => e.clubId === career.clubId)
}

/** "Temporada 3 · Jornada 12" para una entrada del historial. */
export function relationWhen(entry: RelationChange, yearLabel?: string): string {
  const club = getClub(entry.clubId).name
  return `${yearLabel ?? `Temporada ${entry.season}`} · ${club}`
}
