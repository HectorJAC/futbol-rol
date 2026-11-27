import type { EventText } from '../packs'

/** English texts for the dressing-room events (`TEAM_EVENTS` in data/teamEvents.ts). */
export const TEAM_EVENTS_EN: Record<string, EventText> = {
  // Captaincy
  'capitania-oferta': {
    title: 'The Armband',
    text: 'After all these seasons at the club, the boss calls you into his office. {capitan} and {veterano} are waiting there: "We\'ve talked it over in the dressing room. We want you to be captain."',
    options: [
      {
        label: 'Accept, and address the whole dressing room with a speech',
        success:
          'You talk about the people who work behind the scenes, about the fans, about everything still left to win. When you finish, nobody says a word: they just stand and applaud.',
        failure:
          'You stumble over your words, say "we\'ve got to give it everything" three times and wrap up early. The armband is yours, but a couple of the old heads swap glances.'
      },
      {
        label: 'Accept, no speeches: "I\'d rather do my talking on the pitch"',
        outcome:
          '{capitan} takes off the armband and puts it on you himself. On Sunday, you lead the team out of the tunnel.'
      },
      {
        label: 'Turn it down and ask for {capitan} to keep it, with {veterano} as vice-captain',
        outcome:
          '"It\'s not my time yet." {capitan} looks at you, visibly moved, and {veterano} nods. The dressing room understands the gesture, though the boss looks thoughtful.'
      }
    ]
  },
  'capitania-primer-conflicto': {
    title: 'Your First Fire as Captain',
    text: "{rivalPuesto} and {joven} end up shoving each other in training after a nasty tackle. That same afternoon another problem lands: the board still hasn't paid the bonuses it promised, and the dressing room expects you to speak up.",
    options: [
      {
        label: 'Shut yourself in with {rivalPuesto} and {joven} until they shake hands',
        success:
          "You let them have their say, then you have yours. They walk out together, and the next day they're linking up perfectly in the rondo.",
        failure:
          "The meeting goes worse than the training session did. Each of them walks out convinced you're on the other's side."
      },
      {
        label: 'Protect the kid: "Nobody touches {joven}"',
        outcome:
          "{joven} won't forget that you stood up for him. Neither will {rivalPuesto}, for very different reasons."
      },
      {
        label: "Park the fight for now and march into the chairman's office about the bonuses",
        success:
          'Without raising your voice, you go through every promise, with dates and figures. By Friday the bonuses are in the bank, and the dressing room greets you like a hero.',
        failure:
          'The chairman sees you off in five minutes with a "we\'ll see". You come back empty-handed, and the bust-up from training is still simmering.'
      }
    ]
  },
  'capitania-portavoz': {
    title: 'Speaking for the Squad',
    text: 'A {marcador} defeat to {rival}, and the word "crisis" is starting to do the rounds. The press officer has news for you: as captain, today it\'s your turn in front of the microphones.',
    options: [
      {
        label: 'Take the blame on behalf of the whole squad',
        success:
          'No excuses: "This is on us, the players, first and foremost." The fans appreciate the honesty, and the dressing room feels like someone has their back.',
        failure:
          'It sounds like a stock line, and a reporter asks whether that includes your misses in front of goal. You freeze in front of the cameras.'
      },
      {
        label: 'Close ranks behind the manager: "We\'re all with the gaffer"',
        outcome:
          'The gaffer thanks you with a nod at training. In the dressing room, the ones calling for his head look at you differently.'
      },
      {
        label: "Say loud and clear that some aren't pulling their weight",
        outcome:
          'The headline is brutal and the dressing room is in uproar: nobody knows who you meant, so everybody assumes it was them.'
      }
    ]
  },

  // Teammates
  'comp-tregua-rival': {
    title: 'Truce in the Car Park',
    text: 'You and {rivalPuesto} haven\'t said a word to each other in weeks. Today he\'s waiting by your car: "This is dragging us both down. Shall we bury the hatchet?"',
    options: [
      {
        label: 'Shake his hand and suggest you share the penalties',
        outcome:
          "You shake on it in front of half the dressing room. Next day at training, you're even looking for each other in the passing drills."
      },
      {
        label: 'Challenge him to a shoot-out after training: winner takes the penalties',
        success:
          'Five out of five, all in the top corner. {rivalPuesto} laughs, high-fives you and admits the penalties are yours.',
        failure:
          "Your third one hits the post. He keeps his side of the deal, you keep yours: the penalties are his. At least you're talking now."
      },
      {
        label: 'Carry on as you are: "The shirt is won on the pitch"',
        outcome:
          '{rivalPuesto} shrugs and walks off. The cold war goes on, and the dressing room is starting to tire of it.'
      }
    ]
  },
  'comp-lesion-rival': {
    title: 'The Shirt Is Yours',
    text: '{rivalPuesto} ruptures a knee ligament in training: three months out. The boss doesn\'t beat about the bush: "From Sunday, you\'re my number nine."',
    options: [
      {
        label: 'Visit him in hospital with a shirt signed by the whole squad',
        outcome:
          'His eyes well up when he sees the signatures. "Keep my shirt warm, but don\'t get used to it," he jokes.'
      },
      {
        label: 'Send him a text and focus on making the most of it',
        outcome:
          'A quick "chin up, mate", then back to work. You train like never before and the boss notices. So does {rivalPuesto}, from the physio room.'
      },
      {
        label: 'Publicly promise to dedicate your first goal as a starter to him',
        success:
          'It comes after twenty minutes, and you run to the camera holding up his shirt number on your fingers. {rivalPuesto} watches at home with his leg up.',
        failure:
          'Three games and not a sniff of goal. The dedication hangs in the air, and {rivalPuesto} has a sarcastic dig about it in the dressing room.'
      }
    ]
  },
  'comp-consejo-capitan': {
    title: 'A Word from the Captain',
    text: '{capitan} takes you aside after training: "You\'re getting caught offside far too often. Stop watching the ball and keep an eye on the last defender."',
    options: [
      {
        label: 'Listen, and stay behind to work on it together',
        outcome:
          'Half an hour of runs in behind, with {capitan} playing centre-back. By the end of the week, you can read the line before it moves.'
      },
      {
        label: 'Thank him, and ask how to win over the dressing room too',
        success:
          'It catches him off guard, but he likes it. He tells you who really runs things in there and how to talk to each of them.',
        failure: 'The chat drags on and turns awkward. {capitan} ends up glancing at his watch.'
      },
      {
        label: "Tell him you know what you're doing",
        outcome:
          '{capitan} puts his hands up and walks off without a word. A couple of teammates heard the whole thing.'
      }
    ]
  },
  'comp-fiesta-amigo': {
    title: 'A Birthday the Night Before',
    text: "It's {amigo}'s birthday and he's throwing a party at his place the night before the game. \"If you don't come, I'm taking it personally.\"",
    options: [
      {
        label: 'Go, and stay until the lights go out',
        outcome:
          "You dance, you sing, you end up on the decks. {amigo} says it's the best birthday of his life; your legs, the next day, beg to differ."
      },
      {
        label: 'Pop in, raise a glass with him and be gone before midnight',
        success:
          "You give him a hug, blow out the candles with him and you're in bed by half eleven. {amigo} understands, and he's grateful you came.",
        failure:
          'One drink leads to another, and someone posts a video of you dancing on the table at three in the morning.'
      },
      {
        label: 'Stay home and bring him a present to training',
        outcome:
          '{amigo} thanks you with half a smile. He understands, but you can tell he was hoping for more.'
      }
    ]
  },
  'comp-mentor-joven': {
    title: 'The Kid Wants to Learn',
    text: '{joven}, the academy striker, is waiting for you outside the gym. You can tell he\'s working up the nerve: "I play in your position and I want to learn from you. Would you give me a hand?"',
    options: [
      {
        label: 'Take him under your wing: extra sessions every week',
        outcome:
          'You teach him how to shape his body, when to ask for it in behind and how to handle the pressure. Explaining it all, you understand your own game better too.'
      },
      {
        label: 'Give him a couple of tips and let him find his own way',
        outcome:
          '"Outwork everyone, and don\'t believe a word the papers say." {joven} types it into his phone.'
      },
      {
        label: 'Put him in his place: "Nobody handed me anything"',
        outcome:
          '{joven} drops his head and walks away. {veterano} remarks, loud enough for everyone to hear, that you were a kid once too.'
      }
    ]
  },
  'comp-ultima-temporada-veterano': {
    title: 'One Last Favour',
    text: '{veterano} announces he\'ll hang up his boots at the end of the season. At the team dinner he sits down next to you: "I want to go out with a goal at home. If we get a penalty and we\'re winning, let me take it."',
    options: [
      {
        label: 'Promise him, and keep your word in the last home game',
        outcome:
          'Eighty minutes gone, 2-0 up, penalty. You hand the ball to {veterano}, who rifles it into the top corner and sobs on your shoulder. The whole ground rises to its feet.'
      },
      {
        label: 'Promise him something better: the assist for his goal',
        success:
          'In the last home game you skip past two defenders and, instead of shooting, lay it on a plate for {veterano}. Goal, standing ovation, and a photo that will end up framed in his living room.',
        failure:
          'You try all afternoon, but not one pass reaches him cleanly. {veterano} thanks you anyway, with a slightly sad smile.'
      },
      {
        label: "Tell him penalties aren't handed out as gifts",
        outcome:
          '{veterano} nods quietly and changes the subject. The boss approves of your professionalism; the dressing room, less so.'
      }
    ]
  },
  'comp-vestuario-dividido': {
    title: 'A Dressing Room Split in Two',
    text: 'After a week of rows, {capitan} is leading the players demanding changes from the manager, and the boss wants to know whose side everyone is on. All eyes are on you: your goals carry weight in this dressing room.',
    options: [
      {
        label: 'Back {capitan} and the rest of the lads',
        outcome:
          'You sit next to {capitan} at the meeting. The dressing room comes out more united than ever; the boss writes your name down in his notebook.'
      },
      {
        label: "Come out on the manager's side",
        outcome:
          "You back the boss in front of everyone. He won't forget it, but some of the lads stop speaking to you."
      },
      {
        label: 'Take the squad and staff out for dinner ({dinero:15000} out of your own pocket)',
        success:
          'Somewhere between the main course and dessert, {capitan} and the boss end up raising a toast together. The bill is frightening, but the squad is pulling in the same direction again.',
        failure:
          'The food is superb, but each camp sits at its own end of the table. At least everyone thanks you for the invite.'
      }
    ]
  },
  'comp-venta-amigo': {
    title: 'They Want to Sell Your Mate',
    text: 'The papers are treating it as a done deal: the club will sell {amigo} to balance the books. As you leave training, a reporter shoves a microphone in your face: "What do you make of it?"',
    options: [
      {
        label: 'Defend him publicly: "If {amigo} goes, the club is making a mistake"',
        outcome:
          "The clip goes viral, and {amigo} sends you a message you'll never forget. Upstairs in the boardroom, though, it has gone down very badly."
      },
      {
        label: 'Say nothing to the press and speak privately to the director of football',
        success:
          'You explain what {amigo} means to the group. A week later the sale collapses, and only {amigo} knows it was down to you.',
        failure:
          'The director listens politely and reminds you that numbers are numbers. {amigo} appreciates you trying.'
      },
      {
        label: '"That\'s the club\'s decision. I just focus on playing"',
        outcome:
          "The board appreciates your discretion. {amigo} reads your words on his phone, and it's days before he sits next to you on the team bus again."
      }
    ]
  },

  // Former teammates
  'ex-llamada-consejo': {
    title: 'The Midnight Phone Call',
    text: "{excompanero}, your old teammate at {exclub}, rings you at midnight. He's been offered a massive contract in a league on the other side of the world and doesn't know what to do: \"You've always kept a cool head. What would you do?\"",
    options: [
      {
        label: 'Hear him out calmly and help him decide',
        success:
          'You ask him the questions nobody else has: his family, his career, what he really wants. He hangs up at two in the morning with a clear head and an "I owe you one".',
        failure:
          'You end up lecturing him about money and ambition. {excompanero} says goodbye rather coldly.'
      },
      {
        label: 'Tell him to join your club and put a word in with the director of football',
        outcome:
          '{excompanero} loves the idea. The director of football, much less so: he reminds you that recruitment is what his scouts are for.'
      },
      {
        label: "Cut it short: you've got a game tomorrow",
        outcome:
          '"OK, OK, sorry." You get your eight hours; it\'s months before {excompanero} rings you again.'
      }
    ]
  },
  'ex-critica-entrevista': {
    title: 'Shots from the Past',
    text: '{excompanero}, who played alongside you at {exclub}, says in an interview that you\'re "a selfish player who only cares about his own numbers". The clip is everywhere online.',
    options: [
      {
        label: 'Hit back with a dry quip at your press conference',
        success:
          '"I wish him all the best. And if he likes, I\'ll send him my numbers to study." The room laughs and the line makes every headline.',
        failure:
          'You take the bait and end up airing the dirty laundry from your days at {exclub}. The row rumbles on for weeks.'
      },
      {
        label: 'Say nothing and answer with goals',
        success:
          "You score on Sunday and walk through the mixed zone without saying a word. You don't need to.",
        failure:
          "The goals don't come, and the press start to think {excompanero} might have a point."
      },
      {
        label: 'Ring him and talk it out man to man',
        success:
          'He picks up on the third try and you talk it all through: old grudges from {exclub} that neither of you had ever settled. You end up laughing.',
        failure:
          'He hangs up after two minutes. Next day, his camp leaks that you rang him "to threaten him".'
      }
    ]
  },
  'ex-boda': {
    title: 'A Wedding in Mid-Season',
    text: '{excompanero}, your best mate from your {exclub} days, is getting married and wants you as his best man. The wedding is in another city, the day before a league game.',
    options: [
      {
        label: 'Ask the boss if you can go and come back the same night',
        success:
          'The boss agrees on one condition: back at the team hotel by nine. You make it in time, tie stuffed in your pocket, and {excompanero} is over the moon.',
        failure:
          'The boss gives you a flat no. You stay behind, and {excompanero} takes it worse than you expected.'
      },
      {
        label: 'Go without telling the boss, first flight back',
        outcome:
          'Your speech has half the room in tears. Next morning you turn up at the ground with bags under your eyes, and the boss already knows everything.'
      },
      {
        label: 'Apologise and pay for their honeymoon ({dinero:10000})',
        outcome:
          '{excompanero} messages you from a picture-postcard beach: "You\'re forgiven. Almost." The boss is pleased you didn\'t skip the team hotel.'
      }
    ]
  },
  'ex-provocacion-partido': {
    title: 'Reunion in the Tunnel',
    text: 'Today you\'re up against {excompanero}, your old teammate from {exclub}, and his new side. In the tunnel he leans in and mutters: "You won\'t get a sniff today. I know you too well."',
    options: [
      {
        label: 'Answer with a goal and dedicate it to him',
        success:
          "Goal after fifteen minutes. You run towards his bench with a hand cupped to your ear. {excompanero} won't forgive that in a hurry.",
        failure:
          'You miss two one-on-ones and {excompanero} gives you a sarcastic round of applause each time. The clip goes all over social media.'
      },
      {
        label: 'Smile and give him a hug',
        outcome:
          '"Come here, you." You laugh like you did back at {exclub}, and the cameras catch the moment. Then, out on the pitch, it\'s every man for himself.'
      },
      {
        label: 'Wind him up right back for the whole ninety minutes',
        success:
          'You needle him until he snaps and gets sent off for a swipe at you. Your side make the most of it, and the boss tries to hide a smile.',
        failure:
          "You're the one who loses it: booked for dissent, then again for an elbow. You're in the shower before half-time."
      }
    ]
  },
  'ex-negocio': {
    title: 'Business Between Mates',
    text: '{excompanero}, your old teammate at {exclub}, wants the two of you to start a chain of padel clubs. He needs {dinero:120000} from each partner and swears the thing "pays for itself".',
    options: [
      {
        label: 'Become a partner, after going over the books with a fine-tooth comb',
        success:
          "You spot a couple of inflated costs, fix them together and open the first club. A year later it's turning a profit.",
        failure:
          'The books were hiding debts you failed to spot. You lose almost everything, and conversations with {excompanero} get tense.'
      },
      {
        label: "Put the money in, no questions: he's your mate",
        outcome:
          "You sign without reading the small print. {excompanero} gives you a massive hug; as for the money, there's no sign of it yet."
      },
      {
        label: "Tell him you don't mix friendship and money",
        outcome:
          '"Your loss," he laughs. He never raises it again, but it\'s a while before he rings you.'
      }
    ]
  },
  'ex-partido-homenaje': {
    title: 'A Testimonial Match',
    text: '{excompanero} is hanging up his boots, and {exclub} are putting on a testimonial with the players from that old squad. It falls mid-season, but on the invitation he\'s written by hand: "It won\'t be the same without you."',
    options: [
      {
        label: 'Go, and set him up for the last goal of his career',
        success:
          'Eighty-ninth minute: you shape to shoot and slip it to {excompanero} in the six-yard box. Goal, tears, and a hug that makes every front page.',
        failure:
          "Your pass runs too long and the match ends without his goal. Even so, in the centre circle, {excompanero} hugs you like it's day one."
      },
      {
        label: 'Just go to wave to the crowd and say a few words',
        outcome:
          'You take the mic and tell a story from your days together at {exclub}. The crowd laughs, applauds and chants both your names.'
      },
      {
        label: "Send a video message: you can't skip training",
        outcome:
          "Your message plays on the big screen. {excompanero} thanks you on social media, though everyone finds it strange that you weren't there."
      }
    ]
  }
}
