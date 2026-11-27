import type { ShopItemText } from '../packs'

/**
 * English texts for the shop (`TRAINING_ITEMS` + `SHOP_CATALOG`).
 * Original English writing; what each purchase improves lives in the data.
 */
export const SHOP_ITEMS_EN: Record<string, ShopItemText> = {
  // ─── Private training ────────────────────────────────────────────────────
  'entreno-remate': {
    name: 'Finishing sessions with a former striker',
    description:
      'A former international goalscorer fine-tunes your strike and body shape in front of the keeper.'
  },
  'entreno-juego-aereo': {
    name: 'Aerial game specialist',
    description:
      'A former centre-back teaches you to time your leap, win your position and angle your neck.'
  },
  'entreno-regate': {
    name: 'Dribbling school for tight spaces',
    description: 'Close control, feints and changes of pace in five-by-five-metre cages.'
  },
  'entreno-pase-corto': {
    name: 'Rondos and one-touch play with a former midfielder',
    description:
      'You learn to lay it off with your back to goal and play first-time without losing it.'
  },
  'entreno-pase-largo': {
    name: 'Long-passing workshop',
    description: 'Cross-field switches and balls into space until your instep does it on autopilot.'
  },
  'entreno-desmarque': {
    name: 'Off-the-ball movement coach',
    description:
      'A former centre-forward teaches you to attack the gap between centre-back and full-back.'
  },
  'entreno-sprint': {
    name: 'Sprint sessions on an athletics track',
    description: 'Running technique, block starts and stride work with a former Olympic sprinter.'
  },
  'entreno-pliometria': {
    name: 'Power and plyometrics programme',
    description:
      'Jumps, sled drags and medicine balls for more explosive power in your shot and your leap.'
  },
  'entreno-fondo': {
    name: 'Endurance plan with a distance-running coach',
    description: 'Intervals, thresholds and a heart monitor, so your legs last to the 90th minute.'
  },
  'entreno-prevencion': {
    name: 'Injury prevention programme',
    description: 'Core, proprioception and eccentric work so your body can take the knocks.'
  },
  'entreno-visualizacion': {
    name: 'Mental training through visualisation',
    description:
      'A performance coach teaches you to breathe and rehearse every chance in your head first.'
  },
  'entreno-excapitan': {
    name: "A former captain's mentoring",
    description:
      'A former national captain teaches you to speak up in the dressing room and lead on the pitch.'
  },
  'entreno-corners': {
    name: 'Specialist corner-kick coach',
    description:
      'A hundred corners a session until you can land them at the near post, the penalty spot or short.'
  },
  'entreno-faltas': {
    name: 'Specialist free-kick coaching',
    description:
      'A wall of mannequins, a dead ball and a master of the curling strike by your side.'
  },
  'entreno-penaltis-presion': {
    name: 'Sports psychologist: penalties under pressure',
    description:
      'A spot-kick routine, breathing work and goalkeeper footage so you strike with ice in your veins.'
  },

  // ─── Elite programmes ────────────────────────────────────────────────────
  'entreno-elite-goleador': {
    name: "Goalscorer's camp with a former European top scorer",
    description:
      'One week a month at his country estate: finishing and movement from dawn till dusk.'
  },
  'entreno-elite-faltas': {
    name: 'Your own personal free-kick master',
    description: 'You hire a legend of the bending dead ball, full-time, for the entire season.'
  },
  'entreno-elite-atleta': {
    name: 'High-performance centre for elite athletes',
    description: 'Biomechanics, a physiology lab and Olympic coaches, all just for you.'
  },

  // ─── Catalogue ───────────────────────────────────────────────────────────
  'casa-padres': {
    name: 'Buy your parents a house',
    description:
      'Knowing your family are settled takes a weight off your shoulders. You play with a clear head.'
  },
  'coche-familia': {
    name: 'A new car for the family',
    description: "Your mum won't have to catch two buses to come and watch you play any more."
  },
  fundacion: {
    name: 'Set up a foundation where you grew up',
    description:
      'A proper grass pitch and scholarships for local kids. Your name on more than a shirt.'
  },
  fisioterapeuta: {
    name: 'Hire a personal physiotherapist',
    description: 'Daily recovery and injury-prevention sessions all season long.'
  },
  nutricionista: {
    name: 'Hire a personal nutritionist',
    description: 'A tailored diet, monthly blood tests and goodbye to the takeaways.'
  },
  'preparador-velocidad': {
    name: 'Personal speed coach',
    description: 'A former sprinter sharpens your start and lengthens your stride.'
  },
  psicologo: {
    name: 'Sports psychologist',
    description: 'You learn to handle the pressure of penalties and the boos from the stands.'
  },
  'analista-video': {
    name: 'Your own video analyst',
    description:
      'You study every opposing centre-back before each game: you know where to hurt them.'
  },
  'tecnico-individual': {
    name: 'One-to-one technique coach',
    description: 'Extra hours of close control, first touches and passing after training.'
  },
  caminadora: {
    name: 'Buy a home treadmill',
    description: 'A professional treadmill at home for interval runs on your days off.'
  },
  'gimnasio-casa': {
    name: 'Fit out a gym at home',
    description: 'Weights, machines and a room for strength work without relying on the club.'
  },
  lanzabalones: {
    name: 'Ball-launcher machine',
    description: 'A hundred shots a day from every angle imaginable.'
  },
  crioterapia: {
    name: 'Cryotherapy chamber',
    description: 'Recovery at −110 °C after every single match.'
  },
  'campo-privado': {
    name: 'Your own private training pitch',
    description: 'Your own grass, goals and floodlights. Train whenever and however you like.'
  },
  'clases-cabeza': {
    name: 'Sessions with an aerial-game specialist',
    description: 'A former centre-forward teaches you to time your jump and set your neck.'
  },
  'curso-tactica': {
    name: 'Tactics and game-vision course',
    description: 'You learn to read space and switch play from one flank to the other.'
  },
  'curso-liderazgo': {
    name: 'Speaking and leadership course',
    description: 'Speak with confidence to the dressing room and the press.'
  },
  idiomas: {
    name: 'Language lessons',
    description: 'You can talk to every foreign teammate, and the press warm to you.'
  },

  // ─── Family ──────────────────────────────────────────────────────────────
  'vacaciones-familia': {
    name: 'A holiday with the whole family',
    description:
      "Two weeks in the Caribbean with your parents, your brothers and sisters and your gran. You're back for pre-season fully recharged."
  },
  'partido-benefico': {
    name: 'Organise a charity match',
    description:
      "You round up friends and famous names to raise money for your city's children's hospital."
  },
  'casa-abuelos': {
    name: "Do up your grandparents' house",
    description:
      "Central heating, a new bathroom and a stairlift. Your grandad, who used to take you to training, won't feel the cold any more."
  },
  'fondo-educacion': {
    name: 'An education fund for your children',
    description:
      'School, languages and university paid for, for the children you have or the ones still to come. One less thing to worry about.'
  },
  'restaurante-pueblo': {
    name: 'Open a restaurant in your home town',
    description:
      "Your gran's cooking, your shirts on the walls and jobs for half the neighbourhood."
  },
  'casa-hermanos': {
    name: 'A flat for your siblings',
    description:
      "Your siblings fly the nest without crippling mortgages or impossible rents. At Christmas dinner, you're the hero."
  },
  'casa-playa': {
    name: 'A house by the sea',
    description:
      'A whitewashed house on the Mediterranean to switch off in every break, with family and no cameras.'
  },
  'jet-privado': {
    name: 'A share in a private jet',
    description:
      'Shared flying hours: you see your family on every day off and travel without queues or stopovers.'
  },

  // ─── Personal staff ──────────────────────────────────────────────────────
  'instructor-yoga': {
    name: 'Yoga instructor',
    description: 'Breathing, balance and a calmer head when the final minutes come round.'
  },
  'preparador-estiramientos': {
    name: 'Stretching and mobility specialist',
    description:
      'Half an hour of mobility work before and after every session. Goodbye, pulled muscles.'
  },
  'especialista-sueno': {
    name: 'Sleep-science specialist',
    description:
      'Routines, lighting, temperature and a made-to-measure mattress: you sleep like a log, even after night games.'
  },
  'entrenador-penaltis': {
    name: 'Penalty-taking coach',
    description:
      "A former keeper teaches you to read the goalkeeper's hips and commit to a side before your run-up."
  },
  'especialista-balon-parado': {
    name: 'Attacking set-piece specialist',
    description:
      'Together you break down every corner and free kick: where to attack, when to go and how to lose your marker.'
  },
  'preparador-fuerza': {
    name: 'Explosive strength coach',
    description:
      'Plyometrics, jumps and weighted work: extra inches on your leap and power in your shot.'
  },
  'chef-personal': {
    name: 'Personal chef',
    description:
      'High-performance menus cooked at home every day. Eating right has never tasted so good.'
  },
  'gabinete-comunicacion': {
    name: 'Communications team',
    description: 'Professionals to handle your social media, your interviews and your sponsorships.'
  },
  'mentor-leyenda': {
    name: 'Mentoring from a football legend',
    description:
      'A penalty-box icon stays by your side all season: video, long chats and dressing-room secrets.'
  },

  // ─── Equipment ───────────────────────────────────────────────────────────
  'app-vision': {
    name: 'A vision-training app',
    description:
      'Ten minutes a day on peripheral vision and reaction time. You see the play sooner and decide calmly.'
  },
  'trineo-sprint': {
    name: 'Weighted sled for sprint work',
    description: 'You drag weight uphill to sharpen your acceleration over the first few yards.'
  },
  'botas-medida': {
    name: 'Made-to-measure, cutting-edge boots',
    description:
      'Moulded to your foot, 160 grams, and an upper that caresses the ball. Your first touch takes care of itself.'
  },
  'gafas-vr': {
    name: 'Virtual-reality headset for match study',
    description:
      'Relive every move in first person: where the gap was and when you should have made your run.'
  },
  'tienda-altitud': {
    name: 'Altitude tent',
    description:
      'You sleep at a simulated 3,000 metres. Your lungs will thank you in the 85th minute.'
  },
  'piscina-casa': {
    name: 'A heated swimming pool at home',
    description: 'Active recovery in the water every morning, and lengths to build your endurance.'
  },
  'camara-hiperbarica': {
    name: 'Hyperbaric chamber',
    description:
      'Pressurised oxygen to recover in hours from what used to take days. Knocks no longer linger all week.'
  },
  'clinica-fisio': {
    name: 'Your own physiotherapy clinic',
    description:
      "A centre with the country's best physios and equipment, open to you at any hour (and to your neighbours the rest of the time)."
  },
  'finca-alto-rendimiento': {
    name: 'Estate with a high-performance centre',
    description:
      'Gym, pool, recovery suite and a grass pitch, all on one estate. Your very own training complex.'
  },

  // ─── Education ───────────────────────────────────────────────────────────
  'clases-baile': {
    name: 'Dance lessons',
    description:
      'Coordination, rhythm and light feet. The lads have a laugh... until they see your new step-over.'
  },
  'clases-ajedrez': {
    name: 'Chess lessons with a grandmaster',
    description: 'Thinking three moves ahead. It works in the box, too.'
  },
  'clases-boxeo': {
    name: 'Boxing lessons',
    description:
      'Balance, a supple waist and an upper body that helps you win duels with centre-backs.'
  },
  'media-training': {
    name: 'Media training',
    description:
      'Mock press conferences with real journalists. No trick question catches you off guard any more.'
  },
  'retiro-meditacion': {
    name: 'Meditation retreat',
    description: 'A week of silence in the mountains over the summer. You come back at peace.'
  },
  'curso-entrenador': {
    name: 'Start on your coaching badges',
    description:
      'You start working towards your coaching licences: you see the game as if from the dugout and explain it in the dressing room.'
  }
}
