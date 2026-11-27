import { getClub } from '../data/clubs'
import { getOrigin } from '../data/origins'
import type { Career, Teammate } from '../types/career'
import { partnerName, partnerRelation, partnerStage, STAGE_LABELS } from './partner'
import { coachValue, fansValue } from './relationLog'
import { relationLevel, ROLE_LABELS } from './teammates'

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
  if (f.coachConflict) {
    coach = { level: 'enemigo', text: 'Te saltaste su autoridad y no lo ha olvidado.' }
  } else if (f.publicComplaint) {
    coach = { level: 'tenso', text: 'Sigue dolido por tu queja pública en la rueda de prensa.' }
  } else if (career.trust >= 70) {
    coach = { level: 'aliado', text: 'Confía ciegamente en ti. Eres pieza clave de su once.' }
  } else if (career.trust >= 50) {
    coach = { level: 'bien', text: 'Cuenta contigo, pero tienes que demostrarlo cada semana.' }
  } else if (career.trust >= 30) {
    coach = { level: 'neutral', text: 'Todavía no se fía del todo de ti.' }
  } else {
    coach = { level: 'tenso', text: 'Apenas cuenta contigo.' }
  }
  // La barra es la confianza del míster; un choque o una queja pública la limitan.
  result.push({
    id: 'coach',
    name: 'El míster',
    role: 'Entrenador',
    ...coach,
    value: coachValue(career)
  })

  // Padre (solo con el origen "Hijo de una leyenda")
  if (getOrigin(career.originId).archetype === 'herencia') {
    const father: Pick<Relationship, 'level' | 'text'> =
      f.fatherRelation === 'buena'
        ? { level: 'aliado', text: 'Desde aquella conversación, no se pierde un partido.' }
        : f.fatherRelation === 'tensa'
          ? { level: 'tenso', text: 'La respuesta en redes sigue pesando en cada comida familiar.' }
          : {
              level: 'neutral',
              text: 'Te observa desde la distancia, esperando ver de qué estás hecho.'
            }
    result.push({ id: 'father', name: 'Tu padre', role: 'Leyenda del club', ...father })
  }

  // Pareja: relación de 0 a 100 (v0.17).
  const name = partnerName(f)
  const stage = partnerStage(f)
  if (name && stage) {
    const value = partnerRelation(f)
    const children = Number(f.children ?? 0)
    const kids = children > 0 ? ` Tenéis ${children} ${children === 1 ? 'hijo' : 'hijos'}.` : ''
    const text =
      f.cheated === true
        ? 'No sabe lo que pasó aquella noche… por ahora.'
        : stage === 'conociendo'
          ? 'Os estáis conociendo. A 50 de relación seréis novios.'
          : stage === 'pareja'
            ? `${f.engaged ? 'Estáis prometidos.' : f.livingTogether ? 'Compartís casa y rutina.' : 'Sois novios.'} A 100 de relación os casáis.`
            : `Tu compañera de vida.${kids}`
    result.push({
      id: 'partner',
      name,
      role: `Pareja · ${STAGE_LABELS[stage]}`,
      level: f.cheated === true ? 'tenso' : relationLevel(value),
      text,
      value
    })
  }

  // Afición de tu club actual (v0.17: vuelve a empezar al fichar por otro club).
  const fans = fansValue(career)
  const fansInfo: Pick<Relationship, 'level' | 'text'> = f.foreignInterest
    ? { level: 'tenso', text: 'Sospechan que tienes la cabeza en otro club.' }
    : fans >= 70
      ? { level: 'aliado', text: 'Te adoran. Tu nombre se corea en cada partido.' }
      : fans >= 50
        ? { level: 'bien', text: 'Te aplauden y empiezan a ver tu camiseta en la grada.' }
        : fans >= 35
          ? { level: 'neutral', text: 'Aún no saben bien quién eres.' }
          : { level: 'tenso', text: 'La grada te ha dado la espalda.' }
  result.push({ id: 'fans', name: 'La afición', role: 'Grada', ...fansInfo, value: fans })

  return result
}

const TEAMMATE_TEXT: Record<RelationshipLevel, string> = {
  aliado: 'Uña y carne: te defiende dentro y fuera del vestuario.',
  bien: 'Os lleváis bien y se nota en el campo.',
  neutral: 'Relación correcta, sin más.',
  tenso: 'Hay roces entre vosotros.',
  enemigo: 'No os soportáis. El vestuario lo nota.'
}

const RIVAL_TEXT: Partial<Record<RelationshipLevel, string>> = {
  aliado: 'Os jugáis el mismo puesto y aun así sois amigos.',
  tenso: 'Pelea por tu puesto y no te regala nada.',
  enemigo: 'Pelea por tu puesto y no te pasa ni una.'
}

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
    mate.role === 'capitan' && career.captaincy && !ex ? 'Excapitán' : ROLE_LABELS[mate.role]
  return {
    id: mate.id,
    name: mate.name,
    role: ex ? `${role} · ${getClub(mate.clubId).name}` : role,
    level,
    relation: mate.relation,
    text: (mate.role === 'rival' && !ex ? RIVAL_TEXT[level] : undefined) ?? TEAMMATE_TEXT[level]
  }
}
