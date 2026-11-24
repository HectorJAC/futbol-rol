import { useEffect, useRef } from 'react'
import { ClubCrest } from './ClubCrest'
import { getClub } from '../data/clubs'
import { t } from '../i18n/es'
import { leagueTable, roundLabel, slotsFor } from '../logic/competitions'
import { matchResult, seasonContext } from '../logic/season'
import type { Career, CompetitionId } from '../types/career'

const COMPETITION_SHORT: Record<CompetitionId, string> = {
  liga: t.competitions.league,
  copa: t.competitions.cup,
  continental: t.competitions.continental
}

const RESULT_CLASS = { victoria: 'win', empate: 'draw', derrota: 'loss' } as const

/**
 * Tus números de la temporada y todos los partidos de tu club jugados hasta
 * ahora (los nuevos desde tu última decisión, resaltados). La lista no se
 * reinicia entre decisiones: tiene scroll y baja sola hasta el último partido.
 */
export function RecentResults({
  career,
  fromSlot
}: {
  career: Career
  /** Hueco del calendario de la decisión anterior: los partidos desde aquí son nuevos. */
  fromSlot: number
}): React.JSX.Element | null {
  const listRef = useRef<HTMLOListElement>(null)
  const progress = career.seasonProgress
  const count = progress?.clubMatches.length ?? 0

  // Al llegar partidos nuevos, la lista baja hasta el último.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [count])

  if (!progress) return null
  const slots = slotsFor(progress.setup)
  const matches = progress.clubMatches
  const table = leagueTable(seasonContext(career))
  const position = table.findIndex((r) => r.clubId === career.clubId) + 1
  const row = table[position - 1]
  const played = matches.filter((m) => m.played)
  const goals = played.reduce((s, m) => s + m.playerGoals, 0) + progress.bonusGoals
  const assists = played.reduce((s, m) => s + m.playerAssists, 0)
  const rating =
    played.length > 0 ? played.reduce((s, m) => s + (m.rating ?? 6), 0) / played.length : null
  const newCount = matches.filter((m) => m.slot >= fromSlot).length

  return (
    <aside className="panel recent-panel" data-testid="recent-results">
      <h2 className="panel-title">{t.season.myStats}</h2>
      <div className="mini-stats" data-testid="season-stats">
        <div className="mini-stat">
          <span className="mini-stat__value" data-testid="stat-matches">
            {played.length}
          </span>
          <span className="mini-stat__label">{t.summary.matches}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__value" data-testid="stat-goals">
            {goals}
          </span>
          <span className="mini-stat__label">{t.summary.goals}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__value">{assists}</span>
          <span className="mini-stat__label">{t.summary.assists}</span>
        </div>
        <div className="mini-stat">
          <span className="mini-stat__value">{rating === null ? '–' : rating.toFixed(1)}</span>
          <span className="mini-stat__label">{t.match.rating}</span>
        </div>
      </div>

      <h2 className="panel-title recent-panel__title">
        {t.season.sinceLast}
        {newCount > 0 && matches.length > newCount && (
          <span className="recent-panel__new">
            {newCount} {t.season.newSince.toLowerCase()}
          </span>
        )}
      </h2>
      {row && row.played > 0 && (
        <p className="recent-panel__standing" data-testid="league-standing">
          {t.competitions.league}: <b>{position}º</b> · {row.points} {t.competitions.points}
        </p>
      )}
      {matches.length === 0 ? (
        <p className="field__hint">{t.season.noMatchesYet}</p>
      ) : (
        <ol className="recent-panel__list" ref={listRef}>
          {matches.map((m) => {
            const opponent = getClub(m.opponentId)
            const info = slots[m.slot]
            const isNew = m.slot >= fromSlot
            return (
              <li
                key={m.slot}
                className={`recent-match${isNew ? ' recent-match--new' : ''}`}
                data-testid="recent-match"
              >
                <span className="recent-match__meta">
                  {COMPETITION_SHORT[m.competition]} ·{' '}
                  {info ? roundLabel(info, progress.setup) : ''}
                  {m.important && (
                    <span className="tag tag--small">{t.competitions.important}</span>
                  )}
                </span>
                <span className="recent-match__line">
                  <ClubCrest club={opponent} size={18} />
                  <span className="recent-match__rival">
                    {m.home ? '' : '@ '}
                    {opponent.name}
                  </span>
                  <span className={`result result--${RESULT_CLASS[matchResult(m)]}`}>
                    {m.goalsFor}-{m.goalsAgainst}
                    {m.penalties && ` (${m.penalties.for}-${m.penalties.against})`}
                  </span>
                </span>
                {(m.playerGoals > 0 || m.playerAssists > 0 || !m.played) && (
                  <span className={`recent-match__me${m.played ? '' : ' recent-match__me--off'}`}>
                    {!m.played
                      ? m.injured
                        ? t.competitions.injured
                        : t.competitions.bench
                      : [
                          m.playerGoals > 0 && `${m.playerGoals} ${t.competitions.goalShort}`,
                          m.playerAssists > 0 && `${m.playerAssists} ${t.competitions.assistShort}`
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </aside>
  )
}
