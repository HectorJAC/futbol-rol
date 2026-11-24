import { useEffect, useState } from 'react'
import { LockIcon } from '../components/icons'
import { t } from '../i18n/es'
import { applyMotionSetting } from '../logic/motion'
import { useGameStore } from '../store/gameStore'
import {
  AVAILABLE_LANGUAGES,
  LANGUAGES,
  WINDOW_SIZES,
  type GameSettings
} from '../../../shared/settings'

const LANGUAGE_NAMES = { es: 'Español', en: 'English' } as const

/** Interruptor accesible (role="switch"). */
function Toggle({
  label,
  checked,
  onChange,
  testId
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  testId: string
}): React.JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`switch${checked ? ' switch--on' : ''}`}
      onClick={() => onChange(!checked)}
      data-testid={testId}
    >
      <span className="switch__knob" />
    </button>
  )
}

export function Settings(): React.JSX.Element {
  const backToMenu = useGameStore((s) => s.backToMenu)
  const [settings, setSettings] = useState<GameSettings | null>(null)

  useEffect(() => {
    window.api.settings.get().then(setSettings)
  }, [])

  const update = async (patch: Partial<GameSettings>): Promise<void> => {
    const next = await window.api.settings.set(patch)
    setSettings(next)
    applyMotionSetting(next.animations)
  }

  return (
    <div className="screen settings">
      <header className="screen-header">
        <span className="eyebrow">{t.settings.eyebrow}</span>
        <h1 className="screen-title">{t.settings.title}</h1>
      </header>

      {settings && (
        <section className="panel settings__panel">
          <div className="setting">
            <div>
              <strong>{t.settings.fullscreen}</strong>
              <span>{t.settings.fullscreenHint}</span>
            </div>
            <Toggle
              label={t.settings.fullscreen}
              checked={settings.fullscreen}
              onChange={(fullscreen) => update({ fullscreen })}
              testId="setting-fullscreen"
            />
          </div>

          <div className="setting">
            <div>
              <strong>{t.settings.windowSize}</strong>
              <span>{t.settings.windowSizeHint}</span>
            </div>
            <div className="segmented" role="radiogroup" aria-label={t.settings.windowSize}>
              {WINDOW_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={settings.windowSize === size}
                  className={`segmented__option${settings.windowSize === size ? ' segmented__option--on' : ''}`}
                  disabled={settings.fullscreen}
                  onClick={() => update({ windowSize: size })}
                >
                  {size.replace('x', ' × ')}
                </button>
              ))}
            </div>
          </div>

          <div className="setting">
            <div>
              <strong>{t.settings.animations}</strong>
              <span>{t.settings.animationsHint}</span>
            </div>
            <Toggle
              label={t.settings.animations}
              checked={settings.animations}
              onChange={(animations) => update({ animations })}
              testId="setting-animations"
            />
          </div>

          <div className="setting">
            <div>
              <strong>{t.settings.language}</strong>
              <span>{t.settings.languageHint}</span>
            </div>
            <div className="segmented" role="radiogroup" aria-label={t.settings.language}>
              {LANGUAGES.map((lang) => {
                const available = AVAILABLE_LANGUAGES.includes(lang)
                return (
                  <button
                    key={lang}
                    type="button"
                    role="radio"
                    aria-checked={settings.language === lang}
                    className={`segmented__option${settings.language === lang ? ' segmented__option--on' : ''}`}
                    disabled={!available}
                    title={available ? undefined : t.comingSoon}
                    onClick={() => update({ language: lang })}
                  >
                    {!available && <LockIcon size={12} />} {LANGUAGE_NAMES[lang]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="setting setting--disabled">
            <div>
              <strong>{t.settings.audio}</strong>
              <span>{t.settings.audioHint}</span>
            </div>
            <span className="menu-button__badge">
              <LockIcon />
              {t.comingSoon}
            </span>
          </div>
        </section>
      )}

      <footer className="action-bar action-bar--wide settings__footer">
        <button type="button" className="btn btn--secondary" onClick={backToMenu}>
          {t.load.back}
        </button>
        <span className="field__hint">{t.settings.autosaved}</span>
      </footer>
    </div>
  )
}
