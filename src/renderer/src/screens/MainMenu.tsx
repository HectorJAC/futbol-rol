import { useEffect, useRef, useState } from 'react'
import { GameTitle } from '../components/GameTitle'
import { MenuButton } from '../components/MenuButton'
import { t } from '../i18n/es'
import { useGameStore } from '../store/gameStore'

export function MainMenu(): React.JSX.Element {
  const startNewGame = useGameStore((s) => s.startNewGame)
  const openLoadGame = useGameStore((s) => s.openLoadGame)
  const openRecords = useGameStore((s) => s.openRecords)
  const openSettings = useGameStore((s) => s.openSettings)
  const openExtras = useGameStore((s) => s.openExtras)
  const menuRef = useRef<HTMLElement>(null)
  // null = aún comprobando; "Cargar Partida" solo se activa si hay alguna partida guardada.
  const [hasSaves, setHasSaves] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    window.api.saves
      .list()
      .then((saves) => active && setHasSaves(saves.length > 0))
      .catch(() => active && setHasSaves(false))
    return () => {
      active = false
    }
  }, [])

  /** ↑/↓ mueven el foco entre los botones activos (los deshabilitados se saltan). */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>): void => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const buttons = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []
    )
    if (buttons.length === 0) return
    event.preventDefault()
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement)
    const step = event.key === 'ArrowDown' ? 1 : -1
    const next = current === -1 ? 0 : (current + step + buttons.length) % buttons.length
    buttons[next].focus()
  }

  return (
    <div className="screen main-menu">
      <header className="main-menu__header">
        <GameTitle />
      </header>

      <nav
        ref={menuRef}
        className="main-menu__buttons"
        aria-label="Menú principal"
        onKeyDown={handleKeyDown}
      >
        <MenuButton label={t.mainMenu.newGame} onClick={startNewGame} autoFocus />
        <MenuButton
          label={t.mainMenu.loadGame}
          onClick={openLoadGame}
          disabled={!hasSaves}
          badge={hasSaves === false ? t.mainMenu.noSaves : undefined}
        />
        <MenuButton label={t.mainMenu.settings} onClick={openSettings} />
        <MenuButton
          label={t.mainMenu.records}
          onClick={openRecords}
          disabled={!hasSaves}
          badge={hasSaves === false ? t.mainMenu.noSaves : undefined}
        />
        <MenuButton label={t.mainMenu.extras} onClick={openExtras} />
        <MenuButton label={t.mainMenu.quit} onClick={() => window.api.quit()} />
      </nav>

      <footer className="screen-footer">
        <span className="screen-footer__hint">{t.mainMenu.hint}</span>
        <span className="screen-footer__version">{t.version}</span>
      </footer>
    </div>
  )
}
