import { t } from '../i18n/es'
import type { ClubMatch } from '../types/career'

/** Por qué no jugaste un partido: lesión, no convocado o banquillo. */
export function notPlayedText(m: ClubMatch): string {
  if (m.injured) return t.competitions.injured
  if (m.squad === 'fuera') return t.competitions.notCalledUp
  if (m.squad === 'banca') return t.competitions.unusedSub
  return t.competitions.bench
}
