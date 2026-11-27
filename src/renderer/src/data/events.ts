import type { AttributeId, Attributes, SetPieceId } from './attributes'
import type { ClubTier } from './clubs'
import { CONTEXT_EVENTS } from './contextEvents'
import { EXTRA_EVENTS } from './eventsExtra'
import { STORY_EVENTS } from './storyEvents'
import { TEAM_EVENTS } from './teamEvents'
import type { OriginArchetype } from './origins'
import type { TeammateRole } from '../types/career'
import { bindEvent } from '../i18n/bind'
import { BASE_EVENTS_EN, CONTEXT_EVENTS_EN } from '../i18n/en/eventsBase'
import { EXTRA_EVENTS_EN } from '../i18n/en/eventsExtra'
import { STORY_EVENTS_EN } from '../i18n/en/eventsStory'
import { TEAM_EVENTS_EN } from '../i18n/en/eventsTeam'

/** Lo que cambia al elegir una opción (o al acertar/fallar una tirada). */
export interface EventEffects {
  attributes?: Partial<Attributes>
  /** Confianza del entrenador (0–100): decide los minutos. */
  trust?: number
  /** Moral del jugador (0–100): influye en el rendimiento. */
  morale?: number
  /** Fama ante prensa y afición (0–100): influye en premios y ofertas. */
  reputation?: number
  /** Goles extra que se suman al final de la temporada. */
  goals?: number
  /** Dinero que ganas (positivo) o gastas (negativo), en euros. */
  money?: number
  /** Memoria para consecuencias futuras. */
  flags?: Record<string, string | number | boolean>
  /** Suma a flags numéricos (p. ej. `{ children: 1 }` al tener un hijo). */
  addFlags?: Record<string, number>
  /** Cambio de relación con compañeros de tu club (`todos` = todo el vestuario). */
  teammates?: Partial<Record<TeammateRole | 'todos', number>>
  /** Cambio de relación con el excompañero protagonista del evento (`{excompanero}`). */
  exTeammate?: number
  /** Te conviertes en el capitán del equipo. */
  becomeCaptain?: boolean
  /**
   * Cambio en la relación con tu pareja (0–100, desde la v0.17). A 50 sois
   * novios, a 100 os casáis y a 0 os separáis (ver `logic/partner.ts`).
   */
  partner?: number
  /** Cambio en la relación con la afición de tu club, además de lo que mueve la fama (v0.17). */
  fans?: number
  /** Lesión (v0.17): partidos de baja y zona del cuerpo (ver `logic/injury.ts`). */
  injury?: InjuryEffect
}

/** Zona de la lesión: decide qué atributos se resienten. */
export type InjuryZone = 'tobillo' | 'muscular' | 'rodilla' | 'espalda'

export interface InjuryEffect {
  /** Partidos (huecos del calendario) que te pierdes. */
  matches: number
  zone: InjuryZone
  /** `false` = recuperación bien hecha: no pierdes atributos. */
  attributeLoss?: boolean
}

/** Condición sobre la relación con un compañero (0–100). */
export interface TeammateCondition {
  role: TeammateRole
  min?: number
  max?: number
}

/** Condición sobre un flag, para los eventos de historia (pareja, familia…). */
export interface FlagCondition {
  flag: string
  /** El flag vale uno de estos valores (`null` = el flag no existe todavía). */
  oneOf?: Array<string | number | boolean | null>
  /** Valor numérico mínimo del flag (si no existe cuenta como 0). */
  min?: number
  /** Valor numérico máximo del flag (si no existe cuenta como 0). */
  max?: number
  /**
   * Temporadas mínimas desde la temporada guardada en el flag. Por ejemplo
   * `{ flag: 'partnerStageSince', seasonsSince: 1 }` = al menos una temporada en la etapa actual.
   */
  seasonsSince?: number
}

/**
 * Contexto que tiene que darse para que salga un evento. Los campos del último
 * partido hacen que el evento "reaccione": solo sale justo después de un
 * partido con ese resultado (y su texto puede usar `{marcador}`, `{rival}`, `{goles}`).
 */
