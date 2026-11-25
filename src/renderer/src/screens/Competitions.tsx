import { useState } from 'react'
import { ClubCrest } from '../components/ClubCrest'
import { notPlayedText, playedRoleText } from '../logic/notPlayed'
import { getClub } from '../data/clubs'
import { EUROPEAN_SPOTS, INTERCONTINENTAL_SPOTS, isEuropean } from '../data/continentalCups'
import { t } from '../i18n/es'
import {
  buildSeasonView,
  CUP_ROUND_NAMES,
  seasonYearLabel,
  totalSlots,
  type KnockoutTie,
  type SeasonContext,
  type StatRow,
  type TableRow
} from '../logic/competitions'
import { isCareerOver, seasonContext } from '../logic/season'
import { useGameStore } from '../store/gameStore'
import type { Career, ClubMatch, CompetitionId } from '../types/career'

type Tab = 'calendar' | 'league' | 'cup' | 'continental' | 'scorers' | 'assists'

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'calendar', label: t.competitions.calendar },
  { id: 'league', label: t.competitions.league },
  { id: 'cup', label: t.competitions.cup },
  { id: 'continental', label: t.competitions.continental },
  { id: 'scorers', label: t.competitions.scorers },
  { id: 'assists', label: t.competitions.assists }
]

const COMPETITION_SHORT: Record<CompetitionId, string> = {
  liga: t.competitions.league,
  copa: t.competitions.cup,
  continental: t.competitions.continental
}

/** Contexto para recalcular una temporada: la actual o una ya jugada. */
function contextFor(career: Career, season: number): SeasonContext | null {
  if (season === career.season) return seasonContext(career)
  const record = career.history.find((r) => r.season === season)
  if (!record?.clubMatches || !record.setup) return null
  const matchGoals = record.clubMatches.reduce((s, m) => s + m.playerGoals, 0)
  return {
    careerId: career.id,
    season,
    clubId: record.clubId,
    clubMatches: record.clubMatches,
    playedSlots: totalSlots(record.setup),
    bonusGoals: Math.max(0, record.goals - matchGoals),
    setup: record.setup
  }
}

function ClubName({ id, highlight }: { id: string; highlight?: boolean }): React.JSX.Element {
  const club = getClub(id)
  return (
    <span className={`club-cell${highlight ? ' club-cell--mine' : ''}`}>
      <ClubCrest club={club} size={20} />
      <span>{club.name}</span>
    </span>
  )
}

function resultClass(m: ClubMatch): string {
  const pf = m.penalties?.for ?? 0
  const pa = m.penalties?.against ?? 0
  if (m.goalsFor > m.goalsAgainst || (m.goalsFor === m.goalsAgainst && pf > pa)) return 'win'
  if (m.goalsFor < m.goalsAgainst || pf < pa) return 'loss'
  return 'draw'
}

function scoreText(home: number, away: number, pens?: [number, number]): string {
  return `${home}-${away}${pens ? ` (${pens[0]}-${pens[1]} ${t.competitions.penalties})` : ''}`
}

type Zone = 'campeones' | 'europa' | 'conferencia'

/** Copa europea a la que da plaza cada puesto de una primera división europea. */
function europeanZone(index: number): Zone | undefined {
  const position = index + 1
  return (Object.keys(EUROPEAN_SPOTS) as Zone[]).find((cup) =>
    EUROPEAN_SPOTS[cup].includes(position)
  )
}

