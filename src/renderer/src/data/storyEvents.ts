import type { FlagCondition, GameEvent } from './events'

/**
 * Historia de la pareja: se desarrolla a lo largo de toda la carrera.
 *
 * Flags que usa (ver `FlagCondition` en `events.ts`):
 * - `partner`: 'pareja' | 'convivencia' | 'prometidos' | 'casados' | 'ruptura' (sin flag = soltero).
 * - `partnerName`, `partnerSince`, `partnerStageSince`: los rellena el código al cambiar `partner`.
 * - `children`: número de hijos (se suma con `addFlags`).
 * - `cheated`: `true` tras una infidelidad que ella todavía no conoce.
 * - `noMoreChildren`: `true` si la pareja decide no tener más hijos.
 *
 * En los textos, `{pareja}` es el nombre de ella y `{hijos}` el número de hijos.
 * Orden: primero las consecuencias (infidelidad descubierta), luego la progresión de la
 * relación y al final los eventos repetibles de ambiente.
 */

/** Cualquier etapa con pareja (no soltero ni ruptura). */
const ACTIVE: FlagCondition = {
  flag: 'partner',
  oneOf: ['pareja', 'convivencia', 'prometidos', 'casados']
}

/** Al menos una temporada en la etapa actual de la relación. */
const ONE_SEASON_IN_STAGE: FlagCondition = { flag: 'partnerStageSince', seasonsSince: 1 }

