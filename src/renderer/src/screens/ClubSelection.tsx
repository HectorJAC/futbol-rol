import { ClubCrest } from '../components/ClubCrest'
import { Stars } from '../components/Stars'
import { Stepper } from '../components/Stepper'
import { getClubOffers } from '../data/clubs'
import { COUNTRY_CURRENCY, formatMoney } from '../data/currencies'
import { t } from '../i18n/es'
import { useGameStore } from '../store/gameStore'

export function ClubSelection(): React.JSX.Element {
  const draft = useGameStore((s) => s.draft)
  const selectClub = useGameStore((s) => s.selectClub)
  const confirmClub = useGameStore((s) => s.confirmClub)
  const previousStep = useGameStore((s) => s.previousStep)
  const offers = getClubOffers(
    draft.character.nationalityId,
    draft.originId ?? draft.extraOriginId,
    draft.offerSeed
  )

  return (
    <div className="screen clubs">
      <Stepper current="clubSelection" />
      <header className="screen-header">
        <h1 className="screen-title">{t.club.title}</h1>
        <p className="screen-subtitle">{t.club.subtitle}</p>
      </header>

      <div className="offer-grid" role="radiogroup" aria-label={t.club.title}>
        {offers.map((offer) => {
          const selected = offer.club.id === draft.clubId
          return (
            <button
              key={offer.club.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`offer${selected ? ' offer--selected' : ''}`}
              onClick={() => selectClub(offer.club.id)}
            >
              <span className="offer__tag-slot">
                {offer.originTag && <span className="offer__tag">{offer.originTag}</span>}
              </span>
              <ClubCrest club={offer.club} size={72} />
              <span className="offer__name">{offer.club.name}</span>
              <span className="offer__city">
                {offer.club.city} · {t.club.tiers[offer.club.tier]}
              </span>
              <dl className="offer__stats">
                <div>
                  <dt>{t.club.prestige}</dt>
                  <dd>
                    <Stars value={offer.club.prestige} />
                  </dd>
                </div>
                <div>
                  <dt>{t.club.development}</dt>
                  <dd>
                    <Stars value={offer.club.development} />
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
              </dl>
              <span className="offer__pitch">{offer.pitch}</span>
            </button>
          )
        })}
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={previousStep}>
          {t.back}
        </button>
        <span className="field__hint">{draft.clubId ? '' : t.club.choose}</span>
        <button
          type="button"
          className="btn btn--primary"
          onClick={confirmClub}
          disabled={!draft.clubId}
        >
          {t.continue}
        </button>
      </footer>
    </div>
  )
}
