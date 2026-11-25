import { ClubCrest } from './ClubCrest'
import { getClub } from '../data/clubs'
import { t } from '../i18n/es'
import { roundLabel } from '../logic/competitions'
import { importanceOf } from '../logic/season'
import type { Career, CompetitionId, LiveMatch } from '../types/career'

const COMPETITION_NAME: Record<CompetitionId, string> = {
  liga: t.competitions.league,
  copa: t.competitions.cup,
  continental: t.competitions.continental
}

/** Contra quién es el próximo partido importante (antes de pulsar "Jugar partido"). */
export function NextMatch({
  career,
  live
}: {
  career: Career
  live: LiveMatch
}): React.JSX.Element {
  const own = getClub(career.clubId)
  const rival = getClub(live.opponentId)
  const [home, away] = live.home ? [own, rival] : [rival, own]
  const reason = importanceOf(career, {
    slot: live.slot,
    competition: live.competition,
    round: live.round,
    opponentId: live.opponentId,
    home: live.home,
    knockout: live.knockout,
    neutral: live.neutral
  })
  const label = reason ? t.match.reasons[reason] : undefined

  return (
    <div className="next-match" data-testid="next-match">
      <span className="next-match__eyebrow">{t.match.next}</span>
      <div className="next-match__teams" data-testid="next-match-teams">
        <span className="next-match__team">
          <ClubCrest club={home} size={34} />
          <strong>{home.name}</strong>
        </span>
        <span className="next-match__vs">{t.match.vs}</span>
        <span className="next-match__team next-match__team--away">
          <strong>{away.name}</strong>
          <ClubCrest club={away} size={34} />
        </span>
      </div>
      <span className="next-match__meta">
        {COMPETITION_NAME[live.competition]} ·{' '}
        {roundLabel(
          { competition: live.competition, round: live.round },
          career.seasonProgress?.setup
        )}
        {label && <span className="match-card__reason">{label}</span>}
      </span>
    </div>
  )
}
