import { useState } from 'react'
import { ClubCrest } from '../components/ClubCrest'
import { TrophyIcon } from '../components/TrophyIcon'
import { getClub } from '../data/clubs'
import { getTrophy, TROPHIES, type TrophyKind } from '../data/trophies'
import { ordinal, roundName, t } from '../i18n'
import { careerTotals, trophyCounts } from '../logic/season'
import { useGameStore } from '../store/gameStore'
import type { SeasonRecord } from '../types/career'

type View = 'seasons' | 'cabinet'

function TrophyChips({
  record,
  kind
}: {
  record: SeasonRecord
  kind: TrophyKind
}): React.JSX.Element {
  const items = record.trophies.map(getTrophy).filter((tr) => tr.kind === kind)
  if (items.length === 0) return <span className="timeline__none">—</span>
  return (
    <ul className="timeline__chips">
      {items.map((trophy) => (
        <li key={trophy.id} className={`mini-trophy mini-trophy--${kind}`}>
          <TrophyIcon kind={kind} size={16} />
          {trophy.name}
        </li>
      ))}
    </ul>
  )
}

/**
 * Sala de trofeos: todos los títulos de la partida divididos por temporadas,
 * separando colectivos e individuales, y una vitrina con los totales.
 */
export function TrophyRoom(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const backToHub = useGameStore((s) => s.backToHub)
  const [view, setView] = useState<View>('seasons')

  if (!career) return <></>
  const history = career.history
  const all = history.flatMap((r) => r.trophies.map(getTrophy))
  const collective = all.filter((tr) => tr.kind === 'colectivo').length
  const individual = all.length - collective
  const totals = careerTotals(history)
  const counts = trophyCounts(history)

  return (
    <div className="screen trophy-room">
      <header className="trophy-room__header">
        <div>
          <span className="eyebrow">{career.character.name}</span>
          <h1 className="screen-title">{t.trophies.title}</h1>
        </div>
        <div className="trophy-totals">
          <div>
            <strong data-testid="total-collective">{collective}</strong>
            <span>{t.trophies.collective}</span>
          </div>
          <div>
            <strong data-testid="total-individual">{individual}</strong>
            <span>{t.trophies.individual}</span>
          </div>
          <div>
            <strong>{totals.goals}</strong>
            <span>{t.summary.goals}</span>
          </div>
          <div>
            <strong data-testid="total-assists">{totals.assists}</strong>
            <span>{t.summary.assists}</span>
          </div>
          <div>
            <strong>{totals.matches}</strong>
            <span>{t.summary.matches}</span>
          </div>
        </div>
      </header>

      <div className="tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'seasons'}
          className={`tab${view === 'seasons' ? ' tab--active' : ''}`}
          onClick={() => setView('seasons')}
        >
          {t.trophies.bySeason}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'cabinet'}
          className={`tab${view === 'cabinet' ? ' tab--active' : ''}`}
          onClick={() => setView('cabinet')}
        >
          {t.trophies.cabinet}
        </button>
      </div>

      <section className="panel trophy-room__body">
        {history.length === 0 ? (
          <p className="trophy-room__empty">{t.trophies.empty}</p>
        ) : view === 'seasons' ? (
          <table className="timeline">
            <thead>
              <tr>
                <th>{t.trophies.season}</th>
                <th>{t.hub.club}</th>
                <th className="num">{t.trophies.ageShort}</th>
                <th className="num">{t.trophies.matchesShort}</th>
                <th className="num">{t.trophies.goalsShort}</th>
                <th className="num">{t.trophies.assistsShort}</th>
                <th className="num">{t.trophies.ratingShort}</th>
                <th className="num">{t.trophies.nationalShort}</th>
                <th>{t.trophies.collective}</th>
                <th>{t.trophies.individual}</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((record) => {
                const club = getClub(record.clubId)
                return (
                  <tr key={record.season} data-testid="timeline-row">
                    <td>
                      <strong>{record.yearLabel}</strong>
                      <span className="timeline__sub">
                        {t.hub.eyebrow} {record.season}
                      </span>
                    </td>
                    <td>
                      <span className="timeline__club">
                        <ClubCrest club={club} size={22} />
                        {club.name}
                      </span>
                      <span className="timeline__sub">
                        {ordinal(record.leaguePosition)} {t.trophies.inLeague}
                      </span>
                    </td>
                    <td className="num">{record.age}</td>
                    <td className="num">{record.matches}</td>
                    <td className="num">{record.goals}</td>
                    <td className="num">{record.assists}</td>
                    <td className="num">{record.rating.toFixed(1)}</td>
                    <td
                      className="num"
                      title={
                        record.nationalTeam?.tournament
                          ? roundName(record.nationalTeam.tournament.round)
                          : undefined
                      }
                    >
                      {record.nationalTeam?.calledUp
                        ? `${record.nationalTeam.caps}/${record.nationalTeam.goals}`
                        : '—'}
                    </td>
                    <td>
                      <TrophyChips record={record} kind="colectivo" />
                    </td>
                    <td>
                      <TrophyChips record={record} kind="individual" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="cabinet">
            {TROPHIES.map((trophy) => {
              const seasons = counts.get(trophy.id) ?? []
              return (
                <div
                  key={trophy.id}
                  className={`cabinet__item cabinet__item--${trophy.kind}${seasons.length ? '' : ' cabinet__item--locked'}`}
                  title={trophy.description}
                >
                  <TrophyIcon kind={trophy.kind} size={30} />
                  <strong className="cabinet__count">×{seasons.length}</strong>
                  <span className="cabinet__name">{trophy.name}</span>
                  <span className="cabinet__seasons">
                    {seasons.length
                      ? seasons
                          .map((s) => history.find((r) => r.season === s)?.yearLabel)
                          .join(', ')
                      : t.trophies.notWon}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.trophies.back}
        </button>
      </footer>
    </div>
  )
}
