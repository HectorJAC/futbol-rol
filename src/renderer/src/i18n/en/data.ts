import type { AttributeId } from '../../data/attributes'
import type { ContinentalFormatId } from '../../data/continentalCups'
import type { CurrencyId } from '../../data/currencies'
import type { GameModeId } from '../../data/gameModes'
import type { NationalityId } from '../../data/nationalities'
import type { TournamentId } from '../../data/nationalTeams'
import type { PositionId } from '../../data/positions'

/** English names for the game's base data (attributes, countries, leagues…). */

export const ATTRIBUTES_EN: Record<AttributeId, { name: string; description: string }> = {
  finishing: { name: 'Finishing', description: 'Accuracy and coolness when shooting at goal.' },
  heading: { name: 'Heading', description: 'Attacking headers and winning the ball in the air.' },
  dribbling: { name: 'Dribbling', description: 'Beating opponents with the ball at your feet.' },
  shortPassing: {
    name: 'Short passing',
    description: 'Quick combinations, lay-offs with your back to goal and one-touch play.'
  },
  longPassing: {
    name: 'Long passing',
    description: 'Switching the play and slipping balls in behind.'
  },
  offTheBall: {
    name: 'Off the ball',
    description: 'Moving without the ball and turning up in exactly the right place.'
  },
  pace: { name: 'Pace', description: 'Acceleration and top speed.' },
  strength: { name: 'Power', description: 'Force behind your shots and your leap.' },
  stamina: { name: 'Stamina', description: 'Keeping the tempo for 90 minutes and a whole season.' },
  physique: {
    name: 'Physique',
    description: 'A frame that takes the knocks and keeps injuries away.'
  },
  composure: { name: 'Composure', description: 'Staying calm when the pressure is on.' },
  leadership: {
    name: 'Leadership',
    description: 'Your pull in the dressing room and on the pitch.'
  },
  corners: {
    name: 'Corners',
    description: 'Putting a corner exactly where you want it: near post, penalty spot or short.'
  },
  freeKicks: { name: 'Free kicks', description: 'Direct shots and crosses from set pieces.' },
  penalties: { name: 'Penalties', description: 'Nerve and technique from twelve yards.' }
}

export const NATIONALITIES_EN: Record<NationalityId, string> = {
  ARG: 'Argentina',
  BRA: 'Brazil',
  ESP: 'Spain',
  FRA: 'France',
  ENG: 'England',
  GER: 'Germany',
  ITA: 'Italy',
  JPN: 'Japan',
  USA: 'United States'
}

export const POSITIONS_EN: Record<PositionId, { name: string; short: string }> = {
  POR: { name: 'Goalkeeper', short: 'GK' },
  DFC: { name: 'Centre-back', short: 'CB' },
  LAT: { name: 'Full-back', short: 'FB' },
  MCD: { name: 'Defensive midfielder', short: 'DM' },
  MP: { name: 'Attacking midfielder', short: 'AM' },
  DC: { name: 'Striker', short: 'ST' }
}

export const GAME_MODES_EN: Record<GameModeId, { name: string; description: string }> = {
  rapida: {
    name: 'Quick',
    description: '15 seasons. You make decisions every other season. Attributes from 1 to 20.'
  },
  normal: {
    name: 'Normal',
    description: '20 seasons. You make decisions every other season. Attributes from 1 to 30.'
  },
  completa: {
    name: 'Full',
    description:
      '15 seasons. Decisions every season and big matches played moment by moment. Attributes from 1 to 50.'
  },
  personalizada: {
    name: 'Custom',
    description: 'You choose how many seasons (up to 25) and how often you make decisions.'
  }
}

/** How often you decide (1, 2 or 3 seasons). */
export const INTERVALS_EN: Record<1 | 2 | 3, string> = {
  1: 'Every season',
  2: 'Every other season',
  3: 'Every third season'
}

/** Leagues and cups: the same generic, unlicensed names, written the English way. */
export const LEAGUES_EN: Record<
  NationalityId,
  { division1Name: string; division2Name: string; cupName: string }
> = {
  ARG: {
    division1Name: 'Argentine First Division',
    division2Name: 'Argentine Second Division',
    cupName: 'Argentine Cup'
  },
  BRA: {
    division1Name: 'Brazilian First Division',
    division2Name: 'Brazilian Second Division',
    cupName: 'Brazilian Cup'
  },
  ESP: {
    division1Name: 'Spanish First Division',
    division2Name: 'Spanish Second Division',
    cupName: 'Spanish Cup'
  },
  FRA: {
    division1Name: 'French First Division',
    division2Name: 'French Second Division',
    cupName: 'French Cup'
  },
  ENG: {
    division1Name: 'English First Division',
    division2Name: 'English Second Division',
    cupName: 'English Cup'
  },
  GER: {
    division1Name: 'German First Division',
    division2Name: 'German Second Division',
    cupName: 'German Cup'
  },
  ITA: {
    division1Name: 'Italian First Division',
    division2Name: 'Italian Second Division',
    cupName: 'Italian Cup'
  },
  JPN: {
    division1Name: 'Japanese First Division',
    division2Name: 'Japanese Second Division',
    cupName: 'Japanese Cup'
  },
  USA: {
    division1Name: 'American First Division',
    division2Name: 'American Second Division',
    cupName: 'American Cup'
  }
}

/** Same names as the matching trophies. */
export const CONTINENTAL_EN: Record<ContinentalFormatId, string> = {
  campeones: "Champions' Cup",
  europa: 'European Shield',
  conferencia: 'Conference Cup',
  intercontinental: 'Intercontinental Cup',
  legacy: "Champions' Cup"
}

export const TOURNAMENTS_EN: Record<TournamentId, string> = {
  mundial: 'World Cup of Nations',
  'copa-naciones': 'Cup of Nations'
}

export const CURRENCIES_EN: Record<CurrencyId, string> = {
  EUR: 'euros',
  GBP: 'pounds',
  USD: 'dollars',
  ARS: 'Argentine pesos',
  BRL: 'reais',
  JPY: 'yen'
}

/** Cup and tournament rounds (the game stores them by their Spanish key). */
export const ROUNDS_EN: Record<string, string> = {
  'Dieciseisavos de final': 'Round of 32',
  'Octavos de final': 'Round of 16',
  'Cuartos de final': 'Quarter-finals',
  Semifinales: 'Semi-finals',
  Final: 'Final',
  'Fase de grupos': 'Group stage',
  Campeón: 'Champions'
}
