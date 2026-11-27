import type { EventText } from '../packs'

/** English texts for the base season events (`BASE_EVENTS` in data/events.ts). */
export const BASE_EVENTS_EN: Record<string, EventText> = {
  debut: {
    title: 'Your Debut',
    text: 'Seventy minutes gone. The boss calls you over to the touchline: "Go on, son, enjoy it." For the first time, the whole ground is watching you.',
    options: [
      {
        label: 'Demand the ball and go for goal from your first touch',
        success:
          "One touch to set yourself, then you curl it into the top corner. A debut goal, and they're singing your name.",
        failure:
          'Your legs turn to jelly. You give it away twice in a row and the boss puffs out his cheeks on the touchline.'
      },
      {
        label: 'Keep it simple, press hard and work for the team',
        outcome:
          'No fireworks, but no mistakes. The boss claps you on the back at full time: "That\'s the way to start."'
      }
    ]
  },
  fiesta: {
    title: 'A Big Night Out',
    text: 'The lads are throwing a party the night before a game and want you there. "Come on, it\'s good for team spirit."',
    options: [
      {
        label: 'Go, and stay till the very end',
        outcome:
          'Great night, and the dressing room takes you to its heart. Next morning, the fitness coach is rather less impressed.'
      },
      {
        label: 'Show your face, then slip away early',
        success:
          'You turn up, raise a glass with everyone and are gone by midnight without anyone holding it against you.',
        failure:
          "You get sucked in, roll home at silly o'clock and someone posts a photo of you online."
      },
      {
        label: 'Stay at home and rest up',
        outcome:
          'Nine hours\' sleep. A couple of the lads call you "boring", but the coaching staff take note.'
      }
    ]
  },
  extra: {
    title: 'Staying Late',
    text: 'The assistant manager offers to stay behind with you after every session. The coaching staff reckon this is what the team needs you to work on:',
    options: [
      {
        label: 'Finishing: a hundred shots every afternoon',
        outcome:
          'Your calves are wrecked by the end, but the ball keeps finding the net more easily.'
      },
      {
        label: 'Gym: build some power',
        outcome:
          "You put on three kilos of muscle. Centre-backs can't shove you around so easily now."
      },
      {
        label: 'Video: study the movement of the very best',
        outcome:
          'Hours of footage with the analyst. You start seeing gaps where you used to see nothing.'
      }
    ]
  },
  prensa: {
    title: 'Press Conference',
    text: "A journalist, clearly out to stir things up, asks whether you're happy with your minutes.",
    options: [
      {
        label: '"I work hard every day and respect the manager\'s decisions."',
        outcome: 'A textbook answer. Boring headlines, but the boss appreciates it.'
      },
      {
        label: '"Honestly? I think I deserve more minutes."',
        outcome:
          'Your quote leads every sports bulletin. The fans are behind you; the coaching staff, not so much.'
      },
      {
        label: 'Laugh it off with a joke',
        success: 'The room cracks up and your answer goes viral for all the right reasons.',
        failure: "Nobody laughs, and it comes across as if you're mocking the club."
      }
    ]
  },
  penalti: {
    title: 'Penalty in the 90th',
    text: "One-all, last minute, penalty to us. The captain already has the ball under his arm, but he's looking at you.",
    options: [
      {
        label: 'Ask for the ball: "Let me take it"',
        success:
          'A stutter in the run-up, keeper on the floor, ball in the net. You knee-slide in front of your own fans.',
        failure: 'The keeper guesses right. The silence around the ground weighs a ton.'
      },
      {
        label: 'Let the captain take it',
        outcome:
          'The captain scores and dedicates it to you. "Next one\'s yours," he says in your ear.'
      }
    ]
  },
  patrocinador: {
    title: 'A Brand Comes Knocking',
    text: 'A boot brand wants you as the face of its new campaign. It means a three-day shoot right in the middle of the season.',
    options: [
      {
        label: "Accept: it's your moment",
        outcome:
          "Your face is on billboards up and down the country. At the club, some think you're losing focus."
      },
      {
        label: 'Turn it down and focus on football',
        outcome: 'You say no. The manager hears about it and quietly approves.'
      }
    ]
  },
  rival: {
    title: 'Dressing-Room Rivalry',
    text: "The squad's other striker winds you up at every training session. Today he caught you with a late kick.",
    options: [
      {
        label: 'Answer on the pitch: embarrass him with a dribble',
        success: "Nutmeg, then a goal in the practice match. The boss can't help smiling.",
        failure: 'He nicks it off you and celebrates in front of everyone.'
      },
      {
        label: 'Have it out with him',
        outcome:
          'The lads have to pull you apart. You earn respect in the squad, but the boss fines you both.'
      },
      {
        label: 'Ignore him and get on with it',
        outcome: "You don't take the bait. You learn to keep a cool head."
      }
    ]
  },
  molestias: {
    title: 'Hamstring Worries',
    text: 'You feel a twinge in your hamstring before the biggest game of the month.',
    options: [
      {
        label: 'Play through it',
        success:
          'You last the full ninety and score. Nobody ever knows you played carrying a knock.',
        failure: 'It goes after twenty minutes. Three weeks out, and you lose a yard of pace.'
      },
      {
        label: 'Tell the doc and sit it out',
        outcome: 'You miss the game, but you come back at a hundred per cent.'
      }
    ]
  },
  clasico: {
    title: 'The Big Game',
    text: "It's the most anticipated game of the year, and you're a surprise starter. The boss wants you to pin the centre-backs.",
    options: [
      {
        label: 'Go for goal at all costs',
        success: 'A brace. Next morning, your name is on every back page.',
        failure: "Three clear chances, three misses. You're hooked at half-time."
      },
      {
        label: 'Do exactly what the manager asks',
        outcome:
          'Graft, battles and a headed assist. A disciplined shift that the coaching staff applaud.'
      }
    ]
  },
  'padre-tv': {
    title: 'Your Dad on the Telly',
    text: 'Your dad, the club\'s great legend, tells a TV panel that you still "lack a bit of character".',
    options: [
      {
        label: 'Ring him and talk it over in private',
        outcome:
          "A long, honest conversation. For the first time, it feels like he's talking to you as an equal."
      },
      {
        label: 'Hit back on social media',
        outcome:
          'Your put-down of your old man goes round the country. Plenty of fame, and a very frosty Christmas dinner.'
      },
      {
        label: 'Say nothing and answer on the pitch',
        outcome: 'You keep quiet and train twice as hard. Character is shown, not announced.'
      }
    ]
  },
  potrero: {
    title: 'Back to Your Roots',
    text: 'On a day off, you wander back to the bumpy patch of ground where it all started. The local kids spot you and pile in.',
    options: [
      {
        label: 'Stay all afternoon and play with them',
        outcome: "For an afternoon you're ten years old again, and you remember why you play."
      },
      {
        label: 'Organise a charity match to fix up the pitch',
        outcome:
          'The club backs the idea and the neighbourhood gets a fresh new pitch. The press covers it.'
      }
    ]
  },
  ojeador: {
    title: 'A Scout from Abroad',
    text: 'A scout from one of the big foreign clubs turns up at your game and asks your agent about you.',
    options: [
      {
        label: 'Show some interest',
        outcome:
          'Your agent leaks the story. Your value goes up, but it goes down very badly at the club.'
      },
      {
        label: '"I\'m happy here"',
        outcome: 'You say it publicly. At the next game, the fans sing your name.'
      }
    ]
  },
  suplencia: {
    title: 'On the Bench',
    text: "After a run without a goal, the manager tells you you'll be starting on the bench on Sunday.",
    options: [
      {
        label: 'Accept it and work twice as hard',
        outcome: "You train harder than ever. When the chance comes round again, you're ready."
      },
      {
        label: 'Ask for a meeting with the director of football',
        success: 'You make your case calmly and maturely. The club promises you a bigger role.',
        failure: "Going over the manager's head goes down terribly. Now you're in his bad books."
      }
    ]
  },

  // Consequence events: earlier decisions come back.
  'consecuencia-fiesta': {
    title: 'The Photos Surface',
    text: 'A paper runs photos of you out partying last season. The club wants an explanation, and the fans are muttering.',
    options: [
      {
        label: 'Make a public apology',
        outcome: 'You face the microphones and own it. The storm blows over sooner than expected.'
      },
      {
        label: '"My private life is private"',
        success:
          'You say it so calmly that the row simply fizzles out. You even win over a few fans.',
        failure:
          'It comes across as arrogant. You own every headline for a week, and not because of your goals.'
      }
    ]
  },
  'consecuencia-capitan': {
    title: 'The Captain Keeps His Word',
    text: 'Penalty to us in a tight game. The captain picks up the ball, looks around for you and hands it over: "Told you the next one was yours."',
    options: [
      {
        label: 'Give it everything',
        success: 'Goal. The captain is first to reach you. The dressing room is yours.',
        failure: 'Off the post. The captain picks you up: "There\'ll be others."'
      },
      {
        label: 'Hand it back: "You take it, skip"',
        outcome:
          "The gesture doesn't go unnoticed. He scores, and the dressing room now sees you as a leader."
      }
    ]
  },
  'consecuencia-queja': {
    title: 'The Boss Never Forgets',
    text: 'At the first team meeting of the season, the manager reads your quote out loud: "I think I deserve more minutes." The whole dressing room turns to look at you.',
    options: [
      {
        label: 'Hold his gaze: "I still think it, and I\'m going to prove it"',
        success:
          'Half a smile from the boss: "That\'s what I wanted to hear." You start the season with a point to prove.',
        failure: 'He takes it as a challenge. You spend the first few weeks in the stands.'
      },
      {
        label: 'Apologise in front of everyone',
        outcome: 'You swallow your pride. The manager considers the matter closed.'
      }
    ]
  },
  'consecuencia-rival': {
    title: 'Your Rival Makes His Move',
    text: 'Your dressing-room enemy has told the press that "the atmosphere fell apart" because of you. The club wants it settled.',
    options: [
      {
        label: 'Offer him your hand in front of everyone',
        outcome: "You shake hands. You'll never be mates, but the team can breathe again."
      },
      {
        label: 'Tell the club to choose: him or me',
        success: 'The club backs you. Your rival is shipped out on loan in the January window.',
        failure: "The club doesn't do ultimatums. You don't get a minute for a month."
      }
    ]
  },
  'consecuencia-padre': {
    title: 'Dad in the Stands',
    text: "Since that conversation, your dad hasn't missed a single game. Today he's in the stand, in the same seat as always.",
    options: [
      {
        label: 'Dedicate your next goal to him',
        success:
          'You score and point up to the stand. The picture of your dad in tears goes round the world.',
        failure:
          'The goal doesn\'t come, but afterwards your dad hugs you: "I saw a proper number nine today."'
      },
      {
        label: 'Play for the team, the way he taught you',
        outcome: 'A selfless, no-frills performance. That night your dad texts you: "Proud of you."'
      }
    ]
  },
  'consecuencia-ojeador': {
    title: 'The Fans Find Out',
    text: 'Word gets out that you listened to a foreign club. At the first game, part of the crowd boos you as you walk out.',
    options: [
      {
        label: 'Shut them up with a goal',
        success: 'You score and kiss the badge. The boos turn to applause.',
        failure: "Your nerves get the better of you. You're subbed at half-time to more boos."
      },
      {
        label: 'Write an open letter to the fans',
        outcome: "You explain that listening isn't leaving. Part of the crowd forgives you."
      }
    ]
  }
}

