import { useState } from 'react'
import { AttributeBar } from '../components/AttributeBar'
import { ATTRIBUTE_GROUPS, ATTRIBUTES, type Attributes } from '../data/attributes'
import { t } from '../i18n/es'
import { careerScale } from '../logic/playerAttributes'
import { useGameStore } from '../store/gameStore'

/**
 * Reparte los puntos de atributo pendientes. Se puede repartir solo una parte:
 * lo que sobra se guarda para más adelante.
 */
export function TrainingPoints(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const applyTrainingPoints = useGameStore((s) => s.applyTrainingPoints)
  const skipTrainingPoints = useGameStore((s) => s.skipTrainingPoints)
  const [allocation, setAllocation] = useState<Partial<Attributes>>({})

  if (!career) return <></>
  const max = careerScale(career)
  const spent = Object.values(allocation).reduce((s, n) => s + (n ?? 0), 0)
  const left = career.pendingPoints - spent
  const value = (id: keyof Attributes): number => career.attributes[id] + (allocation[id] ?? 0)
  const change = (id: keyof Attributes, step: 1 | -1): void =>
    setAllocation((a) => ({ ...a, [id]: (a[id] ?? 0) + step }))

  return (
    <div className="screen attributes training">
      <header className="screen-header">
        <span className="eyebrow">{t.points.eyebrow}</span>
        <h1 className="screen-title">{t.points.title}</h1>
        <p className="screen-subtitle">{t.points.subtitle}</p>
      </header>

      <div className="split split--attributes">
        <section className="panel attr-panel">
          {ATTRIBUTE_GROUPS.map((group) => (
            <div key={group} className="attr-group">
              <h2 className="attr-group__title">{group}</h2>
              {ATTRIBUTES.filter((a) => a.group === group).map((attr) => (
                <div key={attr.id} className="attr-row" title={attr.description}>
                  <span className="attr-row__name">{attr.name}</span>
                  <AttributeBar value={value(attr.id)} max={max} />
                  <span className="attr-row__mods">
                    {(allocation[attr.id] ?? 0) > 0 && (
                      <span className="mini-mod mini-mod--points">+{allocation[attr.id]}</span>
                    )}
                  </span>
                  <button
                    type="button"
                    className="attr-btn"
                    aria-label={`${t.attributes.decrease} ${attr.name}`}
                    onClick={() => change(attr.id, -1)}
                    disabled={(allocation[attr.id] ?? 0) <= 0}
                  >
                    −
                  </button>
                  <span className="attr-row__value" data-testid={`points-attr-${attr.id}`}>
                    {value(attr.id)}
                  </span>
                  <button
                    type="button"
                    className="attr-btn"
                    aria-label={`${t.attributes.increase} ${attr.name}`}
                    onClick={() => change(attr.id, 1)}
                    disabled={left <= 0 || value(attr.id) >= max}
                    data-testid={`points-plus-${attr.id}`}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="panel summary">
          <div className="points">
            <span className="points__label">{t.points.left}</span>
            <span className="points__value" data-testid="training-points-left">
              {left} / {career.pendingPoints}
            </span>
          </div>
          <p className="field__hint">{t.attributes.scale.replace('{n}', String(max))}</p>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setAllocation({})}
            disabled={spent === 0}
          >
            {t.points.reset}
          </button>
          <p className="field__hint">{t.points.keepHint}</p>
        </section>
      </div>

      <footer className="action-bar action-bar--wide">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={skipTrainingPoints}
          data-testid="skip-points"
        >
          {t.points.later}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => applyTrainingPoints(allocation)}
          disabled={spent === 0}
          data-testid="confirm-points"
        >
          {t.points.confirm}
        </button>
      </footer>
    </div>
  )
}
