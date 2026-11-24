import { useEffect } from 'react'
import { getNationality, NATIONALITIES, type NationalityId } from '../data/nationalities'
import { t } from '../i18n/es'
import { ChevronIcon } from './icons'

interface NationalitySelectorProps {
  value: NationalityId
  onChange: (step: 1 | -1) => void
}

/** Bandera grande con flechas a los lados. ←/→ también cambian de país (salvo si se está escribiendo). */
export function NationalitySelector({
  value,
  onChange
}: NationalitySelectorProps): React.JSX.Element {
  const nationality = getNationality(value)
  const position = NATIONALITIES.findIndex((n) => n.id === value) + 1

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (event.key === 'ArrowLeft') onChange(-1)
      if (event.key === 'ArrowRight') onChange(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onChange])

  return (
    <div className="nationality">
      <button
        type="button"
        className="nationality__arrow"
        onClick={() => onChange(-1)}
        aria-label={t.creation.previousNationality}
      >
        <ChevronIcon direction="left" />
      </button>

      <figure className="nationality__card" aria-live="polite">
        <img
          key={nationality.id}
          className="nationality__flag"
          src={nationality.flag}
          alt=""
          draggable={false}
        />
        <figcaption className="nationality__name" data-testid="nationality-name">
          {nationality.name}
        </figcaption>
        <span className="nationality__counter">
          {position} / {NATIONALITIES.length}
        </span>
      </figure>

      <button
        type="button"
        className="nationality__arrow"
        onClick={() => onChange(1)}
        aria-label={t.creation.nextNationality}
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  )
}