/** English texts for the context events (`CONTEXT_EVENTS` in data/contextEvents.ts). */
export const CONTEXT_EVENTS_EN: Record<string, EventText> = {
  'nomina-grande': {
    title: "A Big Club's Payslip",
    text: 'Your first month at one of the biggest clubs in the world. You open your banking app and count the zeros twice. Nobody in this dressing room talks about money, though: here, they talk about trophies.',
    options: [
      {
        label: 'Celebrate by buying a massive house and a flash supercar',
        outcome:
          'The house ends up in a magazine and the car all over social media. The boss is not amused when you roll into training in it.'
      },
      {
        label: 'Hire a financial adviser and live just as you did before',
        success:
          "You invest sensibly and stay in the same old flat. The club appreciates that you haven't lost your head.",
        failure:
          'The adviser turns out to be a mate of a mate. You lose a tidy sum on a scheme nobody can explain.'
      },
      {
        label: 'Ring your family and ask what they need',
        outcome:
          'Your mum cries down the phone and your dad is lost for words. You pay off the mortgage on the family home and feel lighter than ever.'
      }
    ]
  },
  'nuevo-pais': {
    title: 'A New Country',
    text: "New city, new language, and a dressing room laughing at jokes you don't get. The club offers you a private tutor, and a teammate from back home offers to show you around.",
    options: [
      {
        label: 'Language lessons every day, even if they wear you out',
        success:
          'Three months in, you do your first interview in the local language. The crowd adopts you.',
        failure:
          "It's a real struggle, and you end up mangling your words at a press conference. The memes run for a week."
      },
      {
        label: 'Stick with the lads from back home in the squad',
        outcome:
          'You feel right at home, but the rest of the dressing room sees you as part of a closed clique.'
      },
      {
        label: 'Bring your family over to live with you',
        outcome:
          'The house fills with familiar voices and the food you grew up on. You settle in quicker than expected.'
      }
    ]
  },
  'goleada-a-favor': {
    title: 'After the Thrashing',
    text: "You've just beaten {rival} {marcador}. The dressing room is bouncing and someone suggests a night out in town to celebrate. Training is at ten tomorrow morning.",
    options: [
      {
        label: 'Go out with everyone and enjoy the moment',
        outcome: 'A night to remember. Next day, the fitness coach makes you all run twice as much.'
      },
      {
        label: 'A quiet dinner with the senior pros, then home',
        outcome:
          'You hear stories of other big wins, and of the falls that followed. You go to bed with your feet firmly on the ground.'
      },
      {
        label: 'Urge calm on social media: "This is only the beginning"',
        success:
          'Everyone likes the message: ambition without arrogance. The press hold you up as an example.',
        failure: 'It sounds cocky. The {rival} fans screenshot it for the return fixture.'
      }
    ]
  },
  'hat-trick': {
    title: 'The Hat-Trick Ball',
    text: "You scored {goles} against {rival} (final score: {marcador}). The kit man brings you the match ball, signed by the whole dressing room. It's yours to keep.",
    options: [
      {
        label: 'Give it to your mum',
        outcome:
          'She puts it in the living room, in a display cabinet she buys the very next day. Every visitor gets the tour.'
      },
      {
        label: 'Give it to a kid in the crowd who was crying with joy',
        outcome: 'The video goes round the country. The kid falls asleep hugging the ball.'
      },
      {
        label: 'Keep it, and promise another one next month',
        success:
          'You deliver with a brace the following week. The crowd starts chanting your promise back at you.',
        failure: 'The goals dry up, and the press remind you of your promise every Sunday.'
      }
    ]
  }
}
