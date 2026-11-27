import { useState } from 'react'
import { AttributeBar } from '../components/AttributeBar'
import { ClubCrest } from '../components/ClubCrest'
import { Stars } from '../components/Stars'
import { Stepper } from '../components/Stepper'
import { ATTRIBUTE_GROUPS, ATTRIBUTES, normalizeAttributes } from '../data/attributes'
import { divisionName, getClubOffers } from '../data/clubs'
import { COUNTRY_CURRENCY, formatMoney } from '../data/currencies'
import { attributeScale, getGameModeInfo } from '../data/gameModes'
import { getNationality } from '../data/nationalities'
import { getOrigin } from '../data/origins'
import { getPosition } from '../data/positions'
import { t } from '../i18n'
import { computeAttributes } from '../logic/career'
import { roleFromMinutes } from '../logic/finance'
import { attributeScore } from '../logic/rating'
import { useGameStore } from '../store/gameStore'

/** Último paso de "Nueva partida": todo lo elegido y el botón de firmar el contrato. */
export function CreationSummary(): React.JSX.Element {
  const draft = useGameStore((s) => s.draft)
  const signContract = useGameStore((s) => s.signContract)
  const previousStep = useGameStore((s) => s.previousStep)
  const [signing, setSigning] = useState(false)

  const originId = draft.originId ?? draft.extraOriginId
  const origin = getOrigin(originId)
  const mode = draft.mode
  const max = attributeScale(mode)
  const attributes = computeAttributes(originId, draft.allocation, mode)
  const score = Math.round(attributeScore(normalizeAttributes(attributes, max)))
  const nationality = getNationality(draft.character.nationalityId)
  const offer = getClubOffers(draft.character.nationalityId, originId, draft.offerSeed).find(
    (o) => o.club.id === draft.clubId
  )

  const sign = async (): Promise<void> => {
    setSigning(true)
    await signContract()
  }

  return (
    <div className="screen creation-summary">
      <Stepper current="creationSummary" />
      <header className="screen-header">
        <h1 className="screen-title">{t.creationSummary.title}</h1>
        <p className="screen-subtitle">{t.creationSummary.subtitle}</p>
      </header>

      <div className="creation-summary__grid">
        <section className="panel creation-summary__player" data-testid="summary-player">
          <h2 className="panel-title">{t.creationSummary.player}</h2>
          <div className="summary__player">
            <img className="summary__flag" src={nationality.flag} alt="" />
            <div>
              <strong className="summary__name">{draft.character.name}</strong>
              <span className="summary__origin">
                {draft.character.sex === 'M' ? '♂' : '♀'} · {nationality.name}
              </span>
            </div>
          </div>
          <div className="rating creation-summary__rating">
            <span className="rating__value">{score}</span>
            <span className="rating__label">{t.attributes.overall}</span>
          </div>
          <dl className="creation-summary__facts">
            <div>
              <dt>{t.creationSummary.position}</dt>
              <dd>{getPosition(draft.character.position).name}</dd>
            </div>
            <div>
              <dt>{t.creationSummary.foot}</dt>
              <dd data-testid="summary-foot">{t.creation.feet[draft.character.foot]}</dd>
            </div>
            <div>
              <dt>{t.creationSummary.age}</dt>
              <dd>
                {origin.startAge} {t.creationSummary.years}
              </dd>
            </div>
            <div>
              <dt>{t.creationSummary.origin}</dt>
              <dd>{origin.name}</dd>
            </div>
            <div>
              <dt>{t.creationSummary.mode}</dt>
              <dd>
                {getGameModeInfo(mode.id).name} · {mode.seasons} {t.creationSummary.seasons}
              </dd>
            </div>
          </dl>
        </section>

        <section className="panel creation-summary__attrs" data-testid="summary-attributes">
          <h2 className="panel-title">
            {t.creationSummary.attributes}{' '}
            <span className="field__hint">{t.attributes.scale.replace('{n}', String(max))}</span>
          </h2>
          <div className="creation-summary__attr-list">
            {ATTRIBUTE_GROUPS.map((group) => (
              <div key={group} className="attr-group">
                <h3 className="attr-group__title">{t.attributeGroups[group]}</h3>
                {ATTRIBUTES.filter((a) => a.group === group).map((attr) => (
                  <div
                    key={attr.id}
                    className="attr-row attr-row--readonly"
                    title={attr.description}
                  >
                    <span className="attr-row__name">{attr.name}</span>
                    <AttributeBar value={attributes[attr.id]} max={max} />
                    <span className="attr-row__value">{attributes[attr.id]}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {offer && (
          <section className="panel creation-summary__contract" data-testid="summary-contract">
            <h2 className="panel-title">{t.creationSummary.contract}</h2>
            {offer.originTag && <span className="offer__tag">{offer.originTag}</span>}
            <ClubCrest club={offer.club} size={72} />
            <span className="offer__name" data-testid="summary-club">
              {offer.club.name}
            </span>
            <span className="offer__city">
              {offer.club.city} · {t.club.tiers[offer.club.tier]}
            </span>
            <Stars value={offer.club.prestige} />
            <dl className="creation-summary__facts">
              <div>
                <dt>{t.creationSummary.division}</dt>
                <dd>{divisionName(offer.club.countryId, offer.club.division)}</dd>
              </div>
              <div>
                <dt>{t.creationSummary.role}</dt>
                <dd>{t.game.contractRoles[roleFromMinutes(offer.minutes)]}</dd>
              </div>
              <div>
                <dt>{t.club.minutes}</dt>
                <dd>{t.game.offerMinutes[offer.minutes]}</dd>
              </div>
              <div>
                <dt>{t.club.wage}</dt>
                <dd>
                  {formatMoney(offer.weeklyWage, COUNTRY_CURRENCY[offer.club.countryId])}
                  {t.club.perWeek}
                </dd>
              </div>
              <div>
                <dt>{t.creationSummary.duration}</dt>
                <dd>{t.creationSummary.durationValue}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={previousStep}>
          {t.back}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={sign}
          disabled={!offer || signing}
          data-testid="sign-contract"
        >
          {t.creationSummary.sign}
        </button>
      </footer>
    </div>
  )
}
