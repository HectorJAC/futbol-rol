import type { Club } from '../data/clubs'

/** Iniciales para el escudo: "Real Meseta CF" → "RM". Ignora siglas como FC, CF, SC… */
function clubInitials(name: string): string {
  const skip = new Set(['FC', 'CF', 'SC', 'EC', 'AA', 'AS', 'SV', 'US', 'CD', 'SD', 'DE', 'DEL'])
  const words = name.split(/\s+/).filter((w) => !skip.has(w.toUpperCase()))
  return words
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/** Escudo genérico en SVG con los colores del club (clubes ficticios, sin escudos reales). */
export function ClubCrest({ club, size = 64 }: { club: Club; size?: number }): React.JSX.Element {
  const [primary, secondary] = club.colors
  const id = `crest-${club.id}`
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 100 115"
      aria-hidden="true"
      className="club-crest"
    >
      <defs>
        <clipPath id={id}>
          <path d="M50 3 95 15v40c0 30-20 47-45 57C25 102 5 85 5 55V15Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <rect width="100" height="115" fill={primary} />
        <rect x="58" width="42" height="115" fill={secondary} opacity="0.95" />
        <rect y="70" width="100" height="45" fill="rgba(0,0,0,0.18)" />
      </g>
      <path
        d="M50 3 95 15v40c0 30-20 47-45 57C25 102 5 85 5 55V15Z"
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="4"
      />
      <text
        x="50"
        y="66"
        textAnchor="middle"
        fontFamily="Oswald, sans-serif"
        fontWeight="700"
        fontSize="34"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.55)"
        strokeWidth="1.5"
        paintOrder="stroke"
      >
        {clubInitials(club.name)}
      </text>
    </svg>
  )
}
