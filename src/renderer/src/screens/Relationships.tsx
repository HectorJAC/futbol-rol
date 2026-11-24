import { useState } from 'react'
import { t } from '../i18n/es'
import { describeRelationships, describeTeammate, type Relationship } from '../logic/relationships'
import { captaincyChecks } from '../logic/teammates'
import { useGameStore } from '../store/gameStore'

type Tab = 'people' | 'teammates' | 'ex'

function RelationshipCard({
  r,
  relation
}: {
  r: Relationship
  relation?: number
}): React.JSX.Element {
  return (
    <article className={`panel relationship relationship--${r.level}`} data-testid="relationship">
      <span className="relationship__avatar" aria-hidden="true">
        {r.name.replace(/^(El|La|Tu) /, '')[0].toUpperCase()}
      </span>
      <div className="relationship__body">
        <div className="relationship__top">
          <strong>{r.name}</strong>
          <span className="relationship__level">
            {t.relationships.levels[r.level]}
            {relation !== undefined && ` · ${relation}`}
          </span>
        </div>
        <span className="relationship__role">{r.role}</span>
        {relation !== undefined && (
          <span className="relationship__meter" aria-hidden="true">
            <span style={{ width: `${relation}%` }} />
          </span>
        )}
        <p>{r.text}</p>
      </div>
    </article>
  )
}

/** Cómo te ven el míster, tu familia, la afición, tus compañeros y excompañeros. */
export function Relationships(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const backToHub = useGameStore((s) => s.backToHub)
  const [tab, setTab] = useState<Tab>('people')
  if (!career) return <></>
  const people = describeRelationships(career)
  const teammates = career.teammates.map((m) => describeTeammate(m, career))
  const exTeammates = career.exTeammates.map((m) => describeTeammate(m, career, true))
  const checks = captaincyChecks(career)

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'people', label: t.relationships.people },
    { id: 'teammates', label: t.relationships.teammates },
    { id: 'ex', label: `${t.relationships.exTeammates} (${exTeammates.length})` }
  ]

  return (
    <div className="screen relationships">
      <header className="screen-header">
        <span className="eyebrow">{career.character.name}</span>
        <h1 className="screen-title">{t.relationships.title}</h1>
        <p className="screen-subtitle">{t.relationships.subtitle}</p>
      </header>

      <div className="tabs" role="tablist">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`tab${tab === item.id ? ' tab--active' : ''}`}
            onClick={() => setTab(item.id)}
            data-testid={`relationships-tab-${item.id}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'people' && (
        <div className="relationship-grid">
          {people.map((r) => (
            <RelationshipCard key={r.id} r={r} />
          ))}
        </div>
      )}

      {tab === 'teammates' && (
        <div className="relationship-layout">
          <div className="relationship-grid relationship-grid--compact">
            {teammates.map((r) => (
              <RelationshipCard key={r.id} r={r} relation={r.relation} />
            ))}
          </div>
          <aside className="panel captaincy-panel" data-testid="captaincy-panel">
            <h2 className="panel-title">{t.relationships.captaincy}</h2>
            {career.captaincy ? (
              <p className="hub__message hub__message--gold">
                {t.relationships.youAreCaptain.replace('{n}', String(career.captaincy.since))}
              </p>
            ) : (
              <>
                <ul className="check-list">
                  {checks.map((c) => (
                    <li key={c.label} className={`check check--${c.ok ? 'ok' : 'ko'}`}>
                      <span className="check__icon" aria-hidden="true">
                        {c.ok ? '✓' : '✗'}
                      </span>
                      <span className="check__label">{c.label}</span>
                      <span className="check__detail">{c.detail}</span>
                    </li>
                  ))}
                </ul>
                <p className="field__hint">{t.relationships.captaincyHint}</p>
              </>
            )}
          </aside>
        </div>
      )}

      {tab === 'ex' &&
        (exTeammates.length === 0 ? (
          <p className="field__hint relationship-empty">{t.relationships.noExTeammates}</p>
        ) : (
          <div className="relationship-grid relationship-grid--compact relationship-grid--scroll">
            {exTeammates.map((r) => (
              <RelationshipCard key={r.id} r={r} relation={r.relation} />
            ))}
          </div>
        ))}

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.trophies.back}
        </button>
      </footer>
    </div>
  )
}
