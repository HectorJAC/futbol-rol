import { ClubCrest } from '../components/ClubCrest'
import { EffectChips } from '../components/EffectChips'
import { NextMatch } from '../components/NextMatch'
import { ATTRIBUTES } from '../data/attributes'
import { getClub } from '../data/clubs'
import { t } from '../i18n/es'
import { leagueTable, roundLabel } from '../logic/competitions'
import { useMemo } from 'react'
import {
  currentMoment,
  fillMomentText,
  finalScore,
  finishLiveMatch,
  getMoment,
  isLiveMatchOver,
  liveMatchResult,
  momentText,
  needsLineup,
  scoreBefore
} from '../logic/match'
import { careerScale } from '../logic/playerAttributes'
import {
  advanceSeason,
  careerCurrency,
  checkChance,
  importanceOf,
  seasonContext,
  seasonStep
} from '../logic/season'
import { useGameStore } from '../store/gameStore'

const attributeName = (id: string): string => ATTRIBUTES.find((a) => a.id === id)?.name ?? id

const COMPETITION_NAME = {
  liga: t.competitions.league,
  copa: t.competitions.cup,
  continental: t.competitions.continental
} as const

/** Partido importante jugada a jugada: el marcador cambia con cada decisión. */
export function Match(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const lastMoment = useGameStore((s) => s.lastMoment)
  const chooseMoment = useGameStore((s) => s.chooseMoment)
  const continueMatch = useGameStore((s) => s.continueMatch)
  const finishMatch = useGameStore((s) => s.finishMatch)
  const startMatch = useGameStore((s) => s.startMatch)

  const live = career?.seasonProgress?.liveMatch
  const over = live ? isLiveMatchOver(live) : false
  // Si al acabar este partido toca otro importante, el botón dice "Jugar partido".
  const next = useMemo(() => {
    if (!career || !over) return null
    const advanced = advanceSeason(finishLiveMatch(career))
    return seasonStep(advanced) === 'match' ? (advanced.seasonProgress?.liveMatch ?? null) : null
  }, [career, over])
  const nextIsMatch = next !== null
  if (!career || !live) return <></>
  const lineup = needsLineup(live)

  const reason = importanceOf(career, {
    slot: live.slot,
    competition: live.competition,
    round: live.round,
    opponentId: live.opponentId,
    home: live.home,
    knockout: live.knockout,
    neutral: live.neutral
  })
  const own = getClub(career.clubId)
  const rival = getClub(live.opponentId)
  const finished = over && !lastMoment && !lineup
  const pending = currentMoment(live)
  const index = live.resolutions.length

  const minute = lineup
    ? 0
    : finished
      ? 90
      : lastMoment
        ? lastMoment.resolution.minute
        : (live.minutes[Math.min(index, live.minutes.length - 1)] ?? 90)
  const score = finished ? finalScore(live) : scoreBefore(live, minute + (lastMoment ? 1 : 0))
  const result = finished ? liveMatchResult(career, live) : null

  const timeline = [
    ...live.background
      .filter((g) => finished || g.minute <= minute)
      .map((g) => ({
        minute: g.minute,
        text: g.side === 'for' ? t.match.goalFor : t.match.goalAgainst,
        tone: g.side === 'for' ? 'up' : 'down'
      })),
    ...live.resolutions.map((r) => ({
      minute: r.minute,
      text: getMoment(r.momentId).title,
      tone: r.roll ? (r.roll.success ? 'up' : 'down') : 'neutral'
    })),
    // Cambios: cuándo entras desde el banquillo y cuándo te sustituyen.
    ...(live.enterMinute !== undefined && (finished || minute >= live.enterMinute)
      ? [{ minute: live.enterMinute, text: t.match.youEnter, tone: 'neutral' }]
      : []),
    ...(live.exitMinute !== undefined && (finished || minute >= live.exitMinute)
      ? [{ minute: live.exitMinute, text: t.match.subbedOff, tone: 'neutral' }]
      : [])
  ].sort((a, b) => a.minute - b.minute)
  const role = live.role ?? 'titular'

  const [homeClub, awayClub] = live.home ? [own, rival] : [rival, own]
  const [homeGoals, awayGoals] = live.home ? [score.for, score.against] : [score.against, score.for]
  const momentShown = lastMoment ? getMoment(lastMoment.resolution.momentId) : pending
  // En liga, el puesto de cada equipo antes del partido (debajo de su escudo).
  const positions = new Map<string, { position: number; points: number }>()
  if (live.competition === 'liga') {
    leagueTable({ ...seasonContext(career), playedSlots: live.slot }).forEach((row, i) =>
      positions.set(row.clubId, { position: i + 1, points: row.points })
    )
  }
  const standing = (clubId: string): React.JSX.Element | null => {
    const p = positions.get(clubId)
    return p ? (
      <span className="scoreboard__position" data-testid="team-position">
        {p.position}º · {p.points} {t.competitions.points}
      </span>
    ) : null
  }

  return (
    <div className="screen match-screen">
      <header className="match-header">
        <div className="scoreboard" data-testid="scoreboard">
          <div className="scoreboard__team">
            <span className="scoreboard__crest">
              <ClubCrest club={homeClub} size={52} />
              {standing(homeClub.id)}
            </span>
            <strong>{homeClub.name}</strong>
          </div>
          <div className="scoreboard__score">
            <span data-testid="live-score">
              {homeGoals} - {awayGoals}
            </span>
            {result?.penalties && (
              <small>
                {t.match.penalties}:{' '}
                {live.home
                  ? `${result.penalties.for}-${result.penalties.against}`
                  : `${result.penalties.against}-${result.penalties.for}`}
              </small>
            )}
            <span className="scoreboard__minute">
              {lineup
                ? t.match.lineup
                : finished
                  ? t.match.finalWhistle
                  : `${t.match.minute} ${minute}`}
            </span>
          </div>
          <div className="scoreboard__team">
            <span className="scoreboard__crest">
              <ClubCrest club={awayClub} size={52} />
              {standing(awayClub.id)}
            </span>
            <strong>{awayClub.name}</strong>
          </div>
        </div>
      </header>

      <div className="match-body">
        <article className="panel event-card match-card">
          <div className="match-card__context" data-testid="match-context">
            {t.match.eyebrow} · {COMPETITION_NAME[live.competition]} ·{' '}
            {roundLabel(
              { competition: live.competition, round: live.round },
              career.seasonProgress?.setup
            )}
            {reason && t.match.reasons[reason] && (
              <span className="match-card__reason">{t.match.reasons[reason]}</span>
            )}
            <span className={`match-role match-role--${role}`} data-testid="match-role">
              {t.match.roles[role]}
            </span>
          </div>
          {lineup ? (
            <div className="match-lineup" data-testid="match-lineup">
              <span className="event-card__tag event-card__tag--neutral">{t.match.lineup}</span>
              <h1 className="event-card__title">
                {role === 'titular'
                  ? t.match.starterTitle
                  : role === 'suplente'
                    ? t.match.subTitle
                    : t.match.outTitle}
              </h1>
              <p className="event-card__text">
                {role === 'titular'
                  ? t.match.starterText
                  : role === 'suplente'
                    ? t.match.subText
                    : t.match.outText}
              </p>
            </div>
          ) : finished && result ? (
            <div className="match-final" data-testid="match-final">
              <h1 className="event-card__title">{t.match.finalWhistle}</h1>
              {live.enterMinute !== undefined && (
                <p className="event-card__text">
                  {t.match.enteredAt.replace('{n}', String(live.enterMinute))}
                </p>
              )}
              {live.exitMinute !== undefined && (
                <p className="event-card__text">
                  {t.match.subbedAt.replace('{n}', String(live.exitMinute))}
                </p>
              )}
              {!result.played ? (
                <p className="event-card__text" data-testid="match-not-played">
                  {t.match.notPlayed}
                </p>
              ) : (
                <div className="stat-tiles">
                  <div className="stat-tile">
                    <span className="stat-tile__value">{result.playerGoals}</span>
                    <span className="stat-tile__label">{t.match.yourGoals}</span>
                  </div>
                  <div className="stat-tile">
                    <span className="stat-tile__value">{result.playerAssists}</span>
                    <span className="stat-tile__label">{t.match.yourAssists}</span>
                  </div>
                  <div className="stat-tile">
                    <span className="stat-tile__value" data-testid="match-rating">
                      {result.rating?.toFixed(1)}
                    </span>
                    <span className="stat-tile__label">{t.match.rating}</span>
                  </div>
                </div>
              )}
              {next && <NextMatch career={career} live={next} />}
            </div>
          ) : (
            momentShown && (
              <>
                <span className="event-card__tag event-card__tag--neutral">
                  {t.match.moment} {Math.min(index + (lastMoment ? 0 : 1), live.phases.length)} /{' '}
                  {live.phases.length}
                </span>
                <h1 className="event-card__title" data-testid="moment-title">
                  {momentShown.title}
                </h1>
                <p className="event-card__text">
                  {fillMomentText(momentText(momentShown, career), career, live)}
                </p>
                {!lastMoment ? (
                  <div className="event-options">
                    {momentShown.options.map((option, i) => {
                      const chance = option.check
                        ? Math.round(checkChance(career, option.check) * 100)
                        : null
                      return (
                        <button
                          key={option.label}
                          type="button"
                          className="event-option"
                          onClick={() => chooseMoment(i)}
                          data-testid="moment-option"
                        >
                          <span className="event-option__label">{option.label}</span>
                          {option.check && (
                            <span className="event-option__check">
                              🎲 {attributeName(option.check.attribute)} ·{' '}
                              <strong>{chance}%</strong>
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="event-result" data-testid="moment-result">
                    {lastMoment.resolution.roll && (
                      <div
                        className={`roll roll--${lastMoment.resolution.roll.success ? 'success' : 'failure'}`}
                      >
                        <span className="roll__verdict">
                          {lastMoment.resolution.roll.success ? t.season.success : t.season.failure}
                        </span>
                        <span className="roll__detail">
                          {t.season.rollOf} {attributeName(lastMoment.resolution.roll.attribute)} ·{' '}
                          {Math.round(lastMoment.resolution.roll.chance * 100)}% {t.season.chance}
                        </span>
                      </div>
                    )}
                    <p className="event-result__text">
                      {fillMomentText(lastMoment.resolution.text, career, live)}
                    </p>
                    <EffectChips
                      effects={lastMoment.effects}
                      currency={careerCurrency(career)}
                      scale={careerScale(career)}
                    />
                  </div>
                )}
              </>
            )
          )}
        </article>

        <aside className="panel match-timeline">
          <h2 className="panel-title">{t.match.timeline}</h2>
          <ol>
            {timeline.map((entry, i) => (
              <li key={i} className={`timeline-item timeline-item--${entry.tone}`}>
                <span className="timeline-item__minute">{`${entry.minute}'`}</span>
                <span>{entry.text}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <footer className="action-bar action-bar--wide">
        <span />
        {lineup ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={startMatch}
            autoFocus
            data-testid="start-match"
          >
            {role === 'noConvocado' ? t.match.watch : t.match.play}
          </button>
        ) : finished ? (
          <button type="button" className="btn btn--primary" onClick={finishMatch} autoFocus>
            {nextIsMatch ? t.match.play : t.match.continueSeason}
          </button>
        ) : (
          lastMoment && (
            <button type="button" className="btn btn--primary" onClick={continueMatch} autoFocus>
              {over ? t.match.toFinal : t.match.nextMoment}
            </button>
          )
        )}
      </footer>
    </div>
  )
}
