import type { ShopItem } from './shop'

/** Catálogo de mejoras. Cada temporada la tienda muestra una selección distinta. */
export const SHOP_CATALOG: readonly ShopItem[] = [
  {
    id: 'casa-padres',
    name: 'Comprar una casa a tus padres',
    category: 'Familia',
    description:
      'Saber que tu familia vive tranquila te quita un peso de encima. Juegas con la cabeza despejada.',
    cost: 350_000,
    limit: 'once',
    attributes: { composure: 3 },
    morale: 10
  },
  {
    id: 'coche-familia',
    name: 'Un coche nuevo para la familia',
    category: 'Familia',
    description: 'Tu madre ya no tendrá que coger dos autobuses para ir a verte jugar.',
    cost: 45_000,
    limit: 'once',
    morale: 6
  },
  {
    id: 'fundacion',
    name: 'Crear una fundación en tu barrio',
    category: 'Familia',
    description: 'Un campo de césped y becas para chavales. Tu nombre en algo más que un dorsal.',
    cost: 250_000,
    limit: 'once',
    attributes: { leadership: 3 },
    reputation: 8
  },
  {
    id: 'fisioterapeuta',
    name: 'Contratar un fisioterapeuta personal',
    category: 'Equipo personal',
    description: 'Sesiones diarias de descarga y prevención durante toda la temporada.',
    cost: 90_000,
    limit: 'season',
    attributes: { physique: 3 }
  },
  {
    id: 'nutricionista',
    name: 'Contratar un nutricionista',
    category: 'Equipo personal',
    description: 'Dieta a medida, analíticas mensuales y adiós a la comida rápida.',
    cost: 35_000,
    limit: 'season',
    attributes: { stamina: 2 }
  },
  {
    id: 'preparador-velocidad',
    name: 'Preparador de velocidad',
    category: 'Equipo personal',
    description: 'Un exvelocista te enseña a arrancar y a mejorar tu zancada.',
    cost: 50_000,
    limit: 'season',
    attributes: { pace: 2 }
  },
  {
    id: 'psicologo',
    name: 'Psicólogo deportivo',
    category: 'Equipo personal',
    description: 'Aprendes a gestionar la presión de los penaltis y los silbidos.',
    cost: 40_000,
    limit: 'season',
    attributes: { composure: 2 }
  },
  {
    id: 'analista-video',
    name: 'Analista de vídeo propio',
    category: 'Equipo personal',
    description: 'Estudias a cada central rival antes de cada partido: sabes dónde atacar.',
    cost: 55_000,
    limit: 'season',
    attributes: { offTheBall: 2 }
  },
  {
    id: 'tecnico-individual',
    name: 'Entrenador de técnica individual',
    category: 'Equipo personal',
    description: 'Horas extra de conducción, controles y pases después del entrenamiento.',
    cost: 110_000,
    limit: 'season',
    attributes: { dribbling: 2, shortPassing: 1 }
  },
  {
    id: 'caminadora',
    name: 'Comprar una caminadora',
    category: 'Equipamiento',
    description: 'Una cinta profesional en casa para hacer series los días de descanso.',
    cost: 8_000,
    limit: 'once',
    attributes: { stamina: 1 }
  },
  {
    id: 'gimnasio-casa',
    name: 'Montar un gimnasio en casa',
    category: 'Equipamiento',
    description: 'Pesas, máquinas y una sala para trabajar fuerza sin depender del club.',
    cost: 80_000,
    limit: 'once',
    attributes: { strength: 1, physique: 2 }
  },
  {
    id: 'lanzabalones',
    name: 'Máquina lanzabalones',
    category: 'Equipamiento',
    description: 'Cien remates al día desde todos los ángulos.',
    cost: 25_000,
    limit: 'once',
    attributes: { finishing: 1 }
  },
  {
    id: 'crioterapia',
    name: 'Cámara de crioterapia',
    category: 'Equipamiento',
    description: 'Recuperación a −110 °C después de cada partido.',
    cost: 90_000,
    limit: 'once',
    attributes: { stamina: 2, physique: 1 }
  },
  {
    id: 'campo-privado',
    name: 'Campo de entrenamiento privado',
    category: 'Equipamiento',
    description: 'Tu propio césped con porterías y focos. Entrenas cuando y como quieras.',
    cost: 600_000,
    limit: 'once',
    attributes: { finishing: 3, longPassing: 3, dribbling: 3 }
  },
  {
    id: 'clases-cabeza',
    name: 'Sesiones con un especialista del juego aéreo',
    category: 'Formación',
    description: 'Un exdelantero centro te enseña a medir el salto y a perfilar el cuello.',
    cost: 20_000,
    limit: 'once',
    attributes: { heading: 1 }
  },
  {
    id: 'curso-tactica',
    name: 'Curso de táctica y visión de juego',
    category: 'Formación',
    description: 'Aprendes a leer los espacios y a cambiar el juego de banda a banda.',
    cost: 18_000,
    limit: 'once',
    attributes: { longPassing: 1 }
  },
  {
    id: 'curso-liderazgo',
    name: 'Curso de oratoria y liderazgo',
    category: 'Formación',
    description: 'Hablar en el vestuario y ante la prensa con seguridad.',
    cost: 15_000,
    limit: 'once',
    attributes: { leadership: 1 }
  },
  {
    id: 'idiomas',
    name: 'Clases de idiomas',
    category: 'Formación',
    description: 'Te entiendes con todos los compañeros extranjeros y caes mejor en la prensa.',
    cost: 6_000,
    limit: 'once',
    attributes: { shortPassing: 1 },
    reputation: 2
  },

  // ---------------------------------------------------------------------------
  // Familia
  // ---------------------------------------------------------------------------
  {
    id: 'vacaciones-familia',
    name: 'Vacaciones con toda la familia',
    category: 'Familia',
    description:
      'Dos semanas en el Caribe con tus padres, tus hermanos y la abuela. Vuelves a la pretemporada con las pilas cargadas.',
    cost: 40_000,
    limit: 'season',
    morale: 8
  },
  {
    id: 'partido-benefico',
    name: 'Organizar un partido benéfico',
    category: 'Familia',
    description:
      'Reúnes a amigos y estrellas para recaudar fondos para el hospital infantil de tu ciudad.',
    cost: 30_000,
    limit: 'season',
    morale: 3,
    reputation: 4
  },
  {
    id: 'casa-abuelos',
    name: 'Reformar la casa de tus abuelos',
    category: 'Familia',
    description:
      'Calefacción, un baño nuevo y un ascensor para la escalera. Tu abuelo, que te llevaba a los entrenamientos, ya no tendrá frío.',
    cost: 60_000,
    limit: 'once',
    morale: 6
  },
  {
    id: 'fondo-educacion',
    name: 'Fondo para la educación de tus hijos',
    category: 'Familia',
    description:
      'Colegio, idiomas y universidad pagados para los hijos que tengas o los que vengan. Una preocupación menos.',
    cost: 150_000,
    limit: 'once',
    attributes: { composure: 2 },
    morale: 5,
    minSeason: 6
  },
  {
    id: 'restaurante-pueblo',
    name: 'Abrir un restaurante en tu ciudad natal',
    category: 'Familia',
    description:
      'La cocina de tu abuela, tus camisetas en las paredes y trabajo para medio barrio.',
    cost: 200_000,
    limit: 'once',
    morale: 4,
    reputation: 5,
    minSeason: 3
  },
  {
    id: 'casa-hermanos',
    name: 'Un piso para tus hermanos',
    category: 'Familia',
    description:
      'Tus hermanos se independizan sin hipotecas ni alquileres imposibles. En la cena de Navidad eres el héroe.',
    cost: 280_000,
    limit: 'once',
    attributes: { composure: 2 },
    morale: 8,
    minSeason: 3
  },
  {
    id: 'casa-playa',
    name: 'Una casa junto al mar',
    category: 'Familia',
    description:
      'Una casa blanca frente al Mediterráneo para desconectar en cada parón, con la familia y sin cámaras.',
    cost: 900_000,
    limit: 'once',
    attributes: { composure: 3 },
    morale: 10,
    minSeason: 6
  },
  {
    id: 'jet-privado',
    name: 'Participación en un jet privado',
    category: 'Familia',
    description:
      'Horas de vuelo compartidas: ves a tu familia en cada día libre y viajas sin colas ni escalas.',
    cost: 2_500_000,
    limit: 'once',
    attributes: { stamina: 3 },
    morale: 8,
    reputation: 3,
    minSeason: 10
  },

  // ---------------------------------------------------------------------------
  // Equipo personal (se contrata para una temporada)
  // ---------------------------------------------------------------------------
  {
    id: 'instructor-yoga',
    name: 'Instructor de yoga',
    category: 'Equipo personal',
    description: 'Respiración, equilibrio y una cabeza más tranquila en los minutos finales.',
    cost: 20_000,
    limit: 'season',
    attributes: { composure: 1 }
  },
  {
    id: 'preparador-estiramientos',
    name: 'Preparador de estiramientos y movilidad',
    category: 'Equipo personal',
    description: 'Media hora de movilidad antes y después de cada sesión. Adiós a los tirones.',
    cost: 20_000,
    limit: 'season',
    attributes: { physique: 1 }
  },
  {
    id: 'especialista-sueno',
    name: 'Especialista en sueño',
    category: 'Equipo personal',
    description:
      'Horarios, luz, temperatura y un colchón a medida: duermes como un bebé incluso después de los partidos de noche.',
    cost: 25_000,
    limit: 'season',
    attributes: { stamina: 1 }
  },
  {
    id: 'entrenador-penaltis',
    name: 'Entrenador de penaltis',
    category: 'Equipo personal',
    description:
      'Un exportero te enseña a leer las caderas del rival y a elegir el lado antes de coger carrerilla.',
    cost: 35_000,
    limit: 'season',
    attributes: { composure: 2 }
  },
  {
    id: 'especialista-balon-parado',
    name: 'Especialista en balón parado',
    category: 'Equipo personal',
    description:
      'Estudiáis cada córner y cada falta: dónde atacar, cuándo arrancar y cómo librarte del marcaje.',
    cost: 45_000,
    limit: 'season',
    attributes: { heading: 2 }
  },
  {
    id: 'preparador-fuerza',
    name: 'Preparador de fuerza explosiva',
    category: 'Equipo personal',
    description: 'Pliometría, saltos y lastres: ganas centímetros de salto y potencia de disparo.',
    cost: 50_000,
    limit: 'season',
    attributes: { strength: 2 }
  },
  {
    id: 'chef-personal',
    name: 'Chef personal',
    category: 'Equipo personal',
    description:
      'Menús de alto rendimiento cocinados en casa cada día. Comer bien nunca supo tan bien.',
    cost: 60_000,
    limit: 'season',
    attributes: { stamina: 2 },
    morale: 3
  },
  {
    id: 'gabinete-comunicacion',
    name: 'Gabinete de comunicación',
    category: 'Equipo personal',
    description: 'Profesionales que gestionan tus redes, tus entrevistas y tus patrocinios.',
    cost: 60_000,
    limit: 'season',
    reputation: 5,
    minSeason: 3
  },
  {
    id: 'mentor-leyenda',
    name: 'Mentoría con una leyenda del fútbol',
    category: 'Equipo personal',
    description:
      'Un mito del área te acompaña toda la temporada: vídeo, charlas y secretos de vestuario.',
    cost: 120_000,
    limit: 'season',
    attributes: { leadership: 3 },
    morale: 3,
    minSeason: 6
  },

  // ---------------------------------------------------------------------------
  // Equipamiento
  // ---------------------------------------------------------------------------
  {
    id: 'app-vision',
    name: 'App de entrenamiento visual',
    category: 'Equipamiento',
    description:
      'Diez minutos al día de visión periférica y tiempo de reacción. Ves la jugada antes y decides con calma.',
    cost: 5_000,
    limit: 'once',
    attributes: { composure: 1 }
  },
  {
    id: 'trineo-sprint',
    name: 'Trineo de arrastre para sprints',
    category: 'Equipamiento',
    description: 'Arrastras peso cuesta arriba para ganar aceleración en los primeros metros.',
    cost: 6_000,
    limit: 'once',
    attributes: { pace: 1 }
  },
  {
    id: 'botas-medida',
    name: 'Botas de última generación hechas a medida',
    category: 'Equipamiento',
    description:
      'Molde de tu pie, 160 gramos y un empeine que acaricia el balón. El primer control sale solo.',
    cost: 12_000,
    limit: 'once',
    attributes: { dribbling: 1 }
  },
  {
    id: 'gafas-vr',
    name: 'Gafas de realidad virtual para estudiar partidos',
    category: 'Equipamiento',
    description:
      'Revives cada jugada en primera persona: dónde estaba el hueco y cuándo tenías que arrancar.',
    cost: 15_000,
    limit: 'once',
    attributes: { offTheBall: 1 }
  },
  {
    id: 'tienda-altitud',
    name: 'Tienda de altitud',
    category: 'Equipamiento',
    description: 'Duermes simulando 3.000 metros. Tus pulmones lo agradecen en el minuto 85.',
    cost: 22_000,
    limit: 'once',
    attributes: { stamina: 1 }
  },
  {
    id: 'piscina-casa',
    name: 'Piscina climatizada en casa',
    category: 'Equipamiento',
    description: 'Recuperación activa en el agua cada mañana y largos para ganar fondo.',
    cost: 120_000,
    limit: 'once',
    attributes: { stamina: 3 },
    morale: 3,
    minSeason: 3
  },
  {
    id: 'camara-hiperbarica',
    name: 'Cámara hiperbárica',
    category: 'Equipamiento',
    description:
      'Oxígeno a presión para recuperar en horas lo que antes tardabas días. Los golpes ya no te duran toda la semana.',
    cost: 150_000,
    limit: 'once',
    attributes: { physique: 3 },
    minSeason: 6
  },
  {
    id: 'clinica-fisio',
    name: 'Tu propia clínica de fisioterapia',
    category: 'Equipamiento',
    description:
      'Un centro con los mejores fisios y máquinas del país, abierto para ti a cualquier hora (y para tus vecinos, el resto del día).',
    cost: 380_000,
    limit: 'once',
    attributes: { physique: 3, stamina: 3 },
    reputation: 2,
    minSeason: 6
  },
  {
    id: 'finca-alto-rendimiento',
    name: 'Finca con centro de alto rendimiento',
    category: 'Equipamiento',
    description:
      'Gimnasio, piscina, sala de recuperación y campo de césped en la misma finca. Tu propia ciudad deportiva.',
    cost: 900_000,
    limit: 'once',
    attributes: { strength: 3, stamina: 3, physique: 3 },
    morale: 4,
    minSeason: 10
  },

  // ---------------------------------------------------------------------------
  // Formación
  // ---------------------------------------------------------------------------
  {
    id: 'clases-baile',
    name: 'Clases de baile',
    category: 'Formación',
    description:
      'Coordinación, ritmo y pies ligeros. En el vestuario se ríen... hasta que ven tu nuevo regate.',
    cost: 8_000,
    limit: 'once',
    attributes: { dribbling: 1 }
  },
  {
    id: 'clases-ajedrez',
    name: 'Clases de ajedrez con un gran maestro',
    category: 'Formación',
    description: 'Pensar tres jugadas por delante. En el área también sirve.',
    cost: 9_000,
    limit: 'once',
    attributes: { offTheBall: 1 }
  },
  {
    id: 'clases-boxeo',
    name: 'Clases de boxeo',
    category: 'Formación',
    description:
      'Equilibrio, cintura y un tren superior que te ayuda a ganar los duelos con los centrales.',
    cost: 10_000,
    limit: 'once',
    attributes: { strength: 1 }
  },
  {
    id: 'media-training',
    name: 'Media training',
    category: 'Formación',
    description:
      'Simulacros de rueda de prensa con periodistas de verdad. Ninguna pregunta trampa te pilla ya por sorpresa.',
    cost: 12_000,
    limit: 'once',
    reputation: 4
  },
  {
    id: 'retiro-meditacion',
    name: 'Retiro de meditación',
    category: 'Formación',
    description: 'Una semana de silencio en la montaña durante el verano. Vuelves en paz.',
    cost: 20_000,
    limit: 'once',
    attributes: { composure: 1 },
    morale: 3
  },
  {
    id: 'curso-entrenador',
    name: 'Tus primeros títulos de entrenador',
    category: 'Formación',
    description:
      'Empiezas a sacarte las licencias de entrenador: ves el juego como desde el banquillo y lo explicas en el vestuario.',
    cost: 90_000,
    limit: 'once',
    attributes: { leadership: 2, offTheBall: 1 },
    minSeason: 12
  }
]
