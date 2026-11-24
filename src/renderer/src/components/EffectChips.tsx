import { ATTRIBUTES, scaleDelta } from '../data/attributes'
import type { EventEffects } from '../data/events'
import type { MatchMomentEffects } from '../data/matchTypes'
import { formatMoney, type CurrencyId } from '../data/currencies'

const LABELS = { trust: 'Confianza del míster', morale: 'Moral', reputation: 'Fama' } as const

const RELATION_LABELS = {
  todos: 'Vestuario',
  capitan: 'Capitán',
  rival: 'Rival de puesto',
  veterano: 'Veterano',
  amigo: 'Amigo',
  joven: 'Joven'
} as const

const sign = (n: number): string => (n > 0 ? `+${n}` : `${n}`)

/** Muestra los efectos de una decisión como etiquetas de color (+ verde, − rojo). */
export function EffectChips({
  effects,
  currency = 'EUR',
  scale = 20,
  exName
}: {
  effects: EventEffects | MatchMomentEffects
  /** Moneda del país donde juegas (el dinero se guarda en euros). */
  currency?: CurrencyId
  /** Escala de atributos del modo (los efectos están en la escala de 20). */
  scale?: number
  /** Nombre del excompañero protagonista (para el cambio de relación). */
  exName?: string
}): React.JSX.Element {
  const chips: Array<{ text: string; up: boolean }> = []
  for (const { id, name } of ATTRIBUTES) {
    const delta = scaleDelta(effects.attributes?.[id] ?? 0, scale)
    if (delta) chips.push({ text: `${sign(delta)} ${name}`, up: delta > 0 })
  }
  for (const [role, label] of Object.entries(RELATION_LABELS)) {
    const delta = effects.teammates?.[role as keyof typeof RELATION_LABELS]
    if (delta) chips.push({ text: `${sign(delta)} Relación: ${label}`, up: delta > 0 })
  }
  if (effects.exTeammate) {
    chips.push({
      text: `${sign(effects.exTeammate)} Relación: ${exName ?? 'excompañero'}`,
      up: effects.exTeammate > 0
    })
  }
  if (effects.becomeCaptain) chips.push({ text: 'Capitán del equipo', up: true })
  for (const key of ['trust', 'morale', 'reputation'] as const) {
    const delta = effects[key]
    if (delta) chips.push({ text: `${sign(delta)} ${LABELS[key]}`, up: delta > 0 })
  }
  const goals =
    'goals' in effects ? effects.goals : 'playerGoals' in effects ? effects.playerGoals : 0
  if (goals) chips.push({ text: `${sign(goals)} gol${goals > 1 ? 'es' : ''}`, up: true })
  if ('playerAssists' in effects && effects.playerAssists) {
    const n = effects.playerAssists
    chips.push({ text: `${sign(n)} asistencia${n > 1 ? 's' : ''}`, up: true })
  }
  if ('teamGoals' in effects && effects.teamGoals) {
    chips.push({ text: `Gol de tu equipo`, up: true })
  }
  if ('opponentGoals' in effects && effects.opponentGoals) {
    chips.push({ text: `Gol del rival`, up: false })
  }
  if (effects.money) {
    chips.push({
      text: `${effects.money > 0 ? '+' : '−'}${formatMoney(Math.abs(effects.money), currency)}`,
      up: effects.money > 0
    })
  }

  if (chips.length === 0) return <></>
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
