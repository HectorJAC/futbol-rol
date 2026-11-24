import { ATTRIBUTE_MAX } from '../data/attributes'

/** Color según el valor, como en los juegos de mánager: rojo → amarillo → verde → dorado. */
function attributeTone(value: number, max: number): 'low' | 'mid' | 'good' | 'great' {
  const v = (value * ATTRIBUTE_MAX) / max
  if (v >= 16) return 'great'
  if (v >= 12) return 'good'
  if (v >= 8) return 'mid'
  return 'low'
}

/**
 * Barra horizontal de un atributo (1–`max`). Con `marker` se dibuja una línea
 * en ese valor (por ejemplo, el mínimo para ser el lanzador de penaltis).
 */
export function AttributeBar({
  value,
  max = ATTRIBUTE_MAX,
  marker
}: {
  value: number
  max?: number
  marker?: number
}): React.JSX.Element {
  return (
    <span className="attr-bar" aria-hidden="true">
      <span
        className={`attr-bar__fill attr-bar__fill--${attributeTone(value, max)}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
      {marker !== undefined && (
        <span className="attr-bar__marker" style={{ left: `${(marker / max) * 100}%` }} />
      )}
    </span>
  )
}
