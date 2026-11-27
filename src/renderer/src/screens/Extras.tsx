import { useEffect, useRef } from 'react'
import { MenuButton } from '../components/MenuButton'
import { t } from '../i18n'
import { useGameStore } from '../store/gameStore'

/** Menú de Extras: contenido del juego para consultar (por ahora, los orígenes). */
export function Extras(): React.JSX.Element {
  const openOriginCatalog = useGameStore((s) => s.openOriginCatalog)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const menuRef = useRef<HTMLElement>(null)

  useEffect(() => {
    menuRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [])

  return (
    <div className="screen main-menu extras">
      <header className="screen-header">
        <span className="eyebrow">{t.extras.eyebrow}</span>
        <h1 className="screen-title">{t.extras.title}</h1>
        <p className="screen-subtitle">{t.extras.subtitle}</p>
      </header>

      <nav ref={menuRef} className="main-menu__buttons" aria-label={t.extras.title}>
        <MenuButton label={t.extras.origins} onClick={openOriginCatalog} />
        <p className="extras__hint">{t.extras.originsHint}</p>
      </nav>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToMenu}>
          {t.extras.back}
        </button>
      </footer>
    </div>
  )
}
