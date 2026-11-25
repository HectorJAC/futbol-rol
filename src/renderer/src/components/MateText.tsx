import { t } from '../i18n/es'
import { relationLevel, type MentionedMate } from '../logic/teammates'

const escape = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Texto de la relación con un compañero: "Veterano del vestuario · Relación 62 (Buena)". */
function mateTooltip(mate: MentionedMate): string {
  return `${mate.label} · ${t.season.relation} ${mate.relation} (${t.relationships.levels[relationLevel(mate.relation)]})`
}

/**
 * Texto de un evento en el que los compañeros nombrados se marcan: al pasar el
 * cursor por su nombre se ve qué relación tienes con ellos.
 */
export function MateText({
  text,
  mates
}: {
  text: string
  mates: readonly MentionedMate[]
}): React.JSX.Element {
  if (mates.length === 0) return <>{text}</>
  const names = [...new Set(mates.map((m) => m.name))].sort((a, b) => b.length - a.length)
  const parts = text.split(new RegExp(`(${names.map(escape).join('|')})`, 'g'))
  return (
    <>
      {parts.map((part, i) => {
        const mate = mates.find((m) => m.name === part)
        return mate ? (
          <span
            key={i}
            className={`mate-ref mate-ref--${relationLevel(mate.relation)}`}
            data-tooltip={mateTooltip(mate)}
            data-testid="mate-ref"
          >
            {part}
          </span>
        ) : (
          part
        )
      })}
    </>
  )
}
