import type { MatchMoment } from './matchTypes'

/**
 * Jugadas extra contra un club en el que jugaste (v0.17). Se suman a las del
 * partido, al principio (o al entrar desde el banquillo):
 * - `traicion`: derbi contra el club de tu misma ciudad al que dejaste por su vecino.
 * - `exclub`: cualquier otro reencuentro con un exequipo.
 * `{rival}` es tu exequipo y `{club}`, tu club actual.
 */
export const EXCLUB_MOMENTS: readonly MatchMoment[] = [
  // -------------------------------------------------------------------------
  // Derbi de la traición
  // -------------------------------------------------------------------------
  {
    id: 'traicion-pitada',
    exClub: 'traicion',
    title: 'Judas',
    text: 'Sales al campo y la grada de {rival} te recibe con una pitada ensordecedora. En una pancarta enorme se lee «JUDAS». Tu nueva afición corea tu nombre para taparla.',
    phase: 'inicio',
    options: [
      {
        label: 'Llevarte la mano a la oreja y provocar a tu antigua grada',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'La pitada se multiplica, pero la grada de {club} enloquece contigo. A los diez minutos ya nadie se acuerda de la pancarta... salvo tú.',
            effects: { fans: 6, morale: 4, reputation: 2 }
          },
          failure: {
            text: 'Se te calienta la sangre y entras al primer balón como un toro. Amarilla en el minuto 3 y el míster te mira muy serio.',
            effects: { morale: -4, trust: -3 }
          }
        }
      },
      {
        label: 'Ignorarlos y pensar solo en el partido',
        outcome: {
          text: 'Cabeza baja, botas bien atadas y a jugar. Los silbidos se quedan en ruido de fondo.',
          effects: { morale: 2, trust: 2 }
        }
      },
      {
        label: 'Aplaudir a la grada que te vio crecer',
        outcome: {
          text: 'Una parte de tu antigua afición te devuelve el aplauso. En la grada de {club}, algunos no lo entienden.',
          effects: { fans: -5, reputation: 3, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'traicion-ley-del-ex',
    exClub: 'traicion',
    title: 'La ley del ex',
    text: 'Balón suelto en el área de {rival} y llegas tú, solo, delante de la grada que te llamaba ídolo. Si entra, todo el estadio estará mirando cómo lo celebras.',
    phase: 'inicio',
    options: [
      {
        label: 'Rematar y celebrarlo con rabia delante de tu antigua grada',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Gol. Corres hacia el fondo de {rival} besándote el escudo nuevo. Te lanzan de todo; la grada de {club} ya te ha hecho suyo.',
            effects: { playerGoals: 1, fans: 8, morale: 6, reputation: 2 }
          },
          failure: {
            text: 'La mandas a las nubes. El fondo de {rival} lo celebra como un gol.',
            effects: { morale: -5 }
          }
        }
      },
      {
        label: 'Rematar y, si entra, no celebrarlo por respeto',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Gol, brazos abajo y la mirada al suelo. Tu antigua grada se queda en silencio. Algunos de la tuya, también.',
            effects: { playerGoals: 1, reputation: 4, fans: -2, morale: 3 }
          },
          failure: {
            text: 'El portero, que fue tu compañero, te la saca con el pie. Te da una palmada al levantarse.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Ceder el gol a un compañero mejor colocado',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Pase de la muerte y tu compañero empuja a la red. Te abraza a ti primero.',
            effects: { playerAssists: 1, trust: 3, morale: 2 }
          },
          failure: {
            text: 'El pase sale blando y el central de {rival} lo despeja. Hay quien dice que no quisiste marcarle a tu ex.',
            effects: { fans: -3, morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'traicion-tunel',
    exClub: 'traicion',
    title: 'En el túnel',
    text: 'En el túnel de vestuarios te cruzas con tus antiguos compañeros de {rival}. Uno de ellos te escupe a los pies: «Aquí no se te olvida lo que hiciste».',
    phase: 'inicio',
    options: [
      {
        label: 'Tenderle la mano delante de todos',
        outcome: {
          text: 'Te deja con la mano tendida, pero las cámaras lo han grabado. Esa noche eres tú el que sale bien parado.',
          effects: { reputation: 3, morale: 2 }
        }
      },
      {
        label: 'Contestarle: «Lo que hice fue elegir ganar»',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Lo dices sin levantar la voz y sigues andando. Tus compañeros de {club} te siguen al campo como un solo hombre.',
            effects: { fans: 4, morale: 4, teammates: { todos: 3 } }
          },
          failure: {
            text: 'Os tienen que separar los delegados. El árbitro lo apunta y el míster se lleva las manos a la cabeza.',
            effects: { trust: -4, morale: -3 }
          }
        }
      },
      {
        label: 'Callar y guardarlo para el partido',
        outcome: {
          text: 'No dices nada. Sales al campo con el ceño fruncido y las piernas cargadas de rabia.',
          effects: { morale: 3, trust: 1 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Reencuentro con un exequipo
  // -------------------------------------------------------------------------
  {
    id: 'exclub-reencuentro',
    exClub: 'exclub',
    title: 'Vuelves a casa',
    text: 'Es la primera vez que te enfrentas a {rival} desde que te fuiste. El speaker anuncia tu nombre y parte de la grada se pone en pie para aplaudirte.',
    phase: 'inicio',
    options: [
      {
        label: 'Saludar a tu antigua grada con la mano en el pecho',
        outcome: {
          text: 'El aplauso crece. Es un momento bonito, aunque algún aficionado de {club} lo ve con recelo.',
          effects: { reputation: 3, morale: 3, fans: -2 }
        }
      },
      {
        label: 'Saludar con un gesto y centrarte en el partido',
        outcome: {
          text: 'Un gesto discreto y a lo tuyo. Hoy juegas para {club}.',
          effects: { trust: 2, morale: 1 }
        }
      },
      {
        label: 'Dedicarle el partido a la afición de {club}',
        outcome: {
          text: 'Señalas el escudo y luego a tu grada. Tu antigua afición pasa del aplauso al silbido.',
          effects: { fans: 4, reputation: -1, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'exclub-ley-del-ex',
    exClub: 'exclub',
    title: 'La ley del ex',
    text: 'Te llega un balón franco en la frontal del área de {rival}. La ley del ex nunca falla... ¿o sí?',
    phase: 'inicio',
    options: [
      {
        label: 'Disparar y celebrarlo con los tuyos',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Golazo a la escuadra. Lo celebras con tus compañeros de {club}, sin mirar a tu antigua grada.',
            effects: { playerGoals: 1, fans: 4, morale: 5 }
          },
          failure: {
            text: 'Se te va alto. Tu antigua grada se ríe con cariño: «Eso no lo hacías aquí».',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Disparar y, si entra, pedir perdón a tu antigua grada',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Gol y las manos en alto pidiendo perdón. Tu antigua afición te despide con una ovación.',
            effects: { playerGoals: 1, reputation: 4, morale: 3 }
          },
          failure: {
            text: 'El disparo se marcha fuera. Respiras hondo: queda partido.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Buscar al compañero que llega desde atrás',
        check: {
          attribute: 'shortPassing',
          difficulty: 10,
          success: {
            text: 'Pase atrás perfecto y gol de tu compañero. Te señala a ti en la celebración.',
            effects: { playerAssists: 1, trust: 3 }
          },
          failure: {
            text: 'El pase lo corta un antiguo compañero tuyo, que sonríe: te conoce de memoria.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'exclub-te-conozco',
    exClub: 'exclub',
    title: 'Te conozco',
    text: 'El central de {rival}, que compartió vestuario contigo, te marca al hombre desde el primer minuto y te susurra al oído: «Me sé todos tus trucos».',
    phase: 'inicio',
    options: [
      {
        label: 'Demostrarle que tienes trucos nuevos',
        check: {
          attribute: 'dribbling',
          difficulty: 12,
          success: {
            text: 'Un recorte que no te había visto nunca y te vas solo. Tu centro acaba en gol de {club}.',
            effects: { playerAssists: 1, morale: 5 }
          },
          failure: {
            text: 'Te lee el amago como si lo hubiera ensayado contigo. Porque lo ensayó contigo.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Bromear con él y jugar sin presión',
        outcome: {
          text: 'Os reís los dos. Te relajas, te mueves mejor y el míster lo nota.',
          effects: { morale: 3, trust: 1 }
        }
      },
      {
        label: 'Buscar el cuerpo a cuerpo desde el principio',
        check: {
          attribute: 'strength',
          difficulty: 11,
          success: {
            text: 'Le ganas el primer duelo y el segundo. Al tercero ya no te sigue.',
            effects: { morale: 4, trust: 2 }
          },
          failure: {
            text: 'Te aguanta la carga sin pestañear. «Esto también me lo sé», te dice.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  }
]