export interface EventContext {
  /** Resultado del último partido de tu club. */
  lastResult?: Array<'victoria' | 'empate' | 'derrota'>
  /** Diferencia mínima de goles en el último partido (en valor absoluto). */
  minGoalDiff?: number
  /** Goles mínimos tuyos en el último partido. */
  minPlayerGoals?: number
  /** Partidos jugados seguidos sin marcar. */
  goalDrought?: number
  /** Primera temporada en un club nuevo tras un fichaje. */
  newClub?: boolean
  /** Estrellas mínimas del club actual. */
  minPrestige?: number
  /** Juegas en un país distinto al tuyo. */
  abroad?: boolean
}

/** Evento de una historia larga: sale como mucho uno por temporada y tiene prioridad. */
export interface StoryInfo {
  /** Historia a la que pertenece ('pareja'). */
  id: string
  /** Si es `true` puede volver a salir en otra temporada; si no, solo una vez por carrera. */
  repeatable?: boolean
  /** Los de mayor prioridad salen antes (p. ej. que tu pareja descubra una infidelidad). */
  priority?: number
}

export interface Outcome {
  text: string
  effects: EventEffects
}

/** Tirada de habilidad estilo Baldur's Gate: atributo contra dificultad. */
export interface SkillCheck {
  attribute: AttributeId
  difficulty: number
  success: Outcome
  failure: Outcome
}

export interface EventOption {
  label: string
  /** Si hay tirada, el resultado depende de ella; si no, `outcome` se aplica siempre. */
  check?: SkillCheck
  outcome?: Outcome
}

export interface GameEvent {
  id: string
  title: string
  text: string
  options: EventOption[]
  /** Condiciones para que pueda aparecer. */
  onlySeason?: number
  minSeason?: number
  /** Solo para jugadores con un origen de este tipo. */
  archetypes?: OriginArchetype[]
  /** Edad mínima / máxima del jugador. */
  minAge?: number
  maxAge?: number
  tiers?: ClubTier[]
  /**
   * Evento de consecuencia: solo aparece si una decisión anterior dejó estos flags.
   * Tiene prioridad sobre los eventos normales y sale una sola vez por carrera.
   */
  requiresFlags?: Record<string, string | number | boolean>
  /** Condiciones sobre flags (todas tienen que cumplirse). */
  conditions?: FlagCondition[]
  /** Contexto de la carrera o del último partido (ver `EventContext`). */
  context?: EventContext
  /** Solo puede salir una vez en toda la carrera. */
  once?: boolean
  /** Cada opción muestra todo lo que cambia al elegirla (moral, confianza, dinero…). */
  showEffects?: boolean
  /**
   * Las opciones que cuestan más dinero del que tienes se ven, pero bloqueadas
   * (en el resto de eventos se paga lo que tengas).
   */
  lockUnaffordable?: boolean
  /** Solo si eres el lanzador designado de esa jugada a balón parado. */
  setPieceTaker?: SetPieceId
  /**
   * Solo si no eres titular habitual (ni capitán): p. ej. "titular por sorpresa".
   * Ver `isRegularStarter`.
   */
  notRegularStarter?: boolean
  /** Solo si tienes esa edad o menos, salvo que acabes de llegar al club. */
  maxAgeUnlessNew?: number
  /** Evento de historia larga (ver `StoryInfo`). */
  story?: StoryInfo
  /**
   * Relación con un compañero de tu club. En los textos se puede usar
   * `{capitan}`, `{rivalPuesto}`, `{veterano}`, `{amigo}` y `{joven}`.
   */
  teammate?: TeammateCondition
  /**
   * Necesita un excompañero con esa relación; el texto lo nombra con
   * `{excompanero}` y el club donde coincidisteis con `{exclub}`.
   */
  exTeammate?: { min?: number; max?: number }
  /** `true` = solo si eres el capitán; `false` = solo si no lo eres. */
  captain?: boolean
  /** Solo cuando el vestuario te propone ser capitán (ver `canBeCaptain`). */
  captaincyOffer?: boolean
  /**
   * Las opciones se generan según lo que tu equipo necesita que mejores
   * (ver `eventOptions`); `options` queda como respaldo.
   */
  trainingOptions?: boolean
}

