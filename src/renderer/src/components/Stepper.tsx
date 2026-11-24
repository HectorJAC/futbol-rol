import { t } from '../i18n/es'
import { CREATION_STEPS, type Screen } from '../store/gameStore'

/** Indicador de pasos de "Nueva partida": Jugador · Origen · Atributos · Club. */
export function Stepper({ current }: { current: Screen }): React.JSX.Element {
  const currentIndex = CREATION_STEPS.indexOf(current as (typeof CREATION_STEPS)[number])
  return (
    <ol className="stepper" aria-label="Pasos de la nueva partida">
      {CREATION_STEPS.map((step, index) => {
        const state = index < currentIndex ? 'done' : index === currentIndex ? 'current' : 'todo'
        return (
          <li
            key={step}
            className={`stepper__step stepper__step--${state}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="stepper__number">{index + 1}</span>
            <span className="stepper__label">{t.steps[step]}</span>
          </li>
        )
      })}
    </ol>
  )
}
