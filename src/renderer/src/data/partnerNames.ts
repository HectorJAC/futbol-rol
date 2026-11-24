import type { NationalityId } from './nationalities'

/** Nombres para la pareja del jugador (según su nacionalidad). */
export const PARTNER_NAMES: Record<NationalityId, readonly string[]> = {
  ARG: [
    'Camila',
    'Valentina',
    'Martina',
    'Sofía',
    'Lucía',
    'Agustina',
    'Florencia',
    'Julieta',
    'Antonella',
    'Micaela'
  ],
  BRA: [
    'Ana Clara',
    'Beatriz',
    'Larissa',
    'Fernanda',
    'Gabriela',
    'Juliana',
    'Mariana',
    'Bruna',
    'Letícia',
    'Isabela'
  ],
  ESP: ['Lucía', 'Paula', 'Marta', 'Carmen', 'Laura', 'Elena', 'Irene', 'Claudia', 'Nerea', 'Alba'],
  FRA: [
    'Camille',
    'Léa',
    'Manon',
    'Chloé',
    'Inès',
    'Sarah',
    'Juliette',
    'Clara',
    'Louise',
    'Anaïs'
  ],
  ENG: [
    'Emily',
    'Olivia',
    'Charlotte',
    'Sophie',
    'Grace',
    'Lucy',
    'Hannah',
    'Amelia',
    'Ella',
    'Megan'
  ],
  GER: ['Lena', 'Hannah', 'Laura', 'Lea', 'Anna', 'Julia', 'Sophie', 'Marie', 'Lisa', 'Katharina'],
  ITA: [
    'Giulia',
    'Chiara',
    'Francesca',
    'Sara',
    'Martina',
    'Alessia',
    'Giorgia',
    'Valentina',
    'Elisa',
    'Federica'
  ],
  JPN: ['Yui', 'Hina', 'Sakura', 'Aoi', 'Mio', 'Yuna', 'Rin', 'Haruka', 'Misaki', 'Nanami'],
  USA: [
    'Madison',
    'Emma',
    'Ashley',
    'Taylor',
    'Hailey',
    'Brooke',
    'Jessica',
    'Lauren',
    'Kayla',
    'Morgan'
  ]
}
