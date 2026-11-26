import { useEffect } from 'react'
import {
  AVAILABLE_NATIONALITIES,
  getNationality,
  NATIONALITIES,
  isNationalityAvailable,
  type NationalityId
} from '../data/nationalities'
import { t } from '../i18n/es'
import { ChevronIcon, LockIcon } from './icons'

interface NationalitySelectorProps {
  value: NationalityId
  onChange: (step: 1 | -1) => void
}

/**
 * Bandera grande con flechas a los lados. ←/→ también cambian de país (salvo si
 * se está escribiendo). Las nacionalidades bloqueadas se ven debajo, en gris.
 */
export function NationalitySelector({
  value,
  onChange
}: NationalitySelectorProps): React.JSX.Element {
  const nationality = getNationality(value)
  const position = AVAILABLE_NATIONALITIES.findIndex((n) => n.id === value) + 1
  const locked = NATIONALITIES.filter((n) => !isNationalityAvailable(n.id))

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
          {position} / {AVAILABLE_NATIONALITIES.length}
        </span>
        {locked.length > 0 && (
          <span className="nationality__locked" data-testid="locked-nationalities">
            {locked.map((n) => (
              <img key={n.id} src={n.flag} alt={n.name} title={`${n.name} · ${t.comingSoon}`} />
            ))}
            <span className="nationality__locked-label">
              <LockIcon size={11} /> {t.comingSoon}
            </span>
          </span>
        )}
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
