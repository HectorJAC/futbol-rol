import { t } from '../i18n/es'
import { LockIcon } from './icons'

interface MenuButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  autoFocus?: boolean
  /** Texto de la etiqueta cuando está deshabilitado. Por defecto "Próximamente". */
  badge?: string
}

/** Botón grande del menú principal. Si está deshabilitado muestra una etiqueta con el motivo. */
export function MenuButton({
  label,
  onClick,
  disabled = false,
  autoFocus,
  badge = t.comingSoon
}: MenuButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="menu-button"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      title={disabled ? badge : undefined}
    >
      <span className="menu-button__label">{label}</span>
      {disabled && (
        <span className="menu-button__badge">
          <LockIcon />
          {badge}
        </span>
      )}
    </button>
  )
}
