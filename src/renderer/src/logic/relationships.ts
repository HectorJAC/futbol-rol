import { getClub } from '../data/clubs'
import { getOrigin } from '../data/origins'
import type { Career, Teammate } from '../types/career'
import { relationLevel, ROLE_LABELS } from './teammates'

/** Estado familiar para la ficha: "Casado con Lucía · 2 hijos". */
export function familyStatus(career: Career): string {
  const f = career.flags
  const name = typeof f.partnerName === 'string' ? f.partnerName : ''
  const children = Number(f.children ?? 0)
  const stage: Record<string, string> = {
    pareja: `Saliendo con ${name}`,
    convivencia: `Vive con ${name}`,
    prometidos: `Prometido con ${name}`,
    casados: `Casado con ${name}`
  }
  const base = stage[String(f.partner)] ?? 'Soltero'
  return children > 0 ? `${base} · ${children} ${children === 1 ? 'hijo' : 'hijos'}` : base
}

export type RelationshipLevel = 'aliado' | 'bien' | 'neutral' | 'tenso' | 'enemigo'

export interface Relationship {
  id: string
  name: string
  role: string
  level: RelationshipLevel
  text: string
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
  result.push({ id: 'coach', name: 'El míster', role: 'Entrenador', ...coach })

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

  // Pareja (historia de la v0.8)
  const partnerName = typeof f.partnerName === 'string' ? f.partnerName : null
  const children = Number(f.children ?? 0)
  const kids = children > 0 ? ` Tenéis ${children} ${children === 1 ? 'hijo' : 'hijos'}.` : ''
  if (partnerName && f.partner) {
    const partner: Record<string, Pick<Relationship, 'level' | 'text'>> = {
      pareja: {
        level: 'bien',
        text: 'Estáis empezando. Cada viaje y cada partido os pone a prueba.'
      },
      convivencia: {
        level: 'bien',
        text: 'Compartís casa y rutina: es tu refugio después de los partidos.'
      },
      prometidos: { level: 'aliado', text: 'Estáis preparando la boda.' },
      casados: { level: 'aliado', text: `Tu compañera de vida.${kids}` },
      ruptura: { level: 'tenso', text: `Lo dejasteis. Todavía duele cuando sale su nombre.${kids}` }
    }
    const info = partner[String(f.partner)]
    if (info) {
      const level = f.cheated === true && f.partner !== 'ruptura' ? 'tenso' : info.level
      const text =
        f.cheated === true && f.partner !== 'ruptura'
          ? 'No sabe lo que pasó aquella noche… por ahora.'
          : info.text
      result.push({ id: 'partner', name: partnerName, role: 'Pareja', level, text })
    }
  }

  // Afición
  let fans: Pick<Relationship, 'level' | 'text'>
  if (f.brokenPromise) {
    fans = { level: 'tenso', text: 'No olvidan que dijiste "aquí soy feliz" y te fuiste.' }
  } else if (f.foreignInterest) {
    fans = { level: 'tenso', text: 'Sospechan que tienes la cabeza en otro club.' }
  } else if (f.loyalToClub || f.charityBarrio || career.reputation >= 60) {
    fans = { level: 'aliado', text: 'Te adoran. Tu nombre se corea en cada partido.' }
  } else if (career.reputation >= 30) {
    fans = { level: 'bien', text: 'Te aplauden y empiezan a ver tu camiseta en la grada.' }
  } else {
    fans = { level: 'neutral', text: 'Aún no saben bien quién eres.' }
  }
  result.push({ id: 'fans', name: 'La afición', role: 'Grada', ...fans })

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
