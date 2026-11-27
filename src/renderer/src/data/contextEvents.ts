import type { GameEvent } from './events'

/**
 * Eventos que dependen de lo que acaba de pasar: un fichaje por un grande,
 * llegar a otro país o el resultado del último partido.
 */
export const CONTEXT_EVENTS: readonly GameEvent[] = [
  {
    id: 'nomina-grande',
    once: true,
    context: { newClub: true, minPrestige: 5 },
    title: 'La nómina de un grande',
    text: 'Primer mes en uno de los clubes más grandes del mundo. Abres la app del banco y cuentas los ceros dos veces. En el vestuario nadie habla de dinero: aquí se habla de títulos.',
    options: [
      {
        label: 'Comprar una casa enorme y un coche de lujo para celebrarlo',
        outcome: {
          text: 'La casa sale en una revista y el coche en todas las redes. Al míster no le hace gracia verte llegar con él al entrenamiento.',
          effects: { money: -200000, morale: 8, reputation: 3, trust: -4 }
        }
      },
      {
        label: 'Contratar a un asesor financiero y vivir como hasta ahora',
        check: {
          attribute: 'composure',
          difficulty: 11,
          success: {
            text: 'Inviertes con cabeza y sigues en tu piso de siempre. En el club valoran que no te hayas despistado.',
            effects: { money: 80000, trust: 5, morale: 2 }
          },
          failure: {
            text: 'El asesor resulta ser un amigo de un amigo. Pierdes una buena suma en un negocio que nadie entiende.',
            effects: { money: -60000, morale: -5 }
          }
        }
      },
      {
        label: 'Llamar a tu familia y preguntarles qué necesitan',
        outcome: {
          text: 'Tu madre llora al teléfono y tu padre no sabe qué decir. Pagas la hipoteca de casa y te sientes más ligero que nunca.',
          effects: { money: -90000, morale: 10, attributes: { composure: 1 } }
        }
      }
    ]
  },
  {
    id: 'nuevo-pais',
    context: { newClub: true, abroad: true },
    title: 'Un país nuevo',
    text: 'Nueva ciudad, nuevo idioma y un vestuario que se ríe de chistes que no entiendes. El club te ofrece un profesor particular y un compañero de tu país se ofrece a enseñarte la ciudad.',
    options: [
      {
        label: 'Clases de idioma todos los días, aunque acabes agotado',
        check: {
          attribute: 'leadership',
          difficulty: 10,
          success: {
            text: 'A los tres meses das tu primera entrevista en el idioma local. La grada te adopta.',
            effects: { reputation: 4, trust: 4, attributes: { shortPassing: 1 } }
          },
          failure: {
            text: 'Te cuesta horrores y acabas mezclando palabras en la rueda de prensa. Los memes duran una semana.',
            effects: { reputation: -2, morale: -3 }
          }
        }
      },
      {
        label: 'Rodearte de la gente de tu país en el vestuario',
        outcome: {
          text: 'Te sientes como en casa, pero el resto del vestuario te ve como parte de un grupo cerrado.',
          effects: { morale: 6, trust: -3 }
        }
      },
      {
        label: 'Traerte a tu familia a vivir contigo',
        outcome: {
          text: 'La casa se llena de voces conocidas y la comida de siempre. Te adaptas antes de lo esperado.',
          effects: { money: -30000, morale: 8 }
        }
      }
    ]
  },
  {
    id: 'goleada-a-favor',
    context: { lastResult: ['victoria'], minGoalDiff: 3 },
    title: 'La noche de la goleada',
    text: 'Ganasteis por {marcador} a {rival}. El vestuario es una fiesta y alguien propone salir a celebrarlo por la ciudad. Mañana hay entrenamiento a las diez.',
    options: [
      {
        label: 'Salir con todos y disfrutar del momento',
        outcome: {
          text: 'Una noche para recordar. Al día siguiente el preparador físico os hace correr el doble.',
          effects: { morale: 8, trust: -3 }
        }
      },
      {
        label: 'Una cena tranquila con los veteranos y a casa',
        outcome: {
          text: 'Escuchas historias de otras goleadas y de otras caídas. Te vas a dormir con los pies en el suelo.',
          effects: { morale: 3, trust: 3, attributes: { leadership: 1 } }
        }
      },
      {
        label: 'Pedir calma en las redes: "Esto no ha hecho más que empezar"',
        check: {
          attribute: 'composure',
          difficulty: 10,
          success: {
            text: 'El mensaje gusta a todos: ambición sin soberbia. La prensa te pone de ejemplo.',
            effects: { reputation: 4, trust: 2 }
          },
          failure: {
            text: 'Suena a chulería. La afición de {rival} guarda la captura para la vuelta.',
            effects: { reputation: -2, flags: { tauntedRival: true } }
          }
        }
      }
    ]
  },
  {
    id: 'hat-trick',
    context: { minPlayerGoals: 3 },
    title: 'El balón del hat-trick',
    text: 'Marcaste {goles} goles contra {rival} (resultado final: {marcador}). El utillero te trae el balón del partido firmado por todo el vestuario. Es tuyo.',
    options: [
      {
        label: 'Regalárselo a tu madre',
        outcome: {
          text: 'Lo pone en el salón, en una vitrina que compra al día siguiente. Lo enseña a cada visita.',
          effects: { morale: 8 }
        }
      },
      {
        label: 'Dárselo a un niño de la grada que lloraba de emoción',
        outcome: {
          text: 'El vídeo da la vuelta al país. El niño duerme abrazado al balón.',
          effects: { reputation: 6, morale: 3 }
        }
      },
      {
        label: 'Guardarlo y prometer otro igual el próximo mes',
        check: {
          attribute: 'finishing',
          difficulty: 13,
          success: {
            text: 'Lo cumples con un doblete la semana siguiente. La grada empieza a corear tu promesa.',
            effects: { goals: 2, reputation: 4, morale: 4 }
          },
          failure: {
            text: 'Los goles no llegan y la prensa te recuerda la promesa cada domingo.',
            effects: { reputation: -3, morale: -4 }
          }
        }
      }
    ]
  }
]
