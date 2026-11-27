import { GameTitle } from '../components/GameTitle'
import { t } from '../i18n'
import { useGameStore } from '../store/gameStore'

/** Créditos: quién hace el juego y cómo contactar. */
export function Credits(): React.JSX.Element {
  const backToMenu = useGameStore((s) => s.backToMenu)
  return (
    <div className="screen credits">
      <header className="main-menu__header">
        <GameTitle />
      </header>

      <section className="credits__body" data-testid="credits">
        <span className="eyebrow">{t.credits.createdBy}</span>
        <strong className="credits__name">Hector JAC</strong>
        <p className="credits__contact">
          {t.credits.contact}: <span>hjac10@hotmail.com</span>
        </p>
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToMenu} autoFocus>
          {t.credits.back}
        </button>
      </footer>
    </div>
  )
}
