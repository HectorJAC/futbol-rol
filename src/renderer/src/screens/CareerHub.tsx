import { AttributeBar } from '../components/AttributeBar'
import { ClubCrest } from '../components/ClubCrest'
import { Stars } from '../components/Stars'
import { ATTRIBUTE_GROUPS, ATTRIBUTES, SET_PIECE_ATTRIBUTES } from '../data/attributes'
import { divisionName, getClub } from '../data/clubs'
import { getGameModeInfo, isDecisionSeason } from '../data/gameModes'
import { getNationality } from '../data/nationalities'
import { getOrigin } from '../data/origins'
import { getPosition } from '../data/positions'
import { formatMoney } from '../data/shop'
import { fill, ordinal, t } from '../i18n'
import { divisionOf } from '../logic/competitions'
import {
  careerScale,
  SET_PIECE_LABELS,
  setPieceRoles,
  setPieceThreshold
} from '../logic/playerAttributes'
import { formatMarketValue, marketValue, playerRating } from '../logic/rating'
import { familyStatus } from '../logic/relationships'
import {
  careerCurrency,
  isCareerOver,
  seasonYearLabel,
  squadStatus,
  type SquadStatus
} from '../logic/season'
import { isMarketPending } from '../logic/transfers'
import { useGameStore } from '../store/gameStore'

const SQUAD_ORDER: SquadStatus[] = ['reserva', 'suplente', 'rotacion', 'titular', 'indiscutible']

