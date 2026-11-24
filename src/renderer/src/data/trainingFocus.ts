import type { AttributeId } from './attributes'
import type { EventEffects } from './events'

/**
 * Sesiones extra con el cuerpo técnico, una por atributo. El evento "Horas
 * extra" ofrece las tres que más necesita tu equipo (ver `trainingOptions`).
 */
export interface TrainingFocus {
  /** Texto del botón (sin el nombre del atributo, que se añade delante). */
  label: string
  text: string
  /** Efectos además del +1 al atributo (escala de 20). */
  extra: Omit<EventEffects, 'attributes'>
}

export const TRAINING_FOCUS: Record<AttributeId, TrainingFocus> = {
  finishing: {
    label: 'cien remates cada tarde',
    text: 'Acabas con los gemelos destrozados, pero el balón entra cada vez más fácil.',
    extra: { morale: -2 }
  },
  heading: {
    label: 'centros al área hasta que oscurezca',
    text: 'Te duele la frente de tantos cabezazos, pero ya atacas el balón en el punto más alto.',
    extra: { morale: -1 }
  },
  dribbling: {
    label: 'conducción entre conos y uno contra uno',
    text: 'El segundo entrenador te pone defensas de la cantera y acabas dejándolos sentados.',
    extra: { morale: 2 }
  },
  shortPassing: {
    label: 'rondos y paredes a un toque',
    text: 'A fuerza de rondos, tus apoyos de espaldas ya no se pierden.',
    extra: { trust: 2 }
  },
  longPassing: {
    label: 'cambios de orientación de cuarenta metros',
    text: 'Tus balones largos empiezan a caer donde quieres, no donde pueden.',
    extra: { trust: 2 }
  },
  offTheBall: {
    label: 'vídeo de los movimientos de los mejores',
    text: 'Horas de vídeo con el analista. Empiezas a ver huecos donde antes no veías nada.',
    extra: { trust: 2 }
  },
  pace: {
    label: 'series de sprint y salidas',
    text: 'Las series te dejan sin aire, pero tu arrancada es más explosiva que nunca.',
    extra: { morale: -2 }
  },
  strength: {
    label: 'gimnasio para ganar potencia',
    text: 'Ganas tres kilos de músculo. Los centrales ya no te mueven tan fácil.',
    extra: { morale: -2 }
  },
  stamina: {
    label: 'carrera continua y trabajo aeróbico',
    text: 'Ya no se te nota el cansancio en el minuto 80.',
    extra: { morale: -1 }
  },
  physique: {
    label: 'prevención de lesiones y trabajo de core',
    text: 'Tu cuerpo aguanta mejor los golpes y las cargas de la temporada.',
    extra: { trust: 1 }
  },
  composure: {
    label: 'mano a mano con presión del preparador',
    text: 'Te gritan, te empujan y te cronometran. Cuando llega el momento, ya no te tiembla el pie.',
    extra: { morale: 1 }
  },
  leadership: {
    label: 'charlas con el capitán y el cuerpo técnico',
    text: 'Empiezas a hablar más en el vestuario y los jóvenes te escuchan.',
    extra: { trust: 3 }
  },
  corners: {
    label: 'cincuenta córners a cada palo',
    text: 'Tus córners ya caen en la cabeza de los centrales con precisión.',
    extra: { trust: 2 }
  },
  freeKicks: {
    label: 'faltas contra la barrera de entrenamiento',
    text: 'La rosca empieza a salir sola: el portero suplente ya no las ve.',
    extra: { morale: 2 }
  },
  penalties: {
    label: 'tandas de penaltis con el portero',
    text: 'Eliges esquina, no cambias de idea y la clavas. Una y otra vez.',
    extra: { morale: 2 }
  }
}
