import { ATTRIBUTES, scaleDelta } from '../data/attributes'
import type { Origin } from '../data/origins'
import { t } from '../i18n/es'

/** Ficha de un origen: historia, ventaja, desventaja, efectos y edad de debut. */
export function OriginDetail({
  origin,
  scale = 20
}: {
  origin: Origin
  /** Escala de atributos del modo elegido (los modificadores están en la escala de 20). */
  scale?: number
}): React.JSX.Element {
  return (
    <>
      <span className="detail__archetype">{t.extras.archetypes[origin.archetype]}</span>
      <h2 className="detail__title" data-testid="origin-detail-title">
        {origin.name}
      </h2>
      <p className="detail__tagline">{origin.tagline}</p>
      <p className="detail__story">{origin.story}</p>
      <dl className="detail__pros-cons">
        <div className="detail__pro">
          <dt>{t.origin.advantage}</dt>
          <dd>{origin.advantage}</dd>
        </div>
        <div className="detail__con">
          <dt>{t.origin.drawback}</dt>
          <dd>{origin.drawback}</dd>
        </div>
      </dl>
      <div className="detail__footer">
        <div>
          <span className="field__label">{t.origin.effects}</span>
          <ul className="modifier-list">
            {ATTRIBUTES.filter(({ id }) => origin.modifiers[id]).map(({ id, name }) => {
              const value = scaleDelta(origin.modifiers[id] ?? 0, scale)
              return (
                <li key={id} className={`modifier modifier--${value > 0 ? 'up' : 'down'}`}>
                  {value > 0 ? `+${value}` : value} {name}
                </li>
              )
            })}
          </ul>
        </div>
        <div className="detail__age">
          <span className="field__label">{t.origin.startAge}</span>
          <strong>
            {origin.startAge} {t.origin.years}
          </strong>
        </div>
      </div>
    </>
  )
}
