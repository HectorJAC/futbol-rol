import type { MomentText } from '../packs'

/**
 * English texts for the extra in-match moments (`EXTRA_MATCH_MOMENTS`) and the
 * moments against a former club (`EXCLUB_MOMENTS`). Written from scratch:
 * same plays and choices, own wording. `{rival}` is the opponent (your old
 * club in the ex-club moments) and `{club}` your current club.
 */
export const EXTRA_MOMENTS_EN: Record<string, MomentText> = {
  'inicio-primer-remate': {
    title: 'First Ball into the Box',
    text: 'Minute 17. Your full-back bombs down the flank and looks up. The {rival} centre-back has a fistful of your shirt.',
    options: [
      {
        label: 'Break free and attack the header',
        success: 'You wrench yourself free, climb highest and nod it down inside the post.',
        failure:
          "You're a fraction late. The ball grazes the top of your head and drifts out for a goal kick."
      },
      {
        label: 'Hang at the back post for the knock-down',
        success:
          'Nobody tracks you. The ball drops at your feet and you square it for a teammate, who just has to tap it in.',
        failure:
          "The {rival} keeper claims the cross with ease. You're left standing there alone, with nothing to show for it."
      }
    ]
  },

  'inicio-presion-al-central': {
    title: 'Closing Him Down',
    text: "Minute 22. The {rival} centre-back is dawdling on the ball. Get there in time and you'll pick his pocket.",
    options: [
      {
        label: 'Press flat out and go for the steal',
        success: "Three strides and you're on him. You nick the ball and dink it over the keeper.",
        failure:
          "You're a second too late. He drags it away with his sole and the {rival} fans have a good laugh."
      },
      {
        label: 'Cut off the pass and let him make the mistake',
        success:
          'You block off the easy ball. He panics, gives it away, and your side break and score.',
        failure:
          "You're caught in two minds, neither pressing nor covering. The gaffer is bellowing at you from the touchline."
      }
    ]
  },

  'inicio-entrada-dura': {
    title: 'Scythed from Behind',
    text: 'Minute 27. The {rival} holding midfielder scythes you down from behind without a glance at the ball. The ref only shows yellow. You get up limping.',
    options: [
      {
        label: 'Breathe, and answer with your football',
        success:
          "You don't give him the satisfaction. Next time you're on the ball you take him on, nutmeg him and lay on the goal.",
        failure: 'The anger stays bottled up and you forget how to play for ten minutes.'
      },
      {
        label: 'Let him know you can dish it out too',
        success:
          'At the next fifty-fifty you go in hard but fair. He ends up airborne and leaves you well alone after that.',
        failure:
          "You're late and pick up a yellow of your own. From then on you're playing with the handbrake on."
      }
    ]
  },

  'medio-desmarque-tardio': {
    title: 'The Late Diagonal',
    text: 'Minute 72. The {rival} centre-backs are blowing now. Your midfielder carries it forward, waiting for you to make the run.',
    options: [
      {
        label: 'Diagonal between the centre-backs',
        success:
          'You slip between the pair of them, take it in space and drill it across the keeper.',
        failure: 'The pass arrives, but the centre-back recovers and blocks your shot just in time.'
      },
      {
        label: 'Get it to feet and go at him',
        success:
          'You turn, drop a shoulder, skip past your man and serve a teammate the goal on a plate.',
        failure: "The centre-back doesn't buy the dummy and takes the ball off you cleanly."
      }
    ]
  },

  'final-balon-dividido': {
    title: 'Fifty-Fifty',
    text: 'Minute 75. A loose ball sits up in the middle of the park. You and the {rival} anchorman go for it at the same time.',
    options: [
      {
        label: 'Put your body in and win it',
        success:
          'You win the collision, come away with the ball and spread it wide. The move ends in a goal.',
        failure: "He's heavier. He shoves you aside, plays out and {rival} are into your box."
      },
      {
        label: 'Nip in first with a touch',
        success:
          "You get there first, knock it past him and you're clean through. A cool, calm finish.",
        failure: 'You knock it too far ahead and the keeper comes out to gather it with ease.'
      }
    ]
  },

  'final-contra-tras-corner': {
    title: 'Breakaway from a Corner',
    text: 'Minute 81. {rival} take a corner with everyone forward. The clearance drops at your feet in your own half.',
    options: [
      {
        label: 'Take off with the ball',
        success:
          'Sixty yards at full pelt, legs on fire. You get there and slot it inside the post.',
        failure: 'Halfway there your legs go and the {rival} defender hauls you in.'
      },
      {
        label: 'Wait for support and release it at just the right moment',
        success:
          'You commit the last defender and slip it across at the perfect moment. Your teammate just has to roll it in.',
        failure: 'The pass is underhit and the {rival} defender cuts it out.'
      }
    ]
  }
}

