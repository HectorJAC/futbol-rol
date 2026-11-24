import { useEffect, useState } from 'react'
import { getNationality, NATIONALITIES, type NationalityId } from '../data/nationalities'
import { t } from '../i18n/es'
import { careerFromSaveFile } from '../logic/saveGame'
import { useGameStore } from '../store/gameStore'
import type { SaveSummary } from '../../../shared/saves'

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
}

function flagFor(id: string): string | undefined {
  return NATIONALITIES.some((n) => n.id === id)
    ? getNationality(id as NationalityId).flag
    : undefined
}

export function LoadGame(): React.JSX.Element {
  const loadCareer = useGameStore((s) => s.loadCareer)
  const backToMenu = useGameStore((s) => s.backToMenu)
  const [saves, setSaves] = useState<SaveSummary[] | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.api.saves.list().then(setSaves)
  }, [])

  const load = async (id: string): Promise<void> => {
    const file = await window.api.saves.read(id)
    const career = file ? careerFromSaveFile(file) : null
    if (career) loadCareer(career)
    else setError(id)
  }

  const remove = async (id: string): Promise<void> => {
    await window.api.saves.remove(id)
    setConfirmingDelete(null)
    setSaves((current) => current?.filter((s) => s.id !== id) ?? null)
  }

  return (
    <div className="screen load">
      <header className="screen-header">
        <span className="eyebrow">{t.load.eyebrow}</span>
        <h1 className="screen-title">{t.load.title}</h1>
      </header>

      <section className="save-list" aria-label={t.load.eyebrow}>
        {saves?.length === 0 && <p className="save-list__empty">{t.load.empty}</p>}
        {saves?.map((save) => {
          const flag = flagFor(save.nationalityId)
          return (
            <article key={save.id} className="save-slot" data-testid="save-slot">
              {flag && <img className="save-slot__flag" src={flag} alt="" />}
              <div className="save-slot__info">
                <strong className="save-slot__name">{save.playerName}</strong>
                <span className="save-slot__meta">
                  {save.clubName} · {t.load.season} {save.season} · {formatDate(save.updatedAt)}
                </span>
                {error === save.id && <span className="save-slot__error">{t.load.corrupted}</span>}
              </div>
              <div className="save-slot__actions">
                {confirmingDelete === save.id ? (
                  <>
                    <span className="save-slot__confirm">{t.load.confirmDelete}</span>
                    <button
                      type="button"
                      className="btn btn--danger btn--small"
                      onClick={() => remove(save.id)}
                    >
                      {t.load.yesDelete}
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => setConfirmingDelete(null)}
                    >
                      {t.load.cancel}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => setConfirmingDelete(save.id)}
                    >
                      {t.load.delete}
                    </button>
                    <button
                      type="button"
                      className="btn btn--primary btn--small"
                      onClick={() => load(save.id)}
                    >
                      {t.load.load}
                    </button>
                  </>
                )}
              </div>
            </article>
          )
        })}
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToMenu}>
          {t.load.back}
        </button>
      </footer>
    </div>
  )
}
