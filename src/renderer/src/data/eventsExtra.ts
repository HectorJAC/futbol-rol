import type { GameEvent } from './events'

/**
 * Eventos de la v0.8: carrera larga (hasta 25 temporadas), fase de juvenil,
 * fase de veterano, eventos de arquetipo y sus consecuencias.
 */
export const EXTRA_EVENTS: readonly GameEvent[] = [
  // -------------------------------------------------------------------------
  // Fase de juvenil (hasta 21 años)
  // -------------------------------------------------------------------------
  {
    id: 'primer-sueldo',
    once: true,
    showEffects: true,
    lockUnaffordable: true,
    title: 'Tu primera nómina de verdad',
    text: 'Te llega el primer sueldo de futbolista profesional. En el aparcamiento del club, tus compañeros comparan coches que cuestan más que la casa de tus padres.',
    maxAge: 21,
    options: [
      {
        label: 'Comprarte un deportivo como el de los veteranos',
        outcome: {
          text: 'El coche es una maravilla. El míster lo ve aparcado junto a su plaza y arquea una ceja.',
          effects: { money: -60000, morale: 8, trust: -5, reputation: 2 }
        }
      },
      {
        label: 'Ayudar a tus padres con la hipoteca',
        outcome: {
          text: 'Tu madre llora al teléfono. Es el mejor gol que has marcado este año.',
          effects: { money: -35000, morale: 10 }
        }
      },
      {
        label: 'Ahorrar y buscar un asesor financiero',
        outcome: {
          text: 'Un asesor serio te prepara un plan y solo cobra si tu dinero crece. Los veteranos se ríen de tu utilitario; tú duermes tranquilo.',
          effects: { morale: 2, trust: 3 }
        }
      }
    ]
  },
  {
    id: 'novatada',
    once: true,
    title: 'La novatada',
    text: 'Tradición del vestuario: el novato canta subido a una silla en la cena de equipo. Veinticinco tipos golpean la mesa esperando.',
    maxAge: 21,
    options: [
      {
        label: 'Subirte a la silla y darlo todo',
        check: {
          attribute: 'leadership',
          difficulty: 9,
          success: {
            text: 'Eliges una canción del barrio y acabas con todo el vestuario cantando contigo. Ya eres uno más.',
            effects: { morale: 10, trust: 3 }
          },
          failure: {
            text: 'Se te quiebra la voz en la segunda estrofa. Las risas duran semanas, y el apodo, más.',
            effects: { morale: -6 }
          }
        }
      },
      {
        label: 'Negarte con una sonrisa',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Lo dices con tanta gracia que el capitán te perdona: "Este tiene cuajo".',
            effects: { morale: 4, trust: 2 }
          },
          failure: {
            text: 'Se lo toman como un desplante. Esa semana nadie te pasa el balón en el rondo.',
            effects: { morale: -6, trust: -2 }
          }
        }
      },
      {
        label: 'Pagar la cena para librarte',
        outcome: {
          text: 'La cuenta es de escándalo, pero el vestuario entero brinda a tu salud.',
          effects: { money: -8000, morale: 4 }
        }
      }
    ]
  },
  {
    id: 'primer-entreno-mayores',
    once: true,
    title: 'Bienvenido al primer equipo',
    text: 'Primer entrenamiento con los mayores. El central veterano te recibe con una entrada que te deja tirado en el césped: "Aquí no hay algodones, niño".',
    maxAge: 21,
    options: [
      {
        label: 'Levantarte y aguantarle el siguiente choque',
        check: {
          attribute: 'strength',
          difficulty: 10,
          success: {
            text: 'El siguiente balón dividido lo ganas tú. El central asiente en silencio: prueba superada.',
            effects: { trust: 6, morale: 5, attributes: { strength: 1 } }
          },
          failure: {
            text: 'Te vuelve a pasar por encima y acabas con hielo en el tobillo. El cuerpo técnico toma nota.',
            effects: { morale: -5, trust: -3 }
          }
        }
      },
      {
        label: 'Jugar a un toque para que no te pueda ni tocar',
        check: {
          attribute: 'shortPassing',
          difficulty: 9,
          success: {
            text: 'Tocas y te vas, tocas y te vas. El veterano no llega a ninguna y el míster sonríe en la banda.',
            effects: { trust: 7, attributes: { shortPassing: 1 } }
          },
          failure: {
            text: 'Pierdes el balón en la primera pared y el central se ríe: "Más rápido, chaval".',
            effects: { trust: -3, morale: -3 }
          }
        }
      },
      {
        label: 'Quejarte al segundo entrenador',
        outcome: {
          text: 'El segundo te mira con lástima. En el vestuario ya te llaman "el delicado".',
          effects: { trust: -4, morale: -6 }
        }
      }
    ]
  },
  {
    id: 'directo-streamer',
    title: 'Un directo de madrugada',
    text: 'Un streamer famoso te invita a su directo un martes a las dos de la mañana. Medio millón de chavales conectados y ningún jefe de prensa a la vista.',
    maxAge: 21,
    options: [
      {
        label: 'Entrar y soltarte',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Eres gracioso, cercano y no dices nada de más. Ganas miles de seguidores en una noche.',
            effects: { reputation: 6, morale: 5 }
          },
          failure: {
            text: 'A las tres de la mañana se te escapa lo que piensas del sistema del míster. El clip da la vuelta al país.',
            effects: { reputation: 2, trust: -8 }
          }
        }
      },
      {
        label: 'Entrar diez minutos y despedirte',
        outcome: {
          text: 'Saludas, juegas una partida y te vas a dormir. Suficiente para que hablen bien de ti.',
          effects: { reputation: 3 }
        }
      },
      {
        label: 'Decir que no: mañana hay doble sesión',
        outcome: {
          text: 'Te pierdes la fiesta, pero en la doble sesión eres el único que llega fresco.',
          effects: { trust: 4, morale: -2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Fase de veterano (desde 30 años)
  // -------------------------------------------------------------------------
  {
    id: 'pupilo',
    once: true,
    title: 'El chaval que viene a por tu puesto',
    text: 'Sube del filial un delantero de diecisiete años que corre igual que tú a su edad. El míster te pide que lo tomes bajo tu ala. Algún día te quitará el sitio.',
    minAge: 30,
    options: [
      {
        label: 'Enseñarle todo lo que sabes',
        outcome: {
          text: 'Te quedas con él después de cada sesión. Te escucha como tú escuchabas a los veteranos.',
          effects: { trust: 6, morale: 4, attributes: { leadership: 1 }, flags: { mentor: true } }
        }
      },
      {
        label: 'Enseñarle a jugar contigo, no contra ti',
        check: {
          attribute: 'shortPassing',
          difficulty: 13,
          success: {
            text: 'Paredes, desmarques cruzados, miradas. En dos semanas os entendéis sin hablar y el míster ya piensa en jugar con los dos.',
            effects: { trust: 8, attributes: { shortPassing: 1 }, flags: { mentor: true } }
          },
          failure: {
            text: 'No hay química. El chaval se frustra, tú también, y cada uno acaba a lo suyo.',
            effects: { morale: -4, trust: -2 }
          }
        }
      },
      {
        label: 'Que se lo gane solo, como tuviste que hacer tú',
        outcome: {
          text: 'Le das la espalda. El chaval aprende igual, pero no olvida tu frialdad.',
          effects: { trust: -5, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'perder-velocidad',
    once: true,
    title: 'El GPS no miente',
    text: 'Los datos del GPS lo confirman: has perdido casi dos kilómetros por hora de punta. Los laterales rivales ya no temen tus carreras al espacio.',
    minAge: 30,
    options: [
      {
        label: 'Retrasar tu posición y lanzar a los jóvenes al espacio',
        check: {
          attribute: 'longPassing',
          difficulty: 13,
          success: {
            text: 'Desde la mediapunta, tus balones a la espalda de la defensa son oro. Ya no corres tú: haces correr a los demás.',
            effects: { trust: 6, morale: 4, attributes: { longPassing: 1 } }
          },
          failure: {
            text: 'Tus envíos llegan tarde o se marchan largos. El equipo pierde profundidad y el míster te devuelve al área.',
            effects: { trust: -5, morale: -5 }
          }
        }
      },
      {
        label: 'Pagarte un preparador de velocidad personal',
        check: {
          attribute: 'physique',
          difficulty: 14,
          success: {
            text: 'Fuerza, técnica de carrera y dieta milimétrica. Tu cuerpo responde y recuperas lo perdido.',
            effects: { money: -25000, attributes: { pace: 1 }, morale: 6 }
          },
          failure: {
            text: 'Fuerzas demasiado y el gemelo dice basta. Un mes fuera y la velocidad sigue sin volver.',
            effects: { money: -25000, morale: -6, trust: -3 }
          }
        }
      },
      {
        label: 'Aceptarlo y vivir dentro del área',
        outcome: {
          text: 'Dejas de correr al espacio y empiezas a ganar la posición. Menos metros, más veneno.',
          effects: { attributes: { pace: -1, offTheBall: 1 }, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'pensar-retirada',
    // "Después de un partido gris": solo si el último no se ganó.
    context: { lastResult: ['empate', 'derrota'] },
    title: '¿Hasta cuándo?',
    text: 'Después de un partido gris, en la cena familiar alguien pregunta en voz alta cuándo piensas retirarte. Nadie contesta. Esa misma semana, una cadena de televisión te ofrece ser comentarista cuando cuelgues las botas.',
    minAge: 30,
    options: [
      {
        label: '"Mientras las piernas respondan, sigo"',
        check: {
          attribute: 'stamina',
          difficulty: 13,
          success: {
            text: 'Te pones a prueba en el siguiente entrenamiento: primero en todas las series. La pregunta puede esperar.',
            effects: { morale: 8, trust: 4 }
          },
          failure: {
            text: 'Lo intentas, pero acabas la semana fundido. La pregunta te ronda cada noche.',
            effects: { morale: -6 }
          }
        }
      },
      {
        label: 'Sacarte el título de entrenador por las tardes',
        outcome: {
          text: 'Pizarras, apuntes y vídeos tácticos. Empiezas a ver el fútbol desde el banquillo sin dejar el césped.',
          effects: { attributes: { leadership: 1 }, trust: 3, morale: -2 }
        }
      },
      {
        label: 'Firmar ya un precontrato con la televisión',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Firmas con discreción y buenas condiciones. Ya sabes que habrá vida después del fútbol.',
            effects: { money: 60000, morale: 6 }
          },
          failure: {
            text: 'Se filtra la noticia y la prensa ya te da por retirado. En el vestuario te miran distinto.',
            effects: { money: 60000, trust: -6, reputation: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'brazalete',
    once: true,
    captain: false,
    title: 'El brazalete',
    text: 'El capitán se retira y el vestuario vota a su sucesor. Los veteranos te quieren a ti; los jóvenes, al centrocampista de moda.',
    minAge: 30,
    options: [
      {
        label: 'Dar un discurso antes de la votación',
        check: {
          attribute: 'leadership',
          difficulty: 13,
          success: {
            text: 'Hablas de todo lo que has visto en tantos años de vestuario. Ganas por mayoría. El brazalete pesa, y te queda bien.',
            effects: {
              trust: 8,
              morale: 8,
              reputation: 4,
              attributes: { leadership: 1 },
              becomeCaptain: true
            }
          },
          failure: {
            text: 'El discurso suena a despedida. Pierdes la votación por dos votos.',
            effects: { morale: -8 }
          }
        }
      },
      {
        label: 'Retirarte y pedir el voto para el joven',
        outcome: {
          text: 'El gesto te honra. El nuevo capitán te consulta cada decisión importante.',
          effects: { trust: 5, morale: 2, reputation: 3 }
        }
      },
      {
        label: 'Dejar que decida el míster',
        outcome: {
          text: 'El míster elige al joven "pensando en el futuro". Te duele más de lo que admites.',
          effects: { morale: -5, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'ultimo-contrato',
    once: true,
    title: 'El último gran contrato',
    text: 'Tu agente llega con dos papeles: la renovación del club, un año con rebaja, y una oferta millonaria de una liga lejana para tus últimos años.',
    minAge: 30,
    options: [
      {
        label: 'Firmar la renovación con rebaja',
        outcome: {
          text: 'La afición lo celebra como un título. Acabarás tu carrera donde quieres.',
          effects: { trust: 8, morale: 6, reputation: 4 }
        }
      },
      {
        label: 'Usar la oferta lejana para apretar al club',
        check: {
          attribute: 'composure',
          difficulty: 14,
          success: {
            text: 'Juegas la partida con nervios de acero. El club mejora la oferta y te asegura un buen colchón.',
            effects: { money: 300000, trust: -2 }
          },
          failure: {
            text: 'El presidente se entera de la jugada y la filtra. La grada te pita en el siguiente partido.',
            effects: { trust: -8, reputation: -5 }
          }
        }
      },
      {
        label: 'Pedir una cláusula para entrenar en la cantera al retirarte',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'El club acepta encantado. Tu futuro también está en esta casa.',
            effects: { trust: 6, morale: 6, attributes: { leadership: 1 } }
          },
          failure: {
            text: 'El director deportivo se ríe: "Primero acaba de jugar". La renovación se queda como estaba.',
            effects: { morale: -4 }
          }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Eventos de arquetipo
  // -------------------------------------------------------------------------
  {
    id: 'academia-companero',
    once: true,
    title: 'El que no llegó',
    text: 'Te encuentras en una gasolinera a tu mejor amigo de la cantera. Le cortaron a los diecinueve. Ahora juega en un equipo de barrio y te pregunta, medio en broma, si podrías conseguirle una prueba.',
    archetypes: ['academia'],
    options: [
      {
        label: 'Hablar con el director deportivo por él',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Le consiguen una prueba con el filial. No sabes si llegará, pero le has devuelto la ilusión.',
            effects: { morale: 8, trust: 2, reputation: 2 }
          },
          failure: {
            text: 'El director deportivo te corta en seco: "Tú a jugar, que de fichar ya nos encargamos". Quedas mal con los dos.',
            effects: { trust: -5, morale: -4 }
          }
        }
      },
      {
        label: 'Entrenar con él los días libres',
        outcome: {
          text: 'Vuelve el fútbol de la cantera: paredes, conducciones, risas. Recuerdas por qué empezaste.',
          effects: { morale: 6, attributes: { shortPassing: 1 } }
        }
      },
      {
        label: 'Prometerle que lo mirarás y no hacer nada',
        outcome: {
          text: 'Nunca vuelves a llamarle. Él tampoco. Algo se rompe sin hacer ruido.',
          effects: { morale: -5 }
        }
      }
    ]
  },
  {
    id: 'academia-estilo',
    title: 'Lo que te enseñaron en la cantera',
    text: 'El nuevo entrenador quiere balones largos y segundas jugadas. Tú creciste en una cantera de pase corto y posesión. En el primer entrenamiento te lo deja claro: "Aquí no venimos a tocar".',
    archetypes: ['academia'],
    options: [
      {
        label: 'Adaptarte y aprender a jugar en largo',
        check: {
          attribute: 'longPassing',
          difficulty: 11,
          success: {
            text: 'Descubres que también sabes cambiar el juego con un pase de cuarenta metros. El míster está encantado.',
            effects: { trust: 7, attributes: { longPassing: 1 } }
          },
          failure: {
            text: 'Tus envíos largos acaban en la grada. El míster se desespera.',
            effects: { trust: -4, morale: -3 }
          }
        }
      },
      {
        label: 'Demostrarle que el toque también sirve',
        check: {
          attribute: 'shortPassing',
          difficulty: 12,
          success: {
            text: 'Dos paredes en el partidillo y gol a puerta vacía. "Vale, vale", dice el míster, "pero que no se haga costumbre".',
            effects: { trust: 5, morale: 6, attributes: { shortPassing: 1 } }
          },
          failure: {
            text: 'Pierdes el balón tocando en tu propio campo y te cae una bronca a gritos.',
            effects: { trust: -7, morale: -4 }
          }
        }
      },
      {
        label: 'Llamar a tu antiguo técnico de la cantera',
        outcome: {
          text: '"Un buen jugador juega a lo que pide el partido", te dice. Le das muchas vueltas.',
          effects: { attributes: { composure: 1 }, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'tardio-companeros',
    once: true,
    title: 'Los del curro',
    text: 'Tus antiguos compañeros del trabajo que tenías antes de dar el salto aparecen en la grada con una pancarta enorme con tu nombre. Han venido en furgoneta desde el pueblo.',
    archetypes: ['tardio'],
    options: [
      {
        label: 'Marcarles un gol y dedicárselo',
        check: {
          attribute: 'finishing',
          difficulty: 11,
          success: {
            text: 'Golazo y carrera hasta su pancarta. La foto de la furgoneta celebrándolo se hace viral.',
            effects: { goals: 1, reputation: 5, morale: 8 }
          },
          failure: {
            text: 'No hay gol, pero al acabar te esperan en la puerta igual de orgullosos.',
            effects: { morale: 3 }
          }
        }
      },
      {
        label: 'Invitarlos a cenar después del partido',
        outcome: {
          text: 'Acabáis a las tantas contando batallitas. Recuerdas lo que cuesta ganarse el pan.',
          effects: { money: -5000, morale: 8, trust: -2 }
        }
      }
    ]
  },
  {
    id: 'tardio-base-fisica',
    once: true,
    title: 'El cuerpo que llegó tarde',
    text: 'Los fisios te hacen un estudio completo. Tu cuerpo no tiene la base de los que se criaron en una academia: músculos que nunca se entrenaron, articulaciones a medio hacer.',
    archetypes: ['tardio'],
    options: [
      {
        label: 'Programa de prevención: una hora extra cada día',
        check: {
          attribute: 'physique',
          difficulty: 11,
          success: {
            text: 'Meses de ejercicios aburridos que nadie ve. Tu cuerpo se vuelve una roca.',
            effects: { attributes: { physique: 1 }, trust: 3 }
          },
          failure: {
            text: 'Te pasas de carga y acabas con una tendinitis. Dos semanas en la camilla.',
            effects: { injury: { matches: 2, zone: 'rodilla' }, morale: -5, trust: -2 }
          }
        }
      },
      {
        label: 'Trabajar el fondo con el preparador físico',
        check: {
          attribute: 'stamina',
          difficulty: 10,
          success: {
            text: 'Series, cuestas y pulsómetro. Ahora llegas al minuto noventa como si fuera el sesenta.',
            effects: { attributes: { stamina: 1 }, morale: 3 }
          },
          failure: {
            text: 'El preparador te exprime y te arrastras en los partidos del fin de semana.',
            effects: { trust: -3, morale: -3 }
          }
        }
      },
      {
        label: 'Has llegado hasta aquí con este cuerpo: seguir igual',
        outcome: {
          text: 'Confías en tu instinto. De momento, aguanta.',
          effects: { morale: 3 }
        }
      }
    ]
  },
  {
    id: 'barrio-torneo',
    once: true,
    title: 'El torneo de verano',
    text: 'El torneo de verano del barrio te invita a jugar la final en la pista de cemento donde aprendiste. El club te lo ha prohibido por riesgo de lesión.',
    archetypes: ['barrio'],
    options: [
      {
        label: 'Jugar igualmente, como cuando eras niño',
        check: {
          attribute: 'dribbling',
          difficulty: 10,
          success: {
            text: 'Tres caños, un gol de tacón y el barrio entero invadiendo la pista. Nadie del club se entera... hasta que sale el vídeo.',
            effects: { morale: 10, reputation: 5, trust: -4 }
          },
          failure: {
            text: 'Una entrada en el cemento te abre la rodilla. El club te multa y te pierdes un partido.',
            effects: {
              injury: { matches: 1, zone: 'rodilla' },
              money: -20000,
              trust: -8,
              morale: -4
            }
          }
        }
      },
      {
        label: 'Ir como invitado de honor y entregar el trofeo',
        outcome: {
          text: 'Firmas camisetas durante tres horas. Los chavales te miran como tú mirabas a los mayores.',
          effects: { morale: 6, reputation: 3 }
        }
      },
      {
        label: 'Pagar equipaciones nuevas para todos los equipos',
        outcome: {
          text: 'El torneo estrena camisetas con tu número a la espalda. El barrio no olvida.',
          effects: { money: -15000, reputation: 4, morale: 5 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Entrenamiento y táctica
  // -------------------------------------------------------------------------
  {
    id: 'rondo',
    // Lo de meter al chaval en el centro del rondo: para jóvenes o recién llegados.
    maxAgeUnlessNew: 25,
    title: 'En el centro del rondo',
    text: 'Calentamiento. Los veteranos te meten en el centro del rondo y se pasan el balón entre risas. Llevas dos minutos sin olerla.',
    options: [
      {
        label: 'Presionar sin descanso hasta robarla',
        check: {
          attribute: 'stamina',
          difficulty: 10,
          success: {
            text: 'Persigues cada pase como si fuera el último. Robas, y el grupo aplaude tu insistencia.',
            effects: { trust: 5, morale: 4 }
          },
          failure: {
            text: 'A los tres minutos te ahogas. Acabas con las manos en las rodillas entre carcajadas.',
            effects: { morale: -5, trust: -2 }
          }
        }
      },
      {
        label: 'Leer los pases y anticiparte',
        check: {
          attribute: 'offTheBall',
          difficulty: 11,
          success: {
            text: 'Cortas una línea de pase con la puntera. "Este sabe", murmura el capitán.',
            effects: { trust: 4, morale: 3 }
          },
          failure: {
            text: 'Siempre llegas tarde. El rondo se alarga hasta que el míster lo para por pena.',
            effects: { morale: -4 }
          }
        }
      },
      {
        label: 'Tomártelo con humor y pedir la revancha',
        outcome: {
          text: 'Cuando por fin sales del centro, eres tú el que hace bailar al siguiente.',
          effects: { morale: 3 }
        }
      }
    ]
  },
  {
    id: 'falso-nueve',
    title: 'Falso nueve',
    text: 'El míster ha visto algo en los vídeos: quiere que juegues de falso nueve, bajando a recibir entre líneas para arrastrar a los centrales.',
    options: [
      {
        label: 'Aceptar el reto y aprender el puesto',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Recibes de espaldas, giras y filtras. Los extremos marcan con tus pases y el míster te señala en la charla.',
            effects: { trust: 8, attributes: { shortPassing: 1 } }
          },
          failure: {
            text: 'Te pierdes entre líneas: ni recibes ni llegas al área. Partido para olvidar.',
            effects: { trust: -4, morale: -4 }
          }
        }
      },
      {
        label: 'Pedirle seguir siendo el nueve de área',
        outcome: {
          text: 'Te escucha y lo respeta, pero ya no eres su primera opción para los partidos grandes.',
          effects: { trust: -6, morale: 2 }
        }
      },
      {
        label: 'Proponer una mezcla: bajar y atacar la espalda',
        check: {
          attribute: 'pace',
          difficulty: 12,
          success: {
            text: 'Bajas, arrastras al central y, cuando se descuida, le ganas la espalda en carrera. Gol de pizarra.',
            effects: { goals: 1, trust: 6, morale: 4 }
          },
          failure: {
            text: 'Ni una cosa ni la otra. El míster te pide que elijas.',
            effects: { trust: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'presion-alta',
    title: 'Presión tras pérdida',
    text: 'El nuevo cuerpo técnico quiere que el delantero sea el primer defensor: presión tras pérdida, sprint tras sprint, durante noventa minutos.',
    options: [
      {
        label: 'Morder en cada balón',
        check: {
          attribute: 'stamina',
          difficulty: 11,
          success: {
            text: 'Los centrales rivales no tienen un segundo de paz. Robas uno en el área y lo celebras como un gol.',
            effects: { trust: 8, attributes: { stamina: 1 } }
          },
          failure: {
            text: 'En el minuto sesenta ya no puedes con tu alma. Te cambian en todos los partidos.',
            effects: { trust: -4, morale: -5 }
          }
        }
      },
      {
        label: 'Presionar con cabeza, eligiendo los momentos',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Activas la presión solo cuando el pase es malo. Rindes más corriendo menos.',
            effects: { trust: 5, morale: 3 }
          },
          failure: {
            text: 'Al míster le parece que te escondes, y te lo dice delante de todos.',
            effects: { trust: -6 }
          }
        }
      },
      {
        label: 'Decirle que un nueve está para marcar',
        outcome: {
          text: 'Te mira con los brazos cruzados: "Aquí corren todos o no juega nadie".',
          effects: { trust: -8, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'balon-parado',
    title: 'La jugada de estrategia',
    text: 'El analista ha diseñado una jugada de córner para ti: bloqueo en el primer palo y remate en carrera. El míster quiere ensayarla toda la semana.',
    options: [
      {
        label: 'Repetirla hasta clavarla',
        check: {
          attribute: 'heading',
          difficulty: 11,
          success: {
            text: 'El domingo sale tal y como la dibujaron. Cabezazo en el primer palo y a la red.',
            effects: { goals: 1, trust: 6, morale: 5 }
          },
          failure: {
            text: 'Llegas siempre medio segundo tarde. El analista borra la jugada de la pizarra.',
            effects: { trust: -3, morale: -3 }
          }
        }
      },
      {
        label: 'Ofrecerte para sacar los córners del otro lado',
        check: {
          attribute: 'longPassing',
          difficulty: 11,
          success: {
            text: 'Tus centros caen como puestos con la mano. El central se hincha a rematar y tú ganas otro registro.',
            effects: { trust: 5, attributes: { longPassing: 1 } }
          },
          failure: {
            text: 'El primer córner no pasa del primer defensor. El segundo, tampoco. Te quitan el balón.',
            effects: { trust: -4, morale: -3 }
          }
        }
      },
      {
        label: 'Pedir que el remate sea para el central, que salta más',
        outcome: {
          text: 'El central marca y te lo agradece en el vestuario. Pierdes un gol, ganas un amigo.',
          effects: { trust: 3, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'pretemporada-montana',
    title: 'Pretemporada en la montaña',
    text: 'Concentración a dos mil metros de altitud. El preparador físico anuncia la primera prueba: seis series de mil metros cuesta arriba.',
    options: [
      {
        label: 'Ir a tope desde la primera serie',
        check: {
          attribute: 'stamina',
          difficulty: 12,
          success: {
            text: 'Ganas todas las series. El preparador apunta tu nombre en la pizarra y lo rodea con un círculo.',
            effects: { trust: 6, morale: 4, attributes: { stamina: 1 } }
          },
          failure: {
            text: 'En la cuarta serie vomitas detrás de un pino. Las fotos corren por el grupo del equipo.',
            effects: { morale: -6, trust: -2 }
          }
        }
      },
      {
        label: 'Aguantar el ritmo del grupo y apretar al final',
        check: {
          attribute: 'physique',
          difficulty: 10,
          success: {
            text: 'Tu cuerpo aguanta el castigo sin una sola molestia. Llegas a la liga como un tiro.',
            effects: { trust: 3, attributes: { physique: 1 } }
          },
          failure: {
            text: 'Una sobrecarga en el gemelo te deja tres días en la camilla del hotel.',
            effects: { trust: -3, morale: -3 }
          }
        }
      },
      {
        label: 'Dosificarte: la temporada es larga',
        outcome: {
          text: 'Llegas fresco a septiembre, pero el preparador te ha puesto la cruz.',
          effects: { morale: 2, trust: -4 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Vestuario, prensa y redes
  // -------------------------------------------------------------------------
  {
    id: 'primas-vestuario',
    title: 'La guerra de las primas',
    text: 'La directiva ofrece primas por objetivos y el vestuario se parte en dos: los veteranos quieren cobrar por partido, los jóvenes por títulos. La reunión se calienta.',
    options: [
      {
        label: 'Mediar y proponer un reparto intermedio',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Te escuchan los dos bandos. El acuerdo lleva tu nombre y el capitán te da las gracias.',
            effects: { trust: 5, morale: 6, attributes: { leadership: 1 } }
          },
          failure: {
            text: 'Nadie te hace caso y acabas pareciendo el portavoz de la directiva.',
            effects: { morale: -5, trust: -2 }
          }
        }
      },
      {
        label: 'Ponerte del lado de los veteranos',
        outcome: {
          text: 'Los pesos pesados te lo agradecen y las primas llegan pronto. Los jóvenes te miran de reojo.',
          effects: { money: 20000, morale: 3, trust: -2 }
        }
      },
      {
        label: 'Quedarte al margen',
        outcome: {
          text: 'Tú a entrenar. Cobras lo que te toca y te ahorras disgustos.',
          effects: { trust: 2, morale: -2 }
        }
      }
    ]
  },
  {
    id: 'prensa-goleada',
    // Solo justo después de perder por tres goles o más.
    context: { lastResult: ['derrota'], minGoalDiff: 3 },
    title: 'Después de la goleada',
    text: 'Habéis perdido por {marcador} contra {rival}. En la sala de prensa, un periodista te pregunta si el entrenador debería seguir en el cargo.',
    options: [
      {
        label: '"El míster tiene todo nuestro apoyo. La culpa es nuestra"',
        outcome: {
          text: 'El entrenador lo ve desde su despacho. Al día siguiente te saluda de otra manera.',
          effects: { trust: 8, reputation: -2 }
        }
      },
      {
        label: '"Eso no lo decido yo. Pregunten arriba"',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Esquivas la pregunta con elegancia y nadie consigue sacar un titular.',
            effects: { reputation: 3, trust: 2 }
          },
          failure: {
            text: 'Tu tono se interpreta como una crítica. "El delantero no defiende al míster", titulan.',
            effects: { trust: -7, reputation: 2 }
          }
        }
      },
      {
        label: 'Pedir perdón a la afición y prometer una reacción',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Das la cara cuando otros se escondían. La grada te aplaude en el siguiente partido.',
            effects: { reputation: 6, morale: 4 }
          },
          failure: {
            text: 'Prometes demasiado. Cuando llega la siguiente derrota, te recuerdan tus palabras.',
            effects: { reputation: -4, morale: -4 }
          }
        }
      }
    ]
  },
  {
    id: 'video-viral',
    title: 'El vídeo fuera de contexto',
    text: 'Circula un vídeo de diez segundos en el que parece que te burlas de la afición rival. Fuera de contexto, claro. Ya es tendencia en todo el país.',
    options: [
      {
        label: 'Grabar un vídeo explicando lo que pasó',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Tranquilo, sin excusas y con la grabación completa. La polémica se desinfla en horas.',
            effects: { reputation: 4, morale: 3 }
          },
          failure: {
            text: 'Se te nota el enfado y el segundo vídeo es peor que el primero.',
            effects: { reputation: -6, morale: -4 }
          }
        }
      },
      {
        label: 'Desconectar de las redes una temporada',
        outcome: {
          text: 'Borras las aplicaciones. Duermes mejor, juegas mejor y la polémica muere sola.',
          effects: { morale: 6, reputation: -3, trust: 2 }
        }
      },
      {
        label: 'Contraatacar a los que lo difundieron',
        outcome: {
          text: 'Tus seguidores te defienden con uñas y dientes. El club te pide calma por escrito.',
          effects: { reputation: 3, trust: -6, morale: -2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Agente, patrocinadores y dinero
  // -------------------------------------------------------------------------
  {
    id: 'agente-tiburon',
    once: true,
    title: 'El superagente',
    text: 'El agente más temido del mercado te cita en un hotel de lujo. Promete triplicarte el sueldo. A cambio, quiere el quince por ciento de todo y que dejes a tu agente de toda la vida.',
    options: [
      {
        label: 'Firmar con él',
        outcome: {
          text: 'Su primera llamada ya mueve el mercado. Tu nombre suena en todas partes; tu viejo agente no te coge el teléfono.',
          effects: { reputation: 5, morale: -3, flags: { sharkAgent: true } }
        }
      },
      {
        label: 'Seguir con tu agente de siempre',
        outcome: {
          text: 'Tu agente se entera de la reunión y te lo agradece con un abrazo. Hay cosas que no tienen precio.',
          effects: { morale: 5, trust: 2 }
        }
      },
      {
        label: 'Firmar, pero solo si baja la comisión',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Le aguantas la mirada hasta que baja al ocho por ciento. Su primer movimiento te consigue un buen contrato de botas.',
            effects: { money: 50000, reputation: 3, flags: { sharkAgent: true } }
          },
          failure: {
            text: 'Se levanta antes del postre: "No trabajo con aficionados". La reunión se filtra igual.',
            effects: { reputation: -2, trust: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'marca-bebidas',
    once: true,
    title: 'La bebida energética',
    text: 'Una marca de bebidas energéticas te ofrece {dinero:150000} por una campaña y una publicación semanal en tus redes. Su lata es de un verde imposible.',
    options: [
      {
        label: 'Firmar el contrato completo',
        outcome: {
          text: 'Tu cara aparece en todas las latas del país. El nutricionista del club se lleva las manos a la cabeza.',
          effects: { money: 150000, reputation: 4, trust: -3, flags: { sponsorDrinks: true } }
        }
      },
      {
        label: 'Negociar sin publicaciones en semana de partido',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Aceptan tus condiciones a cambio de menos dinero. Cobras sin que nadie en el club pueda reprocharte nada.',
            effects: { money: 80000, reputation: 2 }
          },
          failure: {
            text: 'Les parece que pides demasiado y se van con otro jugador.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Rechazarlo: no te representa',
        outcome: {
          text: 'El nutricionista te felicita. Tu cuenta bancaria, no tanto.',
          effects: { trust: 3 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Familia y pareja
  // -------------------------------------------------------------------------
  {
    id: 'cumple-madre',
    once: true,
    // Con 17–19 años tu madre aún no cumple sesenta (v0.17).
    minAge: 25,
    title: 'Los sesenta de tu madre',
    text: 'Tu familia organiza una comida sorpresa por los sesenta años de tu madre. Es el sábado, justo el día antes de un partido fuera de casa.',
    options: [
      {
        label: 'Pedir permiso al míster para ir y volver en el día',
        check: {
          attribute: 'leadership',
          difficulty: 10,
          success: {
            text: '"La familia es lo primero, pero a las diez en el hotel". Llegas a los postres y vuelves a tiempo.',
            effects: { morale: 10, trust: 2 }
          },
          failure: {
            text: 'Te dice que no, y encima lo apunta. Pasas el sábado en el hotel mirando las fotos.',
            effects: { morale: -6, trust: -2 }
          }
        }
      },
      {
        label: 'Escaparte sin avisar',
        outcome: {
          text: 'Tu madre llora de alegría. El míster, cuando se entera, no llora: te multa.',
          effects: { morale: 8, trust: -8, money: -10000 }
        }
      },
      {
        label: 'Llamarla por videollamada desde la concentración',
        outcome: {
          text: 'Soplas las velas a través de una pantalla. Ella dice que no pasa nada. Tú sabes que sí.',
          effects: { morale: -5, trust: 3 }
        }
      }
    ]
  },
  {
    id: 'pareja-exclusiva',
    // Solo si tienes pareja (historia de la pareja, v0.8).
    conditions: [{ flag: 'partner', oneOf: ['pareja', 'casados'] }],
    title: 'La exclusiva',
    text: 'Unos paparazzi os fotografían a {pareja} y a ti en la playa. Una revista ofrece {dinero:40000} por una entrevista conjunta y un reportaje en vuestra casa.',
    options: [
      {
        label: 'Aceptar la exclusiva',
        outcome: {
          text: 'Portada, fotos en el sofá y titulares de amor. Tu pareja se arrepiente a la semana.',
          effects: { money: 40000, reputation: 3, morale: -4 }
        }
      },
      {
        label: 'Rechazarla y pedir respeto',
        outcome: {
          text: 'Un comunicado educado y la puerta cerrada. Tu pareja te lo agradece con una cena.',
          effects: { morale: 6 }
        }
      },
      {
        label: 'Aceptar y donar el dinero a una protectora',
        outcome: {
          text: 'Salís en la revista, pero por algo bonito. Tu pareja elige hasta el perro de la portada.',
          effects: { reputation: 4, morale: 2 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Lesiones y recuperación
  // -------------------------------------------------------------------------
  {
    id: 'lesion-tobillo',
    once: true,
    title: 'El esguince',
    text: 'Un pisotón en el entrenamiento y el tobillo se hincha como un balón. Los médicos dicen cuatro semanas. El derbi es en diez días.',
    options: [
      {
        label: 'Respetar los plazos de los médicos',
        outcome: {
          text: 'Ves el derbi desde la grada, pero el tobillo queda como nuevo.',
          effects: {
            trust: 2,
            morale: -5,
            injury: { matches: 4, zone: 'tobillo', attributeLoss: false }
          }
        }
      },
      {
        label: 'Pagar una clínica privada de recuperación exprés',
        check: {
          attribute: 'physique',
          difficulty: 11,
          success: {
            text: 'Cámara hiperbárica y fisios de madrugada. Llegas al derbi, marcas, y nadie se cree que estuvieras lesionado.',
            effects: { money: -30000, goals: 1, trust: 4, morale: 6 }
          },
          failure: {
            text: 'Fuerzas los plazos y recaes en el primer entrenamiento. Ahora son seis semanas.',
            effects: {
              money: -30000,
              morale: -8,
              trust: -3,
              injury: { matches: 6, zone: 'tobillo' }
            }
          }
        }
      },
      {
        label: 'Infiltrarte y jugar sin decírselo a nadie',
        check: {
          attribute: 'physique',
          difficulty: 12,
          success: {
            text: 'Juegas el derbi con el tobillo dormido y haces un partido enorme. Nadie sabe lo que te ha costado.',
            effects: { goals: 1, trust: 5, reputation: 4, flags: { hiddenInjury: true } }
          },
          failure: {
            text: 'A la media hora no puedes apoyar. Te retiras cojeando y el médico te mira con sospecha.',
            effects: {
              trust: -4,
              morale: -6,
              injury: { matches: 5, zone: 'tobillo' },
              flags: { hiddenInjury: true }
            }
          }
        }
      }
    ]
  },
  {
    id: 'rehabilitacion',
    title: 'Dos meses fuera',
    text: 'Rotura muscular. Dos meses de baja. El fisio te da la mano el primer día: "Ahora empieza el partido más largo de la temporada".',
    options: [
      {
        label: 'Rehabilitación obsesiva: mañana y tarde',
        check: {
          attribute: 'stamina',
          difficulty: 11,
          success: {
            text: 'Vuelves antes de lo previsto y con más fondo que nunca. El preparador no da crédito.',
            effects: {
              attributes: { stamina: 1 },
              trust: 4,
              morale: 5,
              injury: { matches: 6, zone: 'muscular', attributeLoss: false }
            }
          },
          failure: {
            text: 'Te pasas de vueltas y el músculo protesta. Dos semanas más de baja.',
            effects: { morale: -8, trust: -2, injury: { matches: 10, zone: 'muscular' } }
          }
        }
      },
      {
        label: 'Fortalecer todo el cuerpo para que no vuelva a pasar',
        check: {
          attribute: 'physique',
          difficulty: 12,
          success: {
            text: 'Core, gimnasio y propiocepción. Vuelves con el cuerpo blindado.',
            effects: {
              attributes: { physique: 1 },
              morale: 4,
              injury: { matches: 8, zone: 'muscular', attributeLoss: false }
            }
          },
          failure: {
            text: 'Avanzas despacio y la impaciencia te come por dentro.',
            effects: { morale: -5, injury: { matches: 8, zone: 'muscular' } }
          }
        }
      },
      {
        label: 'Estudiar al equipo desde la grada con el analista',
        outcome: {
          text: 'Vídeos, pizarra y charlas con el míster. Cuando vuelves, ves huecos que antes no veías.',
          effects: {
            attributes: { offTheBall: 1 },
            trust: 3,
            morale: -2,
            injury: { matches: 8, zone: 'muscular' }
          }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Solidaridad
  // -------------------------------------------------------------------------
  {
    id: 'hospital-infantil',
    once: true,
    title: 'Visita al hospital',
    text: 'Visita navideña al hospital infantil. Un niño de ocho años con tu camiseta te pide que el domingo marques y hagas su celebración: un dinosaurio.',
    options: [
      {
        label: 'Prometérselo',
        check: {
          attribute: 'finishing',
          difficulty: 11,
          success: {
            text: 'Gol en el minuto 34 y celebración de dinosaurio delante de las cámaras. El vídeo emociona a todo el país.',
            effects: { goals: 1, reputation: 6, morale: 10 }
          },
          failure: {
            text: 'No marcas. El lunes vuelves al hospital con la camiseta firmada. Te dice que la próxima.',
            effects: { morale: -3, reputation: 2 }
          }
        }
      },
      {
        label: 'Prometerle algo más grande: una fundación para el hospital',
        outcome: {
          text: 'Pones la primera piedra con {dinero:60000} de tu bolsillo. Ya no hay vuelta atrás.',
          effects: { money: -60000, reputation: 6, morale: 6, flags: { ownFoundation: true } }
        }
      },
      {
        label: 'Volver cada mes, sin cámaras',
        outcome: {
          text: 'Nadie lo sabe salvo las enfermeras. Es lo que mejor te ayuda a dormir.',
          effects: { morale: 8 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Selección y mercado
  // -------------------------------------------------------------------------
  {
    id: 'convocatoria-seleccion',
    title: 'La llamada del seleccionador',
    text: 'El seleccionador te incluye en la lista para dos partidos de clasificación. Arrastras molestias en el aductor y tu club preferiría que te quedaras a recuperarte.',
    minSeason: 2,
    options: [
      {
        label: 'Ir con la selección pase lo que pase',
        check: {
          attribute: 'physique',
          difficulty: 12,
          success: {
            text: 'Juegas los dos partidos sin una sola molestia. El seleccionador ya te ve como fijo.',
            effects: { reputation: 8, morale: 8 }
          },
          failure: {
            text: 'El aductor se rompe en el segundo partido. Tu club no lo olvida.',
            effects: { reputation: 2, trust: -8, morale: -6 }
          }
        }
      },
      {
        label: 'Renunciar a la convocatoria para cuidarte',
        outcome: {
          text: 'Tu club te lo agradece. El seleccionador, al otro lado del teléfono, se queda en silencio.',
          effects: { trust: 6, reputation: -3, flags: { declinedNationalTeam: true } }
        }
      },
      {
        label: 'Ir, pero jugar solo los minutos pactados',
        check: {
          attribute: 'stamina',
          difficulty: 11,
          success: {
            text: 'Sales en la segunda parte de ambos partidos y vuelves fresco al club. Todos contentos.',
            effects: { reputation: 4, trust: 3 }
          },
          failure: {
            text: 'En tus minutos se te ve sin ritmo y fuera de forma. La prensa habla de ti, y no para bien.',
            effects: { reputation: -3, morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'seleccion-estrellas',
    title: 'Concentración con las estrellas',
    text: 'Concentración con la selección. En el primer entrenamiento, el mediapunta estrella del equipo no te pasa ni un balón. El sitio hay que ganárselo.',
    minSeason: 2,
    options: [
      {
        label: 'Ganártelo combinando a un toque',
        check: {
          attribute: 'shortPassing',
          difficulty: 12,
          success: {
            text: 'Dos paredes perfectas y el mediapunta empieza a buscarte. En el amistoso os entendéis de memoria.',
            effects: { reputation: 6, morale: 6, attributes: { shortPassing: 1 } }
          },
          failure: {
            text: 'Fallas el primer pase fácil y te ganas una mirada que lo dice todo.',
            effects: { morale: -5, reputation: -2 }
          }
        }
      },
      {
        label: 'Buscar tu gol por tu cuenta',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'En el amistoso te la juegas y la clavas en la escuadra. Golazo, aunque el vestuario murmura.',
            effects: { reputation: 6, morale: 4 }
          },
          failure: {
            text: 'Tres tiros lejanos con compañeros solos. El seleccionador te cambia al descanso.',
            effects: { reputation: -4, morale: -5 }
          }
        }
      },
      {
        label: 'Hablar con él en la cena',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Tenéis más en común de lo que parecía. Al día siguiente te busca en cada jugada.',
            effects: { morale: 6, reputation: 3 }
          },
          failure: {
            text: 'Te contesta con monosílabos y vuelve al móvil. Mala cena.',
            effects: { morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'rumor-fichaje',
    title: 'Portada inventada',
    text: 'Un periódico deportivo extranjero abre su portada con tu foto: "Acuerdo cerrado". Tú no sabes nada. En el vestuario ya te llaman por el nombre del otro club.',
    minSeason: 2,
    options: [
      {
        label: 'Desmentirlo en tus redes',
        outcome: {
          text: '"No he hablado con nadie. Estoy centrado aquí." El míster lo lee y asiente.',
          effects: { trust: 4, reputation: -2 }
        }
      },
      {
        label: '"No cierro ninguna puerta"',
        outcome: {
          text: 'Tu valor de mercado se dispara y tu agente sonríe. En el club no sonríe nadie.',
          effects: { reputation: 5, trust: -6 }
        }
      },
      {
        label: 'Responder marcando el domingo y besando el escudo',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Gol y beso al escudo delante de la grada. La portada se queda en nada.',
            effects: { goals: 1, trust: 4, morale: 6, reputation: 2 }
          },
          failure: {
            text: 'Se te nota la cabeza en otra parte. Partido gris y pitos al final.',
            effects: { morale: -6, reputation: -3 }
          }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Eventos de consecuencia de la v0.8
  // -------------------------------------------------------------------------
  {
    id: 'consecuencia-bebidas',
    title: 'La lata verde',
    text: 'Aquel contrato con la marca de bebidas energéticas te estalla en la cara: un estudio la relaciona con problemas de salud en adolescentes, y tu cara sigue en todas las latas.',
    requiresFlags: { sponsorDrinks: true },
    options: [
      {
        label: 'Romper el contrato y pagar la penalización',
        outcome: {
          text: 'Pagas la cláusula y pides perdón a las familias. Cuesta dinero, pero tu nombre queda limpio.',
          effects: { money: -50000, reputation: 4, trust: 3, flags: { sponsorDrinks: false } }
        }
      },
      {
        label: 'Defender a la marca en rueda de prensa',
        check: {
          attribute: 'composure',
          difficulty: 13,
          success: {
            text: 'Pides esperar a estudios serios y no te mojas más. La marca te premia con una renovación.',
            effects: { money: 60000, reputation: -2 }
          },
          failure: {
            text: 'Tus palabras suenan a lo que son: un anuncio. Los medios te destrozan.',
            effects: { reputation: -8, morale: -6 }
          }
        }
      },
      {
        label: 'Donar lo ganado al deporte base',
        outcome: {
          text: 'Anuncias que todo lo cobrado irá a escuelas de fútbol. El escándalo se convierte en ejemplo.',
          effects: { money: -80000, reputation: 7, morale: 5, flags: { sponsorDrinks: false } }
        }
      }
    ]
  },
  {
    id: 'consecuencia-pupilo',
    title: 'El debut de tu pupilo',
    text: 'Aquel chaval de la cantera al que tomaste bajo tu ala debuta hoy en el primer equipo. Sale en el minuto 70 y lo primero que hace es buscarte con la mirada.',
    requiresFlags: { mentor: true },
    options: [
      {
        label: 'Fabricarle su primer gol',
        check: {
          attribute: 'longPassing',
          difficulty: 12,
          success: {
            text: 'Le dejas un balón largo a la espalda de la defensa, como tantas veces en los entrenamientos. Gol, y corre a abrazarte a ti antes que a nadie.',
            effects: { trust: 6, morale: 10, reputation: 4, attributes: { leadership: 1 } }
          },
          failure: {
            text: 'El pase se te va largo por un metro. El chaval te pide perdón a ti, como si la culpa fuera suya.',
            effects: { morale: -3 }
          }
        }
      },
      {
        label: 'Cederle el penalti que os pitan en el 88',
        outcome: {
          text: 'Le das el balón y le susurras dónde tirarlo. Lo clava. La grada canta el nombre de los dos.',
          effects: { trust: 5, morale: 8, reputation: 3 }
        }
      },
      {
        label: 'Jugar tu partido: él ya está preparado',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Te la pone él y la empujas tú. El relevo puede esperar un poco más.',
            effects: { goals: 1, morale: 6 }
          },
          failure: {
            text: 'Fallas la tuya y él no se atreve a pedirla. Noche agridulce.',
            effects: { morale: -4 }
          }
        }
      }
    ]
  },
  {
    id: 'consecuencia-agente',
    title: 'La jugada del superagente',
    text: 'Aquel superagente con el que firmaste ha filtrado a la prensa que quieres salir del club para forzar una subida de sueldo. Tú te enteras por la radio.',
    requiresFlags: { sharkAgent: true },
    options: [
      {
        label: 'Despedirle aunque cueste la cláusula',
        outcome: {
          text: 'Rompes con él y pagas la penalización. El club valora que no hayas entrado en su juego.',
          effects: { money: -40000, trust: 6, morale: 2, flags: { sharkAgent: false } }
        }
      },
      {
        label: 'Dejar que siga con la jugada',
        outcome: {
          text: 'El club cede y te mejora el contrato, pero el vestuario te mira como a un mercenario.',
          effects: { money: 200000, trust: -8, reputation: -4 }
        }
      },
      {
        label: 'Obligarle a desmentirlo',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Le dejas claro quién manda. Al día siguiente desmiente la noticia y aprende a consultarte.',
            effects: { trust: 4, reputation: 2, morale: 4 }
          },
          failure: {
            text: 'Te da largas y la noticia sigue viva una semana. El míster te pregunta si piensas irte.',
            effects: { trust: -6, morale: -4 }
          }
        }
      }
    ]
  },
  {
    id: 'consecuencia-fundacion',
    title: 'La fundación abre sus puertas',
    text: 'La fundación que prometiste aquella Navidad en el hospital infantil inaugura su primera sala de juegos. El niño del dinosaurio, ya recuperado, corta la cinta.',
    requiresFlags: { ownFoundation: true },
    options: [
      {
        label: 'Dar un discurso en la inauguración',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Hablas sin papeles y con la voz rota. Media sala llora y las donaciones se multiplican.',
            effects: { reputation: 6, morale: 8 }
          },
          failure: {
            text: 'Te bloqueas a mitad de frase. El niño te salva con un abrazo y todos aplauden igual.',
            effects: { morale: 2 }
          }
        }
      },
      {
        label: 'Organizar un partido benéfico con tus compañeros',
        check: {
          attribute: 'stamina',
          difficulty: 10,
          success: {
            text: 'Estadio lleno, noventa minutos a tope y tres horas firmando autógrafos. Se recauda el doble de lo previsto.',
            effects: { reputation: 5, morale: 6 }
          },
          failure: {
            text: 'Acabas el partido benéfico con un tirón. El míster no se lo toma con humor.',
            effects: { trust: -4, morale: 2 }
          }
        }
      },
      {
        label: 'Poner otros {dinero:50000} y no salir en la foto',
        outcome: {
          text: 'La sala se amplía sin que tu nombre aparezca en ningún sitio. Las enfermeras lo saben, y con eso basta.',
          effects: { money: -50000, morale: 8 }
        }
      }
    ]
  },
  {
    id: 'consecuencia-seleccion',
    title: 'El seleccionador no olvida',
    text: 'Desde que rechazaste aquella convocatoria, tu nombre no aparece en las listas. Hoy el seleccionador lo ha dicho en rueda de prensa: "En la selección solo caben los que quieren venir".',
    requiresFlags: { declinedNationalTeam: true },
    options: [
      {
        label: 'Llamarle por teléfono y aclararlo',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Le explicas lo del aductor sin rencor. Al colgar, te dice que te sigue de cerca.',
            effects: { reputation: 4, morale: 6, flags: { declinedNationalTeam: false } }
          },
          failure: {
            text: 'La conversación se tuerce y acabáis colgando en seco.',
            effects: { morale: -6 }
          }
        }
      },
      {
        label: 'Responderle con goles',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Tres jornadas seguidas marcando. La prensa pide tu convocatoria a gritos.',
            effects: { goals: 2, reputation: 6, morale: 4, flags: { declinedNationalTeam: false } }
          },
          failure: {
            text: 'La presión te puede y la sequía se alarga. Las listas siguen sin tu nombre.',
            effects: { morale: -5, reputation: -2 }
          }
        }
      },
      {
        label: 'Contestarle en la prensa',
        outcome: {
          text: '"Yo también quiero ir, pero sano." El titular encanta a tu afición y enfada a la federación.',
          effects: { reputation: 3, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'consecuencia-infiltracion',
    title: 'El tobillo pasa factura',
    text: 'Aquel esguince que escondiste a base de infiltraciones vuelve a dar la cara. El médico del club ha visto las resonancias y te cita en su despacho: quiere la verdad.',
    requiresFlags: { hiddenInjury: true },
    options: [
      {
        label: 'Contarle todo y parar lo que haga falta',
        outcome: {
          text: 'Seis semanas de baja y una bronca del míster. Pero el tobillo, por fin, se cura de verdad.',
          effects: {
            trust: -3,
            morale: -5,
            attributes: { physique: 1 },
            injury: { matches: 6, zone: 'tobillo', attributeLoss: false },
            flags: { hiddenInjury: false }
          }
        }
      },
      {
        label: 'Negarlo y seguir jugando',
        check: {
          attribute: 'physique',
          difficulty: 14,
          success: {
            text: 'Tu cuerpo aguanta otra vez, contra todo pronóstico. Marcas, aunque cada mañana te cuesta más bajar de la cama.',
            effects: { goals: 1, trust: 3, morale: -2 }
          },
          failure: {
            text: 'El tobillo cede del todo en mitad de un partido. Quirófano, meses fuera y un club que ya no se fía de ti.',
            effects: {
              injury: { matches: 12, zone: 'tobillo' },
              trust: -10,
              morale: -10,
              flags: { hiddenInjury: false }
            }
          }
        }
      },
      {
        label: 'Pedir una segunda opinión fuera del club',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Un especialista propone un tratamiento con carga controlada y el médico del club lo acepta. Sigues jugando, ya sin mentiras.',
            effects: { money: -15000, trust: 2, morale: 3, flags: { hiddenInjury: false } }
          },
          failure: {
            text: 'El club se entera de que buscaste médicos por tu cuenta y se siente engañado.',
            effects: { money: -15000, trust: -7 }
          }
        }
      }
    ]
  }
]
