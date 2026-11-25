import type { MatchMoment } from './matchTypes'

/**
 * Jugadas de la v0.12 para los partidos con más decisiones (hasta 5): tapan
 * los huecos del minuto 15 al 30 y del 70 al 82, que antes no tenían jugadas.
 */
export const EXTRA_MATCH_MOMENTS: readonly MatchMoment[] = [
  {
    id: 'inicio-primer-remate',
    title: 'Primer centro al área',
    text: 'Minuto 17. Tu lateral se va por la banda y mira al área. El central de {rival} te tiene agarrado de la camiseta.',
    phase: 'inicio',
    options: [
      {
        label: 'Soltarte y atacar el balón de cabeza',
        check: {
          attribute: 'heading',
          difficulty: 12,
          success: {
            text: 'Te zafas con un tirón, saltas más que nadie y la pegas abajo, junto al palo.',
            effects: { playerGoals: 1, morale: 7, reputation: 2 }
          },
          failure: {
            text: 'Llegas tarde por un palmo. El balón te roza la coronilla y se pierde por la línea de fondo.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Ir al segundo palo y esperar el rechace',
        check: {
          attribute: 'offTheBall',
          difficulty: 11,
          success: {
            text: 'Nadie te sigue. El rechace cae a tus pies y se la sirves a tu compañero, que solo tiene que empujarla.',
            effects: { playerAssists: 1, trust: 3 }
          },
          failure: {
            text: 'El portero de {rival} atrapa el centro sin problemas. Te quedas solo, sin balón y sin premio.',
            effects: { morale: -1 }
          }
        }
      }
    ]
  },
  {
    id: 'inicio-presion-al-central',
    title: 'Presión al central',
    text: 'Minuto 22. El central de {rival} se recrea con el balón en los pies. Si llegas a tiempo, le robas la cartera.',
    phase: 'inicio',
    options: [
      {
        label: 'Apretar a tope y buscar el robo',
        check: {
          attribute: 'pace',
          difficulty: 12,
          success: {
            text: 'Le comes el terreno en tres zancadas, le robas el balón y la picas por encima del portero.',
            effects: { playerGoals: 1, morale: 7, trust: 3 }
          },
          failure: {
            text: 'Llegas un segundo tarde. El central te regatea con la suela y la grada de {rival} se ríe.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Cerrar la línea de pase y que se equivoque solo',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Le tapas el pase fácil. Se pone nervioso, la regala y tu equipo monta una contra que acaba en gol.',
            effects: { teamGoals: 1, trust: 4 }
          },
          failure: {
            text: 'Te quedas a medio camino: ni presionas ni tapas nada. El míster te grita desde la banda.',
            effects: { trust: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'inicio-entrada-dura',
    title: 'Entrada por detrás',
    text: 'Minuto 27. El mediocentro de {rival} te barre por detrás sin mirar el balón. El árbitro solo saca la amarilla. Te levantas cojeando.',
    phase: 'inicio',
    options: [
      {
        label: 'Respirar y responder con fútbol',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'No le das el gusto. En la siguiente jugada te la juegas, le haces un caño y das el pase del gol.',
            effects: { playerAssists: 1, morale: 5, trust: 3 }
          },
          failure: {
            text: 'Te quedas con la rabia dentro y se te olvida jugar durante diez minutos.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Hacerle notar que tú también pegas',
        check: {
          attribute: 'strength',
          difficulty: 12,
          success: {
            text: 'En el siguiente balón dividido llegas fuerte y limpio. Él sale por los aires y deja de buscarte.',
            effects: { morale: 4, reputation: 1 }
          },
          failure: {
            text: 'Llegas tarde y te ganas la amarilla. Desde entonces juegas con el freno puesto.',
            effects: { trust: -4, morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-desmarque-tardio',
    title: 'Diagonal desde lejos',
    text: 'Minuto 72. Los centrales de {rival} ya llegan cansados. Tu interior conduce y espera a que hagas el movimiento.',
    phase: 'medio',
    options: [
      {
        label: 'Diagonal entre los centrales',
        check: {
          attribute: 'offTheBall',
          difficulty: 12,
          success: {
            text: 'Te cuelas entre los dos, recibes solo y la cruzas lejos del portero.',
            effects: { playerGoals: 1, morale: 7, reputation: 2 }
          },
          failure: {
            text: 'El pase llega, pero el central se recupera y te tapa el disparo justo a tiempo.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Pedirla al pie y encarar',
        check: {
          attribute: 'dribbling',
          difficulty: 12,
          success: {
            text: 'Te giras, amagas, te vas del central y le dejas el gol hecho a tu compañero.',
            effects: { playerAssists: 1, trust: 3, morale: 3 }
          },
          failure: {
            text: 'El central no se traga el amago y te roba la pelota limpiamente.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'final-balon-dividido',
    title: 'Balón dividido',
    text: 'Minuto 75. Un rechace queda suelto en el medio del campo. Tú y el pivote de {rival} vais a por él a la vez.',
    phase: 'final',
    options: [
      {
        label: 'Meter el cuerpo y ganarlo',
        check: {
          attribute: 'strength',
          difficulty: 11,
          success: {
            text: 'Te llevas el choque, sales con el balón y abres a la banda. La jugada acaba en gol.',
            effects: { teamGoals: 1, trust: 4, morale: 3 }
          },
          failure: {
            text: 'Él es más pesado. Te desplaza, sale jugando y {rival} pisa vuestra área.',
            effects: { morale: -2, trust: -2 }
          }
        }
      },
      {
        label: 'Anticiparte con un toque',
        check: {
          attribute: 'pace',
          difficulty: 12,
          success: {
            text: 'Llegas antes, la tocas por delante y te vas solo hacia la portería. Definición tranquila.',
            effects: { playerGoals: 1, morale: 7, reputation: 2 }
          },
          failure: {
            text: 'La tocas demasiado larga y el portero sale a por ella sin problemas.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'final-contra-tras-corner',
    title: 'Contra tras el córner',
    text: 'Minuto 81. {rival} saca un córner con todo el equipo arriba. El despeje cae en tus pies en tu propio campo.',
    phase: 'final',
    options: [
      {
        label: 'Salir corriendo con el balón',
        check: {
          attribute: 'stamina',
          difficulty: 12,
          success: {
            text: 'Sesenta metros a toda velocidad, con las piernas ardiendo. Llegas y la metes junto al palo.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'A mitad de camino te quedas sin piernas y te alcanza el defensa de {rival}.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Esperar a tu compañero y dársela en el momento justo',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Fijas al último defensa y se la das en el momento justo. Tu compañero solo tiene que empujarla.',
            effects: { playerAssists: 1, trust: 4 }
          },
          failure: {
            text: 'El pase se queda corto y el defensa de {rival} la corta.',
            effects: { trust: -2 }
          }
        }
      }
    ]
  }
]
