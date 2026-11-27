import { ClubCrest } from '../components/ClubCrest'
import { TrophyIcon } from '../components/TrophyIcon'
import { ATTRIBUTES } from '../data/attributes'
import { cupName, divisionName, getClub } from '../data/clubs'
import { TOURNAMENT_NAMES } from '../data/nationalTeams'
import { COUNTRY_CURRENCY } from '../data/currencies'
import { formatMoney } from '../data/shop'
import { getTrophy } from '../data/trophies'
import { roundName, t } from '../i18n'
import { maxTrainingPointsFor } from '../data/gameModes'
import { CONTINENTAL_NAME, continentalFormat, roundLabel, slotsFor } from '../logic/competitions'
import { careerTotals, isCareerOver } from '../logic/season'
import { isMarketPending } from '../logic/transfers'
import { useGameStore } from '../store/gameStore'
import type { CompetitionId, SeasonRecord } from '../types/career'

/**
 * Texto del último partido de tu club en una copa: con quién caíste (o la final
 * que ganaste). Se muestra al pasar el cursor por encima de la ronda.
 */
function lastCupMatch(record: SeasonRecord, competition: CompetitionId): string | null {
  const matches = (record.clubMatches ?? []).filter((m) => m.competition === competition)
  const last = matches.at(-1)
  if (!last) return null
  const own = getClub(record.clubId).name
  const rival = getClub(last.opponentId).name
  const [home, away] = last.home ? [own, rival] : [rival, own]
  const [hg, ag] = last.home
    ? [last.goalsFor, last.goalsAgainst]
    : [last.goalsAgainst, last.goalsFor]
  const pens = last.penalties
    ? ` (${last.home ? last.penalties.for : last.penalties.against}-${last.home ? last.penalties.against : last.penalties.for} pen.)`
    : ''
  const slot = record.setup ? slotsFor(record.setup)[last.slot] : undefined
  const round = slot && record.setup ? roundLabel(slot, record.setup) : ''
  return `${round ? `${round}: ` : ''}${home} ${hg}-${ag} ${away}${pens}`
}

