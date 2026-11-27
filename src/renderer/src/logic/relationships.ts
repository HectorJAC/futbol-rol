import { getClub } from '../data/clubs'
import { getOrigin } from '../data/origins'
import type { Career, Teammate } from '../types/career'
import { partnerName, partnerRelation, partnerStage, STAGE_LABELS } from './partner'
import { coachValue, fansValue } from './relationLog'
import { relationLevel, ROLE_LABELS } from './teammates'
import { liveRecord, t } from '../i18n'

export { familyStatus } from './partner'
export { coachValue, fansValue } from './relationLog'

export type RelationshipLevel = 'aliado' | 'bien' | 'neutral' | 'tenso' | 'enemigo'

export interface Relationship {
  id: string
  name: string
  role: string
  level: RelationshipLevel
  text: string
  /** Relación 0–100 para la barra (el míster y la afición, como en el vestuario). */
  value?: number
}

/**
 * Cómo te ven las personas de tu carrera (los compañeros van aparte, ver
 * `describeTeammate`). Se deduce de la confianza, la fama y los flags que
 * dejaron tus decisiones: así se ve que cada elección deja huella.
 */
export function describeRelationships(career: Career): Relationship[] {
  const f = career.flags
  const result: Relationship[] = []

  // Entrenador
  let coach: Pick<Relationship, 'level' | 'text'>
  const ct = t.game.coachText
  if (f.coachConflict) {
    coach = { level: 'enemigo', text: ct.conflict }
  } else if (f.publicComplaint) {
    coach = { level: 'tenso', text: ct.complaint }
  } else if (career.trust >= 70) {
    coach = { level: 'aliado', text: ct.aliado }
  } else if (career.trust >= 50) {
    coach = { level: 'bien', text: ct.bien }
  } else if (career.trust >= 30) {
    coach = { level: 'neutral', text: ct.neutral }
  } else {
    coach = { level: 'tenso', text: ct.tenso }
  }
  // La barra es la confianza del míster; un choque o una queja pública la limitan.
  result.push({
    id: 'coach',
    name: t.game.people.coach,
    role: t.game.people.coachRole,
    ...coach,
    value: coachValue(career)
  })

  // Padre (solo con el origen "Hijo de una leyenda")
  if (getOrigin(career.originId).archetype === 'herencia') {
    const father: Pick<Relationship, 'level' | 'text'> =
      f.fatherRelation === 'buena'
        ? { level: 'aliado', text: t.game.fatherText.buena }
        : f.fatherRelation === 'tensa'
          ? { level: 'tenso', text: t.game.fatherText.tensa }
          : { level: 'neutral', text: t.game.fatherText.neutral }
    result.push({
      id: 'father',
      name: t.game.people.father,
      role: t.game.people.fatherRole,
      ...father
    })
  }

  // Pareja: relación de 0 a 100 (v0.17).
  const name = partnerName(f)
  const stage = partnerStage(f)
  if (name && stage) {
    const value = partnerRelation(f)
    const children = Number(f.children ?? 0)
    const pt = t.game.partnerText
    const kids = children > 0 ? pt.kids(children) : ''
    const text =
      f.cheated === true
        ? pt.cheated
        : stage === 'conociendo'
          ? pt.meeting
          : stage === 'pareja'
            ? `${f.engaged ? pt.engaged : f.livingTogether ? pt.living : pt.couple} ${pt.toMarry}`
            : `${pt.married}${kids}`
    result.push({
      id: 'partner',
      name,
      role: `${t.game.people.partnerRole} · ${STAGE_LABELS[stage]}`,
      level: f.cheated === true ? 'tenso' : relationLevel(value),
      text,
      value
    })
  }

  // Afición de tu club actual (v0.17: vuelve a empezar al fichar por otro club).
  const fans = fansValue(career)
  const ft = t.game.fansText
  const fansInfo: Pick<Relationship, 'level' | 'text'> = f.foreignInterest
    ? { level: 'tenso', text: ft.foreign }
    : fans >= 70
      ? { level: 'aliado', text: ft.aliado }
      : fans >= 50
        ? { level: 'bien', text: ft.bien }
        : fans >= 35
          ? { level: 'neutral', text: ft.neutral }
          : { level: 'tenso', text: ft.tenso }
  result.push({
    id: 'fans',
    name: t.game.people.fans,
    role: t.game.people.fansRole,
    ...fansInfo,
    value: fans
  })

  return result
}

const TEAMMATE_TEXT: Record<RelationshipLevel, string> = liveRecord(() => t.game.teammateText)

const RIVAL_TEXT: Partial<Record<RelationshipLevel, string>> = liveRecord(() => t.game.rivalText)

/**
 * Ficha de un compañero o excompañero: su papel, la relación (0–100) y un
 * texto. Con `ex`, se dice en qué club coincidisteis.
 */
export function describeTeammate(
  mate: Teammate,
  career: Pick<Career, 'captaincy'>,
  ex = false
): Relationship & { relation: number } {
  const level = relationLevel(mate.relation)
  const role =
    mate.role === 'capitan' && career.captaincy && !ex
      ? t.game.roles.exCaptain
      : ROLE_LABELS[mate.role]
  return {
    id: mate.id,
    name: mate.name,
    role: ex ? `${role} · ${getClub(mate.clubId).name}` : role,
    level,
    relation: mate.relation,
    text: (mate.role === 'rival' && !ex ? RIVAL_TEXT[level] : undefined) ?? TEAMMATE_TEXT[level]
  }
}
