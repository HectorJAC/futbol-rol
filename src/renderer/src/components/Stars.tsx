/** Valoración de 1 a 5 con estrellas SVG. */
export function Stars({ value, max = 5 }: { value: number; max?: number }): React.JSX.Element {
  return (
    <span className="stars" role="img" aria-label={`${value} de ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          className={i < value ? 'stars__on' : 'stars__off'}
          aria-hidden="true"
        >
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      ))}
    </span>
  )
}