/** Resumen al terminar una temporada: estadísticas, títulos y progresión. */
export function SeasonSummary(): React.JSX.Element {
  const record = useGameStore((s) => s.lastRecord)
  const backToHub = useGameStore((s) => s.backToHub)
  const openTrophyRoom = useGameStore((s) => s.openTrophyRoom)
  const openMarket = useGameStore((s) => s.openMarket)
  const openTrainingPoints = useGameStore((s) => s.openTrainingPoints)
  const skipTrainingPoints = useGameStore((s) => s.skipTrainingPoints)
  const marketPending = useGameStore((s) => (s.career ? isMarketPending(s.career) : false))
  const career = useGameStore((s) => s.career)

  if (!record) return <></>
  const retired = career ? isCareerOver(career) : false
  const totals = career ? careerTotals(career.history) : null
  const earnings = record.earnings
  const earned = earnings
    ? earnings.salary + earnings.goalBonus + earnings.titleBonus + earnings.events
    : 0
  const club = getClub(record.clubId)
  const currency = COUNTRY_CURRENCY[club.countryId]
  const changes = ATTRIBUTES.filter(({ id }) => record.attributeChanges[id])
  const pendingPoints = career?.pendingPoints ?? 0
  const cupTooltip = lastCupMatch(record, 'copa')
  const continentalTooltip = lastCupMatch(record, 'continental')

  return (
    <div className="screen summary-screen">
      <header className="screen-header">
        <span className="eyebrow">
          {t.summary.eyebrow} {record.season} · {record.yearLabel}
        </span>
        <h1 className="screen-title">{t.summary.title}</h1>
        {retired && totals && (
          <p className="summary-retired" data-testid="career-over">
            <strong>{t.summary.retired}.</strong> {t.summary.retiredText} {record.age}{' '}
            {t.origin.years}: {totals.matches} {t.summary.matches.toLowerCase()}, {totals.goals}{' '}
            {t.summary.goals.toLowerCase()} y {totals.assists} {t.summary.assists.toLowerCase()}.
          </p>
        )}
      </header>

      <div className="summary-grid">
        <section className="panel">
          <div className="summary-club">
            <ClubCrest club={club} size={48} />
            <div>
              <strong>{club.name}</strong>
              <span>
                {record.division ? `${divisionName(club.countryId, record.division)} · ` : ''}
                {t.summary.position}: <b data-testid="league-position">{record.leaguePosition}º</b>
              </span>
              {record.movement && (
                <span
                  className={`movement movement--${record.movement}`}
                  data-testid="league-movement"
                >
                  {record.movement === 'ascenso' ? t.summary.promoted : t.summary.relegated}
                </span>
              )}
            </div>
          </div>
          <div className="stat-tiles">
            <div className="stat-tile">
              <span className="stat-tile__value" data-testid="season-matches">
                {record.matches}
              </span>
              <span className="stat-tile__label">{t.summary.matches}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__value" data-testid="season-goals">
                {record.goals}
              </span>
              <span className="stat-tile__label">{t.summary.goals}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__value">{record.assists}</span>
              <span className="stat-tile__label">{t.summary.assists}</span>
            </div>
            <div className="stat-tile">
              <span className="stat-tile__value">{record.rating.toFixed(1)}</span>
              <span className="stat-tile__label">{t.summary.rating}</span>
            </div>
          </div>
          <div className="national-line" data-testid="national-line">
            <span className="national-line__label">{t.national.title}</span>
            {record.nationalTeam?.calledUp ? (
              <span>
                {record.nationalTeam.caps} {t.summary.matches.toLowerCase()} ·{' '}
                {record.nationalTeam.goals} {t.summary.goals.toLowerCase()}
                {record.nationalTeam.tournament && (
                  <>
                    {' '}
                    · {TOURNAMENT_NAMES[record.nationalTeam.tournament.id]}:{' '}
                    <b>{roundName(record.nationalTeam.tournament.round)}</b>
                  </>
                )}
              </span>
            ) : (
              <span className="national-line__off">{t.national.notCalled}</span>
            )}
          </div>
          {earnings && (
            <div className="national-line" data-testid="season-earnings">
              <span className="national-line__label">{t.summary.earnings}</span>
              <span>
                <b>{formatMoney(earned, currency)}</b> ({t.contract.salary.toLowerCase()}{' '}
                {formatMoney(earnings.salary, currency)} · {t.contract.bonuses.toLowerCase()}{' '}
                {formatMoney(earnings.goalBonus + earnings.titleBonus, currency)}
                {earnings.events !== 0 &&
                  ` · ${t.contract.events.toLowerCase()} ${formatMoney(earnings.events, currency)}`}
                )
              </span>
            </div>
          )}
          <h2 className="panel-title summary-progress-title">{t.summary.progress}</h2>
          {changes.length === 0 ? (
            <p className="field__hint">{t.summary.noProgress}</p>
          ) : (
            <ul className="modifier-list">
              {changes.map(({ id, name }) => {
                const delta = record.attributeChanges[id] ?? 0
                return (
                  <li key={id} className={`modifier modifier--${delta > 0 ? 'up' : 'down'}`}>
                    {delta > 0 ? `+${delta}` : delta} {name}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="panel summary-trophies">
          {record.cupRound !== undefined && (
            <div className="national-line">
              <span className="national-line__label">{t.summary.cup}</span>
              <span>
                {cupName(club.countryId)}:{' '}
                <b
                  className={cupTooltip ? 'has-tooltip' : undefined}
                  data-tooltip={cupTooltip ?? undefined}
                  data-testid="cup-round"
                >
                  {roundName(record.cupRound)}
                </b>
              </span>
            </div>
          )}
          {record.clubMatches && (
            <div className="national-line">
              <span className="national-line__label">{t.summary.continental}</span>
              <span>
                {record.setup ? continentalFormat(record.setup).name : CONTINENTAL_NAME}:{' '}
                <b
                  className={continentalTooltip ? 'has-tooltip' : undefined}
                  data-tooltip={continentalTooltip ?? undefined}
                  data-testid="continental-round"
                >
                  {record.continentalRound
                    ? roundName(record.continentalRound)
                    : t.summary.notQualified}
                </b>
              </span>
            </div>
          )}
          {record.trainingPoints !== undefined && (
            <div className="national-line" data-testid="season-points">
              <span className="national-line__label">{t.summary.points}</span>
              <span>
                <b>
                  {record.trainingPoints} / {career ? maxTrainingPointsFor(career.mode) : 5}
                </b>{' '}
                {t.summary.pointsHint}
              </span>
            </div>
          )}
          {(record.becameCaptain || record.lostCaptaincy) && (
            <div className="national-line" data-testid="season-captaincy">
              <span className="national-line__label">{t.hub.captain}</span>
              <span>
                <b>{record.becameCaptain ? t.summary.becameCaptain : t.summary.lostCaptaincy}</b>
              </span>
            </div>
          )}
          <h2 className="panel-title summary-trophies__title">{t.summary.trophies}</h2>
          {record.trophies.length === 0 ? (
            <p className="summary-trophies__empty">{t.summary.noTrophies}</p>
          ) : (
            <ul className="trophy-list" data-testid="season-trophies">
              {record.trophies.map((id) => {
                const trophy = getTrophy(id)
                return (
                  <li key={id} className={`trophy-chip trophy-chip--${trophy.kind}`}>
                    <TrophyIcon kind={trophy.kind} />
                    <div>
                      <strong>{trophy.name}</strong>
                      <span>{trophy.description}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={openTrophyRoom}>
          {t.hub.trophyRoom}
        </button>
        {pendingPoints > 0 && !retired ? (
          <div className="action-bar__group">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={skipTrainingPoints}
              data-testid="summary-skip-points"
            >
              {t.points.skip}
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={openTrainingPoints}
              autoFocus
              data-testid="summary-continue"
            >
              {`${t.points.button} (${pendingPoints})`}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={marketPending && !retired ? openMarket : backToHub}
            autoFocus
            data-testid="summary-continue"
          >
            {marketPending && !retired ? t.market.hubButton : t.continue}
          </button>
        )}
      </footer>
    </div>
  )
}
