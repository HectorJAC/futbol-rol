import { ATTRIBUTES, scaleDelta } from '../data/attributes'
import type { EventEffects } from '../data/events'
import type { MatchMomentEffects } from '../data/matchTypes'
import { formatMoney, type CurrencyId } from '../data/currencies'
import { t } from '../i18n'
import { injuryText, ZONE_NAMES } from '../logic/injury'
import type { InjuryRecord } from '../types/career'

/** Etiquetas en el idioma actual (se leen al pintar). */
const labels = (): Record<'trust' | 'morale' | 'reputation', string> => ({
  trust: t.hub.trust,
  morale: t.hub.morale,
  reputation: t.hub.reputation
})

const RELATION_ROLES = ['todos', 'capitan', 'rival', 'veterano', 'amigo', 'joven'] as const

const relationLabel = (role: (typeof RELATION_ROLES)[number]): string => {
  const c = t.game.chips
  return {
    todos: c.dressingRoom,
    capitan: c.captain,
    rival: c.rival,
    veterano: c.veteran,
    amigo: c.friend,
    joven: c.youngster
  }[role]
}

const sign = (n: number): string => (n > 0 ? `+${n}` : `${n}`)

/** Muestra los efectos de una decisión como etiquetas de color (+ verde, − rojo). */
export function EffectChips({
  effects,
  currency = 'EUR',
  scale = 20,
  exName,
  partnerName,
  injury,
  inline = false
}: {
  effects: EventEffects | MatchMomentEffects
  /** Moneda del país donde juegas (el dinero se guarda en euros). */
  currency?: CurrencyId
  /** Escala de atributos del modo (los efectos están en la escala de 20). */
  scale?: number
  /** Nombre del excompañero protagonista (para el cambio de relación). */
  exName?: string
  /** Nombre de la pareja (para el cambio de relación, v0.17). */
  partnerName?: string
  /** Lesión que dejó la decisión: partidos de baja y atributos perdidos (v0.17). */
  injury?: InjuryRecord
  /** Dentro de un botón (solo `span`, sin lista). */
  inline?: boolean
}): React.JSX.Element {
  const chips: Array<{ text: string; up: boolean }> = []
  if (injury) {
    chips.push({
      text: `${ZONE_NAMES[injury.zone as keyof typeof ZONE_NAMES] ?? t.game.injury.generic}: ${injuryText(injury)}`,
      up: false
    })
    for (const { id, name } of ATTRIBUTES) {
      const lost = injury.losses[id]
      if (lost) chips.push({ text: `${lost} ${name}`, up: false })
    }
  } else if (effects.injury) {
    chips.push({ text: t.game.injury.matchesOut(effects.injury.matches), up: false })
  }
  for (const { id, name } of ATTRIBUTES) {
    const delta = scaleDelta(effects.attributes?.[id] ?? 0, scale)
    if (delta) chips.push({ text: `${sign(delta)} ${name}`, up: delta > 0 })
  }
  const relation = t.game.chips.relation
  for (const role of RELATION_ROLES) {
    const delta = effects.teammates?.[role]
    if (delta) {
      chips.push({ text: `${sign(delta)} ${relation}: ${relationLabel(role)}`, up: delta > 0 })
    }
  }
  if (effects.exTeammate) {
    chips.push({
      text: `${sign(effects.exTeammate)} ${relation}: ${exName ?? t.game.chips.exTeammate}`,
      up: effects.exTeammate > 0
    })
  }
  if (effects.becomeCaptain) chips.push({ text: t.game.chips.becomeCaptain, up: true })
  if (effects.partner && partnerName) {
    chips.push({
      text: `${sign(effects.partner)} ${relation}: ${partnerName}`,
      up: effects.partner > 0
    })
  }
  if (effects.fans) {
    chips.push({ text: `${sign(effects.fans)} ${t.game.chips.fans}`, up: effects.fans > 0 })
  }
  for (const key of ['trust', 'morale', 'reputation'] as const) {
    const delta = effects[key]
    if (delta) chips.push({ text: `${sign(delta)} ${labels()[key]}`, up: delta > 0 })
  }
  const goals =
    'goals' in effects ? effects.goals : 'playerGoals' in effects ? effects.playerGoals : 0
  if (goals) chips.push({ text: `${sign(goals)} ${t.game.chips.goals(goals)}`, up: true })
  if ('playerAssists' in effects && effects.playerAssists) {
    const n = effects.playerAssists
    chips.push({ text: `${sign(n)} ${t.game.chips.assists(n)}`, up: true })
  }
  if ('teamGoals' in effects && effects.teamGoals) {
    chips.push({ text: t.game.chips.teamGoal, up: true })
  }
  if ('opponentGoals' in effects && effects.opponentGoals) {
    chips.push({ text: t.game.chips.opponentGoal, up: false })
  }
  if (effects.money) {
    chips.push({
      text: `${effects.money > 0 ? '+' : '−'}${formatMoney(Math.abs(effects.money), currency)}`,
      up: effects.money > 0
    })
  }

  if (chips.length === 0) return <></>
  if (inline) {
    return (
      <span className="event-option__gains" data-testid="option-effects">
        {chips.map((chip) => (
          <span key={chip.text} className={`modifier modifier--${chip.up ? 'up' : 'down'}`}>
            {chip.text}
          </span>
        ))}
      </span>
    )
  }
  return (
    <ul className="modifier-list">
      {chips.map((chip) => (
        <li key={chip.text} className={`modifier modifier--${chip.up ? 'up' : 'down'}`}>
          {chip.text}
        </li>
      ))}
    </ul>
  )
}
