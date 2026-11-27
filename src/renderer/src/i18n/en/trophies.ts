import type { TrophyId } from '../../data/trophies'
import type { TrophyText } from '../packs'

/** English trophy names (invented, unlicensed) and descriptions (`TROPHIES`). */
export const TROPHIES_EN: Record<TrophyId, TrophyText> = {
  liga: { name: 'National League', description: 'League champions.' },
  segunda: {
    name: 'Second Division Title',
    description: 'Won the second division (and promotion with it).'
  },
  copa: { name: 'National Cup', description: 'Winners of the cup.' },
  continental: {
    name: "Champions' Cup",
    description: "The continent's premier club competition."
  },
  'copa-europa': {
    name: 'European Shield',
    description: "Europe's second competition: each league's 5th and 6th."
  },
  conferencia: {
    name: 'Conference Cup',
    description: "Europe's third competition: each league's 7th."
  },
  intercontinental: {
    name: 'Intercontinental Cup',
    description: 'Club tournament for the Americas and Asia.'
  },
  mundial: {
    name: 'World Cup of Nations',
    description: 'World champion with your national team.'
  },
  'copa-naciones': {
    name: 'Cup of Nations',
    description: 'Continental champion with your national team.'
  },
  'balon-dorado': {
    name: 'Golden Ball',
    description: "The world's best player of the season."
  },
  mvp: { name: 'Player of the Season', description: 'Best player in the league.' },
  goleador: { name: 'Silver Boot', description: "The league's top scorer." },
  asistente: { name: 'Playmaker of the Season', description: 'Most assists in the league.' },
  'equipo-ideal': {
    name: 'Dream Team',
    description: "Picked in the season's best starting XI."
  },
  joven: { name: 'Best Young Player', description: 'Best player aged 21 or under.' },
  'bota-torneo': {
    name: 'International Golden Boot',
    description: 'Top scorer at an international tournament.'
  }
}