export const EXCLUB_MOMENTS_EN: Record<string, MomentText> = {
  // Derby against the same-city club you left for its neighbours.
  'traicion-pitada': {
    title: 'Judas',
    text: "You walk out and the {rival} end greets you with deafening whistles. A huge banner reads 'JUDAS'. Your new supporters sing your name to drown them out.",
    options: [
      {
        label: 'Cup a hand to your ear and goad your old fans',
        success:
          'The whistling doubles, but the {club} fans go wild for you. Ten minutes in, nobody remembers the banner... except you.',
        failure:
          "Your blood's up and you fly into the first challenge like a bull. Booked after three minutes, and the gaffer's face is like thunder."
      },
      {
        label: 'Ignore them and think only about the game',
        outcome: 'Head down, laces tight, get on with it. The whistles fade into background noise.'
      },
      {
        label: 'Applaud the fans who watched you grow up',
        outcome:
          "Some of your old supporters applaud you back. In the {club} end, a few people can't understand it."
      }
    ]
  },

  'traicion-ley-del-ex': {
    title: 'The Old End',
    text: "Loose ball in the {rival} box and it's you who gets there, alone, right in front of the end that used to call you a hero. If this goes in, the whole stadium will be watching how you celebrate.",
    options: [
      {
        label: "Finish it and celebrate in your old fans' faces",
        success:
          'Goal. You run towards the {rival} end kissing your new badge. They throw everything at you; the {club} fans have made you one of their own.',
        failure: "You sky it. The {rival} end celebrates like they've scored."
      },
      {
        label: "Finish it, and out of respect, don't celebrate",
        success:
          'Goal. Arms down, eyes on the turf. Your old end falls silent. So do a few in your own.',
        failure:
          'The keeper, your old teammate, keeps it out with his foot. He gives you a pat on the back as he gets up.'
      },
      {
        label: 'Square it for a teammate in a better position',
        success:
          "A square ball across goal and your teammate taps in. You're the first one he hugs.",
        failure:
          "The pass is weak and the {rival} centre-back clears. Some say you didn't want to score against your old club."
      }
    ]
  },

  'traicion-tunel': {
    title: 'In the Tunnel',
    text: 'In the tunnel you run into your old {rival} teammates. One of them spits at your feet: "Nobody here forgets what you did."',
    options: [
      {
        label: 'Offer him your hand in front of everyone',
        outcome:
          "He leaves you hanging, but the cameras caught it all. That night, you're the one who comes out of it well."
      },
      {
        label: 'Answer him: "What I did was choose to win"',
        success:
          'You say it without raising your voice and keep walking. Your {club} teammates follow you out as one.',
        failure:
          'Officials have to pull you apart. The referee makes a note and the gaffer holds his head in his hands.'
      },
      {
        label: 'Say nothing and save it for the match',
        outcome:
          'You keep your mouth shut. You walk out with a scowl on your face and fury in your legs.'
      }
    ]
  },

  // Meeting any other former club.
  'exclub-reencuentro': {
    title: 'Homecoming',
    text: "It's the first time you've faced {rival} since you left. The stadium announcer reads out your name and part of the crowd rises to applaud you.",
    options: [
      {
        label: 'Salute your old fans with a hand on your heart',
        outcome:
          "The applause swells. It's a lovely moment, though one or two {club} fans eye it warily."
      },
      {
        label: 'A quick wave, then focus on the game',
        outcome: 'A discreet wave and back to business. Today you play for {club}.'
      },
      {
        label: 'Dedicate the match to the {club} fans',
        outcome:
          'You point to the badge, then to your own supporters. Your old fans switch from applause to whistles.'
      }
    ]
  },

  'exclub-ley-del-ex': {
    title: 'Curse of the Ex',
    text: "The ball sits up for you on the edge of the {rival} box. They say the ex always scores... don't they?",
    options: [
      {
        label: 'Shoot, and celebrate with your teammates',
        success:
          'A screamer into the top corner. You celebrate with your {club} teammates, without a glance at your old fans.',
        failure: 'It flies over. Your old fans laugh fondly: "Never missed those for us!"'
      },
      {
        label: 'Shoot and, if it goes in, apologise to your old fans',
        success:
          'Goal, and your hands go up in apology. Your old supporters give you a standing ovation.',
        failure: "It drifts wide. Deep breath: there's plenty of game left."
      },
      {
        label: 'Find the teammate arriving from deep',
        success:
          'A perfect pull-back and your teammate scores. He points straight at you as he celebrates.',
        failure: 'An old teammate of yours cuts out the pass and grins: he knows you inside out.'
      }
    ]
  },

  'exclub-te-conozco': {
    title: 'I Know You',
    text: 'The {rival} centre-back, who once shared a dressing room with you, man-marks you from the first minute and whispers in your ear: "I know all your tricks."',
    options: [
      {
        label: "Show him you've learned some new ones",
        success:
          "A cut inside he's never seen from you and you're away. Your cross ends in a {club} goal.",
        failure: "He reads the feint as if he'd rehearsed it with you. Because he did."
      },
      {
        label: 'Have a laugh and play without pressure',
        outcome: 'You both crack up. You relax, move better, and the gaffer notices.'
      },
      {
        label: 'Get physical with him from the off',
        success: "First duel, yours. Second, yours. By the third he's stopped following you.",
        failure: 'He takes the shove without flinching. "Know that one too," he tells you.'
      }
    ]
  }
}