function StandingsTable({
  rows,
  mine,
  highlightTop = 0,
  highlightBottom = 0,
  zoneFor
}: {
  rows: TableRow[]
  mine: string
  highlightTop?: number
  highlightBottom?: number
  /** Color de cada puesto según la copa europea a la que da plaza. */
  zoneFor?: (index: number) => Zone | undefined
}): React.JSX.Element {
  return (
    <table className="data-table standings">
      <thead>
        <tr>
          <th className="num">{t.competitions.pos}</th>
          <th>{t.competitions.team}</th>
          <th className="num">{t.competitions.played}</th>
          <th className="num">{t.competitions.won}</th>
          <th className="num">{t.competitions.drawn}</th>
          <th className="num">{t.competitions.lost}</th>
          <th className="num">{t.competitions.goalDiff}</th>
          <th className="num">{t.competitions.points}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.clubId}
            className={`${row.clubId === mine ? 'row--mine' : ''}${zoneFor?.(i) ? ` row--${zoneFor(i)}` : i < highlightTop ? ' row--top' : ''}${i >= rows.length - highlightBottom ? ' row--bottom' : ''}`}
            data-testid={row.clubId === mine ? 'my-table-row' : undefined}
          >
            <td className="num">{i + 1}</td>
            <td>
              <ClubName id={row.clubId} />
            </td>
            <td className="num">{row.played}</td>
            <td className="num">{row.won}</td>
            <td className="num">{row.drawn}</td>
            <td className="num">{row.lost}</td>
            <td className="num">{row.goalsFor - row.goalsAgainst}</td>
            <td className="num">
              <strong>{row.points}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Bracket({
  rounds,
  names,
  mine
}: {
  rounds: KnockoutTie[][]
  names: readonly string[]
  mine: string
}): React.JSX.Element {
  return (
    <div className="bracket">
      {rounds.map((ties, r) => (
        <div key={names[r]} className="bracket__round">
          <h3 className="bracket__title">{names[r]}</h3>
          <div className="bracket__ties">
            {ties.map((tie, i) => {
              const involved = tie.home === mine || tie.away === mine
              return (
                <div key={i} className={`bracket__tie${involved ? ' bracket__tie--mine' : ''}`}>
                  {[tie.home, tie.away].map((id, side) => (
                    <div
                      key={side}
                      className={`bracket__team${tie.winner && tie.winner === id ? ' bracket__team--winner' : ''}`}
                    >
                      {id ? (
                        <ClubName id={id} />
                      ) : (
                        <span className="bracket__tbd">{t.competitions.toBeDecided}</span>
                      )}
                      <span className="bracket__score">
                        {tie.score ? (side === 0 ? tie.score.home : tie.score.away) : ''}
                        {tie.score?.penalties && <small> ({tie.score.penalties[side]})</small>}
                      </span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function StatTable({
  rows,
  label,
  testId
}: {
  rows: StatRow[]
  label: string
  testId: string
}): React.JSX.Element {
  if (rows.length === 0) return <p className="field__hint">{t.competitions.emptyStats}</p>
  const top = rows.slice(0, 15)
  const myIndex = rows.findIndex((r) => r.isPlayer)
  const shown = myIndex >= 15 ? [...top, rows[myIndex]] : top
  return (
    <table className="data-table" data-testid={testId}>
      <thead>
        <tr>
          <th className="num">{t.competitions.pos}</th>
          <th>{t.competitions.player}</th>
          <th>{t.competitions.team}</th>
          <th className="num">{label}</th>
        </tr>
      </thead>
      <tbody>
        {shown.map((row) => (
          <tr key={row.key} className={row.isPlayer ? 'row--mine' : ''}>
            <td className="num">{rows.indexOf(row) + 1}</td>
            <td>
              {row.name}
              {row.isPlayer && <span className="tag tag--small">{t.competitions.you}</span>}
            </td>
            <td>
              <ClubName id={row.clubId} />
            </td>
            <td className="num">
              <strong>{row.value}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Calendario, clasificaciones de liga, copa e internacional, y tablas de goleadores y asistentes. */
export function Competitions(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const backToHub = useGameStore((s) => s.backToHub)
  const [tab, setTab] = useState<Tab>('calendar')
  const lastSeason = career ? (isCareerOver(career) ? career.season - 1 : career.season) : 1
  const [season, setSeason] = useState(lastSeason)

  if (!career) return <></>
  const firstSeason = career.history.find((r) => r.clubMatches)?.season ?? career.season
  const ctx = contextFor(career, season)
  const view = ctx ? buildSeasonView(ctx, career.character.name) : null
  const mine = ctx?.clubId ?? career.clubId

  return (
    <div className="screen competitions">
      <header className="competitions__header">
        <div>
          <span className="eyebrow">
            {t.competitions.eyebrow} {season} · {seasonYearLabel(season)}
          </span>
          <h1 className="screen-title">{t.competitions.title}</h1>
        </div>
        <div className="season-switch">
          <button
            type="button"
            className="btn btn--ghost btn--compact"
            onClick={() => setSeason(season - 1)}
            disabled={season <= Math.min(firstSeason, lastSeason)}
            aria-label={t.competitions.previous}
          >
            ‹
          </button>
          <span data-testid="competitions-season">{seasonYearLabel(season)}</span>
          <button
            type="button"
            className="btn btn--ghost btn--compact"
            onClick={() => setSeason(season + 1)}
            disabled={season >= lastSeason}
            aria-label={t.competitions.next}
          >
            ›
          </button>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`tab${tab === item.id ? ' tab--active' : ''}`}
            onClick={() => setTab(item.id)}
            data-testid={`competitions-tab-${item.id}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="panel competitions__body">
        {!view ? (
          <p className="field__hint">{t.competitions.noData}</p>
        ) : (
          <>
            {view.playedSlots === 0 && (
              <p className="competitions__note">{t.competitions.notStarted}</p>
            )}

            {tab === 'calendar' && (
              <table className="data-table calendar" data-testid="calendar">
                <tbody>
                  {view.calendar.map((entry) => {
                    const m = entry.match
                    return (
                      <tr key={entry.slot} className={m?.important ? 'row--important' : ''}>
                        <td className="calendar__date">{entry.date}</td>
                        <td>
                          <span className={`comp-badge comp-badge--${entry.competition}`}>
                            {COMPETITION_SHORT[entry.competition]}
                          </span>
                        </td>
                        <td className="calendar__round">{entry.label}</td>
                        <td className="calendar__venue">
                          {entry.home ? t.competitions.home : t.competitions.away}
                        </td>
                        <td>
                          {entry.opponentId ? (
                            <ClubName id={entry.opponentId} />
                          ) : (
                            <span className="bracket__tbd">{t.competitions.toBeDecided}</span>
                          )}
                        </td>
                        <td className="num">
                          {m ? (
                            <span className={`result result--${resultClass(m)}`}>
                              {scoreText(
                                m.goalsFor,
                                m.goalsAgainst,
                                m.penalties && [m.penalties.for, m.penalties.against]
                              )}
                            </span>
                          ) : (
                            <span className="field__hint">{t.competitions.pending}</span>
                          )}
                        </td>
                        <td className="calendar__me">
                          {m &&
                            (!m.played ? (
                              <span className="field__hint">{notPlayedText(m)}</span>
                            ) : (
                              <>
                                {playedRoleText(m) && (
                                  <span className="field__hint calendar__role">
                                    {playedRoleText(m)}
                                  </span>
                                )}
                                {m.playerGoals > 0 && (
                                  <span className="stat-pill stat-pill--goal">
                                    {m.playerGoals} {t.competitions.goalShort}
                                  </span>
                                )}
                                {m.playerAssists > 0 && (
                                  <span className="stat-pill">
                                    {m.playerAssists} {t.competitions.assistShort}
                                  </span>
                                )}
                                {m.rating !== undefined && (
                                  <span className="calendar__rating">{m.rating.toFixed(1)}</span>
                                )}
                              </>
                            ))}
                          {m?.important && (
                            <span className="tag tag--small">{t.competitions.important}</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            {tab === 'league' && (
              <>
                <h2 className="panel-title">{view.leagueName}</h2>
                <StandingsTable
                  rows={view.leagueTable}
                  mine={mine}
                  highlightTop={
                    view.division === 1 ? (INTERCONTINENTAL_SPOTS[view.countryId] ?? 0) : 3
                  }
                  zoneFor={
                    view.division === 1 && isEuropean(view.countryId) ? europeanZone : undefined
                  }
                  highlightBottom={3}
                />
                {view.division === 1 && isEuropean(view.countryId) ? (
                  <ul className="table-legend" data-testid="table-legend">
                    {(
                      [
                        ['campeones', t.competitions.legendChampions],
                        ['europa', t.competitions.legendEuropa],
                        ['conferencia', t.competitions.legendConference],
                        ['descenso', t.competitions.legendRelegation]
                      ] as const
                    ).map(([zone, label]) => (
                      <li key={zone}>
                        <span className={`table-legend__swatch table-legend__swatch--${zone}`} />
                        {label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="field__hint competitions__legend">
                    {view.division === 1 ? t.competitions.legendFirst : t.competitions.legendSecond}
                  </p>
                )}
              </>
            )}

            {tab === 'cup' && (
              <>
                <h2 className="panel-title">{view.cupName}</h2>
                <Bracket rounds={view.cup} names={CUP_ROUND_NAMES} mine={mine} />
              </>
            )}

            {tab === 'continental' && (
              <>
                <h2 className="panel-title">{view.continentalName}</h2>
                {!view.continental.qualified && (
                  <p className="competitions__note">{t.competitions.notQualified}</p>
                )}
                <div className="groups">
                  {view.continental.groups.map((group) => (
                    <div key={group.name} className="group">
                      <h3 className="bracket__title">
                        {t.competitions.group} {group.name}
                      </h3>
                      <StandingsTable rows={group.table} mine={mine} highlightTop={2} />
                    </div>
                  ))}
                </div>
                <Bracket
                  rounds={view.continental.knockout}
                  names={view.continentalRoundNames.slice(-view.continental.knockout.length)}
                  mine={mine}
                />
              </>
            )}

            {tab === 'scorers' && (
              <>
                <h2 className="panel-title">
                  {t.competitions.scorers} · {view.leagueName}
                </h2>
                <StatTable rows={view.scorers} label={t.summary.goals} testId="scorers-table" />
              </>
            )}

            {tab === 'assists' && (
              <>
                <h2 className="panel-title">
                  {t.competitions.assists} · {view.leagueName}
                </h2>
                <StatTable rows={view.assists} label={t.summary.assists} testId="assists-table" />
              </>
            )}
          </>
        )}
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.competitions.back}
        </button>
      </footer>
    </div>
  )
}
