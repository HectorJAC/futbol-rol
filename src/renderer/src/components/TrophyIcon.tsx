import type { TrophyKind } from '../data/trophies'

/** Copa (títulos colectivos) o medalla (premios individuales) en SVG. */
export function TrophyIcon({
  kind,
  size = 28
}: {
  kind: TrophyKind
  size?: number
}): React.JSX.Element {
  return kind === 'colectivo' ? (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="trophy-icon">
      <path
        d="M7 3h10v3h3v2a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V6h3zM6 8a2 2 0 0 0 1 1.7V8zm11 1.7A2 2 0 0 0 18 8h-1z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="trophy-icon">
      <path d="M8 2h3l1 4 1-4h3l-2.5 7h-3z" fill="currentColor" opacity="0.7" />
      <circle cx="12" cy="15" r="6" fill="currentColor" />
      <path d="m12 11.8 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z" fill="#1a1405" />
    </svg>
  )
}
