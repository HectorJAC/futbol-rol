import { t } from '../i18n'
import type { ClubMatch } from '../types/career'

/** Si jugaste de titular o saliste desde el banquillo (partidos desde la v0.12). */
export function playedRoleText(m: ClubMatch): string | null {
  if (!m.played) return null
  if (m.squad === 'titular') return t.competitions.starter
  if (m.squad === 'suplente') return t.competitions.cameOn
  return null
}

/** Por qué no jugaste un partido: lesión, no convocado o banquillo. */
export function notPlayedText(m: ClubMatch): string {
  if (m.injured) return t.competitions.injured
  if (m.squad === 'fuera') return t.competitions.notCalledUp
  if (m.squad === 'banca') return t.competitions.unusedSub
  return t.competitions.bench
}
