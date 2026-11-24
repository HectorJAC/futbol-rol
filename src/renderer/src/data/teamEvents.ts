import type { GameEvent } from './events'

/**
 * Eventos de vestuario: la capitanía, los compañeros de tu club (capitán, rival
 * por el puesto, veterano, amigo y canterano) y los excompañeros de otros clubes.
 * Las decisiones cambian la relación con cada uno.
 */
export const TEAM_EVENTS: readonly GameEvent[] = [
  // -------------------------------------------------------------------------
  // Capitanía
  // -------------------------------------------------------------------------
  {
    id: 'capitania-oferta',
    captaincyOffer: true,
    captain: false,
    title: 'El brazalete',
    text: 'Después de tantas temporadas en el club, el míster te llama a su despacho. Allí te esperan {capitan} y {veterano}: "Lo hemos hablado en el vestuario. Queremos que seas el capitán".',
    options: [
      {
        label: 'Aceptar y dirigirte a todo el vestuario con un discurso',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Hablas de la gente que trabaja en el club, de la afición y de todo lo que os queda por ganar. Cuando acabas, nadie dice nada: se levantan y aplauden.',
            effects: {
              becomeCaptain: true,
              teammates: { todos: 10 },
              morale: 8,
              reputation: 3,
              attributes: { leadership: 1 }
            }
          },
          failure: {
            text: 'Te trabas, repites tres veces "hay que darlo todo" y acabas antes de tiempo. El brazalete es tuyo, pero algún veterano se mira de reojo.',
            effects: { becomeCaptain: true, teammates: { todos: -3 }, morale: -3 }
          }
        }
      },
      {
        label: 'Aceptar sin discursos: "Prefiero hablar en el campo"',
        outcome: {
          text: '{capitan} se quita el brazalete y te lo pone él mismo. El domingo sales el primero del túnel.',
          effects: { becomeCaptain: true, teammates: { todos: 4, capitan: 5 }, morale: 6, trust: 3 }
        }
      },
      {
        label: 'Rechazarlo y pedir que {capitan} lo siga llevando, con {veterano} de segundo',
        outcome: {
          text: '"Todavía no es mi momento". {capitan} te mira emocionado y {veterano} asiente. El vestuario entiende el gesto, aunque el míster se queda pensativo.',
          effects: {
            teammates: { capitan: 15, veterano: 10, todos: 4 },
            trust: -2,
            flags: { declinedCaptaincy: true }
          }
        }
      }
    ]
  },
  {
    id: 'capitania-primer-conflicto',
    captain: true,
    once: true,
    title: 'Primer incendio como capitán',
    text: '{rivalPuesto} y {joven} acaban a empujones en el entrenamiento por una entrada fea. Esa misma tarde llega otro problema: la directiva sigue sin pagar las primas prometidas y el vestuario espera que hables tú.',
    options: [
      {
        label: 'Encerrarte con {rivalPuesto} y {joven} hasta que se den la mano',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Les dejas hablar y luego hablas tú. Salen del vestuario juntos y al día siguiente se entienden a la perfección en el rondo.',
            effects: {
              teammates: { rival: 10, joven: 10, todos: 4 },
              trust: 3,
              attributes: { leadership: 1 }
            }
          },
          failure: {
            text: 'La reunión acaba peor que el entrenamiento. Cada uno sale convencido de que estás del lado del otro.',
            effects: { teammates: { rival: -8, joven: -8 }, morale: -4 }
          }
        }
      },
      {
        label: 'Proteger al chaval: "A {joven} no se le toca"',
        outcome: {
          text: '{joven} no olvidará que diste la cara por él. {rivalPuesto} tampoco, aunque por otros motivos.',
          effects: { teammates: { joven: 15, rival: -12 }, morale: 2 }
        }
      },
      {
        label: 'Dejar la pelea para luego y plantarte en el despacho del presidente por las primas',
        check: {
          attribute: 'composure',
          difficulty: 13,
          success: {
            text: 'Sin levantar la voz, recuerdas cada promesa con su fecha y su cifra. El viernes las primas están en la cuenta y el vestuario te recibe como a un héroe.',
            effects: { teammates: { todos: 12 }, money: 25000, trust: -2, reputation: 2 }
          },
          failure: {
            text: 'El presidente te despacha en cinco minutos con un "ya veremos". Vuelves con las manos vacías y la pelea del entrenamiento sigue ahí.',
            effects: { teammates: { todos: -5, rival: -3, joven: -3 }, trust: -4, morale: -3 }
          }
        }
      }
    ]
  },
  {
    id: 'capitania-portavoz',
    captain: true,
    context: { lastResult: ['derrota'] },
    title: 'La voz del vestuario',
    text: 'Otra derrota, {marcador} ante {rival}, y la racha empieza a oler a crisis. El jefe de prensa te avisa: como capitán, hoy te toca a ti ponerte delante de los micrófonos.',
    options: [
      {
        label: 'Asumir la culpa en nombre de toda la plantilla',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Sin excusas: "Los primeros responsables somos los jugadores". La afición agradece la honestidad y el vestuario siente que alguien le cubre la espalda.',
            effects: { teammates: { todos: 8 }, reputation: 4, trust: 3 }
          },
          failure: {
            text: 'Suena a frase hecha, y un periodista te pregunta si eso incluye tus fallos ante la portería. Te quedas en blanco delante de las cámaras.',
            effects: { reputation: -4, morale: -4 }
          }
        }
      },
      {
        label: 'Cerrar filas con el entrenador: "Estamos todos con el míster"',
        outcome: {
          text: 'El míster te lo agradece con un gesto en el entrenamiento. En el vestuario, los que piden su cabeza te miran de otra forma.',
          effects: { trust: 10, teammates: { todos: -6 }, reputation: 1 }
        }
      },
      {
        label: 'Decir alto y claro que algunos no están dando la talla',
        outcome: {
          text: 'El titular es demoledor y el vestuario se revuelve: nadie sabe a quién señalabas, así que todos se dan por aludidos.',
          effects: {
            teammates: { todos: -10 },
            reputation: 3,
            trust: 2,
            flags: { pointedFingers: true }
          }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Compañeros de vestuario
  // -------------------------------------------------------------------------
  {
    id: 'comp-tregua-rival',
    teammate: { role: 'rival', max: 40 },
    title: 'Tregua en el aparcamiento',
    text: '{rivalPuesto} y tú lleváis semanas sin dirigiros la palabra. Hoy te espera junto a tu coche: "Así nos hundimos los dos. ¿Hacemos las paces?".',
    options: [
      {
        label: 'Darle la mano y proponerle que os repartáis los penaltis',
        outcome: {
          text: 'Os dais la mano delante de medio vestuario. Al día siguiente, en el entrenamiento, hasta os buscáis en las combinaciones.',
          effects: { teammates: { rival: 18, todos: 3 }, morale: 4, trust: 2 }
        }
      },
      {
        label: 'Retarle a una tanda de penaltis tras el entrenamiento: el que gane, los tira',
        check: {
          attribute: 'penalties',
          difficulty: 12,
          success: {
            text: 'Cinco de cinco, todos a la escuadra. {rivalPuesto} se ríe, te choca la mano y reconoce que los penaltis son tuyos.',
            effects: { teammates: { rival: 10 }, morale: 4, trust: 2 }
          },
          failure: {
            text: 'Se te va el tercero al poste. Él cumple su parte y tú la tuya: los penaltis son suyos. Al menos ahora os habláis.',
            effects: { teammates: { rival: 12 }, morale: -4 }
          }
        }
      },
      {
        label: 'Seguir a lo tuyo: "El puesto se gana en el campo"',
        outcome: {
          text: '{rivalPuesto} se encoge de hombros y se va. La guerra fría sigue, y el vestuario empieza a cansarse de ella.',
          effects: { teammates: { rival: -10, todos: -3 }, trust: 2, flags: { rivalryOpen: true } }
        }
      }
    ]
  },
  {
    id: 'comp-lesion-rival',
    title: 'El puesto es tuyo',
    text: '{rivalPuesto} se rompe el ligamento de la rodilla en un entrenamiento: tres meses de baja. El míster no se anda con rodeos: "A partir del domingo, el nueve eres tú".',
    options: [
      {
        label: 'Ir a verle al hospital con una camiseta firmada por todo el equipo',
        outcome: {
          text: 'Se le humedecen los ojos al ver las firmas. "Cuídame el puesto, pero no te acostumbres", bromea.',
          effects: { teammates: { rival: 15, todos: 4 }, morale: 3 }
        }
      },
      {
        label: 'Mandarle un mensaje y centrarte en aprovechar la ocasión',
        outcome: {
          text: 'Un "ánimo, crack" y a trabajar. Entrenas como nunca y el míster lo nota; {rivalPuesto}, desde la camilla, también.',
          effects: { teammates: { rival: -5 }, trust: 6 }
        }
      },
      {
        label: 'Prometerle en público que le dedicarás tu primer gol como titular',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Lo marcas en el minuto 20 y corres a la cámara con su dorsal en los dedos. {rivalPuesto} lo ve desde casa con la pierna en alto.',
            effects: { goals: 1, teammates: { rival: 12, todos: 3 }, reputation: 3 }
          },
          failure: {
            text: 'Tres partidos sin ver puerta. La dedicatoria se queda en el aire y {rivalPuesto} lo comenta con ironía en el vestuario.',
            effects: { teammates: { rival: -5 }, morale: -4, reputation: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'comp-consejo-capitan',
    captain: false,
    teammate: { role: 'capitan', min: 40 },
    title: 'Un consejo del capitán',
    text: '{capitan} te aparta al acabar el entrenamiento: "Caes demasiadas veces en fuera de juego. Deja de mirar el balón y fíjate en el último defensa".',
    options: [
      {
        label: 'Escucharle y quedaros a trabajarlo juntos',
        outcome: {
          text: 'Media hora de desmarques con {capitan} haciendo de central. Al final de la semana ya ves la línea antes de que se mueva.',
          effects: { attributes: { offTheBall: 1 }, teammates: { capitan: 12 }, trust: 2 }
        }
      },
      {
        label: 'Agradecérselo y pedirle también consejo para ganarte el vestuario',
        check: {
          attribute: 'leadership',
          difficulty: 10,
          success: {
            text: 'Le pilla por sorpresa, pero le gusta. Te cuenta quién manda de verdad ahí dentro y cómo hablar con cada uno.',
            effects: { teammates: { capitan: 15, todos: 4 }, attributes: { leadership: 1 } }
          },
          failure: {
            text: 'La conversación se alarga y se vuelve incómoda. {capitan} acaba mirando el reloj.',
            effects: { teammates: { capitan: 3 }, morale: -2 }
          }
        }
      },
      {
        label: 'Contestarle que sabes lo que haces',
        outcome: {
          text: '{capitan} levanta las manos y se va sin decir nada. Un par de compañeros lo han oído todo.',
          effects: { teammates: { capitan: -12, todos: -3 }, morale: 2 }
        }
      }
    ]
  },
  {
    id: 'comp-fiesta-amigo',
    teammate: { role: 'amigo', min: 55 },
    title: 'Cumpleaños en la víspera',
    text: '{amigo} cumple años y monta una fiesta en su casa la noche antes del partido. "Si no vienes, me lo tomo como algo personal".',
    options: [
      {
        label: 'Ir y quedarte hasta que se apaguen las luces',
        outcome: {
          text: 'Bailas, cantas y acabas haciendo de DJ. {amigo} dice que es el mejor cumpleaños de su vida; tus piernas, al día siguiente, no opinan lo mismo.',
          effects: { teammates: { amigo: 12 }, morale: 6, trust: -8 }
        }
      },
      {
        label: 'Pasarte un rato, brindar con él y largarte antes de medianoche',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Le das un abrazo, soplas las velas con él y a las once y media estás en la cama. {amigo} lo entiende y se lo agradece.',
            effects: { teammates: { amigo: 6 }, morale: 3 }
          },
          failure: {
            text: 'Una copa lleva a otra y alguien sube un vídeo tuyo bailando encima de la mesa a las tres de la mañana.',
            effects: { teammates: { amigo: 8 }, trust: -6, reputation: -3 }
          }
        }
      },
      {
        label: 'Quedarte en casa y llevarle un regalo al entrenamiento',
        outcome: {
          text: '{amigo} te da las gracias con media sonrisa. Lo entiende, pero se nota que esperaba otra cosa.',
          effects: { teammates: { amigo: -6 }, trust: 3 }
        }
      }
    ]
  },
  {
    id: 'comp-mentor-joven',
    minAge: 25,
    teammate: { role: 'joven', min: 35 },
    title: 'El chaval quiere aprender',
    text: '{joven}, el delantero de la cantera, te espera a la salida del gimnasio. Se nota que le cuesta arrancar: "Juego en tu puesto y quiero aprender de ti. ¿Me echarías una mano?".',
    options: [
      {
        label: 'Tomarlo bajo tu ala: sesiones extra cada semana',
        outcome: {
          text: 'Le enseñas a perfilarse, a pedirla al espacio y a aguantar la presión. Explicándoselo, tú también entiendes mejor tu propio juego.',
          effects: { teammates: { joven: 18, todos: 3 }, attributes: { leadership: 1 }, morale: 3 }
        }
      },
      {
        label: 'Darle un par de consejos y dejar que se busque la vida',
        outcome: {
          text: '"Trabaja más que nadie y no te creas nada de lo que digan los periódicos". {joven} lo apunta en el móvil.',
          effects: { teammates: { joven: 5 } }
        }
      },
      {
        label: 'Pararle los pies: "A mí nadie me regaló nada"',
        outcome: {
          text: '{joven} baja la cabeza y se va. {veterano} comenta en voz alta que tú también fuiste un chaval una vez.',
          effects: { teammates: { joven: -15, veterano: -5, todos: -3 } }
        }
      }
    ]
  },
  {
    id: 'comp-ultima-temporada-veterano',
    minSeason: 3,
    once: true,
    teammate: { role: 'veterano', min: 50 },
    title: 'Una última petición',
    text: '{veterano} anuncia que colgará las botas a final de temporada. En la cena de equipo se sienta a tu lado: "Me quiero despedir con un gol en casa. Si hay un penalti a favor y vamos ganando, déjamelo a mí".',
    options: [
      {
        label: 'Prometérselo y cumplirlo en el último partido en casa',
        outcome: {
          text: 'Minuto 80, penalti y 2-0 en el marcador. Le das el balón a {veterano}, que lo cuela por la escuadra y llora abrazado a ti. El estadio entero se pone en pie.',
          effects: { teammates: { veterano: 20, todos: 6 }, morale: 5, reputation: 3 }
        }
      },
      {
        label: 'Prometerle algo mejor: la asistencia para su gol',
        check: {
          attribute: 'shortPassing',
          difficulty: 12,
          success: {
            text: 'En el último partido en casa te vas de dos rivales y, en lugar de tirar, se la pones a {veterano} en bandeja. Gol, ovación y una foto que acabará enmarcada en su salón.',
            effects: { teammates: { veterano: 18, todos: 5 }, reputation: 3, morale: 4 }
          },
          failure: {
            text: 'Lo intentas toda la tarde, pero ningún pase le llega limpio. {veterano} te da las gracias de todas formas, con una sonrisa algo triste.',
            effects: { teammates: { veterano: 6 }, morale: -2 }
          }
        }
      },
      {
        label: 'Decirle que los penaltis no se regalan',
        outcome: {
          text: '{veterano} asiente en silencio y cambia de tema. El míster aprueba tu profesionalidad; el vestuario, no tanto.',
          effects: { teammates: { veterano: -12, todos: -4 }, trust: 3 }
        }
      }
    ]
  },
  {
    id: 'comp-vestuario-dividido',
    captain: false,
    title: 'Un vestuario partido en dos',
    text: 'Tras una semana de broncas, {capitan} encabeza a los que piden cambios al entrenador, y el míster quiere saber de qué lado está cada uno. Todos te miran: tus goles pesan en este vestuario.',
    options: [
      {
        label: 'Ponerte del lado de {capitan} y del grupo',
        outcome: {
          text: 'Te sientas junto a {capitan} en la reunión. El vestuario sale más unido que nunca; el míster apunta tu nombre en su libreta.',
          effects: { teammates: { capitan: 12, todos: 6 }, trust: -10 }
        }
      },
      {
        label: 'Ponerte del lado del entrenador',
        outcome: {
          text: 'Le das tu apoyo al míster delante de todos. Él no lo olvidará, pero en el vestuario algunos dejan de hablarte.',
          effects: { trust: 10, teammates: { capitan: -12, todos: -6 } }
        }
      },
      {
        label: 'Invitar a cenar a la plantilla y al cuerpo técnico ({dinero:15000} de tu bolsillo)',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Entre el segundo plato y el postre, {capitan} y el míster acaban brindando. La cuenta asusta, pero el vestuario vuelve a remar en la misma dirección.',
            effects: { money: -15000, teammates: { todos: 10, capitan: 6 }, trust: 5, morale: 3 }
          },
          failure: {
            text: 'La comida es excelente, pero cada bando se sienta en un extremo de la mesa. Al menos todos te agradecen la invitación.',
            effects: { money: -15000, teammates: { todos: 3 }, morale: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'comp-venta-amigo',
    teammate: { role: 'amigo', min: 60 },
    title: 'Quieren vender a tu amigo',
    text: 'La prensa da por hecho que el club venderá a {amigo} para cuadrar las cuentas. A la salida del entrenamiento, un periodista te pone el micrófono delante: "¿Qué opinas?".',
    options: [
      {
        label: 'Defenderle en público: "Si se va {amigo}, el club se equivoca"',
        outcome: {
          text: 'El vídeo se hace viral y {amigo} te escribe un mensaje que no vas a olvidar. En los despachos, en cambio, no ha gustado nada.',
          effects: { teammates: { amigo: 18, todos: 4 }, trust: -8, reputation: 2 }
        }
      },
      {
        label: 'Callar ante la prensa y hablar en privado con el director deportivo',
        check: {
          attribute: 'leadership',
          difficulty: 12,
          success: {
            text: 'Le explicas lo que {amigo} significa para el grupo. Una semana después la venta se cae, y solo {amigo} sabe que fuiste tú.',
            effects: { teammates: { amigo: 14 }, trust: -2, flags: { savedFriendTransfer: true } }
          },
          failure: {
            text: 'El director te escucha con educación y te recuerda que las cuentas son las cuentas. {amigo} agradece el intento.',
            effects: { teammates: { amigo: 6 }, trust: -4 }
          }
        }
      },
      {
        label: '"Son decisiones del club. Yo solo pienso en jugar"',
        outcome: {
          text: 'La directiva aprecia tu discreción. {amigo} lee tus palabras en el móvil y tarda días en volver a sentarse a tu lado en el autobús.',
          effects: { teammates: { amigo: -12 }, trust: 4 }
        }
      }
    ]
  },

  // -------------------------------------------------------------------------
  // Excompañeros
  // -------------------------------------------------------------------------
  {
    id: 'ex-llamada-consejo',
    minSeason: 2,
    exTeammate: { min: 60 },
    title: 'Una llamada a medianoche',
    text: '{excompanero}, tu compañero en {exclub}, te llama a medianoche. Le ofrecen un contrato enorme en una liga lejana y no sabe qué hacer: "Tú siempre has tenido la cabeza fría. ¿Qué harías?".',
    options: [
      {
        label: 'Escucharle con calma y ayudarle a decidir',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'Le haces las preguntas que nadie le ha hecho: su familia, su carrera, qué quiere de verdad. Cuelga a las dos de la mañana con las ideas claras y un "te debo una".',
            effects: { exTeammate: 15, morale: 2 }
          },
          failure: {
            text: 'Acabas soltándole un sermón sobre el dinero y la ambición. {excompanero} se despide con frialdad.',
            effects: { exTeammate: -6 }
          }
        }
      },
      {
        label: 'Decirle que se venga a tu club y hablar de él con el director deportivo',
        outcome: {
          text: 'A {excompanero} le encanta la idea. Al director deportivo, bastante menos: te recuerda que para fichar ya tiene a sus ojeadores.',
          effects: { exTeammate: 10, trust: -3, flags: { recommendedExTeammate: true } }
        }
      },
      {
        label: 'Cortar rápido: mañana tienes partido',
        outcome: {
          text: '"Vale, vale, perdona". Duermes ocho horas; {excompanero} tarda meses en volver a llamarte.',
          effects: { exTeammate: -10, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'ex-critica-entrevista',
    minSeason: 2,
    exTeammate: { max: 35 },
    title: 'Dardos desde el pasado',
    text: '{excompanero}, con quien coincidiste en {exclub}, suelta en una entrevista que eres "un egoísta que solo mira sus números". El vídeo corre por todas las redes.',
    options: [
      {
        label: 'Responderle con ironía en la rueda de prensa',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: '"Le deseo lo mejor. Y si quiere, le paso mis números para que los estudie". La sala se ríe y la frase acaba en todos los titulares.',
            effects: { reputation: 4, morale: 3, exTeammate: -5 }
          },
          failure: {
            text: 'Entras al trapo y acabas sacando los trapos sucios de vuestra etapa en {exclub}. La polémica dura semanas.',
            effects: { reputation: -4, trust: -3, exTeammate: -10 }
          }
        }
      },
      {
        label: 'No decir nada y contestar con goles',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Marcas el domingo y pasas por la zona mixta sin decir ni una palabra. No hace falta.',
            effects: { goals: 1, reputation: 3, morale: 4 }
          },
          failure: {
            text: 'Los goles no llegan y la prensa empieza a darle la razón a {excompanero}.',
            effects: { reputation: -3, morale: -4 }
          }
        }
      },
      {
        label: 'Llamarle para hablarlo cara a cara',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'Al tercer intento te lo coge y lo habláis todo: viejas rencillas de {exclub} que ninguno de los dos había cerrado. Acabáis riéndoos.',
            effects: { exTeammate: 18, morale: 3 }
          },
          failure: {
            text: 'Te cuelga a los dos minutos. Al día siguiente, su entorno filtra que le llamaste "para amenazarle".',
            effects: { exTeammate: -8, reputation: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'ex-boda',
    minSeason: 2,
    exTeammate: { min: 60 },
    title: 'Una boda en plena temporada',
    text: '{excompanero}, tu gran amigo de los tiempos de {exclub}, se casa y quiere que seas su testigo. La boda es en otra ciudad, la víspera de un partido de liga.',
    options: [
      {
        label: 'Pedirle permiso al míster para ir y volver esa misma noche',
        check: {
          attribute: 'leadership',
          difficulty: 11,
          success: {
            text: 'El míster accede con una condición: a las nueve en el hotel de concentración. Llegas a tiempo, con la corbata en el bolsillo y {excompanero} feliz.',
            effects: { exTeammate: 15, morale: 6, trust: -2 }
          },
          failure: {
            text: 'El míster se niega en seco. Te quedas, y {excompanero} se lo toma peor de lo que esperabas.',
            effects: { exTeammate: -8, morale: -4 }
          }
        }
      },
      {
        label: 'Ir sin avisar y coger el primer vuelo de vuelta',
        outcome: {
          text: 'Das un discurso que hace llorar a medio salón. A la mañana siguiente llegas al estadio con ojeras, y el míster ya lo sabe todo.',
          effects: { exTeammate: 18, morale: 4, trust: -10 }
        }
      },
      {
        label: 'Disculparte y regalarles el viaje de novios ({dinero:10000})',
        outcome: {
          text: '{excompanero} te escribe desde una playa de postal: "Te perdono. Casi". El míster agradece que no faltes a la concentración.',
          effects: { money: -10000, exTeammate: 5, trust: 2 }
        }
      }
    ]
  },
  {
    id: 'ex-provocacion-partido',
    minSeason: 2,
    exTeammate: {},
    title: 'Reencuentro en el túnel',
    text: 'Hoy juegas contra el equipo de {excompanero}, tu compañero en {exclub}. En el túnel de vestuarios se acerca y te suelta al oído: "Hoy no la hueles, que te conozco".',
    options: [
      {
        label: 'Contestarle con un gol y dedicárselo',
        check: {
          attribute: 'finishing',
          difficulty: 12,
          success: {
            text: 'Gol al cuarto de hora. Corres hacia su banda llevándote la mano a la oreja. {excompanero} no te lo va a perdonar fácilmente.',
            effects: { goals: 1, reputation: 3, morale: 5, exTeammate: -10 }
          },
          failure: {
            text: 'Fallas dos mano a mano y {excompanero} te aplaude con sorna cada vez. La imagen da la vuelta a las redes.',
            effects: { morale: -5, reputation: -2, exTeammate: -3 }
          }
        }
      },
      {
        label: 'Sonreír y darle un abrazo',
        outcome: {
          text: '"Anda, ven aquí". Os reís como en los tiempos de {exclub} y las cámaras captan el momento. Luego, en el campo, cada uno a lo suyo.',
          effects: { exTeammate: 10, reputation: 2, morale: 2 }
        }
      },
      {
        label: 'Devolverle la provocación durante todo el partido',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Le buscas las cosquillas hasta que pierde los nervios y ve la roja por un manotazo. Tu equipo lo aprovecha y el míster disimula una sonrisa.',
            effects: { exTeammate: -15, trust: 4, morale: 3 }
          },
          failure: {
            text: 'El que pierde los nervios eres tú: amarilla por protestar y otra por un codazo. Te vas a la ducha antes del descanso.',
            effects: { exTeammate: -10, trust: -6, morale: -4, reputation: -2 }
          }
        }
      }
    ]
  },
  {
    id: 'ex-negocio',
    minSeason: 3,
    exTeammate: { min: 40 },
    title: 'Un negocio entre amigos',
    text: '{excompanero}, tu compañero en {exclub}, te propone montar juntos una cadena de clubes de pádel. Necesita {dinero:120000} de cada socio y jura que el negocio "se paga solo".',
    options: [
      {
        label: 'Entrar como socio, pero después de revisar las cuentas con lupa',
        check: {
          attribute: 'composure',
          difficulty: 12,
          success: {
            text: 'Detectas un par de gastos inflados, los corregís juntos y abrís el primer club. Un año después ya da beneficios.',
            effects: { money: 60000, exTeammate: 12 }
          },
          failure: {
            text: 'Las cuentas escondían deudas que no supiste ver. Pierdes casi todo, y las conversaciones con {excompanero} se vuelven tensas.',
            effects: { money: -100000, exTeammate: -8 }
          }
        }
      },
      {
        label: 'Poner el dinero sin preguntar: es tu amigo',
        outcome: {
          text: 'Firmas sin leer la letra pequeña. {excompanero} te da un abrazo enorme; del dinero, de momento, ni rastro.',
          effects: { money: -120000, exTeammate: 15, flags: { padelBusiness: true } }
        }
      },
      {
        label: 'Decirle que no mezclas la amistad con el dinero',
        outcome: {
          text: '"Tú te lo pierdes", contesta riéndose. No vuelve a sacar el tema, pero tarda en llamarte.',
          effects: { exTeammate: -8 }
        }
      }
    ]
  },
  {
    id: 'ex-partido-homenaje',
    minSeason: 6,
    exTeammate: { min: 55 },
    title: 'El partido de despedida',
    text: '{excompanero} cuelga las botas y {exclub} le organiza un partido homenaje con los jugadores de aquella plantilla. Te pilla en plena temporada, pero en la invitación ha escrito a mano: "Sin ti no es lo mismo".',
    options: [
      {
        label: 'Ir y servirle en bandeja el último gol de su carrera',
        check: {
          attribute: 'shortPassing',
          difficulty: 11,
          success: {
            text: 'Minuto 89: amagas el disparo y se la pones a {excompanero} en el área pequeña. Gol, lágrimas y un abrazo que sale en todas las portadas.',
            effects: { exTeammate: 20, reputation: 5, morale: 6, trust: -2 }
          },
          failure: {
            text: 'Tu pase se va largo y el partido acaba sin su gol. Aun así, en el centro del campo, {excompanero} te abraza como el primer día.',
            effects: { exTeammate: 10, morale: 3, trust: -2 }
          }
        }
      },
      {
        label: 'Ir solo a saludar a la grada y decir unas palabras',
        outcome: {
          text: 'Coges el micrófono y cuentas una anécdota de vuestra etapa en {exclub}. El estadio ríe, aplaude y corea vuestros nombres.',
          effects: { exTeammate: 12, reputation: 3, morale: 4 }
        }
      },
      {
        label: 'Mandar un vídeo: no puedes saltarte un entrenamiento',
        outcome: {
          text: 'Tu mensaje se proyecta en el videomarcador. {excompanero} lo agradece en redes, aunque a todos les extraña no verte allí.',
          effects: { exTeammate: 4, trust: 2 }
        }
      }
    ]
  }
]
