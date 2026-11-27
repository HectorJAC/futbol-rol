import { t } from '../i18n'

/** "Early-Access v0.x": visible en todas las pantallas, abajo en el centro. */
export function BuildBadge(): React.JSX.Element {
  return (
    <span className="build-badge" data-testid="build-badge">
      Early-Access {t.version}
    </span>
  )
}
