import { t } from '../i18n/es'

/** Título del juego: "Your Football Path" ("Your" pequeño encima de "Football Path"). */
export function GameTitle(): React.JSX.Element {
  return (
    <h1 className="game-title">
      <span className="game-title__prefix">{t.gameTitle.prefix}</span>{' '}
      <span className="game-title__main">{t.gameTitle.main}</span>
    </h1>
  )
}