/** Eventos de la v0.3–v0.6. */
const BASE_EVENTS: readonly GameEvent[] = [
  {
    id: 'debut',
    title: 'Tu debut',
    text: 'Minuto 70. El entrenador te llama a la banda: "Sal y disfruta, chaval". El estadio entero te mira por primera vez.',
    onlySeason: 1,
    options: [
      {
        label: 'Pedir el balón y buscar portería desde el primer toque',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Recibes, te perfilas y la cuelgas en la escuadra. Gol en tu debut. El estadio corea tu nombre.',
            effects: { goals: 1, trust: 8, morale: 12, reputation: 6, flags: { goalOnDebut: true } }
          },
          failure: {
            text: 'Las piernas te tiemblan. Pierdes dos balones seguidos y el entrenador resopla en la banda.',
            effects: { trust: -4, morale: -6 }
          }
        }
      },
      {
        label: 'Jugar sencillo, presionar y ayudar al equipo',
        outcome: {
          text: 'No brillas, pero no fallas. El míster te da una palmada al acabar: "Así se empieza".',
          effects: { trust: 6, morale: 3 }
        }
      }
    ]
  },
  {
    id: 'fiesta',
    title: 'Noche de fiesta',
    text: 'Tus compañeros te invitan a una fiesta la noche antes de un partido. "Venga, novato, que hay que hacer piña".',
    options: [
      {
        label: 'Ir y quedarte hasta el final',
        outcome: {
          text: 'Te lo pasas en grande y el vestuario te adopta. A la mañana siguiente el preparador físico no opina lo mismo.',
          effects: { morale: 10, trust: -10, flags: { partyAnimal: true } }
        }
      },
      {
        label: 'Ir un rato y escabullirte pronto',
        check: {
          attribute: 'leadership',
          difficulty: 9,
          success: {
            text: 'Haces acto de presencia, brindas con todos y te vas a medianoche sin que nadie se lo tome a mal.',
            effects: { morale: 6, trust: 2 }
          },
          failure: {
            text: 'Te enredas, vuelves a las tantas y alguien sube una foto tuya a las redes.',
            effects: { trust: -8, reputation: -3 }
          }
        }
      },
      {
        label: 'Quedarte en casa descansando',
        outcome: {
          text: 'Duermes nueve horas. Algún compañero te llama "aburrido", pero el cuerpo técnico toma nota.',
          effects: { trust: 5, morale: -3 }
        }
      }
    ]
  },
  {
    id: 'extra',
    title: 'Horas extra',
    text: 'El segundo entrenador te ofrece quedarte después de cada sesión. Según el cuerpo técnico, esto es lo que el equipo necesita que mejores:',
    trainingOptions: true,
    options: [
      {
        label: 'Definición: cien remates cada tarde',
        outcome: {
          text: 'Acabas con los gemelos destrozados, pero el balón entra cada vez más fácil.',
          effects: { attributes: { finishing: 1 }, morale: -2 }
        }
      },
      {
        label: 'Gimnasio: ganar potencia',
        outcome: {
          text: 'Ganas tres kilos de músculo. Los centrales ya no te mueven tan fácil.',
          effects: { attributes: { strength: 1 }, morale: -2 }
        }
      },
      {
        label: 'Vídeo: estudiar los movimientos de los mejores',
        outcome: {
          text: 'Horas de vídeo con el analista. Empiezas a ver huecos donde antes no veías nada.',
          effects: { attributes: { offTheBall: 1 }, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'prensa',
    // "¿Contento con tus minutos?": no tiene sentido si ya juegas siempre.
    notRegularStarter: true,
    title: 'Rueda de prensa',
    text: 'Un periodista te pregunta, con mala intención, si estás contento con tus minutos.',
    options: [
      {
        label: '"Trabajo cada día y respeto las decisiones del míster."',
        outcome: {
          text: 'Respuesta de manual. Titulares aburridos, pero el entrenador lo agradece.',
          effects: { trust: 6 }
        }
      },
      {
        label: '"Sinceramente, creo que merezco jugar más."',
        outcome: {
          text: 'Tu frase abre todos los informativos. La afición te apoya; el vestuario técnico, no tanto.',
          effects: { reputation: 6, trust: -8, flags: { publicComplaint: true } }
        }
      },
      {
        label: 'Contestar con una broma',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'La sala se ríe y tu respuesta se hace viral por las buenas razones.',
            effects: { reputation: 5, morale: 4 }
          },
          failure: {
            text: 'El chiste no hace gracia a nadie y parece que te burlas del club.',
            effects: { reputation: -4, trust: -4 }
          }
        }
      }
    ]
  },
  {
    id: 'penalti',
    // "El capitán ya tiene el balón": no si el capitán eres tú.
    captain: false,
    title: 'Penalti en el 90',
    text: 'Empate a uno, último minuto. Penalti a favor. El capitán ya tiene el balón en las manos, pero te mira.',
    options: [
      {
        label: 'Pedirle el balón: "Déjamelo a mí"',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Paradinha, portero al suelo y balón a la red. Te tiras de rodillas frente a tu afición.',
            effects: { goals: 1, reputation: 8, morale: 10, trust: 4 }
          },
          failure: {
            text: 'El portero adivina el lado. El silencio del estadio pesa una tonelada.',
            effects: { morale: -10, reputation: -5 }
          }
        }
      },
      {
        label: 'Dejar que lo tire el capitán',
        outcome: {
          text: 'El capitán marca y te dedica el gol. "La próxima es tuya", te dice al oído.',
          effects: { trust: 3, morale: 2, flags: { captainRespect: true } }
        }
      }
    ]
  },
  {
    id: 'patrocinador',
    title: 'Una marca llama a tu puerta',
    text: 'Una marca de botas quiere hacerte la cara de su nueva campaña. Rodaje de tres días en plena temporada.',
    options: [
      {
        label: 'Aceptar: es tu momento',
        outcome: {
          text: 'Tu cara aparece en vallas de todo el país. En el club algunos piensan que te distraes.',
          effects: { reputation: 8, morale: 5, trust: -4, flags: { sponsor: 'botas' } }
        }
      },
      {
        label: 'Rechazar y centrarte en el fútbol',
        outcome: {
          text: 'Dices que no. El entrenador se entera y lo valora.',
          effects: { trust: 4 }
        }
      }
    ]
  },
  {
    id: 'rival',
    title: 'Rivalidad en el vestuario',
    text: 'El otro delantero del equipo te provoca en cada entrenamiento. Hoy te ha dado una patada a destiempo.',
    options: [
      {
        label: 'Responder en el campo: humillarlo con un regate',
        check: {
          attribute: 'dribbling',
          difficulty: 10,
          success: {
            text: 'Caño y gol en el partidillo. El entrenador sonríe sin querer.',
            effects: { trust: 7, morale: 5 }
          },
          failure: {
            text: 'Te roba el balón y lo celebra delante de todos.',
            effects: { morale: -5, trust: -2 }
          }
        }
      },
      {
        label: 'Encararlo en el vestuario',
        outcome: {
          text: 'Os tienen que separar. Ganas respeto en el grupo, pero el míster os multa a los dos.',
          effects: { morale: 4, trust: -6, flags: { internalRival: 'enemigo' } }
        }
      },
      {
        label: 'Ignorarlo y seguir a lo tuyo',
        outcome: {
          text: 'No entras al trapo. Aprendes a mantener la cabeza fría.',
          effects: { attributes: { composure: 1 }, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'molestias',
    title: 'Molestias musculares',
    text: 'Notas un pinchazo en el isquiotibial antes del partido más importante del mes.',
    options: [
      {
        label: 'Jugar igualmente',
        check: {
          attribute: 'strength',
          difficulty: 11,
          success: {
            text: 'Aguantas los noventa minutos y marcas. Nadie se entera de que jugaste tocado.',
            effects: { goals: 1, trust: 5, morale: 4 }
          },
          failure: {
            text: 'Te rompes en el minuto 20. Tres semanas fuera y algo de velocidad perdida.',
            effects: { injury: { matches: 3, zone: 'muscular' }, morale: -8, trust: -3 }
          }
        }
      },
      {
        label: 'Avisar al médico y parar',
        outcome: {
          text: 'Te pierdes el partido, pero vuelves al cien por cien.',
          effects: { trust: -1, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'clasico',
    // "Titular por sorpresa": no tiene sentido si ya juegas siempre.
    notRegularStarter: true,
    title: 'El gran partido',
    text: 'Llega el partido más esperado del año. Titular por sorpresa. El entrenador te pide que fijes a los centrales.',
    options: [
      {
        label: 'Ir a por el gol a toda costa',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Doblete. Tu nombre en todas las portadas a la mañana siguiente.',
            effects: { goals: 2, reputation: 10, morale: 8 }
          },
          failure: {
            text: 'Tres ocasiones claras, tres fallos. Te cambian en el descanso.',
            effects: { morale: -8, trust: -5 }
          }
        }
      },
      {
        label: 'Hacer exactamente lo que pide el míster',
        outcome: {
          text: 'Desgaste, peleas y una asistencia de cabeza. Partido serio que el cuerpo técnico aplaude.',
          effects: { trust: 7, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'padre-tv',
    title: 'Tu padre, en televisión',
    text: 'Tu padre, la leyenda del club, dice en un programa de televisión que todavía "te falta carácter".',
    archetypes: ['herencia'],
    options: [
      {
        label: 'Llamarle y hablarlo en privado',
        outcome: {
          text: 'Una conversación larga y sincera. Por primera vez sientes que te habla como a un igual.',
          effects: { morale: 6, flags: { fatherRelation: 'buena' } }
        }
      },
      {
        label: 'Responderle en redes sociales',
        outcome: {
          text: 'El "zasca" a tu padre da la vuelta al país. Mucha fama y una cena de Navidad muy tensa.',
          effects: { reputation: 7, morale: -4, flags: { fatherRelation: 'tensa' } }
        }
      },
      {
        label: 'No decir nada y responder en el campo',
        outcome: {
          text: 'Callas y entrenas el doble. El carácter se demuestra, no se declara.',
          effects: { attributes: { leadership: 1 } }
        }
      }
    ]
  },
  {
    id: 'potrero',
    title: 'Vuelta al barrio',
    text: 'Un día libre vuelves al potrero donde empezaste. Los niños del barrio te reconocen y se lanzan a por ti.',
    archetypes: ['barrio'],
    options: [
      {
        label: 'Quedarte toda la tarde jugando con ellos',
        outcome: {
          text: 'Vuelves a sentirte como a los diez años. Recuerdas por qué juegas.',
          effects: { morale: 10, attributes: { dribbling: 1 } }
        }
      },
      {
        label: 'Organizar un partido benéfico para arreglar el campo',
        outcome: {
          text: 'El club se suma a la idea y el barrio estrena césped. La prensa lo cuenta.',
          effects: { reputation: 6, morale: 4, fans: 10, flags: { charityBarrio: true } }
        }
      }
    ]
  },
  {
    id: 'ojeador',
    title: 'Un ojeador extranjero',
    text: 'Un ojeador de un grande del extranjero se presenta en tu partido y pregunta por ti a tu agente.',
    minSeason: 2,
    options: [
      {
        label: 'Mostrar interés',
        outcome: {
          text: 'Tu agente filtra la noticia. Tu valor sube, pero en el club no gusta nada.',
          effects: { reputation: 5, trust: -6, fans: -15, flags: { foreignInterest: true } }
        }
      },
      {
        label: '"Aquí soy feliz"',
        outcome: {
          text: 'Lo dices públicamente. La afición te canta en el siguiente partido.',
          effects: { trust: 5, morale: 4, fans: 10, flags: { loyalToClub: true } }
        }
      }
    ]
  },
  {
    id: 'suplencia',
    // Solo tras una racha de partidos sin marcar.
    context: { goalDrought: 3 },
    title: 'Al banquillo',
    text: 'Tras una racha sin marcar, el entrenador te comunica que el domingo empiezas en el banquillo.',
    tiers: ['grande', 'medio'],
    options: [
      {
        label: 'Aceptarlo y redoblar el esfuerzo',
        outcome: {
          text: 'Entrenas como nunca. Cuando vuelves a tener la oportunidad, estás preparado.',
          effects: { trust: 6, morale: -2, attributes: { finishing: 1 } }
        }
      },
      {
        label: 'Pedir una reunión con el director deportivo',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Expones tu caso con madurez. El club te promete más protagonismo.',
            effects: { trust: 4, reputation: 3 }
          },
          failure: {
            text: 'Saltarte al entrenador sienta fatal. Ahora estás en su lista negra.',
            effects: { trust: -12, morale: -4, flags: { coachConflict: true } }
          }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Eventos de consecuencia: vuelven decisiones de temporadas anteriores.
  // -------------------------------------------------------------------------
  {
    id: 'consecuencia-fiesta',
    title: 'La foto que no querías',
    text: 'Un periódico publica fotos tuyas de fiesta de la temporada pasada. El club pide explicaciones y la afición murmura.',
    requiresFlags: { partyAnimal: true },
    options: [
      {
        label: 'Pedir perdón públicamente',
        outcome: {
          text: 'Das la cara ante los micrófonos. La tormenta pasa antes de lo esperado.',
          effects: { reputation: -2, trust: 4, flags: { partyAnimal: false } }
        }
      },
      {
        label: '"Mi vida privada es mía"',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Lo dices con tanta calma que la polémica se apaga sola. Hasta te ganas algunos fans.',
            effects: { reputation: 3 }
          },
          failure: {
            text: 'Suena a soberbia. Los titulares de la semana son todos para ti, y no por tus goles.',
            effects: { reputation: -6, trust: -6 }
          }
        }
      }
    ]
  },
  {
    id: 'consecuencia-capitan',
    captain: false,
    title: 'El capitán cumple su palabra',
    text: 'Penalti a favor en un partido igualado. El capitán coge el balón, te busca con la mirada y te lo entrega: "Te lo prometí".',
    requiresFlags: { captainRespect: true },
    options: [
      {
        label: 'Tirarlo con todo',
        check: {
          attribute: 'finishing',
          difficulty: 10,
          success: {
            text: 'Gol. El capitán es el primero en abrazarte. El vestuario es tuyo.',
            effects: { goals: 1, morale: 8, attributes: { leadership: 1 } }
          },
          failure: {
            text: 'Al palo. El capitán te levanta del suelo: "Habrá más".',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Devolvérselo: "Tíralo tú, capitán"',
        outcome: {
          text: 'El gesto no pasa desapercibido. Marca y el vestuario te ve ya como un líder.',
          effects: { trust: 4, attributes: { leadership: 1 } }
        }
      }
    ]
  },
  {
    id: 'consecuencia-queja',
    title: 'El míster no olvida',
    text: 'En la primera charla de la temporada, el entrenador lee en voz alta tu frase: "Creo que merezco jugar más". Todo el vestuario te mira.',
    requiresFlags: { publicComplaint: true },
    options: [
      {
        label: 'Sostenerle la mirada: "Lo sigo pensando, y lo voy a demostrar"',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'El míster sonríe a medias: "Eso quería oír". Empiezas la temporada con algo que demostrar.',
            effects: { trust: 6, morale: 5, flags: { publicComplaint: false } }
          },
          failure: {
            text: 'Se lo toma como un desafío. Pasas las primeras semanas en la grada.',
            effects: { trust: -8, morale: -4 }
          }
        }
      },
      {
        label: 'Disculparte delante de todos',
        outcome: {
          text: 'Tragas orgullo. El entrenador da el tema por cerrado.',
          effects: { trust: 5, morale: -3, flags: { publicComplaint: false } }
        }
      }
    ]
  },
  {
    id: 'consecuencia-rival',
    title: 'El rival mueve ficha',
    text: 'Tu enemigo en el vestuario ha contado a la prensa que "el ambiente se rompió" por tu culpa. El club quiere zanjarlo.',
    requiresFlags: { internalRival: 'enemigo' },
    options: [
      {
        label: 'Ofrecerle la mano delante de todos',
        outcome: {
          text: 'Os dais la mano. No seréis amigos, pero el equipo respira.',
          effects: { trust: 5, morale: 2, flags: { internalRival: 'tregua' } }
        }
      },
      {
        label: 'Pedir al club que elija: él o yo',
        check: {
          attribute: 'leadership',
          difficulty: 13,
          success: {
            text: 'El club te elige a ti. Tu rival sale cedido en el mercado de invierno.',
            effects: { trust: 8, reputation: 4, flags: { internalRival: 'derrotado' } }
          },
          failure: {
            text: 'El club no acepta ultimátums. Te quedas sin minutos un mes.',
            effects: { trust: -10, morale: -6 }
          }
        }
      }
    ]
  },
  {
    id: 'consecuencia-padre',
    title: 'Tu padre en la grada',
    text: 'Desde aquella conversación, tu padre no se pierde un partido. Hoy está en la grada, en el mismo asiento de siempre.',
    requiresFlags: { fatherRelation: 'buena' },
    options: [
      {
        label: 'Dedicarle tu próximo gol',
        check: {
          attribute: 'finishing',
          difficulty: 11,
          success: {
            text: 'Marcas y señalas a la grada. La foto de tu padre llorando da la vuelta al mundo.',
            effects: { goals: 1, morale: 10, reputation: 5 }
          },
          failure: {
            text: 'No llega el gol, pero al acabar tu padre te abraza: "Hoy he visto a un nueve".',
            effects: { morale: 5 }
          }
        }
      },
      {
        label: 'Jugar para el equipo, como te enseñó',
        outcome: {
          text: 'Partido sobrio y generoso. Tu padre te escribe por la noche: "Orgulloso".',
          effects: { morale: 6, trust: 3 }
        }
      }
    ]
  },
  {
    id: 'consecuencia-ojeador',
    title: 'La afición se entera',
    text: 'Se filtra que escuchaste a un club extranjero. En el primer partido, parte de la grada te silba al salir al campo.',
    requiresFlags: { foreignInterest: true },
    options: [
      {
        label: 'Callarlos con un gol',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Gol y te besas el escudo. Los silbidos se convierten en aplausos.',
            effects: {
              goals: 1,
              reputation: 4,
              morale: 6,
              fans: 15,
              flags: { foreignInterest: false }
            }
          },
          failure: {
            text: 'Los nervios te pueden. Te cambian al descanso entre más silbidos.',
            effects: { morale: -8, reputation: -4 }
          }
        }
      },
      {
        label: 'Escribir una carta abierta a la afición',
        outcome: {
          text: 'Explicas que escuchar no es irse. Una parte de la grada te perdona.',
          effects: { reputation: 2, morale: 2, fans: 10, flags: { foreignInterest: false } }
        }
      }
    ]
  }
]

/** Todos los eventos que pueden salir durante una temporada. */
export const EVENTS: readonly GameEvent[] = [
  ...BASE_EVENTS,
  ...EXTRA_EVENTS,
  ...STORY_EVENTS,
  ...CONTEXT_EVENTS,
  ...TEAM_EVENTS
]

export function getEvent(id: string): GameEvent {
  const event = EVENTS.find((e) => e.id === id)
  if (!event) throw new Error(`Evento desconocido: ${id}`)
  return event
}

// Textos en inglés: cada evento lee los suyos según el idioma (la mecánica no cambia).
const EVENTS_EN = {
  ...BASE_EVENTS_EN,
  ...CONTEXT_EVENTS_EN,
  ...EXTRA_EVENTS_EN,
  ...STORY_EVENTS_EN,
  ...TEAM_EVENTS_EN
}
for (const event of EVENTS) bindEvent(event, EVENTS_EN[event.id])
