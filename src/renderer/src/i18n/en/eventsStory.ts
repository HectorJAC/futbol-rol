import type { EventText } from '../packs'

/**
 * English texts for the partner/family storyline (`STORY_EVENTS`).
 * Written from scratch for English players: same situations and choices,
 * own wording. `{pareja}` is her name, `{expareja}` your last ex's name and
 * `{hijos}` the number of children.
 */
export const STORY_EVENTS_EN: Record<string, EventText> = {
  'pareja-descubre': {
    title: 'She Knows',
    text: "{pareja} is waiting for you on the sofa, phone in hand. Someone has sent her the photos from that night at the hotel, and tomorrow they'll be all over a gossip magazine. She isn't crying. That's the worst part.",
    options: [
      {
        label: 'Say sorry and fight for her',
        success:
          'You talk for hours, no excuses. As the sun comes up, worn out, she says she\'ll try. "Once. Never again."',
        failure:
          'Every excuse digs the hole deeper. {pareja} packs a bag that same night, and the gossip pages have a field day.'
      },
      {
        label: 'Tell her everything, hold nothing back, and accept her decision',
        success:
          "Your honesty disarms her. It'll take months to trust each other again, but you decide to carry on. You learn something about yourself you don't like.",
        failure:
          'She hears you out to the last word, then stands and hands back her keys. "Thanks for being honest. It\'s just too late."'
      },
      {
        label: 'Make it easy: end it yourself',
        outcome:
          "You can't bear to look her in the eye every morning. You pack your things and check into a hotel. The magazines cast you as the villain of the piece, and maybe they're right."
      }
    ]
  },

  'pareja-conocer': {
    title: 'Someone Special',
    text: "At a teammate's birthday do you end up chatting to a girl who hasn't the faintest idea who you are. She talks about books, travel, anything but football. You haven't laughed this much in years.",
    options: [
      {
        label: "Ask her out before the night's over",
        success:
          'Your voice wobbles, but she smiles: "I was starting to think you\'d never ask." You train all week with a daft grin that nobody in the dressing room lets slide.',
        failure:
          "You get flustered, talk her through your last goal in painstaking detail, and she pops off to get a drink. She doesn't come back."
      },
      {
        label: 'Get her number and see where it goes',
        outcome:
          "Texts, a coffee, a long walk after training. Bit by bit, no rush. A month on, you can't picture a week without her."
      },
      {
        label: "Say a polite goodnight: right now it's football or nothing",
        outcome:
          "You head home early. Next morning you're first through the gates at the training ground, though part of you keeps wondering what might have been."
      }
    ]
  },

  'pareja-conocer-infancia': {
    title: 'Someone Special',
    text: "Home for the holidays, you bump into your childhood friend: the girl who played football in the street with you until it got dark and always beat you on penalties. You sit on your old bench and, before either of you notices, it's gone two in the morning.",
    options: [
      {
        label: "Admit you've always fancied her",
        success:
          'She goes quiet for the longest second of your life, then laughs: "I\'ve been waiting for you to say that since I was twelve." You head back to the training ground walking on air.',
        failure:
          'She looks at you fondly and gives you a hug. "You\'re like a brother to me." You walk home in silence. The friendship survives, but it stings.'
      },
      {
        label: "Suggest meeting up every time you're home",
        outcome:
          "A coffee every visit, messages every day in between. One night you realise you've stopped saying goodbye like friends."
      },
      {
        label: "Leave it be: you won't risk a lifelong friendship over this",
        outcome:
          "You part with a long hug. She goes back to her life and you to yours, though sleep doesn't come easily that night."
      }
    ]
  },

  'pareja-conocer-hospital': {
    title: 'Someone Special',
    text: "The club sends a few of you to the children's hospital. The volunteer showing you round the wards couldn't care less about autographs, but her face lights up when you sit down on the floor to play with the kids.",
    options: [
      {
        label: 'Wait for her outside and ask her to dinner',
        success:
          '"Only if it\'s somewhere nobody asks you for selfies," she says. You find one. It\'s the first of many dinners.',
        failure:
          "She tells you she doesn't date footballers, with a smile that settles the matter. At least the kids have asked you to come back."
      },
      {
        label: 'Sign up as a volunteer and go back every week',
        outcome:
          "You go back on Tuesdays, no cameras. Between stories and games of cards, one afternoon she's waiting for you outside with two coffees."
      },
      {
        label: 'Thank her and get back to the day job',
        outcome:
          "You sign the last few balls and head off to training. Her smile stays with you longer than you'd care to admit."
      }
    ]
  },

  'pareja-conocer-cafeteria': {
    title: 'Someone Special',
    text: 'Every morning before training you stop at the same coffee shop. The girl behind the counter has your order ready before you ask and today, for the first time, there\'s a note on the cup: "Why not sit down and drink it one day?"',
    options: [
      {
        label: 'Grab a stool at the counter and get chatting',
        success:
          "You're late for training for the first time ever, and you don't care. That evening you have dinner together.",
        failure:
          "The eight o'clock rush piles in, the counter fills up and you don't even get as far as names. Next morning, there's no note."
      },
      {
        label: 'Write a note back, with your number on it',
        outcome:
          "Notes go back and forth for weeks, until one Sunday you meet away from the café. There's no going back now."
      },
      {
        label: 'Find another coffee shop: no distractions',
        outcome:
          "The new place does worse coffee and the barista barely looks at you. You're on time for every single session."
      }
    ]
  },

  'pareja-conocer-vuelo': {
    title: 'Someone Special',
    text: 'A storm leaves the flight home from an away game stuck on the tarmac for three hours. The girl in the next seat lends you a charger, then half her sandwich, and in the end tells you her whole life story. She has no idea who you are until the row across asks you for a photo.',
    options: [
      {
        label: 'Ask her out before you land',
        success:
          '"You owe me half a sandwich," she replies. The following week you pay her back at the best restaurant in town.',
        failure:
          "You land, she says a hurried goodbye and vanishes into the crowds at arrivals. You don't even know her surname."
      },
      {
        label: 'Invite her to your next home game',
        outcome:
          "She comes along, can't get her head round offside and cheers your every touch louder than anyone. At full time she's waiting for you outside the ground."
      },
      {
        label: 'Headphones on: study footage of the next opponents',
        outcome:
          'You use the dead hours to study the next opponents. The gaffer clocks how focused you are; she nods off with her head against the window.'
      }
    ]
  },

  'pareja-familia': {
    title: 'Meeting the Parents',
    text: "{pareja} takes you to her parents' for Sunday lunch. Her dad has had a season ticket at your fiercest rivals for forty years, and he opens the door with the enemy's scarf round his neck.",
    options: [
      {
        label: 'Take the digs with good humour',
        success:
          'You play along, laugh at yourself and end up raising a glass together. On the doorstep he claps you on the back: "Not bad, for one of that lot." {pareja} can\'t believe it.',
        failure:
          "By the third joke about your latest miss, you snap. The table goes cold, and {pareja} doesn't say a word to you the whole drive home."
      },
      {
        label: 'Give him two box seats for the derby',
        outcome:
          'He turns up to the derby... in his scarf. But afterwards he asks for a photo "for the grandson you two will give me one day". {pareja} laughs and takes your hand.'
      },
      {
        label: "Cry off: you're away with the squad",
        outcome:
          '{pareja} goes on her own. She never complains, but for weeks you can feel something has cooled between you.'
      }
    ]
  },

  'pareja-celos': {
    title: 'Jealousy Online',
    text: "A famous influencer is plastering your posts with hearts and fire emojis. Half the country is speculating about a romance. {pareja} holds up her phone without a word. She doesn't need one.",
    options: [
      {
        label: 'Post a photo of you two and put it to bed',
        outcome:
          'The photo of you both on the beach racks up the likes. The rumours are dead within a day, and when {pareja} sees it she gives you a long kiss.'
      },
      {
        label: 'Talk it through calmly: "You\'ve nothing to worry about"',
        success:
          "You show her you don't reply to anyone and hand over your phone without being asked. That night you promise each other: no secrets, ever.",
        failure:
          'You get defensive and it ends in a shouting match. You sleep on the sofa and turn up to training with bags under your eyes.'
      },
      {
        label: 'Play it down: "It\'s just social media"',
        outcome:
          "To you it's nothing. To {pareja}, it's something. It hangs in the air between you, and your name is all over the gossip shows."
      }
    ]
  },

  'pareja-convivir': {
    title: 'One Front Door',
    text: 'You\'ve been together a while now, and {pareja} spends more nights at yours than at her own place. One morning over breakfast, out it comes: "What if we found somewhere of our own?"',
    options: [
      {
        label: 'Find a flat together',
        outcome:
          'After weeks of viewings you find one with a terrace and lovely evening light. The first night you eat pizza sitting on the floor, surrounded by boxes.'
      },
      {
        label: "Ask her to move into yours: it's all set up",
        success:
          'You clear out half the wardrobe and let her rehang every picture. "Now it actually feels like a home," says {pareja}. You have to admit she\'s right.',
        failure:
          '"Yours? So what am I, a guest?" The row gets away from you and ends with {pareja} slamming the door on her way out. She doesn\'t come back that night.'
      },
      {
        label: 'Ask for time: you need to focus on football',
        outcome: 'She nods, but the light goes out of her eyes. "Fine. But I won\'t wait forever."'
      }
    ]
  },

  'pareja-propuesta': {
    title: 'The Ring',
    text: "For weeks there's been a ring hidden at the bottom of your kit bag. Every time {pareja} goes anywhere near it, your heart stops. The moment has come... or has it?",
    options: [
      {
        label: 'Go big: the empty stadium, floodlights and violins',
        success:
          "Her name lights up on the big screen. {pareja} covers her face, bursts into tears and says yes before you've finished the question. The video goes round the world.",
        failure:
          'You forget your speech, the violins go out of tune and {pareja}, who hates being the centre of attention, freezes. "Ask me when it\'s just us," she whispers.'
      },
      {
        label: 'Ask at home, just the two of you, over the meal from your first date',
        outcome:
          'No cameras, no witnesses. Just the two of you, two plates of pasta and a "yes" that will stay with you for ever.'
      },
      {
        label: 'Wait a little longer',
        outcome:
          'The ring goes back to the bottom of the bag. The right moment will come. {pareja} suspects nothing... or so you think.'
      }
    ]
  },

  'pareja-boda': {
    title: 'The Wedding',
    text: "Time to decide what sort of wedding it'll be. {pareja}'s mum already has a guest list of four hundred, {pareja} dreams of something small by the sea, and your agent dreams of selling the exclusive to a magazine.",
    options: [
      {
        label: 'Pull out all the stops, magazine exclusive and all',
        outcome:
          "A country estate, four hundred guests, half the dressing room dancing till dawn and the cover of the nation's best-selling magazine. {pareja} is radiant."
      },
      {
        label: 'A small wedding, just your nearest and dearest',
        outcome:
          "Forty people, a little cove, bare feet in the sand. Your gran cries through the whole ceremony. It's exactly what you and {pareja} wanted."
      },
      {
        label: "Put it off: the fixture list won't allow it",
        outcome:
          '{pareja} understands, though her mum is rather less forgiving. The date stays up in the air until next summer.'
      }
    ]
  },

  'pareja-carrera': {
    title: 'Her Career Matters Too',
    text: '{pareja} is offered the chance to run the architecture practice where she works: the job of her dreams. That same week your agent rings because a club abroad has been asking about you. "I\'ve got a career too," she reminds you.',
    options: [
      {
        label: "Tell your agent you're going nowhere",
        outcome:
          'You hang up before your agent can name a figure. {pareja} takes the job, and that night you raise a glass to the both of you.'
      },
      {
        label: 'Persuade her you should both go if the offer comes',
        success:
          'You tell her about the city, about a practice there she admires, about the adventure of it. In the end she smiles: "If we go, we go together. And I\'m choosing the neighbourhood."',
        failure:
          '"And what about me?" The row drags on for days. You don\'t split up, but something cracks, and the lads notice your mind is elsewhere.'
      },
      {
        label: 'Let her make her choice first',
        outcome:
          'You tell her that this time, her career comes first. {pareja} takes the job, and you learn to wait for your own moment without fretting.'
      }
    ]
  },

  'pareja-primer-hijo': {
    title: 'Fatherhood',
    text: 'One evening on the sofa, {pareja} switches off the telly and gives you a very serious look: "I think I\'m ready. Are you?" The old heads in the dressing room say a baby changes your life... and your sleep.',
    options: [
      {
        label: "Yes. Let's do it",
        outcome:
          "Months later your hands shake more in the delivery room than they ever have in a final. You celebrate your next goal rocking an imaginary cradle. You're a dad."
      },
      {
        label: "Wait until the season's over",
        outcome:
          '"Fine, but don\'t let it slide," says {pareja}. You\'ll talk about it again in the summer.'
      }
    ]
  },

  'pareja-crisis': {
    title: 'Stuck in a Rut',
    text: 'Lately you and {pareja} only ever talk about schedules, trips and bills. She eats alone three nights a week and your head is always on the next match. One night she spells it out: "I can\'t go on like this."',
    options: [
      {
        label: 'Try couples counselling',
        outcome:
          'Opening up in front of a stranger is hard, but week by week you start laughing together again. You learn to listen, in the dressing room too.'
      },
      {
        label: 'Surprise her with a trip for two during the break',
        success:
          "A week on an island, phones switched off. On the last night, {pareja} tells you she hasn't felt this close to you in years.",
        failure:
          "A holiday can't fix what you won't talk about. You fly home early, in silence. A month later, {pareja} brings up the word divorce."
      },
      {
        label: "Shrug it off: it'll blow over",
        success:
          'Summer arrives just in time. A few weeks off together and the storm passes on its own... this time.',
        failure:
          "It doesn't blow over. One night you find her suitcases in the hall. {pareja} goes to stay at her sister's, and for the first time the word divorce is said out loud."
      }
    ]
  },

  'pareja-hijo-estadio': {
    title: 'His First Match at the Ground',
    text: "Today {pareja} brings your son to the stadium for the very first time. He's wearing your shirt, which drowns him, and ear defenders against the noise. Before you walk out, you scan the stands for him.",
    options: [
      {
        label: 'Walk out with him in your arms',
        outcome:
          'You carry him all the way to the centre circle. When the whole stadium applauds, he clings to your neck with all his might. That photo will sit on your bedside table for ever.'
      },
      {
        label: 'Promise him a goal',
        success:
          'You score, sprint towards their row and make a heart with your hands. {pareja} lifts him high so the whole ground can see him.',
        failure:
          'The goal never comes. But on the drive home he falls asleep hugging your shirt, and you forget all about the result.'
      }
    ]
  },

  'pareja-otro-hijo': {
    title: 'A Growing Family',
    text: 'Kids in the house: {hijos}. Hours of sleep: nowhere near enough. Even so, as you clear toys off the landing, {pareja} gives you a cheeky smile: "Shall we go for another?"',
    options: [
      {
        label: 'Bring on one more',
        outcome:
          'The family grows. A new cry at four in the morning, and one more reason to leave everything out on the pitch.'
      },
      {
        label: 'Maybe later',
        outcome:
          '"Maybe later," you both say, and you laugh, because you know this conversation isn\'t over.'
      },
      {
        label: 'Decide the family is complete',
        outcome:
          "You talk it over calmly and agree: you're perfect as you are. That night you and {pareja} sleep straight through for the first time in years."
      }
    ]
  },

  'pareja-cumpleanos': {
    title: 'A Birthday Without You',
    text: "The cup tie falls on your son's birthday. The cake, the balloons, the whole family round at the house... and an empty chair if you travel with the team.",
    options: [
      {
        label: 'Ask the gaffer to let you stay at home',
        success:
          'The boss, a father of three, gives you the day off without blinking: "Family comes first." You blow out the candles with your boy and polish off half the cake.',
        failure:
          '"That\'s not something you ask here," he snaps. You travel with the squad in a foul mood and spend the match watching the clock.'
      },
      {
        label: 'Play and score one for him',
        success:
          'You score and mime blowing out candles straight down the camera. At home, your son is bouncing on the sofa screaming your name.',
        failure:
          "You don't score, and by the time you get home he's asleep with his party hat still on. You stand in the doorway watching him for a while."
      },
      {
        label: 'Bring the party forward a day and go all out',
        outcome:
          "A bouncy castle, a clown and half the school in the garden. It's not the actual day, but nobody will forget it."
      }
    ]
  },

  'pareja-tentacion': {
    title: 'A Night Away from Home',
    text: 'Away trip, team hotel. After the win, in the hotel bar, a woman sits down next to you and says she\'s been waiting all night for you to come down. On your phone, a message from {pareja}: "Miss you. Come home soon."',
    options: [
      {
        label: 'Take her up to your room',
        outcome:
          'You let yourself go. Next morning you feel invincible and wretched all at once, and you delete every message before going down to breakfast.'
      },
      {
        label: 'Have one drink with her and get out in time',
        success:
          'A chat, a laugh and a timely "goodnight". You\'ve played with fire without getting burnt.',
        failure:
          'A paparazzo snaps the two of you at the bar. Nothing happened, but the photo tells a different story. {pareja} believes you, though it hurts her.'
      },
      {
        label: 'Get up and ring her',
        outcome:
          'You pay for your lemonade and head upstairs. You chat about nothing until the small hours and fall asleep with the phone in your hand and a clear conscience.'
      }
    ]
  },

  'pareja-aniversario': {
    title: 'Wedding Anniversary',
    text: 'Another anniversary with {pareja}. This year it lands slap bang in a match week, with the squad in a hotel the night before.',
    options: [
      {
        label: 'A surprise dinner at your usual restaurant',
        outcome:
          'Same corner table, same wine, same old jokes. {pareja} raises her glass: "To many more."'
      },
      {
        label: 'Sneak out of the team hotel to see her for an hour',
        success:
          "Out through the hotel's service door, an hour with {pareja} on a bench by the seafront and back before curfew. Nobody's any the wiser.",
        failure:
          'A club official catches you sneaking back in. A fine, a rollicking from the gaffer and headlines. At least {pareja} sees the funny side.'
      },
      {
        label: 'Send a message and promise to make it up to her in summer',
        outcome:
          "{pareja} sends back a heart and a photo of the dress she's saving for the summer. Now you'd better deliver."
      }
    ]
  },

  'pareja-superar': {
    title: 'Moving On',
    text: 'Since you and {expareja} split up, the house has been far too quiet. Your mates keep trying to drag you out of it; your fitness coach keeps telling you to pour everything into your football.',
    options: [
      {
        label: 'Bury yourself in football: train morning and afternoon',
        outcome:
          'First in, last out. The hurt turns into miles in the legs and shots on goal, and the coaching staff take note.'
      },
      {
        label: 'Go out partying every night',
        success:
          "You have a whale of a time and start smiling again. Best of all, nobody takes a photo they shouldn't.",
        failure:
          'You get snapped leaving a nightclub at six in the morning, two days before a match. The gaffer is not amused.'
      },
      {
        label: 'Let your mates set you up with someone',
        success:
          'A "casual" dinner that\'s anything but. You resist at first, but she laughs at your terrible jokes and suddenly the house doesn\'t feel so empty.',
        failure:
          "You spend the whole dinner talking about your ex. She's lovely, but you're just not ready yet."
      }
    ]
  }
}
