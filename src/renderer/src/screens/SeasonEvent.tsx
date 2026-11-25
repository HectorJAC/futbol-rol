import { useMemo, useState } from 'react'
import { EffectChips } from '../components/EffectChips'
import { MateText } from '../components/MateText'
import { LockIcon } from '../components/icons'
import { NextMatch } from '../components/NextMatch'
import { RecentResults } from '../components/RecentResults'
import { ATTRIBUTES } from '../data/attributes'
import { getEvent } from '../data/events'
import { t } from '../i18n/es'
import { leagueRounds, slotsFor } from '../logic/competitions'
import { careerScale, scaledDeltas } from '../logic/playerAttributes'
import { featuredExTeammate, mentionedTeammates } from '../logic/teammates'
import { formatMoney } from '../data/shop'
import {
  advanceSeason,
  careerCurrency,
  checkChance,
  consequenceSources,
  eventOptions,
  fillEventText,
  isOptionLocked,
  optionCost,
  seasonStep,
  seasonYearLabel
} from '../logic/season'
import { useGameStore } from '../store/gameStore'

const attributeName = (id: string): string => ATTRIBUTES.find((a) => a.id === id)?.name ?? id

/** Un evento de la temporada: texto, opciones (algunas con tirada) y resultado. */
export function SeasonEvent(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const lastChoice = useGameStore((s) => s.lastChoice)
  const chooseOption = useGameStore((s) => s.chooseOption)
  const continueSeason = useGameStore((s) => s.continueSeason)
  const backToHub = useGameStore((s) => s.backToHub)
  const [showOrigin, setShowOrigin] = useState(false)
  // Tras decidir: si lo siguiente es un partido importante, se ve contra quién
  // y el botón dice "Jugar partido".
  const next = useMemo(() => {
    if (!career || !lastChoice) return null
    const advanced = advanceSeason(career)
    return seasonStep(advanced) === 'match' ? (advanced.seasonProgress?.liveMatch ?? null) : null
  }, [career, lastChoice])
  const nextIsMatch = next !== null

  const progress = career?.seasonProgress
  if (!career || !progress) return <></>

  // Mientras se muestra el resultado, el evento "actual" es el que se acaba de resolver.
  const index = lastChoice ? progress.resolutions.length - 1 : progress.resolutions.length
  const event = getEvent(progress.eventIds[index])
  const isLast = index === progress.eventIds.length - 1
  const leagueRoundsPlayed = slotsFor(progress.setup)
    .slice(0, progress.playedSlots)
    .filter((s) => s.competition === 'liga').length
  // Partidos jugados desde la decisión anterior.
  const fromSlot = index > 0 ? progress.eventSlots[index - 1] : 0
  const origins = event.requiresFlags ? consequenceSources(event, career) : []
  // Excompañero protagonista: el que se eligió al decidir (o el que toca ahora).
  const featured = lastChoice
    ? lastChoice.resolution.featured
    : featuredExTeammate(career, event)?.id
  const exName = career.exTeammates.find((x) => x.id === featured)?.name
  const fill = (text: string): string => fillEventText(text, career, featured)
  const options = eventOptions(event, career)
  // Compañeros que nombra el evento: al pasar el cursor se ve tu relación con ellos.
  const mates = mentionedTeammates(
    career,
    [
      event.title,
      event.text,
      ...options.flatMap((o) => [
        o.label,
        o.outcome?.text ?? '',
        o.check?.success.text ?? '',
        o.check?.failure.text ?? ''
      ])
    ],
    featured
  )
  const rich = (text: string): React.JSX.Element => <MateText text={text} mates={mates} />

  return (
    <div className="screen season-event">
      <header className="season-event__header">
        <span className="eyebrow">
          {t.hub.eyebrow} {career.season} · {seasonYearLabel(career.season)}
        </span>
        <ol className="event-dots" aria-label={t.season.progress}>
          {progress.eventIds.map((id, i) => (
            <li
              key={id}
              className={`event-dot${i < index || (i === index && lastChoice) ? ' event-dot--done' : ''}${i === index ? ' event-dot--current' : ''}`}
            />
          ))}
        </ol>
        <span className="season-event__count" data-testid="event-count">
          {t.season.event} {index + 1} / {progress.eventIds.length} · {t.season.matchday}{' '}
          {leagueRoundsPlayed}/{leagueRounds(progress.setup)}
        </span>
      </header>

      <div className="event-layout">
        <article className="panel event-card">
          {event.story && (
            <span className="event-card__tag event-card__tag--story" data-testid="story-tag">
              {t.season.story}
            </span>
          )}
          {event.requiresFlags && (
            <button
              type="button"
              className="event-card__tag event-card__tag--button"
              onClick={() => setShowOrigin((v) => !v)}
              aria-expanded={showOrigin}
              title={t.season.consequenceHint}
              data-testid="consequence-tag"
            >
              {t.season.consequence} {showOrigin ? '▴' : '▾'}
            </button>
          )}
          {showOrigin && origins.length > 0 && (
            <div className="consequence-origin" data-testid="consequence-origin">
              {origins.map((o, i) => (
                <p key={i}>
                  {o.season !== undefined
                    ? `${t.season.originSeason} ${o.season} (${seasonYearLabel(o.season)})`
                    : t.season.originBefore}
                  : «{o.eventTitle}» → <b>«{o.optionLabel}»</b>
                </p>
              ))}
            </div>
          )}
          <h1 className="event-card__title" data-testid="event-title">
            {rich(fill(event.title))}
          </h1>
          <p className="event-card__text">{rich(fill(event.text))}</p>

          {!lastChoice ? (
            <div className="event-options">
              {options.map((option, i) => {
                const locked = isOptionLocked(event, option, career)
                const chance = option.check
                  ? Math.round(checkChance(career, option.check) * 100)
                  : null
                // Atributos que mejora la opción (si hay tirada, si sale bien).
                const gains = Object.entries(
                  scaledDeltas(
                    (option.outcome ?? option.check?.success)?.effects.attributes ?? {},
                    careerScale(career)
                  )
                ).filter(([, n]) => (n ?? 0) > 0)
                return (
                  <button
                    key={option.label}
                    type="button"
                    className={`event-option${locked ? ' event-option--locked' : ''}`}
                    onClick={() => chooseOption(i)}
                    disabled={locked}
                    title={locked ? t.season.noMoney : undefined}
                    data-testid="event-option"
                  >
                    <span className="event-option__label">
                      <span>{rich(fill(option.label))}</span>
                      {event.showEffects && option.outcome ? (
                        <EffectChips
                          inline
                          effects={option.outcome.effects}
                          currency={careerCurrency(career)}
                          scale={careerScale(career)}
                        />
                      ) : (
                        gains.length > 0 && (
                          <span className="event-option__gains" data-testid="option-gains">
                            {gains.map(([id, n]) => (
                              <span key={id} className="modifier modifier--up">
                                +{n} {attributeName(id)}
                              </span>
                            ))}
                          </span>
                        )
                      )}
                    </span>
                    {locked && (
                      <span className="event-option__locked" data-testid="option-locked">
                        <LockIcon size={12} /> {t.season.noMoney}: {t.season.missing}{' '}
                        {formatMoney(optionCost(option) - career.money, careerCurrency(career))}
                      </span>
                    )}
                    {option.check && (
                      <span className="event-option__check">
                        🎲 {attributeName(option.check.attribute)} · <strong>{chance}%</strong>
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="event-result" data-testid="event-result">
              {lastChoice.resolution.roll && (
                <div
                  className={`roll roll--${lastChoice.resolution.roll.success ? 'success' : 'failure'}`}
                >
                  <span className="roll__verdict">
                    {lastChoice.resolution.roll.success ? t.season.success : t.season.failure}
                  </span>
                  <span className="roll__detail">
                    {t.season.rollOf} {attributeName(lastChoice.resolution.roll.attribute)} ·{' '}
                    {Math.round(lastChoice.resolution.roll.chance * 100)}% {t.season.chance}
                  </span>
                </div>
              )}
              <p className="event-result__text">{rich(lastChoice.resolution.text)}</p>
              <EffectChips
                effects={lastChoice.effects}
                currency={careerCurrency(career)}
                scale={careerScale(career)}
                exName={exName}
              />
              {next && <NextMatch career={career} live={next} />}
            </div>
          )}
        </article>
        <RecentResults career={career} fromSlot={fromSlot} />
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.season.toHub}
        </button>
        {lastChoice && (
          <button type="button" className="btn btn--primary" onClick={continueSeason} autoFocus>
            {nextIsMatch ? t.match.play : isLast ? t.season.playRest : t.continue}
          </button>
        )}
      </footer>
    </div>
  )
}
