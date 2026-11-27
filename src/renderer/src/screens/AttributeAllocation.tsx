import { AttributeBar } from '../components/AttributeBar'
import { Stepper } from '../components/Stepper'
import {
  ATTRIBUTE_GROUPS,
  ATTRIBUTES,
  BASE_ATTRIBUTES,
  normalizeAttributes,
  scaleDelta
} from '../data/attributes'
import { attributeScale, freePointsFor } from '../data/gameModes'
import { getNationality } from '../data/nationalities'
import { getOrigin } from '../data/origins'
import { t } from '../i18n'
import { canAllocate, computeAttributes, remainingPoints } from '../logic/career'
import { attributeScore } from '../logic/rating'
import { useGameStore } from '../store/gameStore'

export function AttributeAllocation(): React.JSX.Element {
  const draft = useGameStore((s) => s.draft)
  const allocatePoint = useGameStore((s) => s.allocatePoint)
  const resetAllocation = useGameStore((s) => s.resetAllocation)
  const confirmAttributes = useGameStore((s) => s.confirmAttributes)
  const previousStep = useGameStore((s) => s.previousStep)

  // Solo se llega aquí con un origen elegido.
  const originId = draft.originId ?? draft.extraOriginId
  const origin = getOrigin(originId)
  const mode = draft.mode
  const max = attributeScale(mode)
  const freePoints = freePointsFor(mode)
  const attributes = computeAttributes(originId, draft.allocation, mode)
  const left = remainingPoints(draft.allocation, mode)
  const score = Math.round(attributeScore(normalizeAttributes(attributes, max)))
  const nationality = getNationality(draft.character.nationalityId)

  return (
    <div className="screen attributes">
      <Stepper current="attributes" />
      <header className="screen-header">
        <h1 className="screen-title">{t.attributes.title}</h1>
        <p className="screen-subtitle">{t.attributes.subtitle}</p>
      </header>

      <div className="split split--attributes">
        <section className="panel attr-panel">
          {ATTRIBUTE_GROUPS.map((group) => (
            <div key={group} className="attr-group">
              <h2 className="attr-group__title">{t.attributeGroups[group]}</h2>
              {ATTRIBUTES.filter((a) => a.group === group).map((attr) => {
                const value = attributes[attr.id]
                const fromOrigin = scaleDelta(origin.modifiers[attr.id] ?? 0, max)
                const added = draft.allocation[attr.id]
                return (
                  <div key={attr.id} className="attr-row" title={attr.description}>
                    <span className="attr-row__name">{attr.name}</span>
                    <AttributeBar value={value} max={max} />
                    <span className="attr-row__mods">
                      {fromOrigin !== 0 && (
                        <span className={`mini-mod mini-mod--${fromOrigin > 0 ? 'up' : 'down'}`}>
                          {fromOrigin > 0 ? `+${fromOrigin}` : fromOrigin}
                        </span>
                      )}
                      {added > 0 && <span className="mini-mod mini-mod--points">+{added}</span>}
                    </span>
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => allocatePoint(attr.id, -1)}
                      disabled={!canAllocate(originId, draft.allocation, attr.id, -1, mode)}
                      aria-label={`${t.attributes.decrease} ${attr.name}`}
                    >
                      −
                    </button>
                    <span className="attr-row__value" data-testid={`attr-${attr.id}`}>
                      {value}
                    </span>
                    <button
                      type="button"
                      className="step-btn"
                      onClick={() => allocatePoint(attr.id, 1)}
                      disabled={!canAllocate(originId, draft.allocation, attr.id, 1, mode)}
                      aria-label={`${t.attributes.increase} ${attr.name}`}
                    >
                      +
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </section>

        <aside className="panel summary">
          <div className="summary__player">
            <img className="summary__flag" src={nationality.flag} alt="" />
            <div>
              <strong className="summary__name">{draft.character.name}</strong>
              <span className="summary__origin">{origin.name}</span>
            </div>
          </div>

          <div className="rating-block">
            <div className="rating">
              <span className="rating__value" data-testid="overall">
                {score}
              </span>
              <span className="rating__label">{t.attributes.overall}</span>
            </div>
            <span className="rating-block__base">
              Base {Math.round(attributeScore(BASE_ATTRIBUTES))} → {score} ·{' '}
              {t.attributes.scale.replace('{n}', String(max))}
            </span>
          </div>

          <div className="points">
            <span className="points__label">{t.attributes.pointsLeft}</span>
            <span className="points__value" data-testid="points-left">
              {left} / {freePoints}
            </span>
            <span className="points__pips" aria-hidden="true">
              {Array.from({ length: freePoints }, (_, i) => (
                <span key={i} className={`pip${i < left ? ' pip--on' : ''}`} />
              ))}
            </span>
          </div>

          <p className="field__hint">{left > 0 ? t.attributes.mustSpend : t.attributes.capHint}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={resetAllocation}
            disabled={left === freePoints}
          >
            {t.attributes.reset}
          </button>
        </aside>
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={previousStep}>
          {t.back}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={confirmAttributes}
          disabled={left !== 0}
        >
          {t.continue}
        </button>
      </footer>
    </div>
  )
}
