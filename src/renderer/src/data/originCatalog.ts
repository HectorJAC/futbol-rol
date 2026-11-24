import type { Origin } from './origins'

/**
 * Catálogo de orígenes. Cada país tiene uno de cada arquetipo (barrio, academia,
 * herencia y tardío) con sabor local; los orígenes extra valen para cualquier
 * nacionalidad. Todo es ficticio: ni clubes, ni jugadores, ni competiciones reales.
 *
 * Reglas de equilibrio: cada modificador entre -2 y +4, al menos uno negativo,
 * suma neta entre +3 y +5 y entre 3 y 5 atributos tocados.
 */
export const NATIONAL_ORIGINS: readonly Origin[] = [
  // ─── Argentina ───────────────────────────────────────────────────────────
  {
    id: 'arg-potrero',
    nationalityId: 'ARG',
    archetype: 'barrio',
    name: 'Pibe de potrero',
    tagline: 'Aprendiste a gambetear entre piedras, charcos y patadas.',
    story:
      'En el potrero de tu barrio del conurbano bonaerense, las porterías eran dos mochilas y la pelota siempre estaba medio pinchada. Jugabas contra chicos cinco años mayores y aprendiste a no achicarte nunca.',
    advantage: 'Regate endiablado y descaro: no hay defensa que te asuste.',
    drawback: 'Nadie te enseñó a cambiar el juego en largo ni a cuidar tu cuerpo.',
    startAge: 17,
    reputation: 7,
    modifiers: { dribbling: 3, composure: 2, strength: 1, longPassing: -1, physique: -1 },
    clubBond: { tier: 'modesto', tag: 'Su cancha está en tu barrio' }
  },
  {
    id: 'arg-pension',
    nationalityId: 'ARG',
    archetype: 'academia',
    name: 'El chico de la pensión',
    tagline: 'Dejaste tu pueblo a los doce para vivir en un grande.',
    story:
      'Con doce años te subiste a un autobús en un pueblo de Santa Fe rumbo a la pensión de un grande de Buenos Aires. Ocho categorías de inferiores, ocho entrenadores y una sola idea en la cabeza: debutar en Primera.',
    advantage: 'Táctica aprendida desde niño: te mueves y combinas como un veterano.',
    drawback: 'Tanta disciplina te quitó picardía: en el uno contra uno dudas.',
    startAge: 17,
    reputation: 15,
    modifiers: { offTheBall: 3, shortPassing: 2, stamina: 1, dribbling: -1 },
    clubBond: { tier: 'grande', tag: 'Te criaste en su pensión' }
  },
  {
    id: 'arg-hijo-del-tanque',
    nationalityId: 'ARG',
    archetype: 'herencia',
    name: 'El hijo del Tanque',
    tagline: 'Tu padre fue el nueve más querido de Rosario.',
    story:
      'Tu padre, el Tanque, marcó el gol que le dio a un club de Rosario su único campeonato de liga. Todavía hay murales con su cara en el barrio y tú llevas su apellido a la espalda desde que aprendiste a andar.',
    advantage: 'Heredaste su remate y su cabezazo, y media ciudad ya te adora.',
    drawback: 'Cada partido te comparan con él: te pesa la presión y te falta chispa.',
    startAge: 17,
    reputation: 32,
    modifiers: { finishing: 3, heading: 2, strength: 1, pace: -1, composure: -1 },
    clubBond: { tier: 'medio', tag: 'Tu viejo es su ídolo' }
  },
  {
    id: 'arg-liga-regional',
    nationalityId: 'ARG',
    archetype: 'tardio',
    name: 'Albañil de la liga regional',
    tagline: 'Entre semana, ladrillos; los domingos, goles.',
    story:
      'Pasaste la adolescencia trabajando en obras de la Patagonia y jugando la liga regional de Chubut los domingos. A los veinte, un ojeador que iba de paso vio tres goles tuyos en una tarde de viento infernal.',
    advantage: 'La obra te curtió: aguantas cualquier choque y no te cansas nunca.',
    drawback: 'Te faltan años de escuela: tu primer control todavía se va largo.',
    startAge: 20,
    reputation: 4,
    modifiers: { physique: 3, strength: 2, stamina: 1, shortPassing: -1, dribbling: -1 },
    clubBond: { tier: 'modesto', tag: 'Su ojeador iba de paso' }
  },

  // ─── Brasil ──────────────────────────────────────────────────────────────
  {
    id: 'bra-futsal',
    nationalityId: 'BRA',
    archetype: 'barrio',
    name: 'Mago del futsal de favela',
    tagline: 'Tu escuela fue una pista de cemento en lo alto del morro.',
    story:
      'Creciste en una favela de Río de Janeiro jugando al futsal en la pista del morro, con el balón pesado y el rival encima. Allí aprendiste a decidir en medio segundo y a salir de cualquier encierro con un toque.',
    advantage: 'Toque de seda y regate en un palmo: el espacio reducido es tu casa.',
    drawback: 'En campo grande te falta fondo, y por arriba no ganas ni un balón.',
    startAge: 17,
    reputation: 8,
    modifiers: { shortPassing: 3, dribbling: 2, composure: 1, heading: -1, stamina: -1 },
    clubBond: { tier: 'modesto', tag: 'El club que subió al morro' }
  },
  {
    id: 'bra-base-paulista',
    nationalityId: 'BRA',
    archetype: 'academia',
    name: 'Joya de la base paulista',
    tagline: 'Con nueve años ya llevabas el escudo de un grande.',
    story:
      'Te captaron con nueve años en un torneo infantil de São Paulo y desde entonces has vivido en el centro de entrenamiento de un grande. Nutricionistas, psicólogos y un contrato firmado antes de cumplir los catorce.',
    advantage: 'Rápido, con gol y un físico cuidado al milímetro desde niño.',
    drawback: 'Siempre entre algodones: la presión de verdad todavía te viene grande.',
    startAge: 17,
    reputation: 17,
    modifiers: { pace: 3, finishing: 2, physique: 1, composure: -1 },
    clubBond: { tier: 'grande', tag: 'Te firmó con catorce años' }
  },
  {
    id: 'bra-hijo-de-canhao',
    nationalityId: 'BRA',
    archetype: 'herencia',
    name: 'El hijo de Canhão',
    tagline: 'Tu padre tenía el disparo más temido del Nordeste.',
    story:
      'Tu padre, Canhão, fue durante una década el ídolo de un club de Recife gracias a unas faltas directas imposibles. En casa hay un cuarto entero de trofeos y tú practicas golpeos en el patio desde que tenías cuatro años.',
    advantage: 'Golpeo privilegiado: tus disparos y tus faltas llevan su sello.',
    drawback: 'Tienes menos chispa que él, y el juego aéreo nunca fue cosa de familia.',
    startAge: 17,
    reputation: 30,
    modifiers: { strength: 4, finishing: 1, longPassing: 1, pace: -1, heading: -1 },
    clubBond: { tier: 'medio', tag: 'Tu padre es su leyenda' }
  },
  {
    id: 'bra-varzea',
    nationalityId: 'BRA',
    archetype: 'tardio',
    name: 'Goleador de la várzea',
    tagline: 'Repartidor entre semana y rey de los campos de tierra.',
    story:
      'Repartías pedidos en moto por la periferia de São Paulo y los fines de semana marcabas en los campos de tierra de la várzea. A los veintiuno, un ojeador fue a ver a otro jugador y acabó preguntando por ti.',
    advantage: 'Olfato de gol salvaje y piernas de hierro tras años en la tierra.',
    drawback: 'Nadie te enseñó a jugar en equipo: ni levantas la cabeza ni ordenas.',
    startAge: 21,
    reputation: 5,
    modifiers: { finishing: 2, offTheBall: 2, physique: 2, longPassing: -1, leadership: -1 },
    clubBond: { tier: 'modesto', tag: 'Fue a ver a otro y te vio' }
  },

  // ─── España ──────────────────────────────────────────────────────────────
  {
    id: 'esp-plaza-del-pueblo',
    nationalityId: 'ESP',
    archetype: 'barrio',
    name: 'El chaval de la plaza',
    tagline: 'Porterías de piedra y el bar del pueblo como grada.',
    story:
      'Creciste en un pueblo de Jaén donde se jugaba en la plaza, con el portón del ayuntamiento de portería y los abuelos del bar de grada. Jugabas hasta que se iba la luz y, en verano, contra los mozos que volvían de la ciudad.',
    advantage: 'Pillería de pueblo: buscas el hueco, aguantas hasta el final y mandas.',
    drawback: 'Sin entrenadores ni gimnasio: te falta chispa y apenas sabes cabecear.',
    startAge: 17,
    reputation: 6,
    modifiers: { offTheBall: 2, stamina: 2, leadership: 2, pace: -1, heading: -1 },
    clubBond: { tier: 'modesto', tag: 'El equipo de tu comarca' }
  },
  {
    id: 'esp-cantera',
    nationalityId: 'ESP',
    archetype: 'academia',
    name: 'Canterano de toda la vida',
    tagline: 'Diez años en la cantera de un grande, de alevín a juvenil.',
    story:
      'Entraste en la cantera de un grande con siete años y has pasado por todas las categorías, de alevín a juvenil. Rondo tras rondo, te han enseñado que el balón corre más que nadie y que el escudo está por encima del nombre.',
    advantage: 'Pase corto de seda y lectura de juego: el rondo es tu idioma.',
    drawback: 'Físicamente vas justo: los centrales veteranos te pasarán por encima.',
    startAge: 17,
    reputation: 14,
    modifiers: { shortPassing: 4, composure: 1, offTheBall: 1, strength: -1, physique: -1 },
    clubBond: { tier: 'grande', tag: 'Te formaste en su cantera' }
  },
  {
    id: 'esp-hijo-del-capitan',
    nationalityId: 'ESP',
    archetype: 'herencia',
    name: 'Hijo del eterno capitán',
    tagline: 'Tu padre lució el brazalete del club catorce temporadas.',
    story:
      'Tu padre fue el capitán eterno de un club con ambición: catorce temporadas, un ascenso épico y una calle con su nombre. Has crecido en el palco, oyendo a todo el mundo decir que tienes su mismo carácter.',
    advantage: 'Mandas en el vestuario desde el primer día, como hacía él.',
    drawback: 'Tienes su carácter, pero también su poca chispa con el balón en los pies.',
    startAge: 17,
    reputation: 28,
    modifiers: { leadership: 4, heading: 1, composure: 1, pace: -1, dribbling: -1 },
    clubBond: { tier: 'medio', tag: 'Tu padre fue su capitán' }
  },
  {
    id: 'esp-camarero-goleador',
    nationalityId: 'ESP',
    archetype: 'tardio',
    name: 'Camarero y goleador',
    tagline: 'Servías mesas en Lanzarote y marcabas en campos de picón.',
    story:
      'Dejaste los estudios a los dieciséis para servir mesas en un hotel de Lanzarote y jugabas en Regional los domingos, en campos de tierra volcánica. A los diecinueve, un ojeador de vacaciones te vio marcar de chilena.',
    advantage: 'Remate acrobático y la fuerza de quien sabe lo que es currar de verdad.',
    drawback: 'Nunca has entrenado con método: te pierdes cuando el juego se complica.',
    startAge: 19,
    reputation: 4,
    modifiers: { finishing: 3, strength: 2, stamina: 1, offTheBall: -1, shortPassing: -1 },
    clubBond: { tier: 'modesto', tag: 'Te vio un ojeador en chanclas' }
  },

  // ─── Francia ─────────────────────────────────────────────────────────────
  {
    id: 'fra-city-stade',
    nationalityId: 'FRA',
    archetype: 'barrio',
    name: 'Rey del city-stade',
    tagline: 'Una jaula de metal, cinco contra cinco y nadie se rinde.',
    story:
      'Creciste en la banlieue de París, entre torres de doce pisos y el city-stade del barrio, una jaula de metal donde se jugaba a muerte. Allí todos querían ser el más rápido y el más fuerte, y tú aprendiste a ser las dos cosas.',
    advantage: 'Explosivo y fuerte en el duelo: arrancas y nadie te alcanza.',
    drawback: 'Juegas para ti: te cuesta levantar la cabeza y soltar el balón a tiempo.',
    startAge: 17,
    reputation: 7,
    modifiers: { pace: 3, strength: 2, dribbling: 1, shortPassing: -1, composure: -1 },
    clubBond: { tier: 'modesto', tag: 'A dos paradas de tu torre' }
  },
  {
    id: 'fra-centro-de-formacion',
    nationalityId: 'FRA',
    archetype: 'academia',
    name: 'Interno de élite',
    tagline: 'Internado, estudios y doble sesión desde los trece años.',
    story:
      'Con trece años te fuiste interno al centro de formación de un grande francés. Estudiabas por la mañana y entrenabas por la tarde, con vídeo, pizarra y preparador físico: allí te convirtieron en un delantero de manual.',
    advantage: 'Desmarque de libro, buen juego aéreo y un físico trabajado con ciencia.',
    drawback: 'Siempre con red debajo: el día que algo se tuerce, te bloqueas.',
    startAge: 17,
    reputation: 16,
    modifiers: { offTheBall: 2, heading: 2, physique: 2, composure: -1 },
    clubBond: { tier: 'grande', tag: 'Te formó en su internado' }
  },
  {
    id: 'fra-hijo-del-brujo',
    nationalityId: 'FRA',
    archetype: 'herencia',
    name: 'El hijo del Brujo',
    tagline: 'Tu padre hacía magia con la zurda en un club bretón.',
    story:
      'Tu padre, al que la grada llamaba el Brujo, fue el diez que llevó a un club bretón a su primera final de copa. Te enseñó a tocar con las dos piernas antes de que supieras leer, y aún hoy firma más autógrafos que tú.',
    advantage: 'Visión y guante: ves pases que otros delanteros ni imaginan.',
    drawback: 'Eres un nueve con alma de diez: te cuesta pelear en el área.',
    startAge: 17,
    reputation: 29,
    modifiers: { longPassing: 3, shortPassing: 2, composure: 1, heading: -1, strength: -1 },
    clubBond: { tier: 'medio', tag: 'Tu padre sigue siendo su diez' }
  },
  {
    id: 'fra-la-reunion',
    nationalityId: 'FRA',
    archetype: 'tardio',
    name: 'Descubierto en La Reunión',
    tagline: 'Zafra de caña entre semana y goles en la liga de la isla.',
    story:
      'En La Reunión cortabas caña de azúcar con tu tío y jugabas en la liga de la isla, a casi diez mil kilómetros de cualquier ojeador. A los veinte, un vídeo de tus goles llegó por casualidad a un club de la metrópoli y te pagaron el billete.',
    advantage: 'Velocidad de isla y una resistencia forjada bajo el sol tropical.',
    drawback: 'El frío, la táctica y la soledad de la metrópoli te van a costar.',
    startAge: 20,
    reputation: 3,
    modifiers: { stamina: 3, pace: 2, physique: 1, offTheBall: -1, composure: -1 },
    clubBond: { tier: 'modesto', tag: 'Te pagaron el billete de avión' }
  },

  // ─── Inglaterra ──────────────────────────────────────────────────────────
  {
    id: 'eng-sunday-league',
    nationalityId: 'ENG',
    archetype: 'barrio',
    name: 'Niño de la liga dominical',
    tagline: 'A los catorce ya chocabas con hombres hechos y derechos.',
    story:
      'En tu barrio de Liverpool ninguna academia se fijó en ti, así que a los catorce jugabas los domingos en el equipo del pub de tu tío, contra estibadores y fontaneros. Campos embarrados, patadas y balones colgados al área.',
    advantage: 'Duro como una piedra: el barro, las patadas y los balones aéreos son lo tuyo.',
    drawback: 'Tu técnica es de domingo: el regate fino y las paredes no van contigo.',
    startAge: 17,
    reputation: 6,
    modifiers: { heading: 3, physique: 2, composure: 1, dribbling: -1, shortPassing: -1 },
    clubBond: { tier: 'modesto', tag: 'Tu familia lleva su bufanda' }
  },
  {
    id: 'eng-academia-londres',
    nationalityId: 'ENG',
    archetype: 'academia',
    name: 'Producto de la academia',
    tagline: 'GPS en el chaleco y análisis de vídeo desde los siete años.',
    story:
      'Te ficharon con siete años para la academia de un grande de Londres. Has crecido entre datos de GPS, sesiones de vídeo y entrenadores con máster, y llegas al primer equipo con un plan para cada partido.',
    advantage: 'Rápido, incansable y con un desmarque estudiado al milímetro.',
    drawback: 'Siempre te han dicho qué hacer: no sabes tirar del grupo cuando hace falta.',
    startAge: 17,
    reputation: 16,
    modifiers: { pace: 2, offTheBall: 2, stamina: 2, leadership: -1 },
    clubBond: { tier: 'grande', tag: 'Tu academia desde los siete' }
  },
  {
    id: 'eng-hijo-de-big-tommy',
    nationalityId: 'ENG',
    archetype: 'herencia',
    name: 'El hijo de Big Tommy',
    tagline: 'Tu padre es el máximo goleador de la historia de su club.',
    story:
      'Tu padre, Big Tommy, sigue siendo el máximo goleador de la historia de un club del noreste de Inglaterra, y su estatua está junto a la puerta del estadio. Pasaste la infancia en la grada y en pubs donde todavía se cantan sus goles.',
    advantage: 'Hueles el gol como él: siempre apareces donde cae el balón.',
    drawback: 'Eres lento, y los tabloides vigilan cada paso que das fuera del campo.',
    startAge: 17,
    reputation: 33,
    modifiers: { offTheBall: 3, finishing: 2, leadership: 1, pace: -1, composure: -1 },
    clubBond: { tier: 'medio', tag: 'Tu padre tiene allí su estatua' }
  },
  {
    id: 'eng-non-league',
    nationalityId: 'ENG',
    archetype: 'tardio',
    name: 'Electricista y delantero',
    tagline: 'Cables entre semana y goles en el fútbol semiprofesional.',
    story:
      'Te descartaron de una academia a los dieciséis y acabaste de aprendiz de electricista en Birmingham, jugando por cuarenta libras el partido en un equipo semiprofesional. A los veinte, tus goles en la séptima división por fin llamaron la atención.',
    advantage: 'Sabes lo que es caer y levantarte: no te tiembla nada y tiras del grupo.',
    drawback: 'Años lejos del ritmo profesional: te falta velocidad y técnica fina.',
    startAge: 20,
    reputation: 4,
    modifiers: { composure: 2, leadership: 2, finishing: 2, pace: -1, dribbling: -1 },
    clubBond: { tier: 'modesto', tag: 'Te sacaron de la séptima' }
  },

  // ─── Alemania ────────────────────────────────────────────────────────────
  {
    id: 'ger-bolzplatz',
    nationalityId: 'GER',
    archetype: 'barrio',
    name: 'Chico del Bolzplatz',
    tagline: 'Un campo de ceniza en el Ruhr y un balón para todos.',
    story:
      'Creciste en una ciudad minera del Ruhr, hijo de inmigrantes turcos, jugando en el Bolzplatz de ceniza que había detrás de tu bloque. Allí se jugaba sin descanso y sin piedad, y el que perdía volvía a casa con las rodillas peladas.',
    advantage: 'Remate con las dos piernas, regate rápido y pulmones de minero.',
    drawback: 'Te falta pausa: juegas a mil por hora y nunca cambias de ritmo.',
    startAge: 17,
    reputation: 6,
    modifiers: { finishing: 2, dribbling: 2, stamina: 2, composure: -1, longPassing: -1 },
    clubBond: { tier: 'modesto', tag: 'El club de tu bloque' }
  },
  {
    id: 'ger-centro-de-rendimiento',
    nationalityId: 'GER',
    archetype: 'academia',
    name: 'Del centro de rendimiento',
    tagline: 'Pruebas, datos y un plan de desarrollo desde los once años.',
    story:
      'Te detectaron con once años en un centro regional de talentos de Baviera y desde entonces todo ha sido método: pruebas de velocidad, análisis de datos y objetivos por temporada. Te han construido pieza a pieza.',
    advantage: 'Potente, rápido y táctico: un delantero diseñado en laboratorio.',
    drawback: 'Tanto plan te ha restado instinto: en el área a veces piensas demasiado.',
    startAge: 17,
    reputation: 14,
    modifiers: { strength: 2, physique: 2, pace: 1, offTheBall: 1, finishing: -1 },
    clubBond: { tier: 'grande', tag: 'Su método te hizo delantero' }
  },
  {
    id: 'ger-hijo-del-muro',
    nationalityId: 'GER',
    archetype: 'herencia',
    name: 'El hijo del Muro',
    tagline: 'Tu padre fue el central más duro que ha visto Renania.',
    story:
      'Tu padre, al que llamaban el Muro, fue capitán y central de un club de Renania durante quince años sin perderse un partido por lesión. Te ha educado a base de madrugones, disciplina y la idea de que el dolor no existe.',
    advantage: 'Disciplina férrea y un cuerpo de hierro: nunca te rindes.',
    drawback: 'Él te enseñó a cortar balones, no a regatear: con el balón vas tieso.',
    startAge: 17,
    reputation: 27,
    modifiers: { physique: 2, stamina: 2, leadership: 2, heading: 1, dribbling: -2 },
    clubBond: { tier: 'medio', tag: 'Allí tu padre es el Muro' }
  },
  {
    id: 'ger-kreisliga',
    nationalityId: 'GER',
    archetype: 'tardio',
    name: 'Mecánico de la Kreisliga',
    tagline: 'Aprendiz de mecánico y goleador de la liga del distrito.',
    story:
      'Hiciste la formación profesional de mecánico en un taller de Sajonia y jugabas en la Kreisliga por una caja de cervezas al mes. A los veintiuno, tras cuarenta goles en una temporada, un club modesto decidió arriesgarse contigo.',
    advantage: 'Cabezazo demoledor y la cabeza fría de quien no tiene nada que perder.',
    drawback: 'Llegas tarde al ritmo profesional: te falta chispa y fondo.',
    startAge: 21,
    reputation: 3,
    modifiers: { heading: 2, composure: 2, strength: 2, pace: -1, stamina: -1 },
    clubBond: { tier: 'modesto', tag: 'Se arriesgó contigo' }
  },

  // ─── Italia ──────────────────────────────────────────────────────────────
  {
    id: 'ita-oratorio',
    nationalityId: 'ITA',
    archetype: 'barrio',
    name: 'Chico del oratorio',
    tagline: 'El campo de la parroquia, el cura de árbitro y mil partidos.',
    story:
      'Creciste en un barrio de Nápoles jugando en el campito del oratorio, entre la sacristía y la tapia del colegio. Don Ciro, el párroco, te enseñó a engañar al defensa y a no protestar nunca al árbitro, aunque el árbitro fuera él.',
    advantage: 'Picardía napolitana: engañas al central y apareces donde nadie mira.',
    drawback: 'Te falta potencia para la guerra cuerpo a cuerpo con los centrales.',
    startAge: 17,
    reputation: 7,
    modifiers: { offTheBall: 3, dribbling: 1, composure: 1, strength: -1 },
    clubBond: { tier: 'modesto', tag: 'El club de tu parroquia' }
  },
  {
    id: 'ita-vivero',
    nationalityId: 'ITA',
    archetype: 'academia',
    name: 'Discípulo de la táctica',
    tagline: 'Pizarra, vídeo y movimientos sin balón hasta en sueños.',
    story:
      'Entraste con diez años en el vivero de un grande del norte de Italia, donde cada entrenamiento empieza en la pizarra. Te han enseñado a fijar centrales, a jugar de espaldas para los demás y a ganar partidos uno a cero.',
    advantage: 'Inteligencia táctica pura: juegas de espaldas y nunca pierdes la calma.',
    drawback: 'Tanta pizarra y tan poco sprint: te falta punta de velocidad.',
    startAge: 17,
    reputation: 15,
    modifiers: { shortPassing: 2, composure: 2, heading: 1, stamina: 1, pace: -1 },
    clubBond: { tier: 'grande', tag: 'Creciste en su vivero' }
  },
  {
    id: 'ita-hijo-del-halcon',
    nationalityId: 'ITA',
    archetype: 'herencia',
    name: 'Hijo del Halcón de Sicilia',
    tagline: 'Tu padre volaba más alto que nadie en las noches de Palermo.',
    story:
      'Tu padre, el Halcón, marcó más de cien goles de cabeza con un club de Palermo y los bares del puerto todavía tienen su foto. En tu familia el apellido lo es todo, y esperan que lo devuelvas a lo más alto.',
    advantage: 'Salto, timing y potencia: en el área pequeña eres el dueño del aire.',
    drawback: 'Heredaste su juego, también lo malo: poco regate y poca zancada.',
    startAge: 17,
    reputation: 31,
    modifiers: { heading: 4, strength: 1, leadership: 1, dribbling: -1, pace: -1 },
    clubBond: { tier: 'medio', tag: 'Tu padre es su gran ídolo' }
  },
  {
    id: 'ita-pastor-sardo',
    nationalityId: 'ITA',
    archetype: 'tardio',
    name: 'El pastor de Cerdeña',
    tagline: 'Ovejas por la mañana y fútbol de pueblo los domingos.',
    story:
      'Hasta los veinte años cuidaste el rebaño de tu familia en el interior de Cerdeña y jugabas los domingos con el equipo del pueblo, en un campo de tierra con vistas al monte. Un técnico retirado que veraneaba allí no daba crédito.',
    advantage: 'Piernas de monte: disparas como un mulo y no te cansas nunca.',
    drawback: 'Del fútbol táctico no sabes nada: ni desmarques ni paredes.',
    startAge: 20,
    reputation: 3,
    modifiers: { strength: 3, stamina: 2, composure: 1, offTheBall: -1, shortPassing: -1 },
    clubBond: { tier: 'modesto', tag: 'Un veraneante te recomendó' }
  },

  // ─── Japón ───────────────────────────────────────────────────────────────
  {
    id: 'jpn-ribera-del-rio',
    nationalityId: 'JPN',
    archetype: 'barrio',
    name: 'El de los campos del río',
    tagline: 'Echabas carreras a los trenes junto a la ribera de Osaka.',
    story:
      'Al salir de clase corrías a los campos de tierra de la ribera del río, en Osaka, donde nadie te decía qué hacer. Jugabas con oficinistas, abuelos y estudiantes, y cada vez que pasaba un tren por el puente le echabas una carrera.',
    advantage: 'Rápido, atrevido e imprevisible: juegas con la libertad de la calle.',
    drawback: 'Eres ligero como una pluma y cualquier central te mueve.',
    startAge: 17,
    reputation: 5,
    modifiers: { pace: 2, dribbling: 2, offTheBall: 1, physique: -1 },
    clubBond: { tier: 'modesto', tag: 'Entrena al otro lado del río' }
  },
  {
    id: 'jpn-torneo-escolar',
    nationalityId: 'JPN',
    archetype: 'academia',
    name: 'Estrella del torneo escolar',
    tagline: 'Marcaste en la final del campeonato nacional de institutos.',
    story:
      'Te fuiste interno a un instituto de Kagoshima famoso por su equipo: trescientos chicos para once puestos y carreras por la playa al amanecer. Marcaste en la final del campeonato nacional de institutos en Año Nuevo y todo Japón aprendió tu nombre.',
    advantage: 'Disciplina, fondo inagotable y un toque limpio a fuerza de repetición.',
    drawback: 'Eres menudo: los centrales más duros te van a pasar por encima.',
    startAge: 17,
    reputation: 18,
    modifiers: { stamina: 3, shortPassing: 1, composure: 1, leadership: 1, strength: -1 },
    clubBond: { tier: 'grande', tag: 'Te fichó tras la gran final' }
  },
  {
    id: 'jpn-hijo-del-relampago',
    nationalityId: 'JPN',
    archetype: 'herencia',
    name: 'El hijo del Relámpago',
    tagline: 'Tu padre fue el primer gran ídolo de Shizuoka.',
    story:
      'Tu padre, el Relámpago, fue el extremo que llenó estadios con un club de Shizuoka en los primeros años del fútbol profesional japonés. Te despertaba al amanecer para hacer series en la playa, y la prensa te sigue desde que eras un crío.',
    advantage: 'Heredaste su arrancada: en diez metros no te pilla nadie.',
    drawback: 'Cada cámara busca su sombra en ti, y eres frágil en el choque.',
    startAge: 17,
    reputation: 30,
    modifiers: { pace: 3, finishing: 2, dribbling: 1, physique: -1, composure: -1 },
    clubBond: { tier: 'medio', tag: 'Allí tu padre es leyenda' }
  },
  {
    id: 'jpn-liga-de-empresas',
    nationalityId: 'JPN',
    archetype: 'tardio',
    name: 'Oficinista con botas',
    tagline: 'Turnos en la fábrica y goles en la liga de empresas.',
    story:
      'Al acabar el instituto entraste a trabajar en una fábrica de Nagoya y jugabas en el equipo de la empresa, entre turnos y horas extra. A los veinte, un club modesto se fijó en tus goles y tu jefe te dejó marchar con una reverencia.',
    advantage: 'Precisión de fábrica: tu golpeo es exacto, repetido mil veces.',
    drawback: 'Ocho horas de turno al día te han quitado chispa en carrera.',
    startAge: 20,
    reputation: 3,
    modifiers: { finishing: 2, longPassing: 2, composure: 1, pace: -1 },
    clubBond: { tier: 'modesto', tag: 'Te sacó de la fábrica' }
  },

  // ─── Estados Unidos ──────────────────────────────────────────────────────
  {
    id: 'usa-parque-del-barrio',
    nationalityId: 'USA',
    archetype: 'barrio',
    name: 'Rey de la cancha del parque',
    tagline: 'Pachangas de domingo con los padres de tus amigos.',
    story:
      'En el este de Los Ángeles, los domingos se jugaba en el parque del barrio con los padres mexicanos y salvadoreños de tus amigos. Ellos te enseñaron a proteger la pelota con el cuerpo y a no callarte nunca dentro del campo.',
    advantage: 'Proteges el balón como un veterano y no te callas ni debajo del agua.',
    drawback: 'Ni un entrenador en tu vida: tus envíos largos van a cualquier sitio.',
    startAge: 17,
    reputation: 6,
    modifiers: { physique: 2, dribbling: 2, leadership: 1, longPassing: -1 },
    clubBond: { tier: 'modesto', tag: 'El club que fue a tu parque' }
  },
  {
    id: 'usa-residencia',
    nationalityId: 'USA',
    archetype: 'academia',
    name: 'Residente de la academia',
    tagline: 'Residencia, gimnasio de élite y etiqueta de futura estrella.',
    story:
      'Con catorce años te mudaste a la residencia de la academia de una franquicia profesional de Texas, con instituto propio, gimnasio de última generación y torneos por medio mundo. Te venden como el futuro del soccer estadounidense.',
    advantage: 'Atleta de laboratorio: rápido, fuerte y preparado para cualquier ritmo.',
    drawback: 'Mucho gimnasio y poca calle: tu toque todavía es de manual.',
    startAge: 17,
    reputation: 16,
    modifiers: { pace: 2, physique: 2, strength: 1, stamina: 1, shortPassing: -1 },
    clubBond: { tier: 'grande', tag: 'Su residencia fue tu casa' }
  },
  {
    id: 'usa-hijo-del-sheriff',
    nationalityId: 'USA',
    archetype: 'herencia',
    name: 'El hijo del Sheriff',
    tagline: 'Tu padre fue la primera gran estrella de su ciudad.',
    story:
      'Tu padre, el Sheriff, fue el goleador y la cara de un club de Kansas City en los primeros años del fútbol profesional estadounidense. Has crecido entre cámaras, anuncios y campus de verano con su nombre, y ante la prensa te mueves mejor que nadie.',
    advantage: 'Carisma y sangre fría: los focos y las finales no te asustan.',
    drawback: 'Heredaste su carisma, pero no su zancada: te cuesta ganar el espacio.',
    startAge: 17,
    reputation: 28,
    modifiers: { composure: 3, leadership: 2, heading: 1, pace: -1 },
    clubBond: { tier: 'medio', tag: 'Tu padre es su gran estrella' }
  },
  {
    id: 'usa-college',
    nationalityId: 'USA',
    archetype: 'tardio',
    name: 'Estrella universitaria',
    tagline: 'Tres años de liga universitaria y un draft con suerte.',
    story:
      'Llegaste a una universidad de Carolina del Norte con una beca deportiva y la idea de estudiar Empresariales. Tras tres temporadas de goles en la liga universitaria, un club modesto te eligió en el draft y dejaste la carrera a medias.',
    advantage: 'Madurez de vestuario y la preparación física de un atleta universitario.',
    drawback: 'Pocos partidos al año y mucho juego directo: tu regate está oxidado.',
    startAge: 21,
    reputation: 5,
    modifiers: { leadership: 2, stamina: 2, offTheBall: 1, dribbling: -1 },
    clubBond: { tier: 'modesto', tag: 'Te eligió en el draft' }
  }
]

