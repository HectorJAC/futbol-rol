/** Iconos en SVG para que se vean igual en cualquier Windows (sin depender de fuentes o emojis). */

interface IconProps {
  size?: number
}

export function MaleIcon({ size = 28 }: IconProps): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10" cy="14" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M14.5 9.5 20 4M15 4h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FemaleIcon({ size = 28 }: IconProps): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M12 15v7M8.5 18.5h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Bota de fútbol: la punta mira a la derecha o a la izquierda según la pierna buena. */
export function FootIcon({
  size = 28,
  side
}: IconProps & { side: 'derecha' | 'izquierda' }): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g transform={side === 'izquierda' ? 'matrix(-1 0 0 1 24 0)' : undefined}>
        <path
          d="M4 7v7.5c0 .9.6 1.5 1.5 1.5h13.8c.9 0 1.7-.7 1.7-1.6 0-1-.7-1.8-1.7-2L14.5 11 12.8 7H4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M7 16v2.5M11 16v2.5M15 16v2.5M19 16v2.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function ChevronIcon({
  direction,
  size = 28
}: IconProps & { direction: 'left' | 'right' }): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M15 5 8 12l7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LockIcon({ size = 14 }: IconProps): React.JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
