import type { EventText } from '../packs'

/**
 * English texts for EXTRA_EVENTS (data/eventsExtra.ts): long career, youth
 * phase, veteran phase, archetype events and their consequences.
 */
export const EXTRA_EVENTS_EN: Record<string, EventText> = {
  // ---------------------------------------------------------------------------
  // Youth phase (up to 21)
  // ---------------------------------------------------------------------------
  'primer-sueldo': {
    title: 'Your first proper pay packet',
    text: "Your first wage as a professional footballer lands in your account. Out in the training-ground car park, the lads are comparing motors worth more than your parents' house.",
    options: [
      {
        label: 'Buy a sports car like the senior pros drive',
        outcome:
          'The car is a thing of beauty. The gaffer spots it parked next to his space and raises an eyebrow.'
      },
      {
        label: "Chip in on your parents' mortgage",
        outcome: "Your mum is in tears on the phone. Best thing you've scored all year."
      },
      {
        label: 'Save it and find a financial adviser',
        outcome:
          'A sensible adviser draws up a plan and only gets paid if your money grows. The senior lads laugh at your hatchback; you sleep like a baby.'
      }
    ]
  },
  novatada: {
    title: 'The initiation',
    text: 'Dressing-room tradition: at the team dinner, the new boy stands on a chair and sings. Twenty-five grown men are drumming on the table, waiting.',
    options: [
      {
        label: 'Get up there and belt it out',
        success:
          "You go for a song from back home and by the chorus the whole squad is singing with you. You're one of the lads now.",
        failure:
          'Your voice cracks on the second verse. The laughter lasts for weeks. The nickname lasts longer.'
      },
      {
        label: 'Refuse with a smile',
        success:
          'You do it with such charm that the captain lets you off: "This one\'s got bottle."',
        failure: 'They take it as a snub. All week, nobody passes you the ball in the rondos.'
      },
      {
        label: 'Pay for dinner to dodge it',
        outcome: 'The bill is eye-watering, but the whole squad raises a glass to you.'
      }
    ]
  },
  'primer-entreno-mayores': {
    title: 'Welcome to the first team',
    text: 'First session with the senior squad. The veteran centre-back welcomes you with a tackle that leaves you flat on the grass: "No cotton wool up here, son."',
    options: [
      {
        label: 'Get up and stand your ground next time',
        success: 'You win the next fifty-fifty. The centre-back gives a silent nod: test passed.',
        failure:
          'He goes straight through you again and you end up with an ice pack on your ankle. The coaching staff take note.'
      },
      {
        label: "Play one-touch so he can't get near you",
        success:
          "Pass and move, pass and move. The old stager can't get a touch, and the boss smiles on the touchline.",
        failure:
          'You lose it on the very first one-two and the centre-back laughs: "Quicker than that, kid."'
      },
      {
        label: 'Complain to the assistant manager',
        outcome:
          'The assistant looks at you with pity. The dressing room already calls you "Princess".'
      }
    ]
  },
  'directo-streamer': {
    title: 'Live at two in the morning',
    text: "A famous streamer invites you onto his stream at two o'clock on a Tuesday morning. Half a million kids watching and not a press officer in sight.",
    options: [
      {
        label: 'Join in and let loose',
        success:
          "You're funny, down-to-earth and you don't say a word too many. Thousands of new followers overnight.",
        failure:
          "Around 3 a.m. you let slip what you really think of the gaffer's tactics. The clip is all over the country by breakfast."
      },
      {
        label: 'Pop in for ten minutes, then sign off',
        outcome:
          'You say hello, play one game and head to bed. Enough to get people saying nice things.'
      },
      {
        label: "Say no: it's a double session tomorrow",
        outcome:
          "You miss the party, but you're the only one who turns up fresh for the double session."
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Veteran phase (30+)
  // ---------------------------------------------------------------------------
  pupilo: {
    title: 'The kid coming for your shirt',
    text: "A seventeen-year-old striker steps up from the reserves, and he runs just like you did at his age. The gaffer asks you to take him under your wing. One day he'll take your place.",
    options: [
      {
        label: 'Teach him everything you know',
        outcome:
          'You stay behind with him after every session. He hangs on your words the way you once did with the old pros.'
      },
      {
        label: 'Teach him to play with you, not against you',
        success:
          'One-twos, crossover runs, a glance here and there. Within a fortnight you click without a word, and the boss is thinking of playing you both.',
        failure:
          "There's no chemistry. He gets frustrated, so do you, and you go your separate ways."
      },
      {
        label: 'Let him earn it alone, like you had to',
        outcome: "You give him the cold shoulder. He learns anyway, but he won't forget it."
      }
    ]
  },
  'perder-velocidad': {
    title: 'The GPS never lies',
    text: "The GPS data doesn't lie: you've lost nearly two kilometres an hour off your top speed. Opposition full-backs no longer fear your runs in behind.",
    options: [
      {
        label: 'Drop deeper and play the young lads in behind',
        success:
          "From the number ten role, your balls over the top are pure gold. You don't do the running any more: you make others run.",
        failure:
          'Your passes arrive late or run out of play. The team loses its threat in behind and the gaffer sends you back up top.'
      },
      {
        label: 'Hire a personal speed coach at your own expense',
        success:
          'Strength work, sprint technique, a diet weighed to the gram. Your body responds and the lost yard comes back.',
        failure:
          "You push too hard and your calf calls time. Weeks of nursing it, and the pace still won't come back."
      },
      {
        label: 'Accept it and live in the box',
        outcome:
          'You stop chasing balls in behind and start winning the positional battle. Fewer yards, more menace.'
      }
    ]
  },
  'pensar-retirada': {
    title: 'How much longer?',
    text: "After a forgettable game, someone at the family dinner table asks out loud when you're planning to retire. Nobody answers. That same week, a TV channel offers you a punditry job for when you hang up your boots.",
    options: [
      {
        label: '"As long as the legs hold up, I\'m going on"',
        success:
          'You put yourself to the test at the next session: first home in every single sprint. That question can wait.',
        failure:
          'You try, but you finish the week running on fumes. The question nags at you every night.'
      },
      {
        label: 'Do your coaching badges in the evenings',
        outcome:
          'Whiteboards, notes and tactics videos. You start seeing the game from the dugout without ever leaving the pitch.'
      },
      {
        label: 'Sign a pre-contract with the TV people now',
        success: "You sign quietly, on good terms. At least you know there's life after football.",
        failure:
          'The news leaks and the papers have you retired already. The dressing room looks at you differently.'
      }
    ]
  },
  brazalete: {
    title: 'The armband',
    text: "The captain is retiring and the squad will vote for his successor. The old guard want you; the youngsters want the midfielder everyone's talking about.",
    options: [
      {
        label: 'Give a speech before the vote',
        success:
          "You talk about everything you've seen in all your years in dressing rooms. You win comfortably. The armband is heavy, and it suits you.",
        failure: 'The speech sounds like a farewell. You lose the vote by two.'
      },
      {
        label: 'Step aside and back the youngster',
        outcome: "It's a classy gesture. The new captain runs every big decision past you."
      },
      {
        label: 'Let the gaffer decide',
        outcome:
          'The gaffer picks the youngster, "with one eye on the future". It hurts more than you let on.'
      }
    ]
  },
  'ultimo-contrato': {
    title: 'The last big contract',
    text: "Your agent turns up with two sheets of paper: the club's offer, one more year on reduced terms, and a mega-money deal from a far-flung league to see out your career.",
    options: [
      {
        label: 'Sign the new deal on reduced terms',
        outcome:
          "The fans celebrate like you've won a trophy. You'll finish your career where you want to."
      },
      {
        label: 'Use the foreign offer to squeeze the club',
        success:
          'You play your hand with nerves of steel. The club improves its offer and your nest egg is secured.',
        failure:
          'The chairman gets wind of your game and leaks it. The crowd boo you at the next match.'
      },
      {
        label: 'Ask for a clause to coach in the academy when you retire',
        success: 'The club are delighted to agree. Your future belongs here too.',
        failure:
          'The director of football laughs: "Finish playing first." The deal stays as it was.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Archetype events
  // ---------------------------------------------------------------------------
  'academia-companero': {
    title: 'The one they let go',
    text: 'At a petrol station you bump into your best mate from the academy. He was released at nineteen. Now he plays Sunday league, and asks, half joking, whether you could get him a trial.',
    options: [
      {
        label: 'Have a word with the director of football',
        success:
          "They give him a trial with the reserves. Who knows if he'll make it, but you've given him his hope back.",
        failure:
          'The director of football cuts you dead: "You play, we do the signings." Now you look bad to both of them.'
      },
      {
        label: 'Train with him on your days off',
        outcome:
          "It's academy football all over again: one-twos, dribbles, laughter. You remember why you started."
      },
      {
        label: 'Promise to look into it, then do nothing',
        outcome: 'You never call him. He never calls you. Something breaks without a sound.'
      }
    ]
  },
  'academia-estilo': {
    title: 'What the academy taught you',
    text: 'The new manager wants it long and wants second balls. You grew up in an academy built on short passing and possession. At his first session he makes it plain: "We don\'t do pretty passing here."',
    options: [
      {
        label: 'Adapt and learn to play the long ball',
        success:
          'It turns out you can switch the play with a forty-yard ball as well. The gaffer is delighted.',
        failure: 'Your long balls keep ending up in the stands. The gaffer despairs.'
      },
      {
        label: 'Prove that a passing game works too',
        success:
          'Two one-twos in the practice match and a tap-in into an empty net. "All right, all right," says the boss, "but don\'t make a habit of it."',
        failure: 'You get caught dawdling on the ball in your own half and get a proper rollicking.'
      },
      {
        label: 'Give your old academy coach a ring',
        outcome:
          '"A good player plays the game in front of him," he tells you. You chew it over for days.'
      }
    ]
  },
  'tardio-companeros': {
    title: 'The work lads',
    text: "Your old workmates from the job you had before you made the leap turn up in the stands with a huge banner bearing your name. They've driven all the way from your home town in a van.",
    options: [
      {
        label: 'Score one and dedicate it to them',
        success:
          'A screamer, then a sprint to their banner. The photo of the van lads going mad goes viral.',
        failure: "No goal, but they're waiting by the gate at full time, just as proud."
      },
      {
        label: 'Take them out for dinner after the game',
        outcome:
          "You end up out till all hours swapping old stories. It reminds you what a hard day's graft really is."
      }
    ]
  },
  'tardio-base-fisica': {
    title: 'The body that came late',
    text: 'The physios put you through a full screening. Your body lacks the grounding of lads raised in an academy: muscles that were never trained, joints only half built.',
    options: [
      {
        label: 'Injury-prevention plan: an extra hour every day',
        success: 'Months of dull exercises nobody ever sees. Your body turns to granite.',
        failure: "You overdo the loading and get knee tendinitis. Two weeks on the physio's table."
      },
      {
        label: 'Build your engine with the fitness coach',
        success:
          'Intervals, hill runs, heart-rate monitor. Now the ninetieth minute feels like the sixtieth.',
        failure:
          "The fitness coach wrings you dry and you're dragging your legs round at the weekend."
      },
      {
        label: 'This body got you here: carry on as you are',
        outcome: "You trust your instincts. For now, it's holding up."
      }
    ]
  },
  'barrio-torneo': {
    title: 'The summer tournament',
    text: "Your old estate's summer tournament invites you to play in the final, on the concrete pitch where you learned the game. The club has banned it: injury risk.",
    options: [
      {
        label: 'Play anyway, like when you were a kid',
        success:
          'Three nutmegs, a back-heeled goal and the whole estate storming the pitch. Nobody at the club finds out... until the video drops.',
        failure:
          'One tackle on the concrete splits your knee open. The club fines you and you miss a game.'
      },
      {
        label: 'Go as guest of honour and present the trophy',
        outcome:
          'You sign shirts for three hours straight. The kids look at you the way you looked at the big lads.'
      },
      {
        label: 'Pay for brand-new kits for every team in the tournament',
        outcome:
          'The whole tournament plays in new kits with your number on the back. The estate never forgets.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Training and tactics
  // ---------------------------------------------------------------------------
  rondo: {
    title: 'Piggy in the middle',
    text: "Warm-up. The senior lads stick you in the middle of the rondo and knock it round you, laughing. Two minutes and you haven't had a sniff.",
    options: [
      {
        label: 'Hound them non-stop until you win it',
        success:
          "You chase every pass like it's the last. You nick it, and the group applaud your persistence.",
        failure:
          "Three minutes in, you're blowing hard. You end up hands on knees while they howl with laughter."
      },
      {
        label: 'Read the passes and anticipate',
        success:
          'You cut out a pass with the tip of your boot. "This one gets it," mutters the captain.',
        failure: "You're always a step behind. It drags on until the gaffer stops it out of pity."
      },
      {
        label: 'Laugh it off and demand a rematch',
        outcome: "When you finally escape the middle, you're the one making the next lad dance."
      }
    ]
  },
  'falso-nueve': {
    title: 'False nine',
    text: 'The gaffer has spotted something on the video: he wants you as a false nine, dropping into the pockets to drag the centre-backs out.',
    options: [
      {
        label: 'Take on the challenge and learn the role',
        success:
          'Back to goal, turn, thread it through. The wingers feast on your passes and the gaffer singles you out in the team talk.',
        failure:
          'You get lost between the lines: never on the ball, never in the box. One to forget.'
      },
      {
        label: 'Ask to stay as an out-and-out number nine',
        outcome:
          "He hears you out and respects it, but you're no longer his first pick for the big games."
      },
      {
        label: 'Suggest a mix: drop deep, then spin in behind',
        success:
          'You drop, drag the centre-back with you, and the moment he switches off you spin in behind him. A textbook goal.',
        failure: 'Neither fish nor fowl. The gaffer tells you to pick one.'
      }
    ]
  },
  'presion-alta': {
    title: 'Counter-pressing',
    text: "The new coaching staff want the striker to be the first line of defence: press the moment the ball's lost, sprint after sprint, for ninety minutes.",
    options: [
      {
        label: 'Snap at every ball',
        success:
          "Their centre-backs don't get a second's peace. You pinch one in the box and celebrate like you've scored.",
        failure: "By the hour mark you're dead on your feet. You get hooked in every game."
      },
      {
        label: 'Press smartly and pick your moments',
        success: 'You only trigger the press when the pass is loose. More impact, less running.',
        failure: "The gaffer thinks you're hiding, and tells you so in front of everyone."
      },
      {
        label: "Tell him a number nine's job is scoring",
        outcome: 'He folds his arms and stares at you: "Everyone runs here, or nobody plays."'
      }
    ]
  },
  'balon-parado': {
    title: 'The set-piece routine',
    text: 'The analyst has drawn up a corner routine for you: a block at the near post and a header on the run. The gaffer wants it drilled all week.',
    options: [
      {
        label: "Drill it until it's perfect",
        success: 'On Sunday it comes off exactly as drawn. Near-post header, back of the net.',
        failure:
          "You're always half a second late. The analyst wipes the routine off the whiteboard."
      },
      {
        label: 'Offer to take the corners from the other side',
        success:
          'Your deliveries drop as if placed by hand. The centre-back gets header after header and you add another string to your bow.',
        failure:
          "Your first corner doesn't beat the first man. Nor does the second. They take the ball off you."
      },
      {
        label: 'Suggest the centre-back gets the header: he jumps higher',
        outcome:
          'The centre-back scores and thanks you in the dressing room. A goal lost, a friend gained.'
      }
    ]
  },
  'pretemporada-montana': {
    title: 'Pre-season in the mountains',
    text: 'A training camp two thousand metres up. The fitness coach announces the first test: six uphill reps of a thousand metres.',
    options: [
      {
        label: 'Go flat out from the very first rep',
        success:
          'You win every rep. The fitness coach writes your name on the whiteboard and circles it.',
        failure:
          'On the fourth rep you throw up behind a pine tree. The photos are all over the team group chat.'
      },
      {
        label: 'Stay with the pack and kick on at the end',
        success:
          'Your body soaks up the punishment without a single niggle. You hit the new season flying.',
        failure: "A tight calf leaves you on the physio's table in the hotel for three days."
      },
      {
        label: "Pace yourself: it's a long season",
        outcome: 'You reach September fresh, but the fitness coach has marked your card.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Dressing room, press and social media
  // ---------------------------------------------------------------------------
  'primas-vestuario': {
    title: 'The great bonus row',
    text: 'The board offers performance bonuses and the dressing room splits down the middle: the senior pros want paying per match, the youngsters per trophy. The meeting gets heated.',
    options: [
      {
        label: 'Broker a compromise between the two',
        success: 'Both camps listen. The deal has your name on it and the captain thanks you.',
        failure: "Nobody listens, and you end up looking like the board's mouthpiece."
      },
      {
        label: 'Side with the senior players',
        outcome:
          'The big personalities are grateful and the bonuses land early. The youngsters eye you sideways.'
      },
      {
        label: 'Stay out of it',
        outcome: 'Head down, keep training. You take your share and spare yourself the grief.'
      }
    ]
  },
  'prensa-goleada': {
    title: 'After the hammering',
    text: 'A {marcador} thrashing at the hands of {rival}. In the press room, a reporter asks you whether the manager should keep his job.',
    options: [
      {
        label: '"The gaffer has our full backing. This is on us."',
        outcome: 'The manager watches it from his office. Next morning, he greets you differently.'
      },
      {
        label: '"That\'s not my call. Ask the people upstairs."',
        success: 'You sidestep it gracefully and nobody gets a headline out of you.',
        failure: 'Your tone is read as a dig. "Striker refuses to back boss," runs the headline.'
      },
      {
        label: 'Apologise to the fans and promise a response',
        success: 'You front up while others hide. The fans applaud you at the next game.',
        failure:
          'You promise too much. When the next defeat comes, your words get thrown back at you.'
      }
    ]
  },
  'video-viral': {
    title: 'The out-of-context clip',
    text: "A ten-second clip is doing the rounds that seems to show you mocking the opposition fans. Out of context, of course. It's already trending nationwide.",
    options: [
      {
        label: 'Record a video explaining what happened',
        success: 'Calm, no excuses, full footage attached. The row blows over within hours.',
        failure: 'Your anger shows, and the second video is worse than the first.'
      },
      {
        label: 'Come off social media for a while',
        outcome:
          'You delete the apps. You sleep better, play better, and the storm dies on its own.'
      },
      {
        label: 'Hit back at the people who spread it',
        outcome:
          'Your followers defend you tooth and nail. The club asks you, in writing, to calm down.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Agent, sponsors and money
  // ---------------------------------------------------------------------------
  'agente-tiburon': {
    title: 'The super-agent',
    text: 'The most feared agent in the game summons you to a luxury hotel. He promises to triple your wages. In return, he wants fifteen per cent of everything and for you to ditch your long-time agent.',
    options: [
      {
        label: 'Sign with him',
        outcome:
          "One phone call and the market is moving. Your name is everywhere; your old agent won't pick up."
      },
      {
        label: 'Stick with your long-time agent',
        outcome:
          "Your agent hears about the meeting and thanks you with a hug. Some things money can't buy."
      },
      {
        label: 'Sign, but only if he cuts his fee',
        success:
          'You hold his stare until he comes down to eight per cent. His first move lands you a lucrative boot deal.',
        failure:
          'He gets up before dessert: "I don\'t work with amateurs." The meeting leaks anyway.'
      }
    ]
  },
  'marca-bebidas': {
    title: 'The energy drink',
    text: 'An energy-drink brand offers you {dinero:150000} for an ad campaign and a weekly post on your socials. The can is an impossible shade of green.',
    options: [
      {
        label: 'Sign the whole deal as it stands',
        outcome:
          'Your face is on every can in the country. The club nutritionist puts his head in his hands.'
      },
      {
        label: 'Negotiate a deal with no posts in match weeks',
        success:
          'They accept your terms in exchange for less money. You get paid and nobody at the club can say a word.',
        failure: "They think you're asking too much and go to another player instead."
      },
      {
        label: "Turn it down: it's not you",
        outcome: 'The nutritionist congratulates you. Your bank balance is less impressed.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Family and partner
  // ---------------------------------------------------------------------------
  'cumple-madre': {
    title: "Your mum's sixtieth",
    text: "Your family are throwing a surprise lunch for your mum's sixtieth. It's on Saturday, the very day before an away game.",
    options: [
      {
        label: 'Ask the gaffer if you can get there and back in a day',
        success:
          '"Family comes first. But you\'re back at the hotel by ten." You make it for pudding and get back in time.',
        failure:
          'He says no, and makes a note of it too. You spend Saturday in the hotel scrolling through the photos.'
      },
      {
        label: 'Slip away without asking',
        outcome: "Your mum cries with joy. When the gaffer finds out, he doesn't cry: he fines you."
      },
      {
        label: 'Video-call her from the team hotel instead',
        outcome:
          "You blow out the candles through a screen. She says it doesn't matter. You know it does."
      }
    ]
  },
  'pareja-exclusiva': {
    title: 'The exclusive',
    text: 'The paparazzi snap you and {pareja} on the beach. A magazine offers {dinero:40000} for a joint interview and a photo shoot at your home.',
    options: [
      {
        label: 'Take the exclusive',
        outcome: 'Front cover, sofa photos and loved-up headlines. Within a week, she regrets it.'
      },
      {
        label: 'Say no and ask for privacy',
        outcome: 'A polite statement and the door stays shut. She thanks you with dinner for two.'
      },
      {
        label: 'Accept and give the fee to an animal shelter',
        outcome:
          "You're in the magazine, but for something lovely. She even chooses the rescue dog for the cover."
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Injuries and recovery
  // ---------------------------------------------------------------------------
  'lesion-tobillo': {
    title: 'The sprain',
    text: 'Someone stands on your foot in training and the ankle swells up like a balloon. The doctors say four weeks. The derby is in ten days.',
    options: [
      {
        label: "Stick to the doctors' timeline",
        outcome: 'You watch the derby from the stands, but the ankle heals good as new.'
      },
      {
        label: 'Pay for a private fast-track rehab clinic',
        success:
          'Hyperbaric chamber and physios at dawn. You make the derby, you score, and nobody believes you were ever injured.',
        failure: "You rush it and break down in your first session back. Now it's six weeks."
      },
      {
        label: 'Take a painkilling jab and tell no one',
        success:
          'You play the derby with a numb ankle and have a huge game. Nobody knows what it cost you.',
        failure:
          "By the half-hour you can't put weight on it. You limp off and the club doctor gives you a suspicious look."
      }
    ]
  },
  rehabilitacion: {
    title: 'Two months out',
    text: 'A torn muscle. Two months out. On day one, the physio shakes your hand: "This is where the longest match of the season starts."',
    options: [
      {
        label: 'Obsessive rehab: morning and afternoon',
        success:
          "You're back ahead of schedule and fitter than ever. The fitness coach can't believe it.",
        failure: 'You overdo it and the muscle complains. Two more weeks on the sidelines.'
      },
      {
        label: 'Strengthen your whole body so it never happens again',
        success: 'Core, gym and balance work. You come back bulletproof.',
        failure: 'Progress is slow and the impatience eats you alive.'
      },
      {
        label: 'Study the team from the stands with the analyst',
        outcome:
          'Videos, whiteboards and chats with the gaffer. When you come back, you see gaps you never saw before.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Charity
  // ---------------------------------------------------------------------------
  'hospital-infantil': {
    title: 'The hospital visit',
    text: "The Christmas visit to the children's hospital. An eight-year-old in your shirt asks you to score on Sunday and do his celebration: a dinosaur.",
    options: [
      {
        label: 'Promise him',
        success:
          "A goal on 34 minutes and a dinosaur celebration right in front of the cameras. The clip melts the whole country's heart.",
        failure:
          'No goal. On Monday you go back to the hospital with a signed shirt. He says next time, then.'
      },
      {
        label: 'Promise him something bigger: a foundation for the hospital',
        outcome:
          "You lay the first stone with {dinero:60000} of your own money. There's no going back now."
      },
      {
        label: 'Go back every month, no cameras',
        outcome: 'Nobody knows but the nurses. Nothing helps you sleep better.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // National team and transfers
  // ---------------------------------------------------------------------------
  'convocatoria-seleccion': {
    title: 'The international call-up',
    text: "The national manager names you in his squad for two qualifiers. You've been carrying a groin problem, and your club would rather you stayed behind to recover.",
    options: [
      {
        label: 'Join up with the squad, come what may',
        success:
          'You play both games without a twinge. The national boss now sees you as a regular.',
        failure: "Your groin flares up badly in the second game. Your club won't forget it."
      },
      {
        label: 'Withdraw from the squad to look after yourself',
        outcome:
          'Your club appreciates it. On the other end of the line, the national manager says nothing.'
      },
      {
        label: 'Go, but only play the agreed minutes',
        success:
          "You come on in the second half of both games and return to your club fresh. Everyone's happy.",
        failure:
          'In your minutes you look rusty and off the pace. The press are talking about you, and not kindly.'
      }
    ]
  },
  'seleccion-estrellas': {
    title: 'Squad camp with the superstars',
    text: "International camp. In the first session, the team's star playmaker doesn't pass you a single ball. Here, you have to earn your place.",
    options: [
      {
        label: 'Win him over with one-touch play',
        success:
          "Two perfect one-twos and the playmaker starts looking for you. In the friendly you're on the same wavelength.",
        failure: 'You misplace the first easy pass and get a look that says it all.'
      },
      {
        label: 'Go looking for your own goal',
        success:
          'In the friendly you go for it and bury it in the top corner. A worldie, though the dressing room mutters.',
        failure:
          'Three long-range shots with teammates free. The national boss hooks you at half-time.'
      },
      {
        label: 'Talk to him over dinner',
        success:
          "You've got more in common than it seemed. Next day, he's looking for you every time.",
        failure: 'He gives you one-word answers and goes back to his phone. Grim dinner.'
      }
    ]
  },
  'rumor-fichaje': {
    title: 'Front-page fiction',
    text: "A foreign sports paper splashes your photo across its front page: \"Deal done.\" It's news to you. In the dressing room, they're already calling you by the other club's name.",
    options: [
      {
        label: 'Deny it on social media',
        outcome: '"I haven\'t spoken to anyone. I\'m focused here." The gaffer reads it and nods.'
      },
      {
        label: '"I\'m not ruling anything out"',
        outcome: 'Your market value rockets and your agent grins. Nobody at the club is smiling.'
      },
      {
        label: 'Answer by scoring on Sunday and kissing the badge',
        success: 'A goal and a kiss of the badge in front of the fans. The story dies a death.',
        failure: 'Your head is clearly elsewhere. A grey afternoon and boos at the final whistle.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Consequence events
  // ---------------------------------------------------------------------------
  'consecuencia-bebidas': {
    title: 'The green can',
    text: 'That energy-drink deal blows up in your face: a new study links the drink to health problems in teenagers, and your face is still on every single can.',
    options: [
      {
        label: 'Tear up the contract and pay the penalty',
        outcome:
          'You pay the release fee and apologise to the families. It costs you, but your name comes out clean.'
      },
      {
        label: 'Defend the brand at a press conference',
        success:
          "You call for proper research and don't stick your neck out further. The brand rewards you with a new deal.",
        failure: 'Your words sound like what they are: an advert. The media tear you apart.'
      },
      {
        label: 'Give the money to grassroots football',
        outcome:
          "You announce that the money is going to kids' football schools. The scandal becomes an example to follow."
      }
    ]
  },
  'consecuencia-pupilo': {
    title: "Your protégé's debut",
    text: 'The academy kid you took under your wing makes his first-team debut today. He comes on in the 70th minute and the first thing he does is look for you.',
    options: [
      {
        label: 'Set up his first goal',
        success:
          "You drop a long ball in behind the defence, just like you've done a hundred times in training. He scores, and runs to hug you before anyone else.",
        failure:
          'Your pass runs a yard too long. The kid apologises to you, as if it were his fault.'
      },
      {
        label: 'Hand him the penalty you win on 88 minutes',
        outcome:
          'You give him the ball and whisper where to put it. He buries it. The crowd sing both your names.'
      },
      {
        label: "Play your own game: he's ready for this",
        success: 'He lays it on and you tuck it away. The handover can wait a bit longer.',
        failure: "You miss your chance and he daren't ask for the ball. A bittersweet night."
      }
    ]
  },
  'consecuencia-agente': {
    title: "The super-agent's gambit",
    text: 'That super-agent you signed with has leaked to the press that you want to leave the club, to force a pay rise. You find out from the radio.',
    options: [
      {
        label: 'Sack him, whatever the clause costs',
        outcome:
          "You cut ties and pay the penalty. The club appreciates that you didn't play his game."
      },
      {
        label: 'Let him carry on with it',
        outcome:
          'The club caves and improves your contract, but the dressing room looks at you like a mercenary.'
      },
      {
        label: 'Make him deny it publicly',
        success:
          "You make it clear who's boss. Next day he denies the story, and learns to run things past you.",
        failure:
          "He stalls, and the story runs for a week. The gaffer asks you straight out if you're leaving."
      }
    ]
  },
  'consecuencia-fundacion': {
    title: 'The foundation opens its doors',
    text: "The foundation you promised that Christmas at the children's hospital opens its first playroom. The dinosaur boy, fully recovered now, cuts the ribbon.",
    options: [
      {
        label: 'Give a speech at the opening',
        success:
          'You speak without notes, your voice cracking. Half the room is in tears and donations pour in.',
        failure:
          'You freeze mid-sentence. The boy rescues you with a hug, and everyone applauds anyway.'
      },
      {
        label: 'Organise a charity match with your teammates',
        success:
          'A packed stadium, ninety minutes flat out and three hours of autographs. It raises double the target.',
        failure: "A hamstring twinge in the charity game. The gaffer doesn't see the funny side."
      },
      {
        label: 'Put in another {dinero:50000} and stay out of the photo',
        outcome:
          "The playroom grows without your name appearing anywhere. The nurses know, and that's enough."
      }
    ]
  },
  'consecuencia-seleccion': {
    title: "The national boss doesn't forget",
    text: 'Since you turned down that call-up, your name has vanished from the squad lists. Today the national manager said it at his press conference: "There\'s only room in this squad for players who want to be here."',
    options: [
      {
        label: 'Ring him and clear the air',
        success:
          "You explain the groin problem calmly. Before ringing off, he says he's watching you closely.",
        failure: 'The call turns sour and ends with both of you hanging up.'
      },
      {
        label: 'Answer him with goals',
        success: 'You find the net week after week. The press are screaming for your call-up.',
        failure: 'The pressure gets to you and the drought drags on. Still no name on the list.'
      },
      {
        label: 'Hit back through the press',
        outcome:
          '"I want to play for my country too. Fit, though." The fans love the headline; the national association doesn\'t.'
      }
    ]
  },
  'consecuencia-infiltracion': {
    title: 'The ankle bites back',
    text: 'That sprain you hid behind painkilling jabs is back with a vengeance. The club doctor has seen the scans and calls you into his office: he wants the truth.',
    options: [
      {
        label: 'Tell him everything and rest as long as it takes',
        outcome:
          'Six weeks out and a rollicking from the gaffer. But at last, the ankle heals properly.'
      },
      {
        label: 'Deny it and keep playing',
        success:
          'Against all odds, your body holds out again. You score, though getting out of bed is harder every morning.',
        failure:
          'The ankle gives way completely mid-match. Surgery, months out, and a club that no longer trusts you.'
      },
      {
        label: 'Get a second opinion outside the club',
        success:
          'A specialist suggests a managed-load treatment plan and the club doctor signs off on it. You keep playing, no more lies.',
        failure: 'The club finds out you went to doctors behind its back and feels betrayed.'
      }
    ]
  }
}
