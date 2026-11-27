import type { AttributeId } from '../../data/attributes'
import type { TrainingFocusText } from '../packs'

/**
 * English texts for the "Extra hours" training sessions (`TRAINING_FOCUS`).
 * `label` follows the attribute name: "Finishing: <label>".
 */
export const TRAINING_FOCUS_EN: Record<AttributeId, TrainingFocusText> = {
  finishing: {
    label: 'a hundred shots each evening',
    text: 'Your calves are wrecked by the end, but the ball is finding the net more easily every day.'
  },
  heading: {
    label: 'crosses into the box until dark',
    text: 'Your forehead is sore from all the headers, but now you meet the ball at the top of your jump.'
  },
  dribbling: {
    label: 'dribbling through cones and one-on-ones',
    text: 'The assistant coach throws academy defenders at you, and you end up leaving them on their backsides.'
  },
  shortPassing: {
    label: 'rondos and one-touch one-twos',
    text: 'Endless rondos later, your back-to-goal lay-offs stop going astray.'
  },
  longPassing: {
    label: 'forty-yard diagonal switches of play',
    text: 'Your long balls start landing where you want them, not wherever they fancy.'
  },
  offTheBall: {
    label: "video study of the best strikers' movement",
    text: 'Hours of footage with the analyst. You start seeing gaps where there used to be nothing.'
  },
  pace: {
    label: 'sprint reps and explosive starts',
    text: 'The reps leave you gasping, but your first few yards have never been quicker.'
  },
  strength: {
    label: 'gym work to build power',
    text: "You put on three kilos of muscle. Centre-backs can't knock you about so easily now."
  },
  stamina: {
    label: 'steady-state running and aerobic work',
    text: 'You no longer look knackered by the 80th minute.'
  },
  physique: {
    label: 'injury prevention and core work',
    text: 'Your body copes better with the knocks and the grind of the season.'
  },
  composure: {
    label: 'one-on-ones with a coach in your ear',
    text: 'They yell, they shove, they hold a stopwatch over you. When it matters, your nerve holds.'
  },
  leadership: {
    label: 'talks with the skipper and the coaching staff',
    text: 'You start speaking up more in the dressing room, and the young lads listen.'
  },
  corners: {
    label: 'fifty corners to each post',
    text: "Your corners now drop onto the centre-backs' heads with real precision."
  },
  freeKicks: {
    label: 'free kicks over the mannequin wall',
    text: "The curl comes naturally now: the reserve keeper doesn't see them coming."
  },
  penalties: {
    label: 'penalty shoot-outs against the keeper',
    text: 'You pick a corner, stick with it and bury it. Again and again.'
  }
}
