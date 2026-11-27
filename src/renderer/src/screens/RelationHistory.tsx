import { getClub } from '../data/clubs'
import { t } from '../i18n/es'
import { seasonYearLabel } from '../logic/competitions'
import { partnerName, partnerRelation } from '../logic/partner'
import { coachValue, fansValue, relationHistory } from '../logic/relationLog'
import { useGameStore } from '../store/gameStore'
import type { RelationChange } from '../types/career'

const sign = (n: number): string => (n > 0 ? `+${n}` : `${n}`)

function HistoryRow({ entry }: { entry: RelationChange }): React.JSX.Element {
  const tone = entry.kind === 'inicio' ? 'start' : entry.delta > 0 ? 'up' : 'down'
  return (
    <li className={`relation-change relation-change--${tone}`} data-testid="relation-change">
      <span className="relation-change__delta" aria-label={tone}>
        {entry.kind === 'inicio' ? t.relationships.historyStart : sign(entry.delta)}
      </span>
      <div className="relation-change__body">
        <strong>{entry.title}</strong>
        {entry.detail && <span className="relation-change__detail">«{entry.detail}»</span>}
        <span className="relation-change__when">
          {seasonYearLabel(entry.season)} · {getClub(entry.clubId).name}
        </span>
      </div>
      <span className="relation-change__value">{entry.value}</span>
    </li>
  )
}

/**
 * Historial de una relación (v0.17): las decisiones que subieron o bajaron la
 * relación con el míster, la afición o una pareja, de la primera a la última.
 */
export function RelationHistory(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const view = useGameStore((s) => s.relationView)
  const openRelationships = useGameStore((s) => s.openRelationships)
  if (!career || !view) return <></>

  const club = getClub(career.clubId).name
  const current = partnerName(career.flags)
  const name =
    view.target === 'coach'
      ? `${t.relationships.historyCoach} · ${club}`
      : view.target === 'fans'
        ? `${t.relationships.historyFans} · ${club}`
        : (view.name ?? current ?? '')
  const entries = relationHistory(career, view.target, view.name)
  const isCurrentPartner = view.target === 'partner' && (!view.name || view.name === current)
  const now =
    view.target === 'coach'
      ? coachValue(career)
      : view.target === 'fans'
        ? fansValue(career)
        : isCurrentPartner
          ? partnerRelation(career.flags)
          : 0
  const ups = entries.filter((e) => e.kind !== 'inicio' && e.delta > 0).length
  const downs = entries.filter((e) => e.kind !== 'inicio' && e.delta < 0).length

  return (
    <div className="screen relation-history">
      <header className="screen-header">
        <span className="eyebrow">{t.relationships.historyTitle}</span>
        <h1 className="screen-title" data-testid="relation-history-name">
          {name}
        </h1>
        <p className="screen-subtitle">{t.relationships.historySubtitle}</p>
      </header>

      <div className="panel relation-history__summary">
        <div>
          <span className="relation-history__label">{t.relationships.historyNow}</span>
          <strong className="relation-history__now" data-testid="relation-history-now">
            {now}
          </strong>
        </div>
        <span className="relationship__meter relation-history__meter" aria-hidden="true">
          <span style={{ width: `${now}%` }} />
        </span>
        <span className="relation-history__counts">
          <span className="modifier modifier--up">
            {t.relationships.historyUp}: {ups}
          </span>
          <span className="modifier modifier--down">
            {t.relationships.historyDown}: {downs}
          </span>
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="field__hint relationship-empty" data-testid="relation-history-empty">
          {t.relationships.historyEmpty}
        </p>
      ) : (
        <ol className="relation-changes" data-testid="relation-history">
          {entries.map((entry, i) => (
            <HistoryRow key={i} entry={entry} />
          ))}
        </ol>
      )}
      {view.target !== 'partner' && (
        <p className="field__hint relation-history__note">{t.relationships.historyClubNote}</p>
      )}

      <footer className="action-bar action-bar--wide">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={openRelationships}
          data-testid="relation-history-back"
        >
          {t.relationships.back}
        </button>
      </footer>
    </div>
  )
}
