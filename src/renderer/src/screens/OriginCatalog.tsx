import { useState } from 'react'
import { OriginDetail } from '../components/OriginDetail'
import { LockIcon } from '../components/icons'
import {
  AVAILABLE_NATIONALITIES,
  isNationalityAvailable,
  NATIONALITIES,
  type NationalityId
} from '../data/nationalities'
import { EXTRA_ORIGINS } from '../data/originCatalog'
import { getOrigin, originsForNationality } from '../data/origins'
import { t } from '../i18n/es'
import { useGameStore } from '../store/gameStore'

type Tab = NationalityId | 'extra'

/** Extras → Orígenes: todos los orígenes por nacionalidad y los 10 especiales. */
export function OriginCatalog(): React.JSX.Element {
  const openExtras = useGameStore((s) => s.openExtras)
  const [tab, setTab] = useState<Tab>(AVAILABLE_NATIONALITIES[0].id)
  const origins = tab === 'extra' ? EXTRA_ORIGINS : originsForNationality(tab)
  const [selectedId, setSelectedId] = useState<string>(origins[0].id)

  const changeTab = (next: Tab): void => {
    setTab(next)
    const list = next === 'extra' ? EXTRA_ORIGINS : originsForNationality(next)
    setSelectedId(list[0].id)
  }

  const selected = getOrigin(selectedId)

  return (
    <div className="screen origin catalog">
      <header className="screen-header">
        <span className="eyebrow">{t.extras.eyebrow}</span>
        <h1 className="screen-title">{t.extras.catalogTitle}</h1>
        <p className="screen-subtitle">{t.extras.catalogSubtitle}</p>
      </header>

      <div className="tabs catalog__tabs" role="tablist">
        {NATIONALITIES.map((n) => {
          // Orígenes de las nacionalidades bloqueadas: por ahora no se pueden consultar.
          const open = isNationalityAvailable(n.id)
          return (
            <button
              key={n.id}
              type="button"
              role="tab"
              aria-selected={tab === n.id}
              className={`tab tab--flag${tab === n.id ? ' tab--active' : ''}${open ? '' : ' tab--locked'}`}
              onClick={() => changeTab(n.id)}
              disabled={!open}
              title={open ? n.name : `${n.name} · ${t.comingSoon}`}
              data-testid={`catalog-tab-${n.id}`}
            >
              <img src={n.flag} alt="" />
              <span>{n.name}</span>
              {!open && <LockIcon size={11} />}
            </button>
          )
        })}
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'extra'}
          className={`tab${tab === 'extra' ? ' tab--active' : ''}`}
          onClick={() => changeTab('extra')}
          data-testid="catalog-tab-extra"
        >
          {t.extras.extraTab} ({EXTRA_ORIGINS.length})
        </button>
      </div>

      <div className="split">
        <div className="choice-list" role="listbox" aria-label={t.extras.catalogTitle}>
          {origins.map((origin) => (
            <button
              key={origin.id}
              type="button"
              role="option"
              aria-selected={origin.id === selectedId}
              className={`choice${origin.id === selectedId ? ' choice--selected' : ''}`}
              onClick={() => setSelectedId(origin.id)}
              data-testid="catalog-origin"
            >
              <span className="choice__title">{origin.name}</span>
              <span className="choice__subtitle">{t.extras.archetypes[origin.archetype]}</span>
            </button>
          ))}
        </div>
        <section className="panel detail" aria-live="polite">
          <OriginDetail origin={selected} />
        </section>
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={openExtras}>
          {t.extras.backToExtras}
        </button>
      </footer>
    </div>
  )
}
