import { EXTRA_MATCH_MOMENTS } from './matchMomentsExtra'
import type { MatchMoment } from './matchTypes'

/**
 * Jugadas clave de los partidos importantes (derbis, finales de copa y finales
 * continentales). En cada partido salen de 3 a 5 según su relevancia (2 si
 * sales desde el banquillo), en orden de minuto. El marcador se actualiza tras cada decisión.
 */
export const MATCH_MOMENTS: readonly MatchMoment[] = [
  // -------------------------------------------------------------------------
  // Inicio
  // -------------------------------------------------------------------------
  {
    id: 'inicio-primer-balon',
    title: 'El primer balón',
    text: 'Minuto 2. El estadio todavía ruge cuando te llega el primer balón de espaldas, con el central de {rival} pegado a tu nuca.',
    phase: 'inicio',
    options: [
      {
        label: 'Girarte y encarar',
        check: {
          attribute: 'dribbling',
          difficulty: 11,
          success: {
            text: 'Amago, giro y te quedas solo. El remate cruzado entra pegado al palo. Gol en el minuto 2.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'El central te lee el giro y te roba la cartera. Primer duelo para él.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Descargar de primeras y buscar el desmarque',
        check: {
          attribute: 'shortPassing',
          difficulty: 10,
          success: {
            text: 'Pared con el mediapunta, recibes en el área y cedes atrás para que el extremo la empuje. Se adelanta {club}.',
            effects: { playerAssists: 1, trust: 4, morale: 3 }
          },
          failure: {
            text: 'La descarga se va a los pies del pivote de {rival}. Nada grave, pero la grada murmura.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Proteger el balón y ganar una falta',
        check: {
          attribute: 'physique',
          difficulty: 10,
          success: {
            text: 'Aguantas la carga y el central te derriba. Falta, amarilla para él y primer aviso.',
            effects: { morale: 4, trust: 3 }
          },
          failure: {
            text: 'Te desplaza con el hombro como a un juvenil. Saque de banda para {rival}.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'inicio-presion-salida',
    title: 'Presión a la salida',
    text: 'Minuto 6. El portero de {rival} intenta salir jugando en corto. El míster te grita desde la banda que muerdas.',
    phase: 'inicio',
    options: [
      {
        label: 'Sprint al central que recibe',
        check: {
          attribute: 'pace',
          difficulty: 11,
          success: {
            text: 'Llegas antes de que controle, le robas la cartera y la empujas a puerta vacía.',
            effects: { playerGoals: 1, morale: 8, trust: 4 }
          },
          failure: {
            text: 'Llegas tarde, te supera con un pase y {rival} sale lanzado a la contra. Gol en contra.',
            effects: { opponentGoals: 1, trust: -3, morale: -4 }
          }
        }
      },
      {
        label: 'Cerrar la línea de pase y esperar el error',
        check: {
          attribute: 'offTheBall',
          difficulty: 10,
          success: {
            text: 'El portero se queda sin opciones y revienta el balón fuera. Primer asalto para {club}.',
            effects: { trust: 5, morale: 3 }
          },
          failure: {
            text: 'Te quedas a medio camino y {rival} sale jugando con toda la comodidad del mundo.',
            effects: { trust: -2 }
          }
        }
      },
      {
        label: 'Guardar fuerzas para lo que queda',
        outcome: {
          text: 'Dejas correr el balón. El míster abre los brazos en la banda.',
          effects: { trust: -4 }
        }
      }
    ]
  },
  {
    id: 'inicio-provocacion',
    title: 'El central provocador',
    text: 'Minuto 9. En el primer córner, el central de {rival} te pisa, te agarra la camiseta y te susurra algo sobre tu familia.',
    phase: 'inicio',
    options: [
      {
        label: 'No entrar al trapo',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Le sonríes y le guiñas un ojo. Ahora es él quien pierde los nervios y ve la amarilla.',
            effects: { morale: 5, trust: 3 }
          },
          failure: {
            text: 'Aguantas, pero te hierve la sangre. Durante diez minutos no das una a derechas.',
            effects: { morale: -5 }
          }
        }
      },
      {
        label: 'Contestarle en el siguiente remate',
        check: {
          attribute: 'heading',
          difficulty: 12,
          success: {
            text: 'En el siguiente córner le ganas la posición y cabeceas a la red. Ni le miras al celebrarlo.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'Te tira al suelo en pleno salto y el árbitro no pita nada.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Devolverle el empujón',
        outcome: {
          text: 'El árbitro lo ve todo... pero solo lo tuyo. Amarilla en el minuto 9 y a jugar con el freno de mano.',
          effects: { trust: -5, morale: -3 }
        }
      }
    ]
  },
  {
    id: 'inicio-balon-largo',
    title: 'Balón a la espalda',
    text: 'Minuto 12. La defensa de {rival} juega muy adelantada. Tu central levanta la cabeza y te mira: quiere tu desmarque.',
    phase: 'inicio',
    options: [
      {
        label: 'Romper al espacio en el momento justo',
        check: {
          attribute: 'offTheBall',
          difficulty: 11,
          success: {
            text: 'Sales en el último instante, sin fuera de juego. Controlas con el pecho y bates al portero por bajo.',
            effects: { playerGoals: 1, morale: 6, reputation: 2 }
          },
          failure: {
            text: 'Te adelantas medio paso. Bandera arriba y ocasión perdida.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Bajar a recibir y cambiar el juego a la otra banda',
        check: {
          attribute: 'longPassing',
          difficulty: 11,
          success: {
            text: 'Recibes, giras y abres cuarenta metros a la banda contraria. El extremo centra y tu compañero de ataque la mete.',
            effects: { teamGoals: 1, trust: 5 }
          },
          failure: {
            text: 'El cambio de juego se va directo a la grada. El lateral de {rival} aplaude con ironía.',
            effects: { trust: -2, morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'inicio-estadio-en-contra',
    title: 'Un estadio en contra',
    text: 'Minuto 4. Cada vez que tocas el balón, la grada de {rival} te silba con todas sus fuerzas. Tus compañeros más jóvenes parecen encogidos.',
    youngText:
      'Minuto 4. Cada vez que tocas el balón, la grada de {rival} te silba con todas sus fuerzas. Nunca habías jugado en un ambiente así y sientes el peso de cada pitido.',
    phase: 'inicio',
    options: [
      {
        label: 'Pedir el balón en cada jugada y dar la cara',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Cada balón que pides es un mensaje. Tus compañeros se contagian y {club} se adueña del partido.',
            effects: { trust: 5, morale: 6, reputation: 2 }
          },
          failure: {
            text: 'Lo intentas, pero el ruido puede contigo y pierdes tres balones seguidos.',
            effects: { morale: -5, trust: -2 }
          }
        }
      },
      {
        label: 'Bajar el ritmo con pases sencillos',
        check: {
          attribute: 'shortPassing',
          difficulty: 10,
          success: {
            text: 'Toque, toque, toque. El estadio se va callando a medida que {club} se queda con el balón.',
            effects: { trust: 5, morale: 3 }
          },
          failure: {
            text: 'Un pase corto mal medido y {rival} sale a la carrera. Su delantero no perdona.',
            effects: { opponentGoals: 1, trust: -4, morale: -5 }
          }
        }
      },
      {
        label: 'Aislarte y esperar tu ocasión',
        outcome: {
          text: 'Te concentras en lo tuyo. No haces daño, pero tampoco te lo hacen.',
          effects: { morale: 2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Medio
  // -------------------------------------------------------------------------
  {
    id: 'medio-mano-a-mano',
    title: 'Mano a mano',
    text: 'Minuto 38. Un pase filtrado te deja solo ante el portero de {rival}. Sale a tapar con todo el cuerpo.',
    phase: 'medio',
    options: [
      {
        label: 'Picarla por encima',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Vaselina perfecta. El balón bota dos veces antes de entrar. El estadio enmudece.',
            effects: { playerGoals: 1, reputation: 4, morale: 8 }
          },
          failure: {
            text: 'La picas demasiado flojo y el portero la atrapa sin despeinarse.',
            effects: { morale: -5, reputation: -2 }
          }
        }
      },
      {
        label: 'Ajustarla al palo largo',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Abres el pie y la pones donde no llega. Gol.',
            effects: { playerGoals: 1, morale: 6 }
          },
          failure: {
            text: 'Se marcha rozando el poste. Te llevas las manos a la cabeza.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Regatear al portero',
        check: {
          attribute: 'dribbling',
          difficulty: 13,
          success: {
            text: 'Amagas, lo sientas y entras con el balón hasta la red.',
            effects: { playerGoals: 1, reputation: 5, morale: 8 }
          },
          failure: {
            text: 'El portero te adivina el recorte y se lanza a tus pies. Saca rápido, contra de {rival} y gol.',
            effects: { opponentGoals: 1, morale: -6, trust: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-falta-frontal',
    title: 'Falta en la frontal',
    text: 'Minuto 51. Falta al borde del área, ligeramente escorada. Eres el lanzador del equipo y nadie discute quién la tira.',
    phase: 'medio',
    setPiece: 'freeKicks',
    options: [
      {
        label: 'Lanzarla tú, a la escuadra',
        check: {
          attribute: 'freeKicks',
          difficulty: 13,
          success: {
            text: 'Por encima de la barrera y a la cruceta. El portero ni se mueve.',
            effects: { playerGoals: 1, reputation: 5, morale: 8 }
          },
          failure: {
            text: 'Se estrella en la barrera. El rechace acaba en la grada.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Centro tenso al segundo palo',
        check: {
          attribute: 'freeKicks',
          difficulty: 11,
          success: {
            text: 'El balón cae justo en la cabeza de tu central, que la mete a bocajarro.',
            effects: { playerAssists: 1, trust: 5, morale: 4 }
          },
          failure: {
            text: 'El centro se cierra demasiado y el portero lo atrapa sin problemas.',
            effects: { morale: -2, trust: -2 }
          }
        }
      },
      {
        label: 'Ensayar la jugada del entrenamiento',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Toque corto, amago, y el mediocentro la cuela por el hueco de la barrera.',
            effects: { playerAssists: 1, trust: 6 }
          },
          failure: {
            text: 'La barrera se adelanta y la jugada se queda en nada. El míster resopla.',
            effects: { trust: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-contra-tres-dos',
    title: 'Tres contra dos',
    text: 'Minuto 44. Robo en tu campo y salís tres contra dos. Llevas el balón por el centro, con un compañero a cada lado.',
    phase: 'medio',
    options: [
      {
        label: 'Fijar al central y soltar en el momento justo',
        check: {
          attribute: 'shortPassing',
          difficulty: 12,
          success: {
            text: 'Esperas, fijas, sueltas. Tu compañero solo tiene que empujarla.',
            effects: { playerAssists: 1, trust: 5, morale: 4 }
          },
          failure: {
            text: 'Sueltas demasiado pronto y el central intercepta.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Acelerar y buscar el disparo tú',
        check: {
          attribute: 'pace',
          difficulty: 12,
          success: {
            text: 'Dejas atrás a los dos centrales en diez metros y la clavas al primer palo.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'Te cierran el paso y pierdes el balón. {rival} sale a la contra con tu equipo desordenado y marca.',
            effects: { opponentGoals: 1, trust: -5, morale: -5 }
          }
        }
      },
      {
        label: 'Abrir a la banda y llegar al remate',
        check: {
          attribute: 'heading',
          difficulty: 11,
          success: {
            text: 'Abres, sigues la jugada y el centro te encuentra en el punto de penalti. Cabezazo seco, gol.',
            effects: { playerGoals: 1, morale: 6 }
          },
          failure: {
            text: 'El centro te llega a la espalda y el balón muere en la banda.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-penalti',
    title: 'Penalti',
    text: 'Minuto 58. Te derriban dentro del área. Penalti a favor de {club}. Eres el lanzador y el estadio entero contiene la respiración.',
    phase: 'medio',
    setPiece: 'penalties',
    options: [
      {
        label: 'Tirarlo fuerte, arriba',
        check: {
          attribute: 'penalties',
          difficulty: 12,
          success: {
            text: 'Un trallazo imparable bajo el larguero. El portero ni la ve.',
            effects: { playerGoals: 1, morale: 6 }
          },
          failure: {
            text: 'Demasiado fuerte: el balón se marcha por encima del larguero.',
            effects: { morale: -8, reputation: -3 }
          }
        }
      },
      {
        label: 'Esperar al portero y colocarla',
        check: {
          attribute: 'penalties',
          difficulty: 13,
          success: {
            text: 'Esperas hasta que el portero se tira y la pones al otro lado con un toque suave.',
            effects: { playerGoals: 1, reputation: 4, morale: 8 }
          },
          failure: {
            text: 'El portero no se mueve y te la para a media altura.',
            effects: { morale: -8, reputation: -4 }
          }
        }
      },
      {
        label: 'Cedérselo al capitán y darle confianza',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Le das el balón y un par de palabras al oído. Lo transforma y te señala al celebrarlo.',
            effects: { teamGoals: 1, trust: 4, morale: 3 }
          },
          failure: {
            text: 'Le tiemblan las piernas y el portero lo adivina. Te mira como pidiendo perdón.',
            effects: { morale: -4 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-corner',
    title: 'Córner a favor',
    text: 'Minuto 33. Córner para {club}. Te marca el central más alto de {rival}, que te saca una cabeza.',
    phase: 'medio',
    options: [
      {
        label: 'Atacar el primer palo con todo',
        check: {
          attribute: 'heading',
          difficulty: 12,
          success: {
            text: 'Te anticipas y peinas el balón al palo largo. Gol de delantero de los de antes.',
            effects: { playerGoals: 1, morale: 6 }
          },
          failure: {
            text: 'El central te gana arriba sin apenas saltar.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Bloquearle para que remate tu compañero',
        check: {
          attribute: 'physique',
          difficulty: 11,
          success: {
            text: 'Le haces la pantalla y tu central entra solo. Cabezazo a la red.',
            effects: { teamGoals: 1, trust: 5 }
          },
          failure: {
            text: 'Te tira al suelo como a un muñeco. El árbitro pita falta... en ataque.',
            effects: { trust: -2, morale: -2 }
          }
        }
      },
      {
        label: 'Quedarte en la frontal por si hay rechace',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'El rechace te cae a la altura perfecta y le pegas de volea. A la red.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'Tu volea se va a las nubes y {rival} sale a la contra con tu equipo volcado. Gol en contra.',
            effects: { opponentGoals: 1, morale: -5 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-corner-lanzador',
    title: 'Córner para ti',
    text: 'Minuto 37. Córner a favor de {club}. Como lanzador del equipo, colocas el balón en la esquina. Tus centrales ya están en el área.',
    phase: 'medio',
    setPiece: 'corners',
    options: [
      {
        label: 'Centro tenso al primer palo',
        check: {
          attribute: 'corners',
          difficulty: 12,
          success: {
            text: 'El balón sale como un misil al primer palo y tu central la peina a la red.',
            effects: { playerAssists: 1, trust: 4, morale: 4 }
          },
          failure: {
            text: 'El centro se queda corto y lo despeja el primer defensor.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Bombeado al punto de penalti',
        check: {
          attribute: 'corners',
          difficulty: 11,
          success: {
            text: 'Lo dejas caer en el punto de penalti y el cabezazo entra pegado al palo.',
            effects: { playerAssists: 1, morale: 4 }
          },
          failure: {
            text: 'El portero sale por alto y atrapa el balón sin problemas. Arranca la contra de {rival}.',
            effects: { morale: -2, trust: -1 }
          }
        }
      },
      {
        label: 'Sacarlo en corto y buscar la jugada ensayada',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Toque en corto, devolución y centro raso al segundo palo. Gol de la jugada del entrenamiento.',
            effects: { playerAssists: 1, trust: 6 }
          },
          failure: {
            text: 'La jugada ensayada se enreda y {rival} recupera el balón.',
            effects: { trust: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'final-falta-ultimo-minuto',
    title: 'La última falta',
    text: 'Minuto 90. Falta frontal a veinte metros. Eres el lanzador y el estadio se pone en pie.',
    phase: 'final',
    setPiece: 'freeKicks',
    options: [
      {
        label: 'Rosca por encima de la barrera',
        check: {
          attribute: 'freeKicks',
          difficulty: 13,
          success: {
            text: 'La rosca sobrevuela la barrera y baja justo bajo el larguero. Locura en la grada.',
            effects: { playerGoals: 1, morale: 10, reputation: 6 }
          },
          failure: {
            text: 'El balón toca en la barrera y se marcha a córner.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Disparo potente por el palo del portero',
        check: {
          attribute: 'strength',
          difficulty: 13,
          success: {
            text: 'Un zapatazo que el portero ni ve salir. Gol.',
            effects: { playerGoals: 1, morale: 9, reputation: 5 }
          },
          failure: {
            text: 'Demasiado fuerte y demasiado alto: el balón acaba en la grada.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Centro al área para los centrales',
        check: {
          attribute: 'freeKicks',
          difficulty: 11,
          success: {
            text: 'El centro cae en la cabeza de tu central, que remata a la red.',
            effects: { playerAssists: 1, trust: 5, morale: 5 }
          },
          failure: {
            text: 'El portero sale con decisión y atrapa el centro.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-balon-al-espacio',
    title: 'Balón al espacio',
    text: 'Minuto 55. El mediocentro levanta la cabeza y ve tu desmarque a la espalda de la defensa de {rival}.',
    phase: 'medio',
    options: [
      {
        label: 'Romper al espacio a toda velocidad',
        check: {
          attribute: 'offTheBall',
          difficulty: 12,
          success: {
            text: 'Arrancas en el momento justo, controlas orientado y la cruzas lejos del portero.',
            effects: { playerGoals: 1, morale: 7, reputation: 3 }
          },
          failure: {
            text: 'Sales un segundo antes de tiempo. Fuera de juego por medio metro.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Controlar y esperar a que suba el equipo',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Aguantas, levantas la cabeza y das el pase de la muerte para que entre tu compañero.',
            effects: { playerAssists: 1, trust: 4 }
          },
          failure: {
            text: 'Te encima un rival y pierdes el balón sin poder soltarlo.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-cambio-de-banda',
    title: 'Cambio de orientación',
    text: 'Minuto 61. Recibes en la frontal con la defensa de {rival} volcada hacia la izquierda. El extremo derecho está solo.',
    phase: 'medio',
    options: [
      {
        label: 'Cambio de juego al extremo',
        check: {
          attribute: 'longPassing',
          difficulty: 12,
          success: {
            text: 'El balón cruza el campo y cae justo en la bota del extremo, que la pone en la escuadra.',
            effects: { playerAssists: 1, trust: 5, morale: 3 }
          },
          failure: {
            text: 'El pase sale largo y se pierde por la línea de fondo.',
            effects: { morale: -2, trust: -1 }
          }
        }
      },
      {
        label: 'Girarte y disparar desde la frontal',
        check: {
          attribute: 'strength',
          difficulty: 13,
          success: {
            text: 'Te giras y sacas un zapatazo que se cuela por la escuadra.',
            effects: { playerGoals: 1, morale: 8, reputation: 4 }
          },
          failure: {
            text: 'El disparo se marcha alto. La grada resopla.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-duelo-central',
    title: 'Duelo con el central',
    text: 'Minuto 67. El central de {rival} lleva toda la tarde encima de ti. Te llega un balón largo y él te espera.',
    phase: 'medio',
    options: [
      {
        label: 'Ganarle el cuerpo y aguantar',
        check: {
          attribute: 'physique',
          difficulty: 12,
          success: {
            text: 'Le ganas la posición, aguantas y descargas para la llegada de un compañero, que marca.',
            effects: { playerAssists: 1, trust: 4, morale: 3 }
          },
          failure: {
            text: 'Te desplaza con facilidad y sale jugando como si nada.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Peinarla de cabeza hacia la portería',
        check: {
          attribute: 'heading',
          difficulty: 13,
          success: {
            text: 'Te elevas por encima de él y la peinas a la escuadra.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'Te gana arriba y el balón vuelve a medio campo.',
            effects: { morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-a-por-la-remontada',
    title: 'A por la remontada',
    text: 'Minuto 60. {club} va por detrás y el míster quita a un defensa para meter otro delantero. Ahora todo pasa por ti.',
    phase: 'medio',
    situations: ['perdiendo'],
    options: [
      {
        label: 'Pedirla siempre y encarar',
        check: {
          attribute: 'dribbling',
          difficulty: 12,
          success: {
            text: 'Te vas de dos rivales en la frontal y la pegas cruzada. Gol: el partido está vivo.',
            effects: { playerGoals: 1, morale: 9, reputation: 4 }
          },
          failure: {
            text: 'Te cierran entre tres y la contra de {rival} acaba en gol.',
            effects: { opponentGoals: 1, morale: -6 }
          }
        }
      },
      {
        label: 'Jugar de espaldas para los que llegan',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Aguantas de espaldas y la dejas de cara para el disparo del mediocentro. Gol.',
            effects: { playerAssists: 1, trust: 5, morale: 5 }
          },
          failure: {
            text: 'La descarga se queda corta y el rival corta el balón.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-romper-el-empate',
    title: 'Romper el empate',
    text: 'Minuto 66. Empate en el marcador y el partido se ha atascado. Recibes en tres cuartos sin presión.',
    phase: 'medio',
    situations: ['empatando'],
    options: [
      {
        label: 'Probar desde lejos',
        check: {
          attribute: 'finishing',
          difficulty: 13,
          success: {
            text: 'Disparo seco y raso que se cuela pegado al palo. Desatascas el partido.',
            effects: { playerGoals: 1, morale: 8, reputation: 4 }
          },
          failure: {
            text: 'El balón sale mordido y el portero lo atrapa sin problemas.',
            effects: { morale: -2 }
          }
        }
      },
      {
        label: 'Paciencia: tocar y volver a empezar',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Mueves el balón, el rival se desordena y tu equipo encuentra el hueco. Gol de {club}.',
            effects: { teamGoals: 1, trust: 5 }
          },
          failure: {
            text: 'La posesión no lleva a ninguna parte y el partido sigue atascado.',
            effects: { trust: -1 }
          }
        }
      }
    ]
  },
  {
    id: 'medio-arbitro',
    title: 'El árbitro no ve nada',
    text: 'Minuto 41. Te agarran en el área de forma descarada y el árbitro dice que sigan. En la jugada siguiente, el mismo central de {rival} te mete el codo.',
    phase: 'medio',
    options: [
      {
        label: 'Hablar con el árbitro con calma',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Se lo explicas sin levantar la voz. En el siguiente agarrón pita penalti, y tu compañero no perdona.',
            effects: { teamGoals: 1, morale: 4, trust: 2 }
          },
          failure: {
            text: 'Te escucha con cara de piedra y te saca amarilla por protestar.',
            effects: { morale: -4, trust: -2 }
          }
        }
      },
      {
        label: 'Calmar a tus compañeros y que hable solo el capitán',
        check: {
          attribute: 'leadership',
          difficulty: 10,
          success: {
            text: 'Nada de protestas: solo habla el capitán. El árbitro empieza a pitar lo que hay.',
            effects: { trust: 5, morale: 3 }
          },
          failure: {
            text: 'Cinco jugadores rodean al árbitro. Amarilla para dos y el partido se embarra.',
            effects: { trust: -4, morale: -3 }
          }
        }
      },
      {
        label: 'Devolverle el codazo',
        outcome: {
          text: 'El árbitro lo ve y te saca amarilla. Juegas el resto del partido en el alambre.',
          effects: { trust: -5, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'medio-reaccion',
    title: 'Reacción antes del descanso',
    text: 'Minuto 43. {club} va por detrás y el equipo está hundido. Recuperas un balón en tres cuartos de campo: quedan dos minutos para el descanso.',
    phase: 'medio',
    situations: ['perdiendo'],
    options: [
      {
        label: 'Arrancar en conducción hasta el área',
        check: {
          attribute: 'dribbling',
          difficulty: 12,
          success: {
            text: 'Dejas atrás a dos rivales y cruzas el balón lejos del portero. Un gol que cambia el vestuario.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'Te cierran entre tres y pierdes el balón. Al menos no hay contra.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Abrir a banda y llegar desde atrás',
        check: {
          attribute: 'offTheBall',
          difficulty: 11,
          success: {
            text: 'Apareces en el área justo cuando cae el centro. Gol para meteros otra vez en el partido.',
            effects: { playerGoals: 1, trust: 4, morale: 6 }
          },
          failure: {
            text: 'Llegas tarde: el balón pasa por delante de tus botas.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Asegurar el balón y llegar vivos al descanso',
        outcome: {
          text: 'Tocáis hasta el pitido. El míster tendrá quince minutos para recolocar al equipo.',
          effects: { trust: 3 }
        }
      }
    ]
  },
  {
    id: 'medio-sentenciar',
    title: 'Matar el partido',
    text: 'Minuto 64. {club} gana y {rival} se vuelca en busca del empate. El campo está abierto y el balón te llega en el centro del campo.',
    phase: 'medio',
    situations: ['ganando'],
    options: [
      {
        label: 'Lanzar al extremo con un pase largo',
        check: {
          attribute: 'longPassing',
          difficulty: 12,
          success: {
            text: 'Un pase de cincuenta metros que deja al extremo solo. La define con calma. Partido casi sentenciado.',
            effects: { playerAssists: 1, trust: 5, morale: 4 }
          },
          failure: {
            text: 'El pase se queda corto. {rival} recupera y marca en la jugada siguiente.',
            effects: { opponentGoals: 1, trust: -4, morale: -4 }
          }
        }
      },
      {
        label: 'Correr tú los cincuenta metros',
        check: {
          attribute: 'stamina',
          difficulty: 12,
          success: {
            text: 'Llegas con oxígeno para levantar la cabeza y definir. Ni el central que te persigue puede contigo.',
            effects: { playerGoals: 1, morale: 6, reputation: 2 }
          },
          failure: {
            text: 'A mitad de camino se te acaba la gasolina. El central te alcanza sin esfuerzo.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Guardar el balón y enfriar el partido',
        outcome: {
          text: 'Pisas el balón, buscas la falta y la grada de {rival} se desespera. Puro oficio.',
          effects: { trust: 4 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Final
  // -------------------------------------------------------------------------
  {
    id: 'final-asedio',
    title: 'A la desesperada',
    text: 'Minuto 89. {club} pierde y hasta el portero ha subido a rematar. Último córner del partido.',
    phase: 'final',
    situations: ['perdiendo'],
    options: [
      {
        label: 'Rematar de cabeza entre la marabunta',
        check: {
          attribute: 'heading',
          difficulty: 13,
          success: {
            text: 'Te elevas por encima de todos y la cabeceas al fondo de la red. Gol en el último suspiro.',
            effects: { playerGoals: 1, morale: 10, reputation: 5 }
          },
          failure: {
            text: 'El balón te roza el pelo. El portero de {rival} despeja y sale la contra con vuestra portería vacía.',
            effects: { opponentGoals: 1, morale: -6 }
          }
        }
      },
      {
        label: 'Quedarte fuera del área a por el rechace',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'El rechace cae a tus pies y le pegas de volea. Gol.',
            effects: { playerGoals: 1, morale: 10, reputation: 4 }
          },
          failure: {
            text: 'Le pegas mordida y se marcha desviada. El árbitro mira el reloj.',
            effects: { morale: -5 }
          }
        }
      }
    ]
  },
  {
    id: 'final-arenga',
    title: 'Levantar al equipo',
    text: 'Minuto 78. {club} va por detrás y nadie levanta la cabeza. Tus compañeros caminan. Queda poco más de un cuarto de hora.',
    phase: 'final',
    situations: ['perdiendo'],
    options: [
      {
        label: 'Reunirlos y gritar que esto no ha acabado',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Tu grito despierta al equipo. Tres minutos después, un compañero empuja un balón suelto en el área.',
            effects: { teamGoals: 1, morale: 6, trust: 4 }
          },
          failure: {
            text: 'Gritas, pero nadie te sigue. El equipo se rompe y {rival} hace otro.',
            effects: { opponentGoals: 1, morale: -6 }
          }
        }
      },
      {
        label: 'Predicar con el ejemplo: presionar cada balón',
        check: {
          attribute: 'stamina',
          difficulty: 13,
          success: {
            text: 'Robas un balón en la salida de {rival} y se lo sirves a tu compañero, que no falla.',
            effects: { playerAssists: 1, trust: 6, morale: 4 }
          },
          failure: {
            text: 'Corres por los once, pero las piernas ya no responden.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Pedir todos los balones y jugártela tú',
        check: {
          attribute: 'dribbling',
          difficulty: 13,
          success: {
            text: 'Te vas de tres rivales en una baldosa y la cruzas lejos del portero. Seguís vivos.',
            effects: { playerGoals: 1, morale: 8, reputation: 4 }
          },
          failure: {
            text: 'Te enredas una y otra vez. La grada de {club} empieza a resoplar.',
            effects: { morale: -4, reputation: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'final-calambres',
    title: 'Calambres en el 85',
    text: 'Minuto 85. Empate. Te da un calambre en el gemelo y el míster ya ha hecho todos los cambios. Te toca aguantar.',
    phase: 'final',
    situations: ['empatando'],
    options: [
      {
        label: 'Estirar y seguir como sea',
        check: {
          attribute: 'stamina',
          difficulty: 12,
          success: {
            text: 'Te recuperas a base de orgullo y, en la última jugada, llegas al segundo palo para empujarla.',
            effects: { playerGoals: 1, morale: 10, reputation: 4 }
          },
          failure: {
            text: 'Te arrastras por el campo y no llegas a nada. El empate no se mueve.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Quedarte arriba como referencia, sin correr',
        check: {
          attribute: 'physique',
          difficulty: 12,
          success: {
            text: 'Aguantas los balones largos de espaldas a puro cuerpo. Uno de ellos acaba en el gol de un compañero.',
            effects: { playerAssists: 1, trust: 6, morale: 4 }
          },
          failure: {
            text: 'Cada choque te duele el doble. Pierdes todos los balones que te llegan.',
            effects: { morale: -3, trust: -2 }
          }
        }
      },
      {
        label: 'Tirarte al suelo y pedir asistencia',
        outcome: {
          text: 'El fisio entra, te masajea y ganas un minuto de aire. El partido sigue igual.',
          effects: { morale: 2 }
        }
      }
    ]
  },
  {
    id: 'final-penalti-descuento',
    title: 'Penalti en el descuento',
    text: 'Minuto 93. Empate. El árbitro señala penalti para {club} tras revisar la jugada en el monitor. Es la última acción del partido y el balón es tuyo: eres el lanzador.',
    phase: 'final',
    situations: ['empatando'],
    setPiece: 'penalties',
    options: [
      {
        label: 'Lanzarlo tú',
        check: {
          attribute: 'penalties',
          difficulty: 13,
          success: {
            text: 'Carrerilla corta, portero a un lado, balón al otro. Lo celebras con la grada entera encima.',
            effects: { playerGoals: 1, morale: 12, reputation: 8 }
          },
          failure: {
            text: 'El portero de {rival} vuela y la saca con una mano. Final con sabor a ceniza.',
            effects: { morale: -10, reputation: -5 }
          }
        }
      },
      {
        label: 'Dejárselo al especialista y darle ánimo',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Le das la confianza que necesita. Gol, y el primero al que abraza eres tú.',
            effects: { teamGoals: 1, trust: 4, morale: 6 }
          },
          failure: {
            text: 'Le tiemblan las piernas y la manda fuera. Le consuelas sobre el césped.',
            effects: { morale: -4, trust: 2 }
          }
        }
      }
    ]
  },
  {
    id: 'final-perder-tiempo',
    title: 'Que pase el tiempo',
    text: 'Minuto 88. {club} gana y {rival} lo tira todo arriba. Te llega un balón en la esquina del campo rival.',
    phase: 'final',
    situations: ['ganando'],
    options: [
      {
        label: 'Proteger el balón en el banderín',
        check: {
          attribute: 'physique',
          difficulty: 11,
          success: {
            text: 'Te pegas al banderín y aguantas a dos rivales durante un minuto eterno. Saque de banda y la grada te aplaude.',
            effects: { trust: 6, morale: 4 }
          },
          failure: {
            text: 'Te la roban y {rival} sale en estampida. Gol en contra.',
            effects: { opponentGoals: 1, trust: -4, morale: -5 }
          }
        }
      },
      {
        label: 'Buscar el gol de la tranquilidad',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Recortas hacia dentro y la cuelas por el primer palo. Partido cerrado.',
            effects: { playerGoals: 1, morale: 8, reputation: 3 }
          },
          failure: {
            text: 'Disparo blando a las manos del portero, que saca rápido. Los últimos minutos se hacen eternos.',
            effects: { trust: -3, morale: -2 }
          }
        }
      },
      {
        label: 'Tocar en corto con los compañeros',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Rondo en campo rival. La grada de {rival} silba mientras corre el reloj.',
            effects: { trust: 5, morale: 3 }
          },
          failure: {
            text: 'Un mal pase y {rival} recupera. Pasáis un último minuto agónico, pero aguantáis.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'final-ultima-contra',
    title: 'La última contra',
    text: 'Minuto 90. Despeje de {club} y el balón cae en tus pies con medio campo por delante. Solo te sigue un central de {rival}.',
    phase: 'final',
    options: [
      {
        label: 'Esprintar hasta el área',
        check: {
          attribute: 'pace',
          difficulty: 13,
          success: {
            text: 'Le sacas dos metros al central y la defines cruzada. La grada explota.',
            effects: { playerGoals: 1, morale: 10, reputation: 5 }
          },
          failure: {
            text: 'El central te alcanza y despeja a córner. Se te escapa la última bala.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Esperar el apoyo y servir el pase',
        check: {
          attribute: 'shortPassing',
          difficulty: 12,
          success: {
            text: 'Aguantas hasta que llega el extremo y le dejas el balón solo frente al portero. Gol.',
            effects: { playerAssists: 1, trust: 5, morale: 6 }
          },
          failure: {
            text: 'Esperas demasiado y llegan tres rivales. La ocasión se esfuma.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Disparar desde el centro del campo al ver adelantado al portero',
        check: {
          attribute: 'strength',
          difficulty: 14,
          success: {
            text: 'El balón vuela cuarenta metros y entra por debajo del larguero. Gol de leyenda.',
            effects: { playerGoals: 1, reputation: 8, morale: 10 }
          },
          failure: {
            text: 'El balón se va muy por encima. Tus compañeros se llevan las manos a la cabeza.',
            effects: { trust: -3, morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'final-corner-en-contra',
    title: 'Córner en contra',
    text: 'Minuto 92. Córner a favor de {rival}. El míster te hace gestos desesperados: quiere que bajes a defender el primer palo.',
    phase: 'final',
    options: [
      {
        label: 'Bajar y defender el primer palo',
        check: {
          attribute: 'heading',
          difficulty: 12,
          success: {
            text: 'Despejas de cabeza el balón más peligroso del partido. El banquillo de {club} lo celebra como un gol.',
            effects: { trust: 6, morale: 4 }
          },
          failure: {
            text: 'El balón te pasa por encima y el delantero de {rival} remata a placer.',
            effects: { opponentGoals: 1, trust: -4, morale: -4 }
          }
        }
      },
      {
        label: 'Quedarte arriba esperando la contra',
        check: {
          attribute: 'pace',
          difficulty: 12,
          success: {
            text: 'El despeje te llega y sales disparado. Gol a la contra en el último segundo.',
            effects: { playerGoals: 1, morale: 10, reputation: 4 }
          },
          failure: {
            text: 'Con un hombre menos atrás, {rival} remata solo en el área pequeña.',
            effects: { opponentGoals: 1, trust: -6, morale: -4 }
          }
        }
      },
      {
        label: 'Organizar la defensa a gritos',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Colocas a cada uno en su sitio y la zaga despeja sin sufrir.',
            effects: { trust: 5, morale: 3 }
          },
          failure: {
            text: 'Hay demasiado ruido y nadie te oye. El remate rival se estrella en el larguero. Sufrimiento puro.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  },
  ...EXTRA_MATCH_MOMENTS
]
