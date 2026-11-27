import { useState } from 'react'
import { t } from '../i18n'
import { describeRelationships, describeTeammate, type Relationship } from '../logic/relationships'
import { captaincyChecks } from '../logic/teammates'
import { useGameStore } from '../store/gameStore'
import type { RelationTarget } from '../types/career'
import { seasonYearLabel } from '../logic/competitions'
import { STAGE_LABELS } from '../logic/partner'

type Tab = 'people' | 'teammates' | 'ex' | 'exPartners'

/** Relaciones del entorno que tienen historial (v0.17). */
const WITH_HISTORY: Record<string, RelationTarget> = {
  coach: 'coach',
  fans: 'fans',
  partner: 'partner'
}

function RelationshipCard({
  r,
  relation,
  onOpen
}: {
  r: Relationship
  relation?: number
  /** Si se indica, la tarjeta abre el historial de la relación (v0.17). */
  onOpen?: () => void
}): React.JSX.Element {
  const body = (
    <>
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
        {onOpen && <span className="relationship__more">{t.relationships.seeHistory} ›</span>}
      </div>
    </>
  )
  if (onOpen) {
    return (
      <button
        type="button"
        className={`panel relationship relationship--${r.level} relationship--link`}
        onClick={onOpen}
        data-testid="relationship"
        data-relation={r.id}
      >
        {body}
      </button>
    )
  }
  return (
    <article className={`panel relationship relationship--${r.level}`} data-testid="relationship">
      {body}
    </article>
  )
}

/** Cómo te ven el míster, tu familia, la afición, tus compañeros y excompañeros. */
export function Relationships(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const backToHub = useGameStore((s) => s.backToHub)
  const openRelationHistory = useGameStore((s) => s.openRelationHistory)
  const [tab, setTab] = useState<Tab>('people')
  if (!career) return <></>
  const people = describeRelationships(career)
  const teammates = career.teammates.map((m) => describeTeammate(m, career))
  const exTeammates = career.exTeammates.map((m) => describeTeammate(m, career, true))
  const checks = captaincyChecks(career)

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'people', label: t.relationships.people },
    { id: 'teammates', label: t.relationships.teammates },
    { id: 'ex', label: `${t.relationships.exTeammates} (${exTeammates.length})` },
    // Las exparejas solo salen si las hay (v0.17).
    ...(career.exPartners.length > 0
      ? [
          {
            id: 'exPartners' as const,
            label: `${t.relationships.exPartners} (${career.exPartners.length})`
          }
        ]
      : [])
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
          {people.map((r) => {
            const target = WITH_HISTORY[r.id]
            return (
              <RelationshipCard
                key={r.id}
                r={r}
                relation={r.value}
                onOpen={target ? () => openRelationHistory(target) : undefined}
              />
            )
          })}
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

      {tab === 'exPartners' && (
        <div className="relationship-grid relationship-grid--compact relationship-grid--scroll">
          {career.exPartners.map((ex, i) => (
            <RelationshipCard
              key={`${ex.name}-${i}`}
              r={{
                id: `ex-${i}`,
                name: ex.name,
                role: t.relationships.exPartnerLine
                  .replace('{from}', seasonYearLabel(ex.since))
                  .replace('{to}', seasonYearLabel(ex.until))
                  .replace('{stage}', STAGE_LABELS[ex.stage]),
                level: 'tenso',
                text: ex.reason ? `Lo dejasteis: ${ex.reason}.` : 'Lo dejasteis.'
              }}
              onOpen={() => openRelationHistory('partner', ex.name)}
            />
          ))}
        </div>
      )}

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.trophies.back}
        </button>
      </footer>
    </div>
  )
}