/** Orígenes extra: valen para cualquier nacionalidad y salen al azar en la selección. */
export const EXTRA_ORIGINS: readonly Origin[] = [
  {
    id: 'extra-pivot-futbol-sala',
    nationalityId: null,
    archetype: 'singular',
    name: 'Pívot de fútbol sala',
    tagline: 'De espaldas, en un palmo y con un giro: así marcabas.',
    story:
      'Fuiste el pívot de la selección juvenil de fútbol sala de tu país: de espaldas a portería, protegiendo el balón y girándote para rematar en un palmo. A los diecinueve decidiste probar en el césped y un club se atrevió contigo.',
    advantage: 'Juegas de espaldas como nadie y rematas en cuanto te giras.',
    drawback: 'El campo grande se te hace eterno: te falta fondo y pase largo.',
    startAge: 19,
    reputation: 8,
    modifiers: { finishing: 2, shortPassing: 2, strength: 2, stamina: -1, longPassing: -1 }
  },
  {
    id: 'extra-freestyle',
    nationalityId: null,
    archetype: 'singular',
    name: 'Estrella del freestyle',
    tagline: 'Tres millones de seguidores antes de tu primer contrato.',
    story:
      'Tus vídeos de malabares en la azotea de casa se hicieron virales a los quince y hoy tienes tres millones de seguidores. Las marcas te adoran y los clubes dudan: nadie sabe si eres capaz de jugar un partido de verdad.',
    advantage: 'Control de balón de circo y una fama que ya te abre puertas.',
    drawback: 'Nunca has jugado once contra once en serio: no sabes moverte sin balón.',
    startAge: 18,
    reputation: 25,
    modifiers: { dribbling: 4, shortPassing: 1, composure: 1, offTheBall: -1, physique: -1 }
  },
  {
    id: 'extra-hijo-de-diplomaticos',
    nationalityId: null,
    archetype: 'singular',
    name: 'Hijo de diplomáticos',
    tagline: 'Seis países, cinco idiomas y un balón en cada mudanza.',
    story:
      'Tus padres son diplomáticos y has vivido en Nairobi, Seúl, Buenos Aires, Oslo y El Cairo. En cada país jugaste un fútbol distinto y aprendiste a ganarte cualquier vestuario en una semana.',
    advantage: 'Entiendes cualquier estilo de juego y te ganas cualquier vestuario.',
    drawback: 'Fútbol de colegio internacional: te falta dureza en el choque.',
    startAge: 17,
    reputation: 6,
    modifiers: { longPassing: 2, composure: 2, leadership: 1, strength: -1 }
  },
  {
    id: 'extra-velocista',
    nationalityId: null,
    archetype: 'tardio',
    name: 'Velocista reconvertido',
    tagline: 'Dejaste la pista de atletismo con 10,3 en los cien metros.',
    story:
      'Fuiste campeón juvenil de los cien metros, pero te aburrían los tacos de salida y la soledad de la pista. A los diecinueve te apuntaste a un equipo de tu ciudad para divertirte, y en tres meses ya te seguían los ojeadores.',
    advantage: 'Velocidad de atleta: si hay espacio a la espalda, el balón es tuyo.',
    drawback: 'Tu técnica es de principiante: el balón te bota en cada control.',
    startAge: 19,
    reputation: 5,
    modifiers: { pace: 4, strength: 1, stamina: 1, dribbling: -1, shortPassing: -1 }
  },
  {
    id: 'extra-rodilla-de-acero',
    nationalityId: null,
    archetype: 'singular',
    name: 'El que volvió de la rodilla',
    tagline: 'A los dieciséis te dijeron que no volverías a jugar.',
    story:
      'Eras la gran promesa de tu ciudad hasta que, a los dieciséis, te rompiste el cruzado y el menisco en el mismo partido. Tras dos años de quirófano y rehabilitación, vuelves con una cabeza de acero.',
    advantage: 'Has sobrevivido a lo peor: ninguna presión puede contigo.',
    drawback: 'Has perdido una marcha y tu rodilla nunca volverá a ser la misma.',
    startAge: 18,
    reputation: 9,
    modifiers: { composure: 3, leadership: 2, strength: 1, pace: -1, physique: -1 }
  },
  {
    id: 'extra-futbol-playa',
    nationalityId: null,
    archetype: 'singular',
    name: 'Rey de la arena',
    tagline: 'Chilenas, voleas y arena hasta en las orejas.',
    story:
      'Te criaste jugando al fútbol playa en la costa y a los diecisiete ya eras internacional juvenil de la modalidad. En la arena todo se juega por el aire, y tú aprendiste a rematar de chilena antes que a pasar al pie.',
    advantage: 'Remate acrobático y unas piernas que saltan como muelles.',
    drawback: 'En césped el balón corre demasiado: tu pase raso es un desastre.',
    startAge: 18,
    reputation: 7,
    modifiers: { finishing: 2, strength: 2, heading: 1, shortPassing: -1 }
  },
  {
    id: 'extra-portero-reconvertido',
    nationalityId: null,
    archetype: 'singular',
    name: 'Portero reconvertido',
    tagline: 'Fuiste portero hasta los dieciséis; ahora te toca marcar.',
    story:
      'Jugaste de portero en categorías inferiores hasta que un entrenador te vio rematar en un entrenamiento y te mandó arriba. Sabes cómo piensa el que está bajo palos, por dónde espera el disparo y por dónde no.',
    advantage: 'Conoces los trucos del portero y sabes dónde no espera el disparo.',
    drawback: 'Apenas has jugado con los pies: el regate te resulta extraño.',
    startAge: 17,
    reputation: 4,
    modifiers: { finishing: 2, heading: 2, leadership: 1, dribbling: -1 }
  },
  {
    id: 'extra-hijo-del-puerto',
    nationalityId: null,
    archetype: 'barrio',
    name: 'Hijo del puerto',
    tagline: 'Redes al amanecer y partidos en la explanada del puerto.',
    story:
      'Te levantabas a las cuatro para salir a faenar con tu abuelo y por la tarde jugabas en la explanada del puerto, entre redes y cajas de pescado. El mar te enseñó a esperar tu momento y a aguantar cualquier temporal.',
    advantage: 'Duro y paciente: ni un temporal ni un central te sacan de quicio.',
    drawback: 'Tu técnica es de explanada: el pase corto todavía no es lo tuyo.',
    startAge: 17,
    reputation: 5,
    modifiers: { strength: 2, physique: 2, composure: 1, shortPassing: -1 },
    clubBond: { tier: 'modesto', tag: 'El club de tu puerto' }
  },
  {
    id: 'extra-el-otro-gemelo',
    nationalityId: null,
    archetype: 'singular',
    name: 'El otro gemelo',
    tagline: 'Tu hermano gemelo ya es profesional; ahora te toca a ti.',
    story:
      'Tu hermano gemelo y tú jugasteis juntos toda la vida, combinando de memoria en cada categoría. Él firmó primero con un grande y salió en las portadas; tú has tenido que esperar tu turno a la sombra de su nombre.',
    advantage: 'Combinas de memoria y lees a tus compañeros como a tu hermano.',
    drawback: 'Siempre has sido "el hermano de": te cuesta dar un paso al frente.',
    startAge: 17,
    reputation: 12,
    modifiers: { shortPassing: 2, offTheBall: 2, composure: 1, leadership: -1 },
    clubBond: { tier: 'grande', tag: 'Tu gemelo ya juega allí' }
  },
  {
    id: 'extra-hijo-del-utillero',
    nationalityId: null,
    archetype: 'singular',
    name: 'Hijo del utillero',
    tagline: 'Creciste entre botas, petos y olor a linimento.',
    story:
      'Tu padre es el utillero de un grande y has pasado la infancia en su vestuario, recogiendo balones y escuchando las charlas de los mejores. Conoces todos los secretos del club, aunque ningún entrenador te ha regalado nada.',
    advantage: 'Has crecido en un vestuario: entiendes el juego y a cada compañero.',
    drawback: 'Siempre fuiste el más pequeño del grupo y todavía te falta cuerpo.',
    startAge: 17,
    reputation: 6,
    modifiers: { composure: 2, shortPassing: 2, leadership: 1, physique: -1 },
    clubBond: { tier: 'grande', tag: 'Creciste en su vestuario' }
  }
]
