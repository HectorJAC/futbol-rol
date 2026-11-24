import type { CountryLeagues } from './types'

export const ENG_LEAGUES: CountryLeagues = {
  countryId: 'ENG',
  division1Name: 'Primera División de Inglaterra',
  division2Name: 'Segunda División de Inglaterra',
  cupName: 'Copa de Inglaterra',
  division1: [
    {
      id: 'eng-manchester-citi',
      name: 'Manchester Citi',
      city: 'Mánchester',
      strength: 88,
      colors: ['#6cabdd', '#1c2c5b']
    },
    {
      id: 'eng-liverpul-fc',
      name: 'Liverpul FC',
      city: 'Liverpool',
      strength: 87,
      colors: ['#c8102e', '#ffffff'],
      rival: 'eng-manchester-unitet'
    },
    {
      id: 'eng-arsenel',
      name: 'Arsenel',
      city: 'Londres',
      strength: 86,
      colors: ['#ef0107', '#ffffff'],
      rival: 'eng-tottenam-hotspur'
    },
    {
      id: 'eng-chelsey-fc',
      name: 'Chelsey FC',
      city: 'Londres',
      strength: 83,
      colors: ['#034694', '#ffffff']
    },
    {
      id: 'eng-newcastel-united',
      name: 'Newcastel United',
      city: 'Newcastle',
      strength: 82,
      colors: ['#241f20', '#ffffff'],
      rival: 'eng-sunderlant-afc'
    },
    {
      id: 'eng-aston-vila',
      name: 'Aston Vila',
      city: 'Birmingham',
      strength: 81,
      colors: ['#670e36', '#95bfe5']
    },
    {
      id: 'eng-tottenam-hotspur',
      name: 'Tottenam Hotspur',
      city: 'Londres',
      strength: 80,
      colors: ['#ffffff', '#132257'],
      rival: 'eng-arsenel'
    },
    {
      id: 'eng-manchester-unitet',
      name: 'Manchester Unitet',
      city: 'Mánchester',
      strength: 80,
      colors: ['#da291c', '#000000'],
      rival: 'eng-liverpul-fc'
    },
    {
      id: 'eng-brighten-hove-albion',
      name: 'Brighten & Hove Albion',
      city: 'Brighton',
      strength: 78,
      colors: ['#0057b8', '#ffffff'],
      rival: 'eng-cristal-palace'
    },
    {
      id: 'eng-nottingham-forrest',
      name: 'Nottingham Forrest',
      city: 'Nottingham',
      strength: 77,
      colors: ['#dd0000', '#ffffff'],
      rival: 'eng-derbi-county'
    },
    {
      id: 'eng-afc-bournemuth',
      name: 'AFC Bournemuth',
      city: 'Bournemouth',
      strength: 77,
      colors: ['#da291c', '#000000']
    },
    {
      id: 'eng-cristal-palace',
      name: 'Cristal Palace',
      city: 'Londres',
      strength: 77,
      colors: ['#1b458f', '#c4122e'],
      rival: 'eng-brighten-hove-albion'
    },
    {
      id: 'eng-west-hamm-united',
      name: 'West Hamm United',
      city: 'Londres',
      strength: 76,
      colors: ['#7a263a', '#1bb1e7']
    },
    {
      id: 'eng-fulhem-fc',
      name: 'Fulhem FC',
      city: 'Londres',
      strength: 76,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'eng-brendford-fc',
      name: 'Brendford FC',
      city: 'Londres',
      strength: 76,
      colors: ['#e30613', '#ffffff']
    },
    {
      id: 'eng-everten-fc',
      name: 'Everten FC',
      city: 'Liverpool',
      strength: 74,
      colors: ['#003399', '#ffffff']
    },
    {
      id: 'eng-wolverhampton-wonderers',
      name: 'Wolverhampton Wonderers',
      city: 'Wolverhampton',
      strength: 73,
      colors: ['#fdb913', '#231f20'],
      rival: 'eng-west-bromwick-albion'
    },
    {
      id: 'eng-leichester-city',
      name: 'Leichester City',
      city: 'Leicester',
      strength: 72,
      colors: ['#003090', '#fdbe11']
    },
    {
      id: 'eng-ipswitch-town',
      name: 'Ipswitch Town',
      city: 'Ipswich',
      strength: 71,
      colors: ['#0044a9', '#ffffff'],
      rival: 'eng-norvich-city'
    },
    {
      id: 'eng-southamton-fc',
      name: 'Southamton FC',
      city: 'Southampton',
      strength: 70,
      colors: ['#d71920', '#ffffff'],
      rival: 'eng-portsmuth-fc'
    }
  ],
  division2: [
    {
      id: 'eng-leedz-united',
      name: 'Leedz United',
      city: 'Leeds',
      strength: 70,
      colors: ['#ffffff', '#1d428a']
    },
    {
      id: 'eng-burnly-fc',
      name: 'Burnly FC',
      city: 'Burnley',
      strength: 69,
      colors: ['#6c1d45', '#99d6ea'],
      rival: 'eng-blackbourn-rovers'
    },
    {
      id: 'eng-sheffeld-united',
      name: 'Sheffeld United',
      city: 'Sheffield',
      strength: 68,
      colors: ['#ee2737', '#ffffff'],
      rival: 'eng-sheffield-wensday'
    },
    {
      id: 'eng-sunderlant-afc',
      name: 'Sunderlant AFC',
      city: 'Sunderland',
      strength: 67,
      colors: ['#eb172b', '#ffffff'],
      rival: 'eng-newcastel-united'
    },
    {
      id: 'eng-midlesbrough-fc',
      name: 'Midlesbrough FC',
      city: 'Middlesbrough',
      strength: 66,
      colors: ['#e11b22', '#ffffff']
    },
    {
      id: 'eng-west-bromwick-albion',
      name: 'West Bromwick Albion',
      city: 'West Bromwich',
      strength: 66,
      colors: ['#122f67', '#ffffff'],
      rival: 'eng-wolverhampton-wonderers'
    },
    {
      id: 'eng-coventri-city',
      name: 'Coventri City',
      city: 'Coventry',
      strength: 65,
      colors: ['#59cbe8', '#ffffff']
    },
    {
      id: 'eng-norvich-city',
      name: 'Norvich City',
      city: 'Norwich',
      strength: 65,
      colors: ['#fff200', '#00a650'],
      rival: 'eng-ipswitch-town'
    },
    {
      id: 'eng-watfort-fc',
      name: 'Watfort FC',
      city: 'Watford',
      strength: 64,
      colors: ['#fbee23', '#ed2127']
    },
    {
      id: 'eng-swansee-city',
      name: 'Swansee City',
      city: 'Swansea',
      strength: 63,
      colors: ['#ffffff', '#000000'],
      rival: 'eng-cardif-city'
    },
    {
      id: 'eng-blackbourn-rovers',
      name: 'Blackbourn Rovers',
      city: 'Blackburn',
      strength: 63,
      colors: ['#009ee0', '#ffffff'],
      rival: 'eng-burnly-fc'
    },
    {
      id: 'eng-milwall-fc',
      name: 'Milwall FC',
      city: 'Londres',
      strength: 63,
      colors: ['#001d5e', '#ffffff']
    },
    {
      id: 'eng-stocke-city',
      name: 'Stocke City',
      city: 'Stoke-on-Trent',
      strength: 62,
      colors: ['#e03a3e', '#ffffff']
    },
    {
      id: 'eng-sheffield-wensday',
      name: 'Sheffield Wensday',
      city: 'Sheffield',
      strength: 62,
      colors: ['#4466b4', '#ffffff'],
      rival: 'eng-sheffeld-united'
    },
    {
      id: 'eng-queens-park-rangerz',
      name: 'Queens Park Rangerz',
      city: 'Londres',
      strength: 61,
      colors: ['#005cab', '#ffffff']
    },
    {
      id: 'eng-hull-citty',
      name: 'Hull Citty',
      city: 'Hull',
      strength: 61,
      colors: ['#f5a12d', '#000000']
    },
    {
      id: 'eng-portsmuth-fc',
      name: 'Portsmuth FC',
      city: 'Portsmouth',
      strength: 60,
      colors: ['#001489', '#ffffff'],
      rival: 'eng-southamton-fc'
    },
    {
      id: 'eng-derbi-county',
      name: 'Derbi County',
      city: 'Derby',
      strength: 60,
      colors: ['#ffffff', '#000000'],
      rival: 'eng-nottingham-forrest'
    },
    {
      id: 'eng-lutton-town',
      name: 'Lutton Town',
      city: 'Luton',
      strength: 59,
      colors: ['#f78f1e', '#002d62']
    },
    {
      id: 'eng-cardif-city',
      name: 'Cardif City',
      city: 'Cardiff',
      strength: 58,
      colors: ['#0070b5', '#ffffff'],
      rival: 'eng-swansee-city'
    }
  ],
  firstOffers: ['eng-arsenel', 'eng-west-hamm-united', 'eng-sunderlant-afc']
}
