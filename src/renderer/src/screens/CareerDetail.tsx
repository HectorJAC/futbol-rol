import { useState } from 'react'
import { AttributeBar } from '../components/AttributeBar'
import { ClubCrest } from '../components/ClubCrest'
import { TrophyIcon } from '../components/TrophyIcon'
import { ATTRIBUTE_GROUPS, ATTRIBUTES } from '../data/attributes'
import { divisionName, getClub } from '../data/clubs'
import { getGameModeInfo } from '../data/gameModes'
import { getNationality, NATIONALITIES, type NationalityId } from '../data/nationalities'
import { getOrigin } from '../data/origins'
import { getPosition } from '../data/positions'
import { formatMoney, getShopItem } from '../data/shop'
import { getTrophy, TROPHIES } from '../data/trophies'
import { t } from '../i18n/es'
import { purchaseSummary, totalSpent } from '../logic/finance'
import { careerScale } from '../logic/playerAttributes'
import { formatMarketValue, marketValue, playerRating } from '../logic/rating'
import { describeRelationships, describeTeammate, familyStatus } from '../logic/relationships'
import {
  careerCurrency,
  careerTotals,
  isCareerOver,
  seasonYearLabel,
  trophyCounts
} from '../logic/season'
import { useGameStore } from '../store/gameStore'
import type { Career } from '../types/career'

type Tab = 'path' | 'trophies' | 'attributes' | 'relationships' | 'money'

const TABS: Tab[] = ['path', 'trophies', 'attributes', 'relationships', 'money']

function flagOf(id: string): string | undefined {
  return NATIONALITIES.some((n) => n.id === id)
    ? getNationality(id as NationalityId).flag
    : undefined
}

