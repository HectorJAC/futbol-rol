import { LockIcon } from '../components/icons'
import { Stepper } from '../components/Stepper'
import {
  defaultMode,
  eventsPerDecisionSeason,
  GAME_MODES,
  hasFullSeasons,
  intervalLabel,
  MAX_CUSTOM_SEASONS,
  MIN_CUSTOM_SEASONS,
  type DecisionInterval
} from '../data/gameModes'
import { t } from '../i18n/es'
import { useGameStore } from '../store/gameStore'

const INTERVALS: DecisionInterval[] = [1, 2, 3]

/** Paso 2 de la nueva partida: Completa o Personalizada (Rápida y Normal, por ahora cerradas). */
export function ModeSelection(): React.JSX.Element {
  const mode = useGameStore((s) => s.draft.mode)
  const setMode = useGameStore((s) => s.setMode)
  const confirmMode = useGameStore((s) => s.confirmMode)
  const previousStep = useGameStore((s) => s.previousStep)

  const custom = mode.id === 'personalizada'
  const changeSeasons = (step: number): void => {
    const seasons = Math.min(MAX_CUSTOM_SEASONS, Math.max(MIN_CUSTOM_SEASONS, mode.seasons + step))
    setMode({ ...mode, seasons })
  }

  return (
    <div className="screen mode-select">
      <Stepper current="modeSelection" />
      <header className="screen-header">
        <h1 className="screen-title">{t.mode.title}</h1>
        <p className="screen-subtitle">{t.mode.subtitle}</p>
      </header>

      <div className="mode-grid" role="radiogroup" aria-label={t.mode.title}>
        {GAME_MODES.map((info) => {
          const selected = info.id === mode.id
          const shown = selected ? mode : defaultMode(info.id)
          const locked = !info.available
          return (
            <button
              key={info.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`panel mode-card${selected ? ' mode-card--selected' : ''}${locked ? ' mode-card--locked' : ''}`}
              onClick={() => !selected && setMode(defaultMode(info.id))}
              disabled={locked}
              title={locked ? t.mode.unavailable : undefined}
              data-testid={`mode-${info.id}`}
            >
              <span className="mode-card__head">
                <span className="mode-card__name">{info.name}</span>
                {locked && (
                  <span className="mode-card__lock">
                    <LockIcon size={12} />
                    {t.comingSoon}
                  </span>
                )}
              </span>
              <span className="mode-card__desc">{info.description}</span>
              <dl className="mode-card__facts">
                <div>
                  <dt>{t.mode.seasons}</dt>
                  <dd>{shown.seasons}</dd>
                </div>
                <div>
                  <dt>{t.mode.decisions}</dt>
                  <dd>{intervalLabel(shown.decisionInterval)}</dd>
                </div>
                <div>
                  <dt>{t.mode.perSeason}</dt>
                  <dd>{eventsPerDecisionSeason(shown)}</dd>
                </div>
              </dl>
              {hasFullSeasons(shown) && (
                <span className="mode-card__badge">{t.mode.importantMatches}</span>
              )}
            </button>
          )
        })}
      </div>

      {custom && (
        <section className="panel mode-custom" data-testid="mode-custom">
          <div className="setting">
            <div>
              <strong>{t.mode.customSeasons}</strong>
              <span>
                {MIN_CUSTOM_SEASONS}–{MAX_CUSTOM_SEASONS}
              </span>
            </div>
            <div className="number-stepper">
              <button
                type="button"
                className="attr-btn"
                aria-label={t.mode.fewer}
                onClick={() => changeSeasons(-1)}
                disabled={mode.seasons <= MIN_CUSTOM_SEASONS}
              >
                −
              </button>
              <strong data-testid="custom-seasons">{mode.seasons}</strong>
              <button
                type="button"
                className="attr-btn"
                aria-label={t.mode.more}
                onClick={() => changeSeasons(1)}
                disabled={mode.seasons >= MAX_CUSTOM_SEASONS}
              >
                +
              </button>
            </div>
          </div>
          <div className="setting">
            <div>
              <strong>{t.mode.customInterval}</strong>
            </div>
            <div className="segmented" role="radiogroup" aria-label={t.mode.customInterval}>
              {INTERVALS.map((interval) => (
                <button
                  key={interval}
                  type="button"
                  role="radio"
                  aria-checked={mode.decisionInterval === interval}
                  className={`segmented__option${mode.decisionInterval === interval ? ' segmented__option--on' : ''}`}
                  onClick={() => setMode({ ...mode, decisionInterval: interval })}
                >
                  {intervalLabel(interval)}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={previousStep}>
          {t.back}
        </button>
        <button type="button" className="btn btn--primary" onClick={confirmMode}>
          {t.continue}
        </button>
      </footer>
    </div>
  )
}
