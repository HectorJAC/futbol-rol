import { useState } from 'react'
import { FemaleIcon, FootIcon, LockIcon, MaleIcon } from '../components/icons'
import { NationalitySelector } from '../components/NationalitySelector'
import { Stepper } from '../components/Stepper'
import { POSITIONS } from '../data/positions'
import { t } from '../i18n/es'
import { NAME_MAX_LENGTH, validateName } from '../logic/characterName'
import { useGameStore } from '../store/gameStore'
import { FEET } from '../types/character'

export function CharacterCreation(): React.JSX.Element {
  const character = useGameStore((s) => s.draft.character)
  const setDraftName = useGameStore((s) => s.setDraftName)
  const setFoot = useGameStore((s) => s.setFoot)
  const changeNationality = useGameStore((s) => s.changeNationality)
  const confirmCharacter = useGameStore((s) => s.confirmCharacter)
  const backToMenu = useGameStore((s) => s.backToMenu)

  // El error del nombre solo se enseña después de que el jugador haya escrito algo o intentado continuar.
  const [nameTouched, setNameTouched] = useState(false)
  const nameError = validateName(character.name)
  const showNameError = nameTouched && nameError !== null

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault()
    setNameTouched(true)
    confirmCharacter()
  }

  return (
    <div className="screen creation">
      <Stepper current="characterCreation" />
      <header className="screen-header">
        <span className="eyebrow">{t.creation.eyebrow}</span>
        <h1 className="screen-title">{t.creation.title}</h1>
        <p className="screen-subtitle">{t.creation.subtitle}</p>
      </header>

      <form className="creation__body" onSubmit={handleSubmit} noValidate>
        <section className="panel creation__form">
          <div className="field">
            <label className="field__label" htmlFor="player-name">
              {t.creation.nameLabel}
            </label>
            <input
              id="player-name"
              className={`text-input${showNameError ? ' text-input--error' : ''}`}
              type="text"
              value={character.name}
              placeholder={t.creation.namePlaceholder}
              maxLength={NAME_MAX_LENGTH + 10}
              autoComplete="off"
              spellCheck={false}
              autoFocus
              onChange={(e) => {
                setDraftName(e.target.value)
                setNameTouched(true)
              }}
              aria-invalid={showNameError}
              aria-describedby="player-name-error"
            />
            <p id="player-name-error" className="field__error" role="alert">
              {showNameError && nameError ? t.creation.nameErrors[nameError] : ''}
            </p>
          </div>

          <div className="field">
            <span className="field__label">{t.creation.sexLabel}</span>
            <div className="option-row" role="radiogroup" aria-label={t.creation.sexLabel}>
              <button
                type="button"
                role="radio"
                aria-checked={character.sex === 'M'}
                className={`option${character.sex === 'M' ? ' option--selected' : ''}`}
                title={t.creation.male}
              >
                <MaleIcon />
                <span className="option__text">{t.creation.male}</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={false}
                className="option"
                disabled
                title={t.comingSoon}
              >
                <FemaleIcon />
                <span className="option__text">{t.creation.female}</span>
                <span className="option__badge">
                  <LockIcon size={12} />
                  {t.comingSoon}
                </span>
              </button>
            </div>
          </div>

          <div className="field">
            <span className="field__label">{t.creation.footLabel}</span>
            <div className="option-row" role="radiogroup" aria-label={t.creation.footLabel}>
              {FEET.map((foot) => (
                <button
                  key={foot}
                  type="button"
                  role="radio"
                  aria-checked={character.foot === foot}
                  className={`option option--foot${character.foot === foot ? ' option--selected' : ''}`}
                  onClick={() => setFoot(foot)}
                  data-testid={`foot-${foot}`}
                >
                  <FootIcon side={foot} />
                  <span className="option__text">{t.creation.feet[foot]}</span>
                  <span className="option__hint">{t.creation.footHint[foot]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field__label">{t.creation.positionLabel}</span>
            <div className="option-row" role="radiogroup" aria-label={t.creation.positionLabel}>
              {POSITIONS.map((position) => (
                <button
                  key={position.id}
                  type="button"
                  role="radio"
                  aria-checked={character.position === position.id}
                  className={`option option--position${character.position === position.id ? ' option--selected' : ''}`}
                >
                  <span className="option__short">{position.short}</span>
                  <span className="option__text">{position.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="panel creation__nationality">
          <span className="field__label">{t.creation.nationalityLabel}</span>
          <NationalitySelector value={character.nationalityId} onChange={changeNationality} />
          <span className="field__hint">{t.creation.nationalityHint}</span>
        </section>

        <footer className="action-bar">
          <button type="button" className="btn btn--secondary" onClick={backToMenu}>
            {t.creation.back}
          </button>
          <button type="submit" className="btn btn--primary" disabled={nameError !== null}>
            {t.creation.start}
          </button>
        </footer>
      </form>
    </div>
  )
}