/** Centro de la carrera: ficha, situación en el club y acceso a la temporada y a la Sala de trofeos. */
export function CareerHub(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const saveStatus = useGameStore((s) => s.saveStatus)
  const saveCareer = useGameStore((s) => s.saveCareer)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const playSeason = useGameStore((s) => s.playSeason)
  const openTrophyRoom = useGameStore((s) => s.openTrophyRoom)
  const openRelationships = useGameStore((s) => s.openRelationships)
  const openCompetitions = useGameStore((s) => s.openCompetitions)
  const openContract = useGameStore((s) => s.openContract)
  const openTrainingPoints = useGameStore((s) => s.openTrainingPoints)
  const openClubSearch = useGameStore((s) => s.openClubSearch)
  const marketMessage = useGameStore((s) => s.marketMessage)

  if (!career) return <></>
  const lastSeason = career.history.at(-1)

  const { character } = career
  const nationality = getNationality(character.nationalityId)
  const position = getPosition(character.position)
  const origin = getOrigin(career.originId)
  const club = getClub(career.clubId)
  const over = isCareerOver(career)
  const decisionSeason = isDecisionSeason(career.mode, career.season)
  const modeName = getGameModeInfo(career.mode.id).name
  const seasonShown = over ? career.mode.seasons : career.season
  const division = divisionName(club.countryId, divisionOf(career.divisions, career.clubId))
  const pendingPoints = career.pendingPoints
  const currency = careerCurrency(career)
  const max = careerScale(career)
  const setPieceMin = setPieceThreshold(career)
  const roles = setPieceRoles(career)
  const takerOf = SET_PIECE_ATTRIBUTES.filter((id) => roles[id]).map((id) => SET_PIECE_LABELS[id])
  const canSpend = pendingPoints > 0 && !over
  const target = career.transferTarget ? getClub(career.transferTarget.clubId) : null
  const squad = squadStatus(career)
  const squadLevel = SQUAD_ORDER.indexOf(squad.status)

  const saveLabel = {
    idle: t.hub.save,
    saving: t.hub.saving,
    saved: t.hub.saved,
    error: t.hub.saveError
  }[saveStatus]

  const exit = async (): Promise<void> => {
    await saveCareer()
    backToMenu()
  }

  return (
    <div className="screen hub">
      <header className="hub__header">
        <div>
          <span className="eyebrow" data-testid="hub-season">
            {t.hub.eyebrow} {seasonShown} {t.hub.seasonOf} {career.mode.seasons} ·{' '}
            {seasonYearLabel(seasonShown)} · {fill(t.hub.modeLabel, { mode: modeName })}
          </span>
          <div className="hub__name-row">
            <h1 className="screen-title hub__title" data-testid="hub-player-name">
              {character.name}
            </h1>
            <img
              className="hub__flag"
              src={nationality.flag}
              alt={nationality.name}
              title={nationality.name}
              data-testid="hub-flag"
            />
          </div>
        </div>
        <div className="hub__badges">
          <div className="hub__club-badge">
            <ClubCrest club={club} size={44} />
            <div>
              <strong data-testid="hub-club-name">
                {club.name}
                {career.captaincy && (
                  <span className="captain-badge" title={t.hub.captain} data-testid="captain-badge">
                    C
                  </span>
                )}
              </strong>
              <span data-testid="hub-division">{division}</span>
            </div>
          </div>
          <div className="hub__wage-badge" data-testid="hub-wage">
            <span>{t.hub.wage}</span>
            <strong>
              {formatMoney(career.contract.weeklyWage, currency)}
              {t.club.perWeek}
            </strong>
          </div>
        </div>
      </header>

      {over && (
        <p
          className="hub__message hub__message--gold"
          role="status"
          data-testid="career-over-banner"
        >
          <strong>{t.hub.careerOver}.</strong> {t.hub.careerOverText}
        </p>
      )}

      {canSpend && (
        <p className="hub__message hub__message--gold" role="status" data-testid="points-banner">
          {t.hub.pointsPending.replace('{n}', String(pendingPoints))}
        </p>
      )}

      {career.flags.captainNamedSeason === career.season && career.captaincy && (
        <p className="hub__message" role="status" data-testid="captain-message">
          {t.hub.captainNamed}
        </p>
      )}

      {marketMessage && (
        <p className="hub__message" role="status" data-testid="market-message">
          {marketMessage}
        </p>
      )}

      <div className="hub__grid">
        <section className="panel hub-card">
          <div className="rating rating--compact">
            <span className="rating__value" data-testid="hub-rating">
              {playerRating(career)}
            </span>
            <span className="rating__label">{t.hub.overall}</span>
          </div>
          <dl className="info-list">
            <div>
              <dt>{t.creation.positionLabel}</dt>
              <dd>
                <span className="tag">{position.short}</span> {position.name}
              </dd>
            </div>
            <div>
              <dt>{t.creation.footLabel}</dt>
              <dd data-testid="hub-foot">{t.creation.feet[character.foot]}</dd>
            </div>
            <div>
              <dt>{t.creation.nationalityLabel}</dt>
              <dd>{nationality.name}</dd>
            </div>
            <div>
              <dt>{t.hub.age}</dt>
              <dd>
                {career.age} {t.origin.years}
              </dd>
            </div>
            <div>
              <dt>{t.national.caps}</dt>
              <dd data-testid="hub-caps">
                {career.history.reduce((sum, r) => sum + (r.nationalTeam?.caps ?? 0), 0)}
              </dd>
            </div>
            <div>
              <dt>{t.hub.origin}</dt>
              <dd>{origin.name}</dd>
            </div>
            <div>
              <dt>{t.hub.money}</dt>
              <dd data-testid="hub-money">{formatMoney(career.money, currency)}</dd>
            </div>
            <div>
              <dt>{t.hub.marketValue}</dt>
              <dd data-testid="hub-market-value">
                {formatMarketValue(marketValue(career), currency)}
              </dd>
            </div>
            <div>
              <dt>{t.hub.family}</dt>
              <dd data-testid="hub-family">{familyStatus(career)}</dd>
            </div>
          </dl>
        </section>

        <section
          className={`panel hub-attrs hub-attrs--compact${canSpend ? ' hub-attrs--clickable' : ''}`}
          onClick={canSpend ? openTrainingPoints : undefined}
          onKeyDown={
            canSpend
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openTrainingPoints()
                  }
                }
              : undefined
          }
          role={canSpend ? 'button' : undefined}
          tabIndex={canSpend ? 0 : undefined}
          title={canSpend ? t.hub.attributesHint : undefined}
          data-testid="hub-attributes"
        >
          <h2 className="panel-title hub-attrs__title">
            {t.hub.attributes}
            <span className="hub-attrs__scale">1–{max}</span>
            {canSpend && (
              <span className="hub-attrs__points" data-testid="hub-attributes-points">
                +{pendingPoints} {t.hub.pointsShort}
              </span>
            )}
          </h2>
          {ATTRIBUTE_GROUPS.map((group) =>
            ATTRIBUTES.filter((a) => a.group === group).map((attr) => {
              const setPiece = group === 'Balón parado'
              const taker = setPiece && career.attributes[attr.id] >= setPieceMin
              return (
                <div
                  key={attr.id}
                  className={`attr-row attr-row--readonly${setPiece ? ' attr-row--set-piece' : ''}`}
                  title={attr.description}
                >
                  <span className="attr-row__name">
                    {attr.name}
                    {taker && <span className="taker-tag">{t.hub.setPieces}</span>}
                  </span>
                  <AttributeBar value={career.attributes[attr.id]} max={max} />
                  <span className="attr-row__value">{career.attributes[attr.id]}</span>
                </div>
              )
            })
          )}
          {/* Que eres el lanzador se descubre al llegar al nivel: no se dice cuál es. */}
          {takerOf.length > 0 && (
            <p className="hub-attrs__takers" data-testid="hub-set-pieces">
              {t.hub.setPieces}: {takerOf.join(' · ')}
            </p>
          )}
        </section>

        <section className="panel hub-next">
          <div className="hub-next__club">
            <ClubCrest club={club} size={44} />
            <div>
              <strong>{club.name}</strong>
              <span>
                {club.city} · {t.club.tiers[club.tier]}
              </span>
              <span className="hub-next__stars">
                {t.club.prestige} <Stars value={club.prestige} />
              </span>
            </div>
          </div>

          <div>
            <h2 className="panel-title">{t.hub.standing}</h2>
            {(
              [
                ['trust', t.hub.trust],
                ['morale', t.hub.morale],
                ['reputation', t.hub.reputation]
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="meter" data-testid={`meter-${key}`}>
                <span className="meter__label">{label}</span>
                <span className="meter__bar">
                  <span className="meter__fill" style={{ width: `${career[key]}%` }} />
                </span>
                <span className="meter__value">{career[key]}</span>
              </div>
            ))}
            <div
              className={`meter meter--squad squad--${squad.status}`}
              title={t.hub.squadHint}
              data-testid="meter-squad"
            >
              <span className="meter__label">{t.hub.squad}</span>
              <span className="squad-level">
                <span className="squad-level__steps" aria-hidden="true">
                  {SQUAD_ORDER.map((level, i) => (
                    <i key={level} className={i <= squadLevel ? 'on' : undefined} />
                  ))}
                </span>
                <b data-testid="hub-squad">{t.hub.squadLevels[squad.status]}</b>
              </span>
            </div>
          </div>

          <nav className="hub-nav" aria-label={t.hub.club}>
            <button
              type="button"
              className="btn btn--secondary btn--compact"
              onClick={openCompetitions}
              data-testid="open-competitions"
            >
              {t.hub.competitions}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--compact"
              onClick={openContract}
              data-testid="open-contract"
            >
              {t.hub.contract}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--compact"
              onClick={openRelationships}
            >
              {t.relationships.title}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--compact"
              onClick={openTrophyRoom}
            >
              {t.hub.trophyRoom}
            </button>
            <button
              type="button"
              className="btn btn--secondary btn--compact"
              onClick={openClubSearch}
              disabled={over}
              data-testid="open-club-search"
            >
              {t.hub.searchClub}
            </button>
          </nav>
          {target && (
            <p className="hub-target" data-testid="hub-target">
              {t.hub.target}: <ClubCrest club={target} size={16} /> <b>{target.name}</b>
            </p>
          )}

          <div className="hub-next__soon">
            {lastSeason ? (
              <>
                <h3>
                  {t.hub.lastSeason} · {lastSeason.yearLabel}
                </h3>
                <p>
                  {lastSeason.goals} {t.summary.goals.toLowerCase()} · {lastSeason.assists}{' '}
                  {t.summary.assists.toLowerCase()} · {lastSeason.matches}{' '}
                  {t.summary.matches.toLowerCase()} · {ordinal(lastSeason.leaguePosition)}{' '}
                  {t.trophies.inLeague} · {lastSeason.trophies.length}{' '}
                  {t.game.titles(lastSeason.trophies.length)}
                </p>
              </>
            ) : (
              <p>{t.hub.noSeasonsShort}</p>
            )}
          </div>
        </section>
      </div>

      <footer className="action-bar action-bar--wide">
        <div className="action-bar__group">
          <button type="button" className="btn btn--secondary" onClick={exit}>
            {t.hub.exit}
          </button>
          <button
            type="button"
            className={`btn btn--ghost${saveStatus === 'saved' ? ' btn--saved' : ''}`}
            onClick={saveCareer}
            disabled={saveStatus === 'saving'}
            data-testid="save-button"
          >
            {saveLabel}
          </button>
        </div>
        <div className="action-bar__group">
          {canSpend && (
            <button
              type="button"
              className="btn btn--secondary"
              onClick={openTrainingPoints}
              data-testid="open-points"
            >
              {t.points.button} ({pendingPoints})
            </button>
          )}
          {over ? (
            <button type="button" className="btn btn--primary" onClick={openTrophyRoom} autoFocus>
              {t.hub.trophyRoom}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--primary"
              onClick={playSeason}
              autoFocus
              title={decisionSeason ? undefined : t.hub.simulateHint}
              data-testid="play-season"
            >
              {isMarketPending(career)
                ? t.market.hubButton
                : career.seasonProgress
                  ? t.hub.resume
                  : decisionSeason
                    ? `${t.hub.play} ${career.season}`
                    : `${t.hub.simulate} ${career.season}`}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