/** Trayectoria: cada temporada con su club, números, posición y copas. */
function PathTab({ career }: { career: Career }): React.JSX.Element {
  if (career.history.length === 0) {
    return <p className="trophy-room__empty">{t.careerDetail.noSeasons}</p>
  }
  return (
    <table className="timeline" data-testid="detail-path">
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
          <th>{t.careerDetail.cup}</th>
          <th>{t.careerDetail.continental}</th>
          <th className="num">{t.careerDetail.titles}</th>
        </tr>
      </thead>
      <tbody>
        {[...career.history].reverse().map((r) => {
          const club = getClub(r.clubId)
          return (
            <tr key={r.season}>
              <td>
                <strong>{r.yearLabel}</strong>
                <span className="timeline__sub">
                  {t.hub.eyebrow} {r.season}
                </span>
              </td>
              <td>
                <span className="timeline__club">
                  <ClubCrest club={club} size={22} />
                  {club.name}
                  {r.captain && (
                    <span className="captain-badge" title={t.hub.captain}>
                      C
                    </span>
                  )}
                </span>
                <span className="timeline__sub">
                  {r.leaguePosition}º {t.trophies.inLeague}
                  {r.division ? ` · ${divisionName(club.countryId, r.division)}` : ''}
                  {r.movement === 'ascenso' && ` · ${t.summary.promoted}`}
                  {r.movement === 'descenso' && ` · ${t.summary.relegated}`}
                </span>
              </td>
              <td className="num">{r.age}</td>
              <td className="num">{r.matches}</td>
              <td className="num">{r.goals}</td>
              <td className="num">{r.assists}</td>
              <td className="num">{r.rating.toFixed(1)}</td>
              <td className="num">
                {r.nationalTeam?.calledUp ? `${r.nationalTeam.caps}/${r.nationalTeam.goals}` : '—'}
              </td>
              <td className="detail__round">{r.cupRound ?? '—'}</td>
              <td className="detail__round">{r.continentalRound ?? '—'}</td>
              <td className="num">
                {r.trophies.length > 0 ? (
                  <span className="records__gold">{r.trophies.length}</span>
                ) : (
                  <span className="timeline__none">—</span>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/** Vitrina con los títulos ganados y en qué temporadas. */
function TrophiesTab({ career }: { career: Career }): React.JSX.Element {
  const counts = trophyCounts(career.history)
  const won = TROPHIES.filter((trophy) => (counts.get(trophy.id) ?? []).length > 0)
  if (won.length === 0) return <p className="trophy-room__empty">{t.careerDetail.noTrophies}</p>
  return (
    <div className="cabinet" data-testid="detail-trophies">
      {won.map((trophy) => {
        const seasons = counts.get(trophy.id) ?? []
        return (
          <div
            key={trophy.id}
            className={`cabinet__item cabinet__item--${trophy.kind}`}
            title={getTrophy(trophy.id).description}
          >
            <TrophyIcon kind={trophy.kind} size={30} />
            <strong className="cabinet__count">×{seasons.length}</strong>
            <span className="cabinet__name">{trophy.name}</span>
            <span className="cabinet__seasons">
              {seasons.map((s) => career.history.find((r) => r.season === s)?.yearLabel).join(', ')}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Ficha y atributos tal y como acabaron (o están ahora). */
function AttributesTab({ career }: { career: Career }): React.JSX.Element {
  const max = careerScale(career)
  const position = getPosition(career.character.position)
  const currency = careerCurrency(career)
  return (
    <div className="detail-attrs" data-testid="detail-attributes">
      <section className="detail-attrs__profile">
        <div className="rating rating--compact">
          <span className="rating__value">{playerRating(career)}</span>
          <span className="rating__label">{t.hub.overall}</span>
        </div>
        <dl className="info-list">
          <div>
            <dt>{t.creation.positionLabel}</dt>
            <dd>{position.name}</dd>
          </div>
          <div>
            <dt>{t.creation.footLabel}</dt>
            <dd>{t.creation.feet[career.character.foot]}</dd>
          </div>
          <div>
            <dt>{t.hub.age}</dt>
            <dd>
              {career.age} {t.origin.years}
            </dd>
          </div>
          <div>
            <dt>{t.hub.origin}</dt>
            <dd>{getOrigin(career.originId).name}</dd>
          </div>
          <div>
            <dt>{t.hub.marketValue}</dt>
            <dd>{formatMarketValue(marketValue(career), currency)}</dd>
          </div>
          <div>
            <dt>{t.hub.family}</dt>
            <dd>{familyStatus(career)}</dd>
          </div>
        </dl>
      </section>
      <section className="detail-attrs__groups">
        {ATTRIBUTE_GROUPS.map((group) => (
          <div key={group} className="detail-attrs__group">
            <h3 className="attr-group__title">{group}</h3>
            {ATTRIBUTES.filter((a) => a.group === group).map((attr) => (
              <div key={attr.id} className="attr-row attr-row--readonly" title={attr.description}>
                <span className="attr-row__name">{attr.name}</span>
                <AttributeBar value={career.attributes[attr.id]} max={max} />
                <span className="attr-row__value">{career.attributes[attr.id]}</span>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  )
}

/** El míster, la familia, la afición y el vestuario (actual y antiguo). */
function RelationshipsTab({ career }: { career: Career }): React.JSX.Element {
  const people = describeRelationships(career)
  const teammates = career.teammates.map((m) => describeTeammate(m, career))
  const ex = career.exTeammates.map((m) => describeTeammate(m, career, true))
  const groups = [
    {
      id: 'people',
      title: t.careerDetail.people,
      items: people.map((r) => ({ ...r, relation: r.value }))
    },
    { id: 'teammates', title: t.careerDetail.teammates, items: teammates },
    { id: 'ex', title: t.careerDetail.exTeammates, items: ex }
  ].filter((g) => g.items.length > 0)
  return (
    <div className="detail-relations" data-testid="detail-relationships">
      {groups.map((group) => (
        <section key={group.id} className={`detail-relations__group--${group.id}`}>
          <h3 className="panel-title">{group.title}</h3>
          <ul className="detail-relations__list">
            {group.items.map((r) => (
              <li key={r.id} className={`detail-relation relationship--${r.level}`}>
                <div>
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                </div>
                {r.relation !== undefined && (
                  <span className="relationship__meter" aria-hidden="true">
                    <span style={{ width: `${r.relation}%` }} />
                  </span>
                )}
                <span className="relationship__level">
                  {t.relationships.levels[r.level]}
                  {r.relation !== undefined && ` · ${r.relation}`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/** Contrato, ingresos de cada temporada (sueldo, primas y eventos) y compras. */
function MoneyTab({ career }: { career: Career }): React.JSX.Element {
  const currency = careerCurrency(career)
  const money = (amount: number): string => formatMoney(amount, currency)
  const contract = career.contract
  const club = getClub(contract.clubId)
  const seasons = career.history.filter((r) => r.earnings)
  const earned = seasons.reduce((sum, r) => {
    const e = r.earnings as NonNullable<typeof r.earnings>
    return sum + e.salary + e.goalBonus + e.titleBonus + e.events
  }, 0)
  return (
    <div className="detail-money" data-testid="detail-money">
      <section>
        <h3 className="panel-title">
          {isCareerOver(career) ? t.careerDetail.lastContract : t.careerDetail.currentContract}
        </h3>
        <div className="summary-club">
          <ClubCrest club={club} size={40} />
          <div>
            <strong>{club.name}</strong>
            <span>
              {t.contract.role}: <b>{contract.role}</b>
            </span>
          </div>
        </div>
        <dl className="info-list">
          <div>
            <dt>{t.contract.wage}</dt>
            <dd>
              {money(contract.weeklyWage)}
              {t.contract.perWeek}
            </dd>
          </div>
          <div>
            <dt>{t.contract.until}</dt>
            <dd>
              {contract.endSeason} ({seasonYearLabel(contract.endSeason)})
            </dd>
          </div>
          <div>
            <dt>{t.contract.releaseClause}</dt>
            <dd>{money(contract.releaseClause)}</dd>
          </div>
          <div>
            <dt>{t.hub.money}</dt>
            <dd>{money(career.money)}</dd>
          </div>
          <div>
            <dt>{t.careerDetail.totalEarned}</dt>
            <dd>{money(earned)}</dd>
          </div>
          <div>
            <dt>{t.contract.spent}</dt>
            <dd>{money(totalSpent(career))}</dd>
          </div>
        </dl>
      </section>
      <section>
        <h3 className="panel-title">{t.careerDetail.earnings}</h3>
        {seasons.length === 0 ? (
          <p className="field__hint">{t.contract.noEarnings}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.trophies.season}</th>
                <th>{t.hub.club}</th>
                <th className="num">{t.contract.salary}</th>
                <th className="num">{t.contract.bonuses}</th>
                <th className="num">{t.contract.total}</th>
              </tr>
            </thead>
            <tbody>
              {[...seasons].reverse().map((r) => {
                const e = r.earnings as NonNullable<typeof r.earnings>
                return (
                  <tr key={r.season}>
                    <td>{r.yearLabel}</td>
                    <td>{getClub(r.clubId).name}</td>
                    <td className="num">{money(e.salary)}</td>
                    <td className="num">{money(e.goalBonus + e.titleBonus + e.events)}</td>
                    <td className="num">
                      <strong>{money(e.salary + e.goalBonus + e.titleBonus + e.events)}</strong>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        <h3 className="panel-title detail-money__purchases">{t.careerDetail.purchases}</h3>
        {career.purchases.length === 0 ? (
          <p className="field__hint">{t.careerDetail.noPurchases}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t.trophies.season}</th>
                <th>{t.contract.item}</th>
                <th className="num">{t.contract.cost}</th>
                <th>{t.contract.gained}</th>
              </tr>
            </thead>
            <tbody>
              {[...career.purchases].reverse().map((p, i) => (
                <tr key={`${p.itemId}-${p.season}-${i}`}>
                  <td>{seasonYearLabel(p.season)}</td>
                  <td>{getShopItem(p.itemId).name}</td>
                  <td className="num">{money(p.cost)}</td>
                  <td>{purchaseSummary(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

/** Records → una carrera: todos sus detalles (títulos, clubes, números, relaciones…). */
export function CareerDetail(): React.JSX.Element {
  const career = useGameStore((s) => s.recordCareer)
  const backToRecords = useGameStore((s) => s.backToRecords)
  const [tab, setTab] = useState<Tab>('path')
  if (!career) return <></>

  const totals = careerTotals(career.history)
  const trophies = career.history.flatMap((r) => r.trophies.map(getTrophy))
  const caps = career.history.reduce((sum, r) => sum + (r.nationalTeam?.caps ?? 0), 0)
  const club = getClub(career.clubId)
  const flag = flagOf(career.character.nationalityId)
  const over = isCareerOver(career)
  const nationality = NATIONALITIES.some((n) => n.id === career.character.nationalityId)
    ? getNationality(career.character.nationalityId).name
    : career.character.nationalityId

  return (
    <div className="screen career-detail">
      <header className="trophy-room__header">
        <div>
          <span className="eyebrow">{t.careerDetail.eyebrow}</span>
          <div className="hub__name-row">
            <h1 className="screen-title" data-testid="detail-name">
              {career.character.name}
            </h1>
            {flag && <img className="hub__flag" src={flag} alt={nationality} title={nationality} />}
          </div>
          <p className="career-detail__meta" data-testid="detail-meta">
            <ClubCrest club={club} size={18} /> {club.name} · {getGameModeInfo(career.mode.id).name}{' '}
            ·{' '}
            {over
              ? t.careerDetail.retired
              : t.careerDetail.seasonOf
                  .replace('{n}', String(career.season))
                  .replace('{total}', String(career.mode.seasons))}
          </p>
        </div>
        <div className="trophy-totals">
          <div>
            <strong>{career.history.length}</strong>
            <span>{t.careerDetail.seasons}</span>
          </div>
          <div>
            <strong>{totals.matches}</strong>
            <span>{t.summary.matches}</span>
          </div>
          <div>
            <strong data-testid="detail-goals">{totals.goals}</strong>
            <span>{t.summary.goals}</span>
          </div>
          <div>
            <strong>{totals.assists}</strong>
            <span>{t.summary.assists}</span>
          </div>
          <div>
            <strong>{caps}</strong>
            <span>{t.national.caps}</span>
          </div>
          <div>
            <strong>{trophies.length}</strong>
            <span>{t.careerDetail.titles}</span>
          </div>
        </div>
      </header>

      <div className="tabs" role="tablist">
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab${tab === id ? ' tab--active' : ''}`}
            onClick={() => setTab(id)}
            data-testid={`detail-tab-${id}`}
          >
            {t.careerDetail.tabs[id]}
          </button>
        ))}
      </div>

      <section className="panel trophy-room__body">
        {tab === 'path' && <PathTab career={career} />}
        {tab === 'trophies' && <TrophiesTab career={career} />}
        {tab === 'attributes' && <AttributesTab career={career} />}
        {tab === 'relationships' && <RelationshipsTab career={career} />}
        {tab === 'money' && <MoneyTab career={career} />}
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToRecords}>
          {t.careerDetail.back}
        </button>
      </footer>
    </div>
  )
}
