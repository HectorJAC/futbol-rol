import type { OriginText } from '../packs'

/**
 * English texts for the origins (`NATIONAL_ORIGINS` + `EXTRA_ORIGINS`).
 * Original English writing for the same stories; the mechanics live in the data.
 */
export const ORIGINS_EN: Record<string, OriginText> = {
  // ─── Argentina ───────────────────────────────────────────────────────────
  'arg-potrero': {
    name: 'The Potrero Kid',
    tagline: 'You learnt to dribble dodging stones, puddles and studs.',
    story:
      'On the scrap of waste ground in your corner of Greater Buenos Aires, the goals were two school bags and the ball was always half flat. You played against lads five years older and learnt never to shrink from anyone.',
    advantage: 'Devilish feet and plenty of cheek: no defender frightens you.',
    drawback: 'Nobody taught you to switch play long or how to look after your body.',
    clubBondTag: "Their ground's in your barrio"
  },
  'arg-pension': {
    name: 'The Boarding-House Boy',
    tagline: 'At twelve you left home to board at one of the big clubs.',
    story:
      'Aged twelve, you climbed onto a coach in a small Santa Fe town bound for the youth digs of a Buenos Aires giant. Eight age groups, eight coaches and one thought in your head the whole way: a first-team debut.',
    advantage: 'Tactics drilled in since childhood: you move and link play like a veteran.',
    drawback: 'All that discipline cost you your cunning: one-on-one, you dither.',
    clubBondTag: 'You grew up in their digs'
  },
  'arg-hijo-del-tanque': {
    name: 'Son of the Tank',
    tagline: 'Your father was the best-loved number nine in Rosario.',
    story:
      "Your father, the Tank, scored the goal that won a Rosario club its only league title. His face still covers murals all over the neighbourhood, and you've worn his surname on your back since you could walk.",
    advantage: 'His finishing and heading are in your blood, and half the city adores you.',
    drawback: "Every match you're measured against him; the pressure tells and you lack pace.",
    clubBondTag: "Your old man's their idol"
  },
  'arg-liga-regional': {
    name: 'The Regional-League Bricklayer',
    tagline: 'Laying bricks all week, scoring goals on Sundays.',
    story:
      'You spent your teens on Patagonian building sites, turning out for a Chubut regional-league side every Sunday. At twenty, a scout who happened to be passing through watched you score a hat-trick in a howling gale.',
    advantage: 'The building site toughened you up: you ride any challenge and never tire.',
    drawback: 'Years of coaching missed: your first touch still gets away from you.',
    clubBondTag: 'Their scout was passing by'
  },

  // ─── Brazil ──────────────────────────────────────────────────────────────
  'bra-futsal': {
    name: 'The Favela Futsal Wizard',
    tagline: 'Your classroom was a concrete court high up the hillside.',
    story:
      "You grew up in a Rio de Janeiro favela playing futsal on the hillside court, with a heavy ball and an opponent breathing down your neck. That's where you learnt to decide in half a second and slip out of any trap with one touch.",
    advantage: 'A silken touch and feet that could turn in a phone box: tight spaces are home.',
    drawback: 'On a full-size pitch you run out of puff, and you win nothing in the air.',
    clubBondTag: 'The club that came up the hill'
  },
  'bra-base-paulista': {
    name: 'The Paulista Prodigy',
    tagline: "At nine, you were already wearing a big club's badge.",
    story:
      "A big club snapped you up at a São Paulo kids' tournament when you were nine, and you've lived at their training centre ever since. Nutritionists, psychologists and a contract signed before your fourteenth birthday.",
    advantage: 'Quick, clinical, and a body fine-tuned since you were small.',
    drawback: 'Wrapped in cotton wool all your life: real pressure is still too much for you.',
    clubBondTag: 'Had you signed by fourteen'
  },
  'bra-hijo-de-canhao': {
    name: 'Son of Canhão',
    tagline: 'Your father had the most feared shot in the Northeast.',
    story:
      "Your father, Canhão, was a Recife club's idol for a decade thanks to free kicks that seemed impossible. There's a whole room of trophies at home, and you've been hammering balls against the yard wall since you were four.",
    advantage: 'A gifted striker of the ball: your shots carry his trademark venom.',
    drawback: "You're not as sharp off the mark as he was, and heading never ran in the family.",
    clubBondTag: "Your father's their legend"
  },
  'bra-varzea': {
    name: 'The Várzea Goal-Getter',
    tagline: 'Delivery rider by week, king of the dirt pitches by weekend.',
    story:
      "You delivered orders by motorbike around the outskirts of São Paulo and banged in goals on the várzea's dirt pitches at weekends. At twenty-one, a scout came to watch somebody else and left asking about you.",
    advantage: 'A feral nose for goal and iron legs from years on bare earth.',
    drawback: 'Nobody taught you to play for the team: you rarely look up and never organise.',
    clubBondTag: 'Came for someone else, saw you'
  },

  // ─── Spain ───────────────────────────────────────────────────────────────
  'esp-plaza-del-pueblo': {
    name: 'The Village Square Lad',
    tagline: 'Stone goalposts, and the village bar for a grandstand.',
    story:
      'You grew up in a village in Jaén where football meant the square: the town-hall doors for a goal and the old boys outside the bar for a crowd. You played until the light went and, in summer, against the young men back from the city.',
    advantage: 'Village street-smarts: you find the gap, last the distance and call the shots.',
    drawback: 'No coaches, no gym: you lack a burst of pace and can barely head a ball.',
    clubBondTag: "Your district's own club"
  },
  'esp-cantera': {
    name: 'A Lifelong Academy Boy',
    tagline: "Ten years in a giant's academy, from under-elevens to the youth side.",
    story:
      "You joined a giant's academy at seven and have climbed through every age group since. Rondo after rondo, they drummed two lessons into you: the ball always runs faster than any player, and the badge matters more than the name on the back.",
    advantage: 'Silky short passing and a reader of the game: you speak fluent rondo.',
    drawback: "Physically you're short of it: seasoned centre-backs will walk all over you.",
    clubBondTag: 'A product of their academy'
  },
  'esp-hijo-del-capitan': {
    name: 'Son of the Forever Captain',
    tagline: "Your father wore the club's armband for fourteen seasons.",
    story:
      "Your father was the eternal captain of an ambitious club: fourteen seasons, one legendary promotion and a street named after him. You grew up in the directors' box, hearing everyone say you've got his temperament.",
    advantage: 'You run the dressing room from day one, just as he did.',
    drawback: "You've got his character, but also his lack of zip with the ball at your feet.",
    clubBondTag: 'Your father was their captain'
  },
  'esp-camarero-goleador': {
    name: 'The Goalscoring Waiter',
    tagline: 'Waiting tables in Lanzarote, scoring on volcanic-gravel pitches.',
    story:
      'You left school at sixteen to wait tables in a Lanzarote hotel and played regional football on Sundays, on pitches of black volcanic grit. At nineteen, a scout on holiday saw you score with an overhead kick.',
    advantage: 'Acrobatic finishing and the power of someone who knows what graft really means.',
    drawback: "You've never trained properly: when the game gets complicated, you get lost.",
    clubBondTag: 'Spotted by a scout in flip-flops'
  },

  // ─── France ──────────────────────────────────────────────────────────────
  'fra-city-stade': {
    name: 'King of the City-Stade',
    tagline: 'A steel cage, five-a-side, and nobody ever gives up.',
    story:
      "You grew up in the Paris banlieue, among twelve-storey tower blocks and the estate's city-stade, a metal cage where every game was life or death. Everyone there wanted to be the quickest and the strongest, and you learnt to be both.",
    advantage: 'Explosive and strong in the duel: once you go, nobody catches you.',
    drawback: 'You play for yourself: you struggle to look up and release the ball in time.',
    clubBondTag: 'Two stops from your block'
  },
  'fra-centro-de-formacion': {
    name: 'The Elite Boarder',
    tagline: 'Boarding, lessons and double sessions from the age of thirteen.',
    story:
      "At thirteen you moved into the boarding academy of one of France's big clubs. Lessons in the morning, training in the afternoon, with video, whiteboard and a fitness coach: there they turned you into a textbook centre-forward.",
    advantage: 'Textbook movement, a strong aerial game and a body built by sports science.',
    drawback: 'Always with a safety net: the day things go wrong, you freeze.',
    clubBondTag: 'You boarded at their academy'
  },
  'fra-hijo-del-brujo': {
    name: 'Son of the Sorcerer',
    tagline: 'Your father worked magic with his left foot at a Breton club.',
    story:
      'Your father, known on the terraces as the Sorcerer, was the number ten who took a Breton club to its first cup final. He had you using both feet before you could read, and he still signs more autographs than you do.',
    advantage: 'Vision and a velvet glove: you see passes other strikers never dream of.',
    drawback: "A number nine with a ten's soul: you'd rather not scrap in the box.",
    clubBondTag: "Your father's still their No. 10"
  },
  'fra-la-reunion': {
    name: 'Discovered on Réunion',
    tagline: 'Cutting cane all week, scoring goals in the island league.',
    story:
      'On Réunion you cut sugar cane with your uncle and played in the island league, nearly ten thousand kilometres from the nearest scout. At twenty, a video of your goals found its way by chance to a club on the mainland, and they paid for your ticket.',
    advantage: 'Island-bred speed and an engine forged under the tropical sun.',
    drawback: 'The cold, the tactics and the loneliness of the mainland will take their toll.',
    clubBondTag: 'They paid for your plane ticket'
  },

  // ─── England ─────────────────────────────────────────────────────────────
  'eng-sunday-league': {
    name: 'The Sunday League Kid',
    tagline: 'At fourteen you were already clattering into grown men.',
    story:
      "No academy ever looked twice at you in your corner of Liverpool, so at fourteen you were turning out on Sundays for your uncle's pub team against dockers and plumbers. Mud-bath pitches, flying tackles and high balls lumped into the box.",
    advantage: 'Hard as nails: mud, kicks and aerial bombardments are your natural habitat.',
    drawback: "Your touch is pure Sunday league: fancy dribbles and one-twos aren't you.",
    clubBondTag: 'Your family wear their scarf'
  },
  'eng-academia-londres': {
    name: 'London Academy Product',
    tagline: 'A GPS vest on your back and video analysis since you were seven.',
    story:
      "One of London's big clubs signed you for their academy at seven. You grew up on GPS data, video sessions and coaches with master's degrees, and you reach the first team with a plan for every match.",
    advantage: 'Quick, tireless and with movement studied down to the last yard.',
    drawback: "You've always been told what to do: you can't drag the team along when it counts.",
    clubBondTag: 'Your academy since you were seven'
  },
  'eng-hijo-de-big-tommy': {
    name: 'Son of Big Tommy',
    tagline: "Your father is his club's all-time record goalscorer.",
    story:
      'Your father, Big Tommy, is still the all-time top scorer at a club in the North East of England, and his statue stands beside the stadium gates. You spent your childhood on the terraces and in pubs where they still sing about his goals.',
    advantage: "You sniff out goals like he did: you're always where the ball drops.",
    drawback: "You're slow, and the tabloids watch your every step off the pitch.",
    clubBondTag: "Your father's statue stands there"
  },
  'eng-non-league': {
    name: 'The Non-League Sparky',
    tagline: 'Wiring houses all week, scoring goals in the semi-pro game.',
    story:
      "An academy released you at sixteen and you ended up an apprentice electrician in Birmingham, playing for forty quid a game for a semi-pro side. At twenty, your goals in the seventh tier finally caught someone's eye.",
    advantage: "You've been knocked down and got back up: nothing fazes you and you lead the line.",
    drawback: 'Years away from the professional tempo: you lack pace and finesse.',
    clubBondTag: 'Found you in the seventh tier'
  },

  // ─── Germany ─────────────────────────────────────────────────────────────
  'ger-bolzplatz': {
    name: 'The Bolzplatz Kid',
    tagline: 'An ash pitch in the Ruhr and one ball between everyone.',
    story:
      'The son of Turkish immigrants, you grew up in a Ruhr mining town playing on the cinder Bolzplatz behind your block of flats. Games there were relentless and merciless, and whoever lost went home with skinned knees.',
    advantage: "You finish with either foot, dribble at speed and have a miner's lungs.",
    drawback: "You lack calm: it's all a hundred miles an hour, and you never switch play.",
    clubBondTag: "Your block's own club"
  },
  'ger-centro-de-rendimiento': {
    name: 'Performance Centre Product',
    tagline: 'Tests, data and a development plan since the age of eleven.',
    story:
      'A regional talent centre in Bavaria picked you out at eleven, and since then everything has been method: speed testing, data analysis and targets for every season. They have built you piece by piece.',
    advantage: 'Powerful, quick and tactically sharp: a striker designed in a lab.',
    drawback: 'So much planning has dulled your instinct: in the box you sometimes overthink.',
    clubBondTag: 'Their method made you a striker'
  },
  'ger-hijo-del-muro': {
    name: 'Son of the Wall',
    tagline: 'Your father was the hardest centre-back the Rhineland ever saw.',
    story:
      'Your father, known as the Wall, captained a Rhineland club from centre-back for fifteen years without missing a single game through injury. He raised you on early alarms, discipline and the belief that pain does not exist.',
    advantage: 'Iron discipline and a body to match: you never, ever give up.',
    drawback: "He taught you to win the ball, not to beat a man: on the ball you're stiff.",
    clubBondTag: 'Your father is their Wall'
  },
  'ger-kreisliga': {
    name: 'The Kreisliga Mechanic',
    tagline: 'Apprentice mechanic and top scorer in the district league.',
    story:
      'You trained as a mechanic at a garage in Saxony and played in the Kreisliga for a crate of beer a month. At twenty-one, after forty goals in a single season, a small club decided to take a punt on you.',
    advantage: 'A thunderous header and the cool head of a man with nothing to lose.',
    drawback: "You're late to the pro game: you lack a burst and a big engine.",
    clubBondTag: 'They took a punt on you'
  },

  // ─── Italy ───────────────────────────────────────────────────────────────
  'ita-oratorio': {
    name: 'The Parish Pitch Kid',
    tagline: 'The parish pitch, the priest as referee and a thousand games.',
    story:
      "You grew up in a Naples neighbourhood playing on the oratorio's little pitch, squeezed between the sacristy and the school wall. Don Ciro, the parish priest, taught you to fool a defender and never to argue with the referee, even when the referee was him.",
    advantage: 'Neapolitan guile: you con the centre-back and pop up where no one is looking.',
    drawback: 'You lack the power for hand-to-hand combat with centre-backs.',
    clubBondTag: 'The club from your parish'
  },
  'ita-vivero': {
    name: 'A Disciple of Tactics',
    tagline: 'Whiteboards, video and off-the-ball runs even in your dreams.',
    story:
      'At ten you joined the nursery of a giant in northern Italy, where every session starts at the whiteboard. They taught you to pin centre-backs, to play with your back to goal for others, and to win games one-nil.',
    advantage: 'Pure tactical intelligence: you hold the ball up and never lose your cool.',
    drawback: 'All that whiteboard, so little sprinting: you lack top-end speed.',
    clubBondTag: 'Raised in their nursery'
  },
  'ita-hijo-del-halcon': {
    name: 'Son of the Sicilian Falcon',
    tagline: "Your father flew higher than anyone on Palermo's big nights.",
    story:
      'Your father, the Falcon, scored over a hundred headers for a Palermo club, and his photo still hangs in the bars down by the harbour. In your family the name is everything, and they expect you to restore it to the top.',
    advantage: 'Spring, timing and power: in the six-yard box, you own the air.',
    drawback: 'You inherited his game, flaws and all: little dribbling and a short stride.',
    clubBondTag: "Your father's their hero"
  },
  'ita-pastor-sardo': {
    name: 'The Sardinian Shepherd',
    tagline: 'Sheep in the morning, village football on Sundays.',
    story:
      "Until you were twenty you tended your family's flock in the Sardinian interior, and on Sundays you played for the village team on a dirt pitch overlooking the hills. A retired coach spending his summer there couldn't believe his eyes.",
    advantage: 'Mountain legs: you shoot like a mule kicks and you never tire.',
    drawback: 'You know nothing of tactics: no clever runs, no one-twos.',
    clubBondTag: 'A holidaymaker tipped them off'
  },

  // ─── Japan ───────────────────────────────────────────────────────────────
  'jpn-ribera-del-rio': {
    name: 'The Riverside Pitch Kid',
    tagline: 'You used to race the trains along the riverbank in Osaka.',
    story:
      'After school you ran straight to the dirt pitches on the Osaka riverbank, where nobody told you what to do. You played with office workers, grandads and students, and whenever a train rattled over the bridge, you raced it.',
    advantage: 'Quick, daring and unpredictable: you play with the freedom of the street.',
    drawback: "You're light as a feather and any centre-back can shift you.",
    clubBondTag: 'They train across the river'
  },
  'jpn-torneo-escolar': {
    name: 'High-School Tournament Star',
    tagline: 'You scored in the final of the national high-school championship.',
    story:
      'You boarded at a Kagoshima high school famous for its football team: three hundred boys for eleven places and runs along the beach at dawn. You scored in the national high-school final at New Year, and the whole of Japan learnt your name.',
    advantage: 'Discipline, a bottomless engine and a clean touch honed by endless repetition.',
    drawback: "You're slightly built, and the toughest centre-backs will bully you.",
    clubBondTag: 'Signed you after the big final'
  },
  'jpn-hijo-del-relampago': {
    name: 'Son of the Lightning Bolt',
    tagline: "Your father was Shizuoka's first great football idol.",
    story:
      'Your father, the Lightning Bolt, was the winger who packed out stadiums for a Shizuoka club in the early days of the Japanese professional game. He woke you at dawn for sprint reps on the beach, and the press have followed you since you were a nipper.',
    advantage: 'You inherited his acceleration: over ten yards, nobody catches you.',
    drawback: "Every camera looks for his shadow in you, and you're fragile in contact.",
    clubBondTag: "Your father's a legend there"
  },
  'jpn-liga-de-empresas': {
    name: 'The Works-Team Striker',
    tagline: 'Factory shifts and goals in the corporate league.',
    story:
      'After high school you went to work at a factory in Nagoya and played for the company team between shifts and overtime. At twenty, a small club noticed your goals, and your boss let you go with a deep bow.',
    advantage: 'Factory precision: your striking is exact, repeated a thousand times.',
    drawback: 'Eight-hour shifts every day have taken the zip out of your running.',
    clubBondTag: 'Pulled you off the line'
  },

  // ─── USA ─────────────────────────────────────────────────────────────────
  'usa-parque-del-barrio': {
    name: 'King of the Park Pitch',
    tagline: "Sunday kickabouts in the park with your friends' dads.",
    story:
      "In East Los Angeles, Sundays meant games in the neighbourhood park with your friends' Mexican and Salvadoran dads. They taught you to shield the ball with your body and never to keep quiet on the pitch.",
    advantage: 'You shield the ball like a veteran and never, ever stop talking.',
    drawback: 'Never had a coach in your life: your long balls could end up anywhere.',
    clubBondTag: 'The club that came to your park'
  },
  'usa-residencia': {
    name: 'The Residency Prospect',
    tagline: "A residency, an elite gym and the 'future star' label stuck on you.",
    story:
      "At fourteen you moved into the academy residence of a Texas pro franchise, complete with its own high school, a state-of-the-art gym and tournaments halfway round the world. They're selling you as the future of American soccer.",
    advantage: 'A lab-grown athlete: quick, strong and conditioned for any tempo.',
    drawback: 'Plenty of gym, not much street: your touch is still by the book.',
    clubBondTag: 'Their residence was your home'
  },
  'usa-hijo-del-sheriff': {
    name: 'Son of the Sheriff',
    tagline: "Your father was his city's first real football star.",
    story:
      'Your father, the Sheriff, was the goalscorer and the face of a Kansas City club in the early years of American pro soccer. You grew up among cameras, adverts and summer camps bearing his name, and nobody handles the press better than you.',
    advantage: "Charisma and ice in your veins: bright lights and finals don't scare you.",
    drawback: 'You got his charisma but not his stride: getting in behind is a struggle.',
    clubBondTag: "Your father's their biggest star"
  },
  'usa-college': {
    name: 'The College Soccer Star',
    tagline: 'Three years of college soccer and a lucky draft pick.',
    story:
      'You arrived at a North Carolina university on a sports scholarship, planning to study business. After three seasons of goals in college soccer, a small club picked you in the draft and you left your degree half-finished.',
    advantage: 'Dressing-room maturity and the conditioning of a college athlete.',
    drawback: 'Few games a year and lots of long-ball football: your dribbling is rusty.',
    clubBondTag: 'Picked you in the draft'
  },

  // ─── Extra origins ───────────────────────────────────────────────────────
  'extra-pivot-futbol-sala': {
    name: 'The Futsal Pivot',
    tagline: "Back to goal, no room and a quick turn: that's how you scored.",
    story:
      "You were the pivot for your country's youth futsal team: back to goal, shielding the ball and spinning to shoot in the tiniest of spaces. At nineteen you decided to try your luck on grass, and one club was brave enough to take you on.",
    advantage: 'Brilliant with your back to goal, and you shoot the instant you turn.',
    drawback: 'A full-size pitch feels endless: you lack stamina and a long pass.'
  },
  'extra-freestyle': {
    name: 'The Freestyle Sensation',
    tagline: 'Three million followers before your first contract.',
    story:
      "Your keepy-uppy videos on the roof of your building went viral when you were fifteen, and now you have three million followers. Sponsors love you and clubs aren't sure: nobody knows if you can actually play a proper match.",
    advantage: 'Circus-level ball control and a fame that already opens doors.',
    drawback: "You've never played proper eleven-a-side: you don't know how to move off the ball."
  },
  'extra-hijo-de-diplomaticos': {
    name: "The Diplomats' Son",
    tagline: 'Six countries, five languages and a ball in every removal box.',
    story:
      "Your parents are diplomats, and you've lived in Nairobi, Seoul, Buenos Aires, Oslo and Cairo. Every country taught you a different kind of football, and you learnt to win over any dressing room within a week.",
    advantage: 'You understand any style of play and can win over any dressing room.',
    drawback: 'International-school football: you lack bite in the physical battles.'
  },
  'extra-velocista': {
    name: 'The Converted Sprinter',
    tagline: 'You left the athletics track with a 10.3 in the hundred metres.',
    story:
      'You were junior 100-metres champion, but the starting blocks and the loneliness of the track bored you stiff. At nineteen you joined a local team just for fun, and within three months the scouts were on your trail.',
    advantage: "Sprinter's speed: if there's space in behind, the ball is yours.",
    drawback: "Your technique is a beginner's: the ball bounces off you every touch."
  },
  'extra-rodilla-de-acero': {
    name: 'Back from the Broken Knee',
    tagline: "At sixteen they told you you'd never play again.",
    story:
      "You were your city's great hope until, at sixteen, you tore your cruciate and your meniscus in the same game. After two years of operations and rehab, you're back with a mind made of steel.",
    advantage: "You've survived the worst: no amount of pressure can break you.",
    drawback: "You've lost a yard of pace, and your knee will never be the same again."
  },
  'extra-futbol-playa': {
    name: 'King of the Sand',
    tagline: 'Overhead kicks, volleys and sand in your ears.',
    story:
      'You grew up playing beach football on the coast, and at seventeen you were already a youth international in the sport. On sand everything is played in the air, and you learnt the overhead kick before the simple pass to feet.',
    advantage: 'Acrobatic finishing and legs that spring like coils.',
    drawback: 'On grass the ball runs too fast: your passing along the ground is a disaster.'
  },
  'extra-portero-reconvertido': {
    name: 'The Converted Keeper',
    tagline: "You kept goal until sixteen; now it's your turn to score.",
    story:
      "You played in goal through the youth ranks until a coach saw you finish in training and pushed you up front. You know how the man between the posts thinks: where he expects the shot, and where he doesn't.",
    advantage: "You know every goalkeeper's trick and where he isn't expecting the shot.",
    drawback: "You've barely played with your feet: dribbling still feels foreign."
  },
  'extra-hijo-del-puerto': {
    name: 'Son of the Harbour',
    tagline: 'Hauling nets at dawn, playing on the harbour front at dusk.',
    story:
      'You were up at four to go out fishing with your grandad, and in the afternoons you played on the quayside among the nets and fish crates. The sea taught you to wait for your moment and to ride out any storm.',
    advantage: 'Tough and patient: neither a storm nor a centre-back can rattle you.',
    drawback: "Your technique is pure quayside: short passing still isn't your game.",
    clubBondTag: "Your harbour town's club"
  },
  'extra-el-otro-gemelo': {
    name: 'The Other Twin',
    tagline: "Your twin brother has already turned pro; now it's your turn.",
    story:
      "You and your twin brother played together all your lives, linking up from memory at every age group. He signed for a giant first and made the front pages; you've had to wait your turn in the shadow of his name.",
    advantage: 'You link up on instinct and read teammates as you read your brother.',
    drawback: "You've always been 'the other one': stepping up doesn't come naturally.",
    clubBondTag: 'Your twin plays there'
  },
  'extra-hijo-del-utillero': {
    name: "The Kit Man's Son",
    tagline: 'You grew up among boots, bibs and the smell of liniment.',
    story:
      'Your father is the kit man at a big club, and you spent your childhood in their dressing room, collecting balls and listening to team talks from the best. You know every secret the club has, though no coach has ever handed you a thing.',
    advantage: 'You grew up in a dressing room: you understand the game and every teammate.',
    drawback: 'You were always the smallest of the bunch, and you still need to fill out.',
    clubBondTag: 'Raised in their dressing room'
  }
}
