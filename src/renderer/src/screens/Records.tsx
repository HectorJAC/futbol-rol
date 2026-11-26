import { useEffect, useState } from 'react'
import { getNationality, NATIONALITIES, type NationalityId } from '../data/nationalities'
import { t } from '../i18n/es'
import { careerRecordRow, rankCareers, type CareerRecordRow } from '../logic/records'
import { careerFromSaveFile } from '../logic/saveGame'
import { useGameStore } from '../store/gameStore'
import type { Career } from '../types/career'

function flagFor(id: string): string | undefined {
  return NATIONALITIES.some((n) => n.id === id)
    ? getNationality(id as NationalityId).flag
    : undefined
}

/**
 * Records: comparativa de todas las carreras guardadas, ordenadas por títulos y
 * goles. Pulsar una abre todos sus detalles.
 */
export function Records(): React.JSX.Element {
  const backToMenu = useGameStore((s) => s.backToMenu)
  const openRecordDetail = useGameStore((s) => s.openRecordDetail)
  const [rows, setRows] = useState<CareerRecordRow[] | null>(null)
  const [careers, setCareers] = useState<Map<string, Career>>(new Map())

  useEffect(() => {
    let active = true
    ;(async () => {
      const summaries = await window.api.saves.list()
      const careers = await Promise.all(summaries.map((s) => window.api.saves.read(s.id)))
      const parsed = careers.flatMap((file) => {
        const career = file ? careerFromSaveFile(file) : null
        return career ? [career] : []
      })
      if (!active) return
      setCareers(new Map(parsed.map((c) => [c.id, c])))
      setRows(rankCareers(parsed.map(careerRecordRow)))
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="screen records">
      <header className="screen-header">
        <span className="eyebrow">{t.records.eyebrow}</span>
        <h1 className="screen-title">{t.records.title}</h1>
        <p className="screen-subtitle">
          {t.records.subtitle} {rows && rows.length > 0 && t.records.openHint}
        </p>
      </header>

      <section className="panel trophy-room__body">
        {rows?.length === 0 && <p className="trophy-room__empty">{t.records.empty}</p>}
        {rows && rows.length > 0 && (
          <table className="timeline">
            <thead>
              <tr>
                <th className="num">#</th>
                <th>{t.records.player}</th>
                <th className="num">{t.records.seasons}</th>
                <th className="num">{t.trophies.matchesShort}</th>
                <th className="num">{t.trophies.goalsShort}</th>
                <th className="num">{t.trophies.assistsShort}</th>
                <th className="num">{t.national.caps}</th>
                <th className="num">{t.trophies.collective}</th>
                <th className="num">{t.trophies.individual}</th>
                <th>{t.records.bestSeason}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const flag = flagFor(row.nationalityId)
                const career = careers.get(row.id)
                const open = (): void => {
                  if (career) openRecordDetail(career)
                }
                return (
                  <tr
                    key={row.id}
                    className="records__row"
                    onClick={open}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        open()
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    data-testid="record-row"
                  >
                    <td className="num">{i + 1}</td>
                    <td>
                      <span className="timeline__club">
                        {flag && <img className="records__flag" src={flag} alt="" />}
                        {row.playerName}
                      </span>
                    </td>
                    <td className="num">{row.seasons}</td>
                    <td className="num">{row.matches}</td>
                    <td className="num">{row.goals}</td>
                    <td className="num">{row.assists}</td>
                    <td className="num">{row.caps}</td>
                    <td className="num records__gold">{row.collective}</td>
                    <td className="num records__blue">{row.individual}</td>
                    <td>
                      {row.bestSeason ? (
                        <>
                          {row.bestSeason.goals} {t.summary.goals.toLowerCase()}
                          <span className="timeline__sub">{row.bestSeason.yearLabel}</span>
                        </>
                      ) : (
                        <span className="timeline__none">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      <footer className="action-bar action-bar--wide">
        <button type="button" className="btn btn--secondary" onClick={backToMenu}>
          {t.load.back}
        </button>
      </footer>
    </div>
  )
}
