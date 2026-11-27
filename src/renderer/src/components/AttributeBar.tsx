import { ATTRIBUTE_MAX } from '../data/attributes'

/** Color según el valor, como en los juegos de mánager: rojo → amarillo → verde → dorado. */
function attributeTone(value: number, max: number): 'low' | 'mid' | 'good' | 'great' {
  const v = (value * ATTRIBUTE_MAX) / max
  if (v >= 16) return 'great'
  if (v >= 12) return 'good'
  if (v >= 8) return 'mid'
  return 'low'
}

/** Barra horizontal de un atributo (1–`max`). */
export function AttributeBar({
  value,
  max = ATTRIBUTE_MAX
}: {
  value: number
  max?: number
}): React.JSX.Element {
  return (
    <span className="attr-bar" aria-hidden="true">
      <span
        className={`attr-bar__fill attr-bar__fill--${attributeTone(value, max)}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </span>
  )
}
