import { useState } from 'react'
import { ClubCrest } from '../components/ClubCrest'
import { LockIcon } from '../components/icons'
import { Stars } from '../components/Stars'
import { getClub } from '../data/clubs'
import { getNationality, NATIONALITIES, type NationalityId } from '../data/nationalities'
import { COUNTRY_CURRENCY, formatMoney } from '../data/currencies'
import { t } from '../i18n/es'
import { careerCurrency, seasonYearLabel } from '../logic/season'
import { renewedContract } from '../logic/finance'
import { generateTransferMarket, stayRenews } from '../logic/transfers'
import { useGameStore } from '../store/gameStore'

const STAY = '__stay__'

function countryName(id: string): string {
  return NATIONALITIES.some((n) => n.id === id) ? getNationality(id as NationalityId).name : id
}

/** Mercado de verano: ofertas de otros clubes o quedarse. Los clubes rechazados no vuelven a llamar. */
export function TransferMarket(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const resolveMarket = useGameStore((s) => s.resolveMarket)
  const backToHub = useGameStore((s) => s.backToHub)
  const [selected, setSelected] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!career) return <></>
  const current = getClub(career.clubId)
  const market = generateTransferMarket(career)

  const confirm = async (): Promise<void> => {
    if (!selected) return
    setBusy(true)
    await resolveMarket(selected === STAY ? null : selected)
  }

  return (
    <div className="screen market">
      <header className="screen-header">
        <span className="eyebrow">
          {t.market.eyebrow} · {seasonYearLabel(career.season)}
        </span>
        <h1 className="screen-title">{t.market.title}</h1>
        <p className="screen-subtitle">{t.market.subtitle}</p>
      </header>

      <div
        className="offer-grid offer-grid--market"
        role="radiogroup"
        aria-label={t.market.title}
        style={{ gridTemplateColumns: `repeat(${market.offers.length + 1}, 1fr)` }}
      >
        <button
          type="button"
          role="radio"
          aria-checked={selected === STAY}
          className={`offer offer--stay${selected === STAY ? ' offer--selected' : ''}`}
          onClick={() => setSelected(STAY)}
          data-testid="market-stay"
        >
          <span className="offer__tag-slot">
            <span className="offer__tag offer__tag--neutral">{t.market.current}</span>
          </span>
          <ClubCrest club={current} size={64} />
          <span className="offer__name">
            {t.market.stayIn} {current.name}
          </span>
          <span className="offer__city">{current.city}</span>
          <span className="offer__pitch">{t.market.stayPitch}</span>
          <span className="offer__contract" data-testid="stay-contract">
            {stayRenews(career)
              ? `${t.market.renewal}: ${formatMoney(renewedContract(career).weeklyWage, careerCurrency(career))}${t.club.perWeek} · 3 ${t.market.seasons}`
              : `${t.market.contractUntil} ${career.contract.endSeason}`}
          </span>
        </button>

        {market.offers.map((offer) => {
          const isSelected = selected === offer.club.id
          return (
            <button
              key={offer.club.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`offer${isSelected ? ' offer--selected' : ''}`}
              onClick={() => setSelected(offer.club.id)}
              data-testid="market-offer"
            >
              <span className="offer__tag-slot">
                {offer.note && <span className="offer__tag">{offer.note}</span>}
              </span>
              <ClubCrest club={offer.club} size={64} />
              <span className="offer__name">{offer.club.name}</span>
              <span className="offer__city">
                {offer.club.city} ({countryName(offer.club.countryId)}) ·{' '}
                {t.club.tiers[offer.club.tier]}
              </span>
              <dl className="offer__stats">
                <div>
                  <dt>{t.club.prestige}</dt>
                  <dd>
                    <Stars value={offer.club.prestige} />
                  </dd>
                </div>
                <div>
                  <dt>{t.club.minutes}</dt>
                  <dd>{offer.minutes}</dd>
                </div>
                <div>
                  <dt>{t.club.wage}</dt>
                  <dd>
                    {formatMoney(offer.weeklyWage, COUNTRY_CURRENCY[offer.club.countryId])}
                    {t.club.perWeek}
                  </dd>
                </div>
                <div>
                  <dt>{t.market.contract}</dt>
                  <dd>
                    {offer.years} {t.market.seasons}
                  </dd>
                </div>
              </dl>
              <span className="offer__pitch">{offer.pitch}</span>
            </button>
          )
        })}
      </div>

      {market.target && (
        <p
          className={`hub__message${market.target.accepted ? ' hub__message--gold' : ''}`}
          data-testid="market-target"
        >
          {(market.target.accepted ? t.market.targetAccepted : t.market.targetRejected).replace(
            '{club}',
            market.target.club.name
          )}
          {market.target.reasons.length > 0 && ` ${market.target.reasons.join(' · ')}.`}
        </p>
      )}

      {market.closedDoors.length > 0 && (
        <p className="market__closed" data-testid="closed-doors">
          <LockIcon size={14} /> {market.closedDoors.map((d) => d.club.name).join(', ')}:{' '}
          {market.closedDoors[0].reason}
        </p>
      )}

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.season.toHub}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={confirm}
          disabled={!selected || busy}
        >
          {selected === STAY ? t.market.confirmStay : t.market.confirmMove}
        </button>
      </footer>
    </div>
  )
}
