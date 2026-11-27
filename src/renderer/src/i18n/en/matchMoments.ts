import type { MomentText } from '../packs'

/**
 * English texts for the key match moments (`MATCH_MOMENTS`). Original writing
 * for the same situations; the mechanics live in the data.
 */
export const MATCH_MOMENTS_EN: Record<string, MomentText> = {
  // ---------------------------------------------------------------------------
  // Early
  // ---------------------------------------------------------------------------
  'inicio-primer-balon': {
    title: 'Your First Touch',
    text: 'Minute 2. The ground is still roaring as your first ball arrives with your back to goal and the {rival} centre-back breathing down your neck.',
    options: [
      {
        label: 'Turn and run at him',
        success:
          "Shoulder drop, spin, and you're away. Your low finish nestles inside the post. Goal inside two minutes.",
        failure: 'The centre-back reads the turn and picks your pocket. First round to him.'
      },
      {
        label: 'Lay it off first time and spin in behind',
        success:
          'A one-two with the number ten, you take it into the box and cut it back for the winger to tap in. {club} go ahead.',
        failure:
          'The lay-off rolls straight to the {rival} holding midfielder. No real harm, but the crowd grumbles.'
      },
      {
        label: 'Shield it and win a free kick',
        success:
          "You hold him off until he drags you down. Free kick, yellow card, and he's walking a tightrope.",
        failure: 'He shoulders you off it like a youth-team kid. Throw-in to {rival}.'
      }
    ]
  },
  'inicio-presion-salida': {
    title: 'Pressing the Keeper',
    text: 'Minute 6. The {rival} keeper tries to play out from the back. From the touchline, the gaffer is yelling at you to hunt it down.',
    options: [
      {
        label: 'Close down the centre-back',
        success:
          "You're on him before he can take a touch, nick it off his toes and roll it into an empty net.",
        failure:
          'You arrive late, he plays round you and {rival} are away on the break. Goal to them.'
      },
      {
        label: 'Cut off the passing lane and wait for a mistake',
        success: 'The keeper runs out of options and lumps it into touch. Early honours to {club}.',
        failure:
          "You're caught in no man's land and {rival} stroll out from the back without a care."
      },
      {
        label: 'Save your legs for the long haul',
        outcome: 'You let it go. On the touchline, the gaffer throws his arms out wide.'
      }
    ]
  },
  'inicio-provocacion': {
    title: 'The Wind-Up Merchant',
    text: 'Minute 9. At the first corner, the {rival} centre-back stands on your foot, grabs your shirt and mutters something about your family.',
    options: [
      {
        label: "Don't take the bait",
        success:
          "You smile and give him a wink. Now he's the one who loses his head, and he's booked.",
        failure:
          "You bite your tongue, but your blood's boiling. For ten minutes nothing goes right."
      },
      {
        label: 'Do your talking with the next header',
        success:
          "At the next corner you win the position and power a header in. You don't even glance at him as you wheel away.",
        failure: 'He bundles you over mid-jump and the ref gives nothing.'
      },
      {
        label: 'Give him a shove back',
        outcome:
          'The referee sees it all... or rather, only your part. Booked on nine minutes, and now you have to tiptoe for the rest.'
      }
    ]
  },
  'inicio-balon-largo': {
    title: 'Ball Over the Top',
    text: 'Minute 12. {rival} are playing a really high line. Your centre-back looks up and catches your eye: he wants the run.',
    options: [
      {
        label: 'Time your run in behind perfectly',
        success:
          'You go at the last possible moment, bang onside. Chest it down and slide it under the keeper.',
        failure: 'You go half a step too early. Flag up, chance gone.'
      },
      {
        label: 'Drop deep to receive and switch it to the far flank',
        success:
          'You receive, turn and spray a forty-yard pass out to the far wing. The winger crosses and your strike partner tucks it away.',
        failure:
          'The switch sails straight into the stands. The {rival} full-back gives it a sarcastic round of applause.'
      }
    ]
  },
  'inicio-estadio-en-contra': {
    title: 'Hostile Territory',
    text: "Minute 4. Every time you get on the ball, the {rival} end boos you with everything they've got. Your younger teammates look like they want to hide.",
    youngText:
      "Minute 4. Every time you get on the ball, the {rival} end boos you with everything they've got. You've never played in an atmosphere like this, and every jeer lands on your shoulders.",
    options: [
      {
        label: 'Demand the ball every time and front up',
        success:
          'Every time you call for it, it sends a message. It spreads through the side and {club} take control of the game.',
        failure:
          'You try, but the noise gets to you and you give the ball away three times in a row.'
      },
      {
        label: 'Slow it down with simple passes',
        success: 'Pass, pass, pass. The ground goes quieter and quieter as {club} keep the ball.',
        failure:
          'One short pass underhit and {rival} are off and running. Their striker makes no mistake.'
      },
      {
        label: 'Shut it out and wait your chance',
        outcome: "You focus on your own game. You don't hurt them, but they don't hurt you either."
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Middle
  // ---------------------------------------------------------------------------
  'medio-mano-a-mano': {
    title: 'One on One',
    text: 'Minute 38. A through ball puts you clean through on the {rival} keeper. He rushes out to make himself big.',
    options: [
      {
        label: 'Chip it over him',
        success: 'A perfect chip. It bounces twice before rolling in. The ground falls silent.',
        failure: "You don't get enough on it and the keeper gathers without breaking a sweat."
      },
      {
        label: 'Slot it into the far corner',
        success: 'Side-foot, far corner, out of his reach. Goal.',
        failure: 'It whistles just wide of the post. Hands on your head.'
      },
      {
        label: 'Go round the keeper',
        success: 'A dummy sends him to the floor and you walk it into the net.',
        failure:
          'The keeper reads it and dives at your feet. A quick throw, {rival} break, and they score.'
      }
    ]
  },
  'medio-falta-frontal': {
    title: 'Free Kick on the Edge',
    text: "Minute 51. Free kick just outside the box, slightly off-centre. You're the designated taker, and nobody's arguing.",
    options: [
      {
        label: 'Go for the top corner',
        success: "Over the wall and right into the angle. The keeper doesn't even twitch.",
        failure: 'Straight into the wall. The rebound ends up in the stands.'
      },
      {
        label: 'Whip it to the back post',
        success:
          "It drops right onto your centre-back's head and he nods it in from point-blank range.",
        failure: 'It curls in too close to goal and the keeper plucks it out of the air.'
      },
      {
        label: 'Try the routine from training',
        success: 'A short tap, a dummy, and the midfielder threads it through a gap in the wall.',
        failure:
          'The wall charges out and the routine comes to nothing. The gaffer puffs out his cheeks.'
      }
    ]
  },
  'medio-contra-tres-dos': {
    title: 'Three on Two',
    text: "Minute 44. You win it back in your own half and break three on two. You're carrying it through the middle with a teammate either side.",
    options: [
      {
        label: 'Draw the defender and release it at the right moment',
        success: 'Wait, draw him in, slip it. Your teammate just has to tap it in.',
        failure: 'You release it too early and the defender cuts it out.'
      },
      {
        label: 'Kick on and take the shot yourself',
        success:
          'You leave both centre-backs for dead inside ten yards and drill it in at the near post.',
        failure:
          'They close you down and you lose it. {rival} counter with your side all over the place, and score.'
      },
      {
        label: 'Spread it wide and attack the cross',
        success:
          'You spread it, keep running, and the cross finds you on the penalty spot. A firm header, goal.',
        failure: 'The cross comes in behind you and trickles out for a throw.'
      }
    ]
  },
  'medio-penalti': {
    title: 'Penalty',
    text: "Minute 58. You're brought down in the box. Penalty to {club}. You're on spot-kick duty, and the whole ground holds its breath.",
    options: [
      {
        label: 'Blast it high and hard',
        success: 'An unstoppable rocket under the crossbar. The keeper never sees it.',
        failure: 'Too much on it: the ball sails high over the crossbar.'
      },
      {
        label: 'Wait for the keeper and place it',
        success: 'You wait until the keeper commits, then roll it gently into the other corner.',
        failure: 'The keeper stays put and saves it at waist height.'
      },
      {
        label: 'Hand it to the skipper and back him',
        asCaptain: { label: 'Give it to a teammate and back him up' },
        success:
          'You hand him the ball with a quiet word in his ear. He buries it and points at you as he celebrates.',
        failure:
          "His legs turn to jelly and the keeper guesses right. He looks at you like he's saying sorry."
      }
    ]
  },
  'medio-corner': {
    title: 'Attacking Corner',
    text: "Minute 33. Corner to {club}. You're picked up by {rival}'s tallest centre-back, a full head above you.",
    options: [
      {
        label: 'Attack the near post hard',
        success:
          "You get there first and glance it into the far corner. An old-fashioned number nine's goal.",
        failure: 'He wins the header while barely leaving the ground.'
      },
      {
        label: 'Block him so a teammate gets the header',
        success: 'You block him off and your centre-back attacks it free. Header, net.',
        failure: 'He tosses you aside like a rag doll. The ref blows for a foul... against you.'
      },
      {
        label: 'Lurk on the edge of the box for a rebound',
        success:
          'The clearance drops at the perfect height and you hit it on the volley. In it goes.',
        failure:
          'Your volley ends up in orbit and {rival} break with your side all committed forward. They score.'
      }
    ]
  },
  'medio-corner-lanzador': {
    title: 'Your Corner',
    text: "Minute 37. Corner to {club}. As the team's set-piece taker, you place the ball in the quadrant. Your centre-backs are already in the box.",
    options: [
      {
        label: 'Whip it to the near post',
        success:
          'It fizzes in to the near post like a missile and your centre-back flicks it into the net.',
        failure: 'The delivery fails to beat the first man and is hacked clear.'
      },
      {
        label: 'Float it to the penalty spot',
        success:
          'You drop it right on the penalty spot and the header creeps in just inside the post.',
        failure:
          'The keeper comes off his line and claims it with ease, and {rival} set off on the counter.'
      },
      {
        label: 'Play it short and run the training-ground move',
        success:
          'Short pass, one back, and a low cross to the far post. A goal straight off the training ground.',
        failure: 'The routine gets tangled up and {rival} win the ball back.'
      }
    ]
  },
  'final-falta-ultimo-minuto': {
    title: 'The Last Free Kick',
    text: "Minute 90. Central free kick, twenty-odd yards out. It's yours, and the whole ground is on its feet.",
    options: [
      {
        label: 'Bend it up and over the wall',
        success: 'It curls over the wall and dips just under the bar. Pandemonium in the stands.',
        failure: 'It clips the wall and deflects behind for a corner.'
      },
      {
        label: "Drive it hard at the keeper's post",
        success: 'A thunderbolt the keeper never even sees. Goal.',
        failure: 'Too much power, too much height: it ends up in row Z.'
      },
      {
        label: 'Float it in for the centre-backs',
        success: "The delivery lands on your centre-back's head and he powers it in.",
        failure: 'The keeper comes out with real authority and claims it.'
      }
    ]
  },
  'medio-balon-al-espacio': {
    title: 'The Run in Behind',
    text: 'Minute 55. Your central midfielder looks up and spots your run in behind the {rival} back line.',
    options: [
      {
        label: 'Burst into the space at full pelt',
        success:
          'You go at exactly the right moment, take it in your stride and slot it across the keeper.',
        failure: 'You set off a second too soon. Offside by half a yard.'
      },
      {
        label: 'Control it and wait for the team to catch up',
        success:
          'You hold it, look up and roll it across the six-yard box for a teammate to tap in.',
        failure: 'A defender gets tight and takes it off you before you can release it.'
      }
    ]
  },
  'medio-cambio-de-banda': {
    title: 'Switching the Play',
    text: 'Minute 61. You pick it up on the edge of the box with the {rival} defence all shifted to the left. Your right winger is unmarked.',
    options: [
      {
        label: 'Switch it out to the winger',
        success:
          "The ball travels across the pitch and drops onto the winger's boot. He bends it into the top corner.",
        failure: 'The pass is overhit and runs out for a goal kick.'
      },
      {
        label: 'Turn and let fly from the edge',
        success: 'You swivel and unleash a screamer that flies into the top corner.',
        failure: 'The shot sails over. A groan goes round the ground.'
      }
    ]
  },
  'medio-duelo-central': {
    title: 'Duel with the Centre-Back',
    text: "Minute 67. The {rival} centre-back has been in your back pocket all afternoon. A long ball comes your way, and he's waiting.",
    options: [
      {
        label: 'Get your body in and hold him off',
        success:
          'You get across him, hold it up and lay it off for a teammate arriving late, who scores.',
        failure: 'He muscles you off it easily and strolls away with the ball.'
      },
      {
        label: 'Flick it on with your head towards goal',
        success: 'You rise above him and glance it into the top corner.',
        failure: 'He wins it in the air and the ball goes back to halfway.'
      }
    ]
  },
  'medio-a-por-la-remontada': {
    title: 'Chasing the Comeback',
    text: 'Minute 60. {club} are behind, and the gaffer takes off a defender to throw on another striker. Everything goes through you now.',
    options: [
      {
        label: 'Demand it and take them on',
        success:
          'You skip past two men on the edge of the box and hit it across goal. Goal: game on.',
        failure: 'Three of them crowd you out and {rival} score on the break.'
      },
      {
        label: 'Play with your back to goal for the runners',
        success: 'You hold it up, back to goal, and set it for the midfielder to strike. Goal.',
        failure: 'Your lay-off is short and they nip in to cut it out.'
      }
    ]
  },
  'medio-romper-el-empate': {
    title: 'Break the Deadlock',
    text: "Minute 66. It's level and the game has ground to a halt. You pick it up in the final third with nobody on you.",
    options: [
      {
        label: 'Have a go from range',
        success: 'A crisp, low drive that nestles just inside the post. Deadlock broken.',
        failure: 'You scuff it and the keeper gathers without any trouble.'
      },
      {
        label: 'Patience: pass it and go again',
        success:
          'You move the ball, they get pulled out of shape and your side finds the gap. Goal for {club}.',
        failure: 'All that possession goes nowhere and the game stays stuck.'
      }
    ]
  },
  'medio-arbitro': {
    title: 'The Ref Sees Nothing',
    text: "Minute 41. You're blatantly held in the box and the ref waves play on. Next move, the same {rival} centre-back plants an elbow in you.",
    options: [
      {
        label: 'Have a calm word with the ref',
        success:
          "You explain it without raising your voice. Next time you're grabbed, he points to the spot, and your teammate scores.",
        failure: 'He listens with a face like stone and books you for dissent.'
      },
      {
        label: 'Calm your teammates and let the skipper do the talking',
        asCaptain: {
          label: 'Calm your teammates and do the talking yourself',
          success:
            "No mobbing: you've got the armband, so you do the talking. The ref starts calling it straight.",
          failure:
            'You call for calm, but five players surround the ref. Two yellows, and the game turns ugly.'
        },
        success: 'No mobbing: only the skipper talks. The ref starts calling it straight.',
        failure: 'Five players surround the ref. Two of them are booked, and the game turns ugly.'
      },
      {
        label: 'Give him an elbow back',
        outcome:
          'The ref sees that one and books you. You play the rest of the game on a knife-edge.'
      }
    ]
  },
  'medio-reaccion': {
    title: 'A Response Before Half-Time',
    text: 'Minute 43. {club} are behind and heads have dropped. You win the ball back in the final third with two minutes left before half-time.',
    options: [
      {
        label: 'Drive at them all the way into the box',
        success:
          'You leave two of them behind and slide it across the keeper. A goal that changes the mood in the dressing room.',
        failure: "Three of them close you down and you lose it. At least there's no counter."
      },
      {
        label: 'Spread it wide and arrive late',
        success:
          'You ghost into the box just as the cross drops. A goal that puts you right back in it.',
        failure: "You're a fraction late: the ball flashes across in front of you."
      },
      {
        label: 'Keep the ball and reach half-time still in it',
        outcome:
          'You keep it until the whistle. The gaffer has fifteen minutes to sort the side out.'
      }
    ]
  },
  'medio-sentenciar': {
    title: 'Kill the Game Off',
    text: 'Minute 64. {club} are ahead and {rival} are throwing everyone forward for an equaliser. The pitch has opened up, and the ball reaches you in midfield.',
    options: [
      {
        label: 'Send the winger away with a long ball',
        success:
          'A fifty-yard pass that puts the winger clean through. He finishes calmly. That should just about settle it.',
        failure: 'The pass falls short. {rival} win it back and score from the very next move.'
      },
      {
        label: 'Run the fifty yards yourself',
        success:
          "You've still got the legs to lift your head and finish. Not even the centre-back chasing you can keep up.",
        failure:
          'Halfway there, the tank runs dry. The centre-back catches you without breaking stride.'
      },
      {
        label: 'Keep the ball and take the sting out of it',
        outcome:
          'You put your foot on the ball, win a foul and drive the {rival} fans mad. Streetwise stuff.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Late
  // ---------------------------------------------------------------------------
  'final-asedio': {
    title: 'All or Nothing',
    text: 'Minute 89. {club} are losing and even the keeper has come up for it. Last corner of the game.',
    options: [
      {
        label: 'Go for the header in the scramble',
        success: 'You rise above everyone and head it into the back of the net. A last-gasp goal.',
        failure:
          'It brushes your hair. The {rival} keeper clears and they break away towards your empty net.'
      },
      {
        label: 'Hang back outside the box for the rebound',
        success: 'The clearance drops at your feet and you volley it in. Goal.',
        failure: "You don't catch it cleanly and it drifts wide. The ref checks his watch."
      }
    ]
  },
  'final-arenga': {
    title: 'Rallying the Troops',
    text: "Minute 78. {club} are behind and every head is down. Your teammates are walking. There's just over a quarter of an hour left.",
    options: [
      {
        label: "Gather them round and yell it's not over",
        success:
          'Your shout wakes the side up. Three minutes later, a teammate bundles home a loose ball in the box.',
        failure: 'You shout, but nobody follows. The team falls apart and {rival} add another.'
      },
      {
        label: 'Lead by example: chase down every ball',
        success:
          "You nick the ball as {rival} try to play out and set up a teammate, who doesn't miss.",
        failure: 'You run for all eleven of them, but your legs have gone.'
      },
      {
        label: 'Want every ball and take it on yourself',
        success:
          'You beat three of them in a phone box and slot it across the keeper. Still alive.',
        failure: 'You tie yourself in knots again and again. The {club} fans start to groan.'
      }
    ]
  },
  'final-calambres': {
    title: 'Cramp in the 85th',
    text: "Minute 85. All square. Your calf cramps up and the gaffer has already made all his subs. You'll have to grit your teeth.",
    options: [
      {
        label: 'Stretch it out and carry on',
        success:
          'Pride gets you through, and with the last move you reach the back post to bundle it in.',
        failure: "You limp around and can't get to anything. The score stays level."
      },
      {
        label: 'Stay up top as a target man, no running',
        success:
          'You hold up long balls with your back to goal on sheer strength. One of them ends with a teammate scoring.',
        failure: 'Every challenge hurts twice as much. You lose every ball that comes to you.'
      },
      {
        label: 'Go down and call for the physio',
        outcome:
          "The physio rubs the calf and buys you a minute's breather. The game stays as it was."
      }
    ]
  },
  'final-penalti-descuento': {
    title: 'Stoppage-Time Penalty',
    text: "Minute 93. All square. After a look at the pitchside monitor, the ref points to the spot for {club}. It's the last kick of the game, and the ball is yours: you're the taker.",
    options: [
      {
        label: 'You take it',
        success:
          'Short run-up, keeper one way, ball the other. You celebrate with the whole stand piling on top of you.',
        failure: 'The {rival} keeper flies across and palms it away one-handed. A bitter end.'
      },
      {
        label: 'Leave it to the specialist and gee him up',
        success: "You give him the belief he needs. Goal, and you're the first one he hugs.",
        failure: 'His legs go and he drags it wide. You console him out on the grass.'
      }
    ]
  },
  'final-perder-tiempo': {
    title: 'Run Down the Clock',
    text: 'Minute 88. {club} are ahead and {rival} are throwing everything forward. The ball comes to you down by their corner flag.',
    options: [
      {
        label: 'Shield it by the corner flag',
        success:
          'You plant yourself by the flag and hold off two of them for an eternal minute. Throw-in, and the crowd applaud you.',
        failure: 'They rob you and {rival} stampede up the other end. Goal to them.'
      },
      {
        label: 'Go for the goal that seals it',
        success: 'You cut inside and squeeze it in at the near post. Game over.',
        failure:
          'A tame shot straight at the keeper, who gets it out quickly. The last few minutes drag on forever.'
      },
      {
        label: 'Keep it short with your teammates',
        success:
          'Piggy in the middle in their half. The {rival} fans whistle as the clock ticks down.',
        failure:
          'One loose pass and {rival} win it back. An agonising final minute, but you hang on.'
      }
    ]
  },
  'final-ultima-contra': {
    title: 'The Last Break',
    text: 'Minute 90. {club} clear their lines and the ball drops at your feet with half the pitch in front of you. Only one {rival} centre-back is chasing.',
    options: [
      {
        label: 'Sprint for the box',
        success: 'You get two yards on the centre-back and slide it across goal. The place erupts.',
        failure:
          'The centre-back catches you and clears for a corner. Your last shot at it is gone.'
      },
      {
        label: 'Wait for support and lay it on',
        success:
          'You hold on until the winger arrives and leave him one on one with the keeper. Goal.',
        failure: 'You wait too long and three defenders get back. The chance is gone.'
      },
      {
        label: 'Spot the keeper off his line and shoot from halfway',
        success: 'It sails forty-odd yards and dips under the crossbar. The stuff of legend.',
        failure: 'It flies miles over. Your teammates stand there with their hands on their heads.'
      }
    ]
  },
  'final-corner-en-contra': {
    title: 'Defending a Corner',
    text: 'Minute 92. Corner to {rival}. The gaffer is waving frantically at you: he wants you back to mark the near post.',
    options: [
      {
        label: 'Get back and guard the near post',
        success:
          "You head away the most dangerous ball of the match. The {club} bench celebrate like it's a goal.",
        failure: 'It sails over your head and the {rival} striker finishes at his leisure.'
      },
      {
        label: 'Stay up the pitch waiting for the break',
        success:
          "The clearance reaches you and you're off like a shot. A breakaway goal with the very last kick.",
        failure: 'A man short at the back, {rival} get a free header in the six-yard box.'
      },
      {
        label: 'Bark orders at the defence',
        success: 'You put everyone in their place and the back line clears it comfortably.',
        failure:
          "It's too loud and nobody hears you. Their header crashes off the crossbar. Squeaky-bum time."
      }
    ]
  }
}
