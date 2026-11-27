import { OriginDetail } from '../components/OriginDetail'
import { Stepper } from '../components/Stepper'
import { attributeScale } from '../data/gameModes'
import { getNationality } from '../data/nationalities'
import { getOrigin, originsForNationality } from '../data/origins'
import { t } from '../i18n'
import { useGameStore } from '../store/gameStore'

/** Paso 3: los 4 orígenes del país elegido y un origen especial al azar. */
export function OriginSelection(): React.JSX.Element {
  const originId = useGameStore((s) => s.draft.originId)
  const nationalityId = useGameStore((s) => s.draft.character.nationalityId)
  const extraOriginId = useGameStore((s) => s.draft.extraOriginId)
  const selectOrigin = useGameStore((s) => s.selectOrigin)
  const confirmOrigin = useGameStore((s) => s.confirmOrigin)
  const previousStep = useGameStore((s) => s.previousStep)
  const mode = useGameStore((s) => s.draft.mode)

  const selected = originId ? getOrigin(originId) : null
  const national = originsForNationality(nationalityId)
  const extra = getOrigin(extraOriginId)
  const nationality = getNationality(nationalityId)

  return (
    <div className="screen origin">
      <Stepper current="originSelection" />
      <header className="screen-header">
        <h1 className="screen-title">{t.origin.title}</h1>
        <p className="screen-subtitle">{t.origin.subtitle}</p>
      </header>

      <div className="split">
        <div className="choice-list" role="radiogroup" aria-label={t.origin.title}>
          <span className="choice-list__heading">
            <img src={nationality.flag} alt="" className="choice-list__flag" />
            {t.origin.fromCountry} {nationality.name}
          </span>
          {national.map((origin) => (
            <button
              key={origin.id}
              type="button"
              role="radio"
              aria-checked={origin.id === originId}
              className={`choice${origin.id === originId ? ' choice--selected' : ''}`}
              onClick={() => selectOrigin(origin.id)}
              data-testid="origin-option"
            >
              <span className="choice__title">{origin.name}</span>
              <span className="choice__subtitle">{origin.tagline}</span>
            </button>
          ))}
          <span
            className="choice-list__heading choice-list__heading--extra"
            title={t.origin.extraHint}
          >
            {t.origin.extra}
          </span>
          <button
            type="button"
            role="radio"
            aria-checked={extra.id === originId}
            className={`choice choice--extra${extra.id === originId ? ' choice--selected' : ''}`}
            onClick={() => selectOrigin(extra.id)}
            data-testid="origin-option-extra"
          >
            <span className="choice__title">{extra.name}</span>
            <span className="choice__subtitle">{extra.tagline}</span>
          </button>
        </div>

        <section className="panel detail" aria-live="polite">
          {selected ? (
            <OriginDetail origin={selected} scale={attributeScale(mode)} />
          ) : (
            <p className="detail__empty">{t.origin.empty}</p>
          )}
        </section>
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={previousStep}>
          {t.back}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={confirmOrigin}
          disabled={!selected}
        >
          {t.continue}
        </button>
      </footer>
    </div>
  )
}
