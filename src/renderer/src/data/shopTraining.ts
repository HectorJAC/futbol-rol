import type { ShopItem } from './shop'

/**
 * Entrenamientos privados: uno por atributo (se pueden repetir una vez por
 * temporada) y tres programas de élite que llegan a partir de la cuarta temporada.
 */
export const TRAINING_ITEMS: readonly ShopItem[] = [
  {
    id: 'entreno-remate',
    name: 'Sesiones de remate con un exdelantero',
    category: 'Entrenamiento',
    description:
      'Un exgoleador internacional te corrige el golpeo y la colocación del cuerpo ante el portero.',
    cost: 90_000,
    limit: 'season',
    attributes: { finishing: 3 }
  },
  {
    id: 'entreno-juego-aereo',
    name: 'Especialista en juego aéreo',
    category: 'Entrenamiento',
    description: 'Un excentral te enseña a medir el salto, ganar la posición y orientar el cuello.',
    cost: 45_000,
    limit: 'season',
    attributes: { heading: 2 }
  },
  {
    id: 'entreno-regate',
    name: 'Escuela de regate en espacios reducidos',
    category: 'Entrenamiento',
    description: 'Conducción, fintas y cambios de ritmo en jaulas de cinco metros por cinco.',
    cost: 50_000,
    limit: 'season',
    attributes: { dribbling: 2 }
  },
  {
    id: 'entreno-pase-corto',
    name: 'Rondos y juego a un toque con un exmediocentro',
    category: 'Entrenamiento',
    description: 'Aprendes a descargar de espaldas y a jugar de primeras sin perder el balón.',
    cost: 40_000,
    limit: 'season',
    attributes: { shortPassing: 2 }
  },
  {
    id: 'entreno-pase-largo',
    name: 'Taller de golpeo largo',
    category: 'Entrenamiento',
    description: 'Cambios de orientación y balones al espacio hasta que el empeine responda solo.',
    cost: 35_000,
    limit: 'season',
    attributes: { longPassing: 2 }
  },
  {
    id: 'entreno-desmarque',
    name: 'Entrenador de movimientos sin balón',
    category: 'Entrenamiento',
    description: 'Un exdelantero centro te enseña a atacar el hueco entre central y lateral.',
    cost: 85_000,
    limit: 'season',
    attributes: { offTheBall: 3 }
  },
  {
    id: 'entreno-sprint',
    name: 'Sesiones de sprint en pista de atletismo',
    category: 'Entrenamiento',
    description:
      'Técnica de carrera, salidas de tacos y trabajo de zancada con una exatleta olímpica.',
    cost: 80_000,
    limit: 'season',
    attributes: { pace: 3 }
  },
  {
    id: 'entreno-pliometria',
    name: 'Programa de potencia y pliometría',
    category: 'Entrenamiento',
    description:
      'Saltos, arrastres y balón medicinal para ganar explosividad en el disparo y el salto.',
    cost: 45_000,
    limit: 'season',
    attributes: { strength: 2 }
  },
  {
    id: 'entreno-fondo',
    name: 'Plan de resistencia con un preparador de fondistas',
    category: 'Entrenamiento',
    description: 'Series, umbrales y pulsómetro para llegar al minuto 90 con piernas.',
    cost: 40_000,
    limit: 'season',
    attributes: { stamina: 2 }
  },
  {
    id: 'entreno-prevencion',
    name: 'Programa de prevención de lesiones',
    category: 'Entrenamiento',
    description: 'Core, propiocepción y trabajo excéntrico para que el cuerpo aguante los choques.',
    cost: 50_000,
    limit: 'season',
    attributes: { physique: 2 }
  },
  {
    id: 'entreno-visualizacion',
    name: 'Entrenamiento mental con visualización',
    category: 'Entrenamiento',
    description:
      'Un coach de alto rendimiento te enseña a respirar y a ensayar cada ocasión en tu cabeza.',
    cost: 45_000,
    limit: 'season',
    attributes: { composure: 2 }
  },
  {
    id: 'entreno-excapitan',
    name: 'Mentoría con un excapitán',
    category: 'Entrenamiento',
    description:
      'Un excapitán de selección te enseña a hablar en el vestuario y a mandar en el campo.',
    cost: 55_000,
    limit: 'season',
    attributes: { leadership: 2 }
  },
  {
    id: 'entreno-corners',
    name: 'Especialista en saques de esquina',
    category: 'Entrenamiento',
    description:
      'Cien córners por sesión hasta clavarlos al primer palo, al punto de penalti o en corto.',
    cost: 20_000,
    limit: 'season',
    attributes: { corners: 1 }
  },
  {
    id: 'entreno-faltas',
    name: 'Especialista en lanzamiento de faltas',
    category: 'Entrenamiento',
    description: 'Barrera de maniquíes, balón parado y un maestro del golpeo con rosca a tu lado.',
    cost: 75_000,
    limit: 'season',
    attributes: { freeKicks: 3 }
  },
  {
    id: 'entreno-penaltis-presion',
    name: 'Psicólogo deportivo: penaltis bajo presión',
    category: 'Entrenamiento',
    description:
      'Rutina de lanzamiento, respiración y vídeo de porteros para tirar con sangre fría.',
    cost: 40_000,
    limit: 'season',
    attributes: { penalties: 2 }
  },

  // Programas de élite
  {
    id: 'entreno-elite-goleador',
    name: 'Stage del goleador con un ex máximo goleador europeo',
    category: 'Entrenamiento',
    description: 'Una semana al mes en su finca: remate y desmarque de la mañana a la noche.',
    cost: 300_000,
    limit: 'season',
    attributes: { finishing: 3, offTheBall: 3 },
    minSeason: 4
  },
  {
    id: 'entreno-elite-faltas',
    name: 'Maestro de las faltas en exclusiva',
    category: 'Entrenamiento',
    description:
      'Contratas a tiempo completo a un mito del golpeo con rosca durante toda la temporada.',
    cost: 280_000,
    limit: 'season',
    attributes: { freeKicks: 3, corners: 3 },
    minSeason: 4
  },
  {
    id: 'entreno-elite-atleta',
    name: 'Centro de alto rendimiento para atletas de élite',
    category: 'Entrenamiento',
    description: 'Biomecánica, laboratorio de fisiología y preparadores olímpicos solo para ti.',
    cost: 350_000,
    limit: 'season',
    attributes: { pace: 3, stamina: 3 },
    minSeason: 4
  }
]