export const STORY_EVENTS: readonly GameEvent[] = [
  // -------------------------------------------------------------------------
  // Consecuencia: ella se entera de la infidelidad.
  // -------------------------------------------------------------------------
  {
    id: 'pareja-descubre',
    title: 'Lo sabe',
    text: '{pareja} te espera sentada en el sofá, con el móvil en la mano. Alguien le ha mandado las fotos de aquella noche en el hotel, y mañana saldrán en una revista del corazón. No llora. Eso es lo peor.',
    story: { id: 'pareja', repeatable: true, priority: 10 },
    conditions: [ACTIVE, { flag: 'cheated', oneOf: [true] }],
    options: [
      {
        label: 'Pedirle perdón y luchar por ella',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Le hablas durante horas, sin excusas. Al amanecer, agotada, te dice que lo va a intentar. "Una vez. Ni una más".',
            effects: { morale: -4, reputation: -3, flags: { cheated: false } }
          },
          failure: {
            text: 'Cada excusa empeora las cosas. {pareja} hace la maleta esa misma noche y la prensa del corazón se da un festín.',
            effects: {
              morale: -12,
              reputation: -6,
              flags: { partner: 'ruptura', cheated: false }
            }
          }
        }
      },
      {
        label: 'Contárselo todo, sin guardarte nada, y aceptar lo que decida',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Tu sinceridad la desarma. Os va a costar meses volver a confiar, pero decidís seguir. Aprendes algo de ti que no te gusta.',
            effects: {
              morale: -2,
              reputation: -2,
              attributes: { composure: 1 },
              flags: { cheated: false }
            }
          },
          failure: {
            text: 'Te escucha hasta el final, se levanta y te devuelve las llaves. "Gracias por la sinceridad. Llega tarde".',
            effects: {
              morale: -10,
              reputation: -4,
              flags: { partner: 'ruptura', cheated: false }
            }
          }
        }
      },
      {
        label: 'Ponérselo fácil: dejarlo tú',
        outcome: {
          text: 'No te ves capaz de mirarla a la cara cada día. Recoges tus cosas y te vas a un hotel. Las revistas te pintan como el malo de la película, y quizá lo eres.',
          effects: {
            morale: -8,
            reputation: -5,
            flags: { partner: 'ruptura', cheated: false }
          }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Conocer a alguien.
  // -------------------------------------------------------------------------
  {
    id: 'pareja-conocer',
    title: 'Alguien especial',
    text: 'En el cumpleaños de un compañero coincides con una chica que no tiene ni idea de quién eres. Te habla de libros, de viajes, de todo menos de fútbol. Hacía años que no te reías tanto.',
    story: { id: 'pareja', repeatable: true },
    minAge: 18,
    conditions: [{ flag: 'partner', oneOf: [null] }],
    options: [
      {
        label: 'Pedirle una cita antes de que acabe la noche',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Te tiembla la voz, pero ella sonríe: "Pensaba que no me lo ibas a pedir nunca". Esa semana entrenas con una sonrisa tonta que nadie en el vestuario deja pasar.',
            effects: { morale: 8, flags: { partner: 'pareja' } }
          },
          failure: {
            text: 'Te lías, le cuentas tu último gol con todo lujo de detalles y ella se va a por algo de beber. No vuelve.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Pedirle el número y dejar que las cosas fluyan',
        outcome: {
          text: 'Mensajes, un café, un paseo largo después de entrenar. Poco a poco, sin prisa. Un mes después ya no te imaginas la semana sin ella.',
          effects: { morale: 6, flags: { partner: 'pareja' } }
        }
      },
      {
        label: 'Despedirte con educación: ahora mismo solo existe el fútbol',
        outcome: {
          text: 'Te vas pronto a casa. Al día siguiente eres el primero en llegar a la ciudad deportiva, aunque una parte de ti se pregunta qué habría pasado.',
          effects: { trust: 3, morale: -2 }
        }
      }
    ]
  },

  // Otras formas de conocer a alguien: mismo título, otra historia. Sale la que
  // menos veces ha salido (y, entre ellas, una al azar).
  {
    id: 'pareja-conocer-infancia',
    title: 'Alguien especial',
    text: 'Vuelves a casa en vacaciones y te cruzas con tu amiga de la infancia, la que jugaba contigo al fútbol en la calle hasta que se hacía de noche y te ganaba a los penaltis. Os sentáis en el banco de siempre y, sin daros cuenta, se os hace de madrugada.',
    story: { id: 'pareja', repeatable: true },
    minAge: 18,
    conditions: [{ flag: 'partner', oneOf: [null] }],
    options: [
      {
        label: 'Confesarle que siempre te ha gustado',
        check: {
          attribute: 'composure',
          difficulty: 9,
          success: {
            text: 'Se queda callada un segundo eterno y luego se ríe: "Llevo desde los doce años esperando que lo dijeras". Vuelves a la ciudad deportiva con la cabeza en las nubes.',
            effects: { morale: 10, flags: { partner: 'pareja' } }
          },
          failure: {
            text: 'Te mira con cariño y te da un abrazo: "Eres como mi hermano". Volvéis a casa en silencio. La amistad sigue ahí, pero escuece.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Proponerle veros cada vez que vuelvas a casa',
        outcome: {
          text: 'Un café cada vez que vuelves, mensajes a diario entre medias. Una noche te das cuenta de que ya no os despedís como amigos.',
          effects: { morale: 7, flags: { partner: 'pareja' } }
        }
      },
      {
        label: 'Dejarlo estar: no quieres estropear una amistad de toda la vida',
        outcome: {
          text: 'Os despedís con un abrazo largo. Ella vuelve a su vida y tú a la tuya, aunque esa noche te cuesta dormir.',
          effects: { morale: -2, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'pareja-conocer-hospital',
    title: 'Alguien especial',
    text: 'El club organiza una visita al hospital infantil. La voluntaria que os acompaña por las habitaciones no se impresiona con los autógrafos, pero se le ilumina la cara cuando te sientas en el suelo a jugar con los niños.',
    story: { id: 'pareja', repeatable: true },
    minAge: 18,
    conditions: [{ flag: 'partner', oneOf: [null] }],
    options: [
      {
        label: 'Esperarla a la salida e invitarla a cenar',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: '"Solo si es un sitio donde nadie te pida fotos", te dice. Encontráis uno. Es la primera de muchas cenas.',
            effects: { morale: 8, flags: { partner: 'pareja' } }
          },
          failure: {
            text: 'Te dice que no sale con futbolistas, con una sonrisa que no admite réplica. Al menos los niños te han pedido que vuelvas.',
            effects: { morale: -3, reputation: 1 }
          }
        }
      },
      {
        label: 'Apuntarte como voluntario y volver cada semana',
        outcome: {
          text: 'Vuelves los martes, sin cámaras. Entre cuentos y partidas de cartas, una tarde ella te espera a la salida con dos cafés.',
          effects: { morale: 7, reputation: 2, flags: { partner: 'pareja' } }
        }
      },
      {
        label: 'Darle las gracias y volver a lo tuyo',
        outcome: {
          text: 'Firmas los últimos balones y te vas al entrenamiento. Su sonrisa se te queda en la cabeza más de lo que te gustaría admitir.',
          effects: { trust: 2, morale: -1 }
        }
      }
    ]
  },
  {
    id: 'pareja-conocer-cafeteria',
    title: 'Alguien especial',
    text: 'Cada mañana paras en la misma cafetería antes de entrenar. La chica de la barra ya te pone el café sin preguntar y hoy, por primera vez, te ha dejado una nota en el vaso: "¿Y si un día te lo tomas sentado?".',
    story: { id: 'pareja', repeatable: true },
    minAge: 18,
    conditions: [{ flag: 'partner', oneOf: [null] }],
    options: [
      {
        label: 'Sentarte en la barra y darle conversación',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Llegas tarde al entrenamiento por primera vez en tu vida y te da igual. Esa noche cenáis juntos.',
            effects: { morale: 8, trust: -1, flags: { partner: 'pareja' } }
          },
          failure: {
            text: 'Entra el grupo de las ocho, se llena la barra y no os da tiempo ni a presentaros. Al día siguiente la nota ya no está.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Contestarle con otra nota y tu número',
        outcome: {
          text: 'Notas que van y vienen durante semanas, hasta que un domingo os veis fuera de la cafetería. Ya no hay vuelta atrás.',
          effects: { morale: 6, flags: { partner: 'pareja' } }
        }
      },
      {
        label: 'Cambiar de cafetería: no estás para distracciones',
        outcome: {
          text: 'El café nuevo está peor y la camarera ni te mira. Llegas puntual a todos los entrenamientos.',
          effects: { trust: 3, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'pareja-conocer-vuelo',
    title: 'Alguien especial',
    text: 'Una tormenta deja el vuelo de vuelta de un partido fuera tres horas en tierra. La chica del asiento de al lado te presta un cargador, luego medio bocadillo y, al final, te cuenta su vida entera. No sabe quién eres hasta que los de la otra fila te piden una foto.',
    story: { id: 'pareja', repeatable: true },
    minAge: 18,
    conditions: [{ flag: 'partner', oneOf: [null] }],
    options: [
      {
        label: 'Pedirle una cita antes de aterrizar',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: '"Me debes medio bocadillo", te contesta. La semana siguiente se lo devuelves en el mejor restaurante de la ciudad.',
            effects: { morale: 8, flags: { partner: 'pareja' } }
          },
          failure: {
            text: 'Aterrizáis, se despide con prisa y se pierde entre la gente del aeropuerto. Ni siquiera sabes su apellido.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Invitarla a ver tu próximo partido en casa',
        outcome: {
          text: 'Viene al partido, no entiende el fuera de juego y grita tu gol más que nadie. Al acabar te espera en la puerta del estadio.',
          effects: { morale: 6, flags: { partner: 'pareja' } }
        }
      },
      {
        label: 'Ponerte los cascos y repasar vídeos del rival',
        outcome: {
          text: 'Aprovechas las horas muertas para estudiar al próximo rival. El míster te ve concentrado; ella se duerme con la cabeza en la ventanilla.',
          effects: { trust: 3, morale: -2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Primeros tiempos de novios.
  // -------------------------------------------------------------------------
  {
    id: 'pareja-familia',
    title: 'Comida con sus padres',
    text: '{pareja} te lleva a comer el domingo a casa de sus padres. Su padre es socio de vuestro máximo rival desde hace cuarenta años y te abre la puerta con la bufanda del enemigo al cuello.',
    story: { id: 'pareja' },
    conditions: [{ flag: 'partner', oneOf: ['pareja'] }],
    options: [
      {
        label: 'Aguantar las pullas con humor',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Le sigues el juego, te ríes de ti mismo y acabáis brindando. Al despedirse te da una palmada: "Para ser de los otros, no estás mal". {pareja} no se lo puede creer.',
            effects: { morale: 7, attributes: { composure: 1 } }
          },
          failure: {
            text: 'Al tercer chiste sobre tu último fallo, saltas. La sobremesa se congela y {pareja} no te dirige la palabra en todo el viaje de vuelta.',
            effects: { morale: -6 }
          }
        }
      },
      {
        label: 'Regalarle dos entradas de palco para el derbi',
        outcome: {
          text: 'Viene al derbi... con su bufanda. Pero al acabar te pide una foto "para el nieto que algún día tendréis". {pareja} se ríe y te coge de la mano.',
          effects: { money: -2000, morale: 6 }
        }
      },
      {
        label: 'Excusarte: tienes concentración',
        outcome: {
          text: '{pareja} va sola. No te reprocha nada, pero durante semanas notas que algo se ha enfriado entre vosotros.',
          effects: { morale: -3, trust: 1 }
        }
      }
    ]
  },
  {
    id: 'pareja-celos',
    title: 'Celos en las redes',
    text: 'Una influencer famosa llena tus fotos de corazones y emojis de fuego. Medio país especula con un romance. {pareja} te enseña el móvil sin decir nada. No hace falta.',
    story: { id: 'pareja' },
    conditions: [{ flag: 'partner', oneOf: ['pareja', 'convivencia'] }],
    options: [
      {
        label: 'Subir una foto juntos y zanjar el tema',
        outcome: {
          text: 'La foto de los dos en la playa se llena de "me gusta". Los rumores mueren en un día y {pareja} te da un beso largo al verla.',
          effects: { morale: 6, reputation: 2 }
        }
      },
      {
        label: 'Hablarlo con calma: "No tienes de qué preocuparte"',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Le enseñas que no contestas a nadie y le dejas el móvil sin que te lo pida. Esa noche os prometéis contároslo todo, siempre.',
            effects: { morale: 6 }
          },
          failure: {
            text: 'Te pones a la defensiva y la conversación acaba a gritos. Duermes en el sofá y llegas al entrenamiento con ojeras.',
            effects: { morale: -6, trust: -2 }
          }
        }
      },
      {
        label: 'Restarle importancia: "Son cosas de las redes"',
        outcome: {
          text: 'Para ti no es nada. Para {pareja}, sí. Algo se queda flotando entre los dos, y tu nombre en todos los programas de cotilleo.',
          effects: { morale: -4, reputation: 2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Vivir juntos, compromiso y boda.
  // -------------------------------------------------------------------------
  {
    id: 'pareja-convivir',
    title: 'Una sola llave',
    text: 'Lleváis tiempo juntos y {pareja} pasa más noches en tu casa que en la suya. Una mañana, mientras desayunáis, lo suelta: "¿Y si buscamos algo nuestro?"',
    story: { id: 'pareja', repeatable: true },
    conditions: [{ flag: 'partner', oneOf: ['pareja'] }, ONE_SEASON_IN_STAGE],
    options: [
      {
        label: 'Buscar un piso juntos',
        outcome: {
          text: 'Visitáis pisos durante semanas hasta dar con uno con terraza y luz de tarde. La primera noche cenáis pizza sentados en el suelo, entre cajas.',
          effects: { money: -12000, morale: 10, flags: { partner: 'convivencia' } }
        }
      },
      {
        label: 'Que se venga a tu casa, que ya está montada',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Le vacías medio armario y le dejas cambiar todos los cuadros. "Ahora sí parece una casa", dice {pareja}. Tienes que darle la razón.',
            effects: { morale: 8, flags: { partner: 'convivencia' } }
          },
          failure: {
            text: '"¿Tu casa? ¿Y yo qué soy, una invitada?" La discusión se te va de las manos y acaba con {pareja} cerrando la puerta de un portazo. Esta vez no vuelve.',
            effects: { morale: -10, flags: { partner: 'ruptura' } }
          }
        }
      },
      {
        label: 'Pedirle tiempo: ahora necesitas centrarte en el fútbol',
        outcome: {
          text: 'Asiente, pero se le apaga la mirada. "Vale. Pero no pienso esperar siempre".',
          effects: { morale: -4, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'pareja-propuesta',
    title: 'El anillo',
    text: 'Llevas semanas con un anillo escondido en el fondo de la bolsa de deporte. Cada vez que {pareja} se acerca a ella se te para el corazón. Ha llegado el momento... ¿o no?',
    story: { id: 'pareja', repeatable: true },
    conditions: [{ flag: 'partner', oneOf: ['convivencia'] }, ONE_SEASON_IN_STAGE],
    options: [
      {
        label: 'Pedírselo a lo grande: en el estadio vacío, con focos y violines',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'El marcador se ilumina con su nombre. {pareja} se tapa la cara, llora y dice que sí antes de que termines la frase. El vídeo da la vuelta al mundo.',
            effects: {
              money: -15000,
              morale: 12,
              reputation: 5,
              flags: { partner: 'prometidos' }
            }
          },
          failure: {
            text: 'Se te olvida el discurso, los violines desafinan y {pareja}, que odia ser el centro de atención, se queda helada. "Pregúntamelo cuando estemos solos", te susurra.',
            effects: { money: -15000, morale: -6, reputation: -2 }
          }
        }
      },
      {
        label: 'Pedírselo en casa, a solas, con la cena de vuestra primera cita',
        outcome: {
          text: 'Sin cámaras ni testigos. Solo vosotros, dos platos de pasta y un "sí" que se te queda grabado para siempre.',
          effects: { morale: 10, flags: { partner: 'prometidos' } }
        }
      },
      {
        label: 'Esperar un poco más',
        outcome: {
          text: 'Devuelves el anillo al fondo de la bolsa. Ya llegará el momento. {pareja} no sospecha nada... o eso crees.',
          effects: { morale: -2 }
        }
      }
    ]
  },
  {
    id: 'pareja-boda',
    title: 'La boda',
    text: 'Toca decidir cómo será la boda. La madre de {pareja} ya tiene una lista de cuatrocientos invitados, {pareja} sueña con algo pequeño junto al mar y tu agente, con vender la exclusiva a una revista.',
    story: { id: 'pareja', repeatable: true },
    conditions: [{ flag: 'partner', oneOf: ['prometidos'] }, ONE_SEASON_IN_STAGE],
    options: [
      {
        label: 'Boda por todo lo alto, con exclusiva incluida',
        outcome: {
          text: 'Una finca, cuatrocientos invitados, medio vestuario bailando hasta el amanecer y la portada de la revista más leída del país. {pareja} está radiante.',
          effects: {
            money: -120000,
            morale: 10,
            reputation: 6,
            flags: { partner: 'casados' }
          }
        }
      },
      {
        label: 'Una boda íntima, solo con los vuestros',
        outcome: {
          text: 'Cuarenta personas, una cala, los pies descalzos en la arena. Tu abuela llora durante toda la ceremonia. Es exactamente lo que {pareja} y tú queríais.',
          effects: { money: -25000, morale: 12, flags: { partner: 'casados' } }
        }
      },
      {
        label: 'Aplazarla: con este calendario no hay manera',
        outcome: {
          text: '{pareja} lo entiende, aunque su madre no tanto. La fecha queda en el aire hasta el verano que viene.',
          effects: { morale: -3, trust: 2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Vida en común: su carrera, los hijos y las crisis.
  // -------------------------------------------------------------------------
  {
    id: 'pareja-carrera',
    title: 'Su carrera también cuenta',
    text: 'A {pareja} le ofrecen dirigir el estudio de arquitectura donde trabaja: el proyecto de su vida. Esa misma semana tu agente te llama porque un club extranjero pregunta por ti. "Yo también tengo una carrera", te recuerda ella.',
    story: { id: 'pareja' },
    minAge: 21,
    conditions: [{ flag: 'partner', oneOf: ['convivencia', 'casados'] }, ONE_SEASON_IN_STAGE],
    options: [
      {
        label: 'Decirle a tu agente que no te mueves de aquí',
        outcome: {
          text: 'Cuelgas al agente sin escuchar la cifra. {pareja} acepta el puesto y esa noche brindáis por los dos.',
          effects: { morale: 8, trust: 3 }
        }
      },
      {
        label: 'Convencerla de que os vayáis juntos si llega la oferta',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Le hablas de la ciudad, de un estudio de allí que ella admira, de la aventura. Al final sonríe: "Si vamos, vamos los dos. Y el barrio lo elijo yo".',
            effects: { morale: 6, reputation: 2 }
          },
          failure: {
            text: '"¿Y lo mío qué?" La discusión dura días. No rompéis, pero algo se agrieta entre vosotros y el vestuario te nota ausente.',
            effects: { morale: -8, trust: -2 }
          }
        }
      },
      {
        label: 'Dejar que ella decida primero',
        outcome: {
          text: 'Le dices que esta vez su carrera va delante. {pareja} acepta el puesto y tú aprendes a esperar tu momento sin ansiedad.',
          effects: { morale: 5, attributes: { composure: 1 } }
        }
      }
    ]
  },
  {
    id: 'pareja-primer-hijo',
    title: 'Ser padre',
    text: 'Una noche, en el sofá, {pareja} apaga la tele y te mira muy seria: "Creo que estoy preparada. ¿Y tú?" Los veteranos del vestuario dicen que un hijo te cambia la vida... y el sueño.',
    story: { id: 'pareja', repeatable: true },
    conditions: [
      { flag: 'partner', oneOf: ['casados'] },
      { flag: 'children', max: 0 },
      ONE_SEASON_IN_STAGE
    ],
    options: [
      {
        label: 'Sí. Vamos a por ello',
        outcome: {
          text: 'Meses después te tiemblan las manos en el paritorio más que en cualquier final. Tu siguiente gol lo celebras meciendo una cuna imaginaria. Eres padre.',
          effects: { morale: 12, attributes: { leadership: 1 }, addFlags: { children: 1 } }
        }
      },
      {
        label: 'Esperar a que termine la temporada',
        outcome: {
          text: '"Vale, pero no lo dejes pasar", dice {pareja}. Lo volveréis a hablar en verano.',
          effects: { morale: -2 }
        }
      }
    ]
  },
  {
    id: 'pareja-crisis',
    title: 'La rutina pesa',
    text: 'Últimamente {pareja} y tú solo habláis de horarios, viajes y facturas. Ella cena sola tres noches por semana y tú vives con la cabeza en el próximo partido. Una noche te lo dice claro: "Así no puedo seguir".',
    story: { id: 'pareja' },
    conditions: [
      { flag: 'partner', oneOf: ['casados'] },
      { flag: 'partnerStageSince', seasonsSince: 2 }
    ],
    options: [
      {
        label: 'Ir a terapia de pareja',
        outcome: {
          text: 'Cuesta abrirse delante de un desconocido, pero semana a semana volvéis a reíros juntos. Aprendes a escuchar, también en el vestuario.',
          effects: { money: -18000, morale: 6, attributes: { composure: 1 } }
        }
      },
      {
        label: 'Sorprenderla con un viaje para los dos en el parón',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Una semana en una isla, sin móviles. La última noche, {pareja} te dice que hacía años que no te sentía tan cerca.',
            effects: { money: -12000, morale: 10 }
          },
          failure: {
            text: 'Un viaje no arregla lo que no habláis. Volvéis antes de tiempo y en silencio. Un mes después, {pareja} te pide el divorcio.',
            effects: { money: -12000, morale: -12, flags: { partner: 'ruptura' } }
          }
        }
      },
      {
        label: 'No darle importancia: ya se pasará',
        check: {
          attribute: 'composure',
          difficulty: 13,
          success: {
            text: 'El verano llega a tiempo. Unas semanas de descanso juntos y la tormenta pasa sola... esta vez.',
            effects: { morale: 2 }
          },
          failure: {
            text: 'No se pasa. Una noche encuentras sus maletas en la entrada. {pareja} se marcha, y lo siguiente que recibes son los papeles del divorcio.',
            effects: { morale: -12, reputation: -2, flags: { partner: 'ruptura' } }
          }
        }
      }
    ]
  },
  {
    id: 'pareja-hijo-estadio',
    title: 'Su primer partido en el estadio',
    text: 'Hoy {pareja} trae por primera vez a tu hijo al estadio. Lleva tu camiseta, que le queda enorme, y unos cascos para el ruido. Antes de salir al campo lo buscas con la mirada en la grada.',
    story: { id: 'pareja' },
    conditions: [
      { flag: 'partner', oneOf: ['casados'] },
      { flag: 'children', min: 1 }
    ],
    options: [
      {
        label: 'Salir al campo con él en brazos',
        outcome: {
          text: 'Lo llevas hasta el centro del campo. Cuando el estadio entero aplaude, se agarra a tu cuello con todas sus fuerzas. Esa foto la tendrás siempre en la mesilla.',
          effects: { morale: 10, reputation: 3 }
        }
      },
      {
        label: 'Prometerle un gol',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Marcas, corres hacia su fila y haces un corazón con las manos. {pareja} lo levanta en brazos para que lo vea todo el estadio.',
            effects: { goals: 1, morale: 12 }
          },
          failure: {
            text: 'No llega el gol. Pero en el coche, de vuelta, se queda dormido abrazado a tu camiseta, y se te olvida el resultado.',
            effects: { morale: 4 }
          }
        }
      }
    ]
  },
  {
    id: 'pareja-otro-hijo',
    title: 'La familia crece',
    text: 'Hijos en casa: {hijos}. Horas de sueño: muy pocas. Aun así, mientras recogéis juguetes del pasillo, {pareja} te mira con una sonrisa traviesa: "¿Y si vamos a por otro?"',
    story: { id: 'pareja', repeatable: true },
    conditions: [
      { flag: 'partner', oneOf: ['casados'] },
      { flag: 'children', min: 1, max: 3 },
      { flag: 'noMoreChildren', oneOf: [null, false] }
    ],
    options: [
      {
        label: 'Que venga uno más',
        outcome: {
          text: 'La familia crece. Un nuevo llanto a las cuatro de la mañana y una razón más para dejarte la piel en cada partido.',
          effects: { morale: 10, addFlags: { children: 1 } }
        }
      },
      {
        label: 'Más adelante',
        outcome: {
          text: '"Más adelante", repetís los dos, y os reís porque sabéis que lo volveréis a hablar.',
          effects: { morale: 1 }
        }
      },
      {
        label: 'Decidir que la familia está completa',
        outcome: {
          text: 'Lo habláis con calma y estáis de acuerdo: así estáis perfectos. Esa noche {pareja} y tú dormís de un tirón por primera vez en años.',
          effects: { morale: 4, flags: { noMoreChildren: true } }
        }
      }
    ]
  },
  {
    id: 'pareja-cumpleanos',
    title: 'Un cumpleaños sin ti',
    text: 'El partido de copa cae justo el día del cumpleaños de tu hijo. La tarta, los globos, toda la familia en casa... y una silla vacía si viajas con el equipo.',
    story: { id: 'pareja', repeatable: true },
    conditions: [{ flag: 'children', min: 1 }],
    options: [
      {
        label: 'Pedirle al míster que te deje quedarte',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'El entrenador, padre de tres, te da el día libre sin pestañear: "La familia, primero". Soplas las velas con él y te comes medio pastel.',
            effects: { morale: 10, trust: -1 }
          },
          failure: {
            text: '"Aquí eso no se pide", te corta. Viajas con el equipo de mal humor y te pasas el partido mirando el reloj.',
            effects: { morale: -6, trust: -3 }
          }
        }
      },
      {
        label: 'Jugar y dedicarle un gol',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Marcas y haces el gesto de soplar velas mirando a la cámara. En casa, tu hijo salta en el sofá gritando tu nombre.',
            effects: { goals: 1, morale: 8, reputation: 2 }
          },
          failure: {
            text: 'No marcas, y cuando llegas a casa ya está dormido con el gorro de fiesta puesto. Te quedas un rato mirándolo desde la puerta.',
            effects: { morale: -6 }
          }
        }
      },
      {
        label: 'Adelantar la fiesta un día y tirar la casa por la ventana',
        outcome: {
          text: 'Castillo hinchable, payaso y medio colegio en el jardín. No es el día exacto, pero nadie lo olvidará.',
          effects: { money: -5000, morale: 5 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Eventos repetibles: tentación, aniversario y ruptura.
  // -------------------------------------------------------------------------
  {
    id: 'pareja-tentacion',
    title: 'Una noche lejos de casa',
    text: 'Concentración lejos de casa. Después de la victoria, en el bar del hotel, una mujer se sienta a tu lado y te dice que lleva toda la noche esperando a que bajes. En el móvil, un mensaje de {pareja}: "Te echo de menos. Vuelve pronto".',
    story: { id: 'pareja', repeatable: true },
    minAge: 19,
    conditions: [ACTIVE, ONE_SEASON_IN_STAGE, { flag: 'cheated', oneOf: [null, false] }],
    options: [
      {
        label: 'Subir con ella a la habitación',
        outcome: {
          text: 'Te dejas llevar. A la mañana siguiente te sientes invencible y miserable a la vez, y borras todos los mensajes antes de bajar a desayunar.',
          effects: { morale: 5, flags: { cheated: true } }
        }
      },
      {
        label: 'Tomarte una copa con ella y retirarte a tiempo',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Una charla, unas risas y un "buenas noches" a tiempo. Has jugado con fuego sin quemarte.',
            effects: { morale: 3 }
          },
          failure: {
            text: 'Un paparazzi os fotografía juntos en la barra. No ha pasado nada, pero la foto dice otra cosa. {pareja} te cree, aunque le duele.',
            effects: { morale: -5, reputation: -3 }
          }
        }
      },
      {
        label: 'Levantarte y llamarla',
        outcome: {
          text: 'Pagas tu refresco y subes a la habitación. Habláis de tonterías hasta las tantas y te duermes con el móvil en la mano y la conciencia tranquila.',
          effects: { morale: 4 }
        }
      }
    ]
  },
  {
    id: 'pareja-aniversario',
    title: 'Aniversario de boda',
    text: 'Otro aniversario con {pareja}. Este año cae en plena semana de partido, con concentración la noche anterior.',
    story: { id: 'pareja', repeatable: true },
    conditions: [{ flag: 'partner', oneOf: ['casados'] }, ONE_SEASON_IN_STAGE],
    options: [
      {
        label: 'Una cena sorpresa en vuestro restaurante de siempre',
        outcome: {
          text: 'El mismo rincón, el mismo vino, las mismas bromas. {pareja} levanta la copa: "Por muchos más".',
          effects: { money: -3000, morale: 6 }
        }
      },
      {
        label: 'Escaparte de la concentración para verla una hora',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Sales por la puerta de servicio del hotel, una hora con {pareja} en un banco del paseo y vuelta antes del toque de queda. Nadie se entera.',
            effects: { morale: 8 }
          },
          failure: {
            text: 'El delegado te pilla volviendo por la puerta de servicio. Multa, bronca del míster y titulares. Al menos {pareja} se ríe.',
            effects: { morale: 2, trust: -6, reputation: -2 }
          }
        }
      },
      {
        label: 'Un mensaje y la promesa de compensarla en verano',
        outcome: {
          text: '{pareja} te manda un corazón y una foto del vestido que piensa estrenar en verano. Te toca cumplir.',
          effects: { morale: -1, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'pareja-superar',
    title: 'Pasar página',
    text: 'Desde que {pareja} y tú lo dejasteis, la casa está demasiado silenciosa. Tus amigos insisten en sacarte de ella; tu preparador, en que vuelques todo en el campo.',
    story: { id: 'pareja', repeatable: true },
    conditions: [{ flag: 'partner', oneOf: ['ruptura'] }, ONE_SEASON_IN_STAGE],
    options: [
      {
        label: 'Refugiarte en el fútbol: entrenar mañana y tarde',
        outcome: {
          text: 'Llegas el primero y te vas el último. El dolor se convierte en kilómetros y en remates, y el cuerpo técnico toma nota.',
          effects: { trust: 5, morale: -2, attributes: { stamina: 1 } }
        }
      },
      {
        label: 'Salir de fiesta todas las noches',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Lo pasas en grande y vuelves a sonreír. Y lo más importante: nadie te hace una foto que no debiera.',
            effects: { morale: 8 }
          },
          failure: {
            text: 'Te pillan saliendo de una discoteca a las seis de la mañana, dos días antes de un partido. El míster no está para bromas.',
            effects: { morale: 2, trust: -8, reputation: -4 }
          }
        }
      },
      {
        label: 'Dejar que tus amigos te presenten a alguien',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Una cena "casual" que de casual no tiene nada. Al principio te resistes, pero ella se ríe de tus chistes malos y, de repente, la casa ya no parece tan vacía.',
            effects: {
              morale: 8,
              flags: { partner: 'pareja', cheated: false, noMoreChildren: false }
            }
          },
          failure: {
            text: 'Te pasas la cena hablando de tu ex. Ella es encantadora, pero tú todavía no estás preparado.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  }
]
