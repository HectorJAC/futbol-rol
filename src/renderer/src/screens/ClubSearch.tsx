import { useState } from 'react'
import { ClubCrest } from '../components/ClubCrest'
import { Stars } from '../components/Stars'
import { divisionName, getClub, type Division } from '../data/clubs'
import { NATIONALITIES, type NationalityId } from '../data/nationalities'
import { t } from '../i18n/es'
import { canTarget, signingChecks } from '../logic/transfers'
import { useGameStore } from '../store/gameStore'

/**
 * Buscador de equipos: país → división → club. El club elegido queda como
 * objetivo y, si al acabar la temporada cumples sus requisitos, te hace una oferta.
 */
export function ClubSearch(): React.JSX.Element {
  const career = useGameStore((s) => s.career)
  const backToHub = useGameStore((s) => s.backToHub)
  const chooseTransferTarget = useGameStore((s) => s.chooseTransferTarget)
  const ownCountry = career ? getClub(career.clubId).countryId : 'ARG'
  const targetClub = career?.transferTarget ? getClub(career.transferTarget.clubId) : null
  const [country, setCountry] = useState<NationalityId>(targetClub?.countryId ?? ownCountry)
  const [division, setDivision] = useState<Division>(1)
  const [selected, setSelected] = useState<string | null>(targetClub?.id ?? null)

  if (!career) return <></>
  const clubs = [...career.divisions[country][division - 1]]
    .map(getClub)
    .sort((a, b) => b.strength - a.strength || a.name.localeCompare(b.name))
  const club = selected ? getClub(selected) : null
  const isTarget = !!club && career.transferTarget?.clubId === club.id
  const checks = club && club.id !== career.clubId ? signingChecks(career, club.id) : []
  const allowed = !!club && canTarget(career, club.id)

  const pickCountry = (id: NationalityId): void => {
    setCountry(id)
    setSelected(null)
  }
  const pickDivision = (d: Division): void => {
    setDivision(d)
    setSelected(null)
  }

  return (
    <div className="screen club-search">
      <header className="screen-header">
        <span className="eyebrow">{t.search.eyebrow}</span>
        <h1 className="screen-title">{t.search.title}</h1>
        <p className="screen-subtitle">{t.search.subtitle}</p>
      </header>

      <div className="search-grid">
        <section className="panel search-countries" aria-label={t.search.country}>
          <h2 className="panel-title">1 · {t.search.country}</h2>
          <div className="search-countries__list">
            {NATIONALITIES.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`search-chip${country === n.id ? ' search-chip--on' : ''}`}
                onClick={() => pickCountry(n.id)}
                aria-pressed={country === n.id}
                data-testid={`search-country-${n.id}`}
              >
                <img src={n.flag} alt="" />
                {n.name}
              </button>
            ))}
          </div>
        </section>

        <section className="panel search-clubs">
          <h2 className="panel-title">2 · {t.search.division}</h2>
          <div className="search-divisions">
            {([1, 2] as const).map((d) => (
              <button
                key={d}
                type="button"
                className={`search-chip${division === d ? ' search-chip--on' : ''}`}
                onClick={() => pickDivision(d)}
                aria-pressed={division === d}
                data-testid={`search-division-${d}`}
              >
                {divisionName(country, d)}
              </button>
            ))}
          </div>
          <h2 className="panel-title">3 · {t.search.club}</h2>
          <ul className="search-clubs__list">
            {clubs.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`search-club${selected === c.id ? ' search-club--on' : ''}`}
                  onClick={() => setSelected(c.id)}
                  data-testid="search-club"
                >
                  <ClubCrest club={c} size={22} />
                  <span className="search-club__name">{c.name}</span>
                  {career.transferTarget?.clubId === c.id && (
                    <span className="tag tag--small">{t.search.currentTarget}</span>
                  )}
                  {c.id === career.clubId && <span className="tag tag--small">{t.hub.club}</span>}
                  <Stars value={c.prestige} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel search-detail" data-testid="search-detail">
          {!club ? (
            <p className="field__hint">{t.search.pickClub}</p>
          ) : (
            <>
              <div className="hub-next__club">
                <ClubCrest club={club} size={56} />
                <div>
                  <strong data-testid="search-club-name">{club.name}</strong>
                  <span>
                    {club.city} · {t.club.tiers[club.tier]}
                  </span>
                  <span className="hub-next__stars">
                    {t.club.prestige} <Stars value={club.prestige} />
                  </span>
                </div>
              </div>
              {club.id === career.clubId ? (
                <p className="field__hint">{t.search.yourClub}</p>
              ) : (
                <>
                  <h3 className="panel-title">{t.search.requirements}</h3>
                  <ul className="check-list" data-testid="signing-checks">
                    {checks.map((c) => (
                      <li key={c.label} className={`check check--${c.ok ? 'ok' : 'ko'}`}>
                        <span className="check__icon" aria-hidden="true">
                          {c.ok ? '✓' : '✗'}
                        </span>
                        <span className="check__label">{c.label}</span>
                        <span className="check__detail">{c.detail}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="field__hint">{allowed ? t.search.nowHint : t.search.lastSeason}</p>
                  {isTarget && (
                    <p className="hub__message hub__message--gold" data-testid="target-set">
                      {t.search.isTarget}
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </div>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToHub}>
          {t.trophies.back}
        </button>
        <div className="action-bar__group">
          {career.transferTarget && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => chooseTransferTarget(null)}
              data-testid="cancel-target"
            >
              {t.search.cancelTarget}
            </button>
          )}
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => club && chooseTransferTarget(club.id)}
            disabled={!club || !allowed || isTarget}
            data-testid="set-target"
          >
            {t.search.setTarget}
          </button>
        </div>
      </footer>
    </div>
  )
}
