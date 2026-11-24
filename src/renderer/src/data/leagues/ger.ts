import type { CountryLeagues } from './types'

/** Alemania: Bundesliga y 2. Bundesliga 2024-25 con nombres alterados. */
export const GER_LEAGUES: CountryLeagues = {
  countryId: 'GER',
  division1Name: 'Primera División de Alemania',
  division2Name: 'Segunda División de Alemania',
  cupName: 'Copa de Alemania',
  division1: [
    {
      id: 'ger-bayern-munchem',
      name: 'Bayern Münchem',
      city: 'Múnich',
      strength: 87,
      colors: ['#dc052d', '#ffffff'],
      rival: 'ger-borussia-dortmumd'
    },
    {
      id: 'ger-bayer-leverkuzen',
      name: 'Bayer Leverkuzen',
      city: 'Leverkusen',
      strength: 84,
      colors: ['#e32221', '#000000']
    },
    {
      id: 'ger-borussia-dortmumd',
      name: 'Borussia Dortmumd',
      city: 'Dortmund',
      strength: 82,
      colors: ['#fde100', '#000000'],
      rival: 'ger-bayern-munchem'
    },
    {
      id: 'ger-rb-leipzik',
      name: 'RB Leipzik',
      city: 'Leipzig',
      strength: 81,
      colors: ['#dd0741', '#ffffff']
    },
    {
      id: 'ger-eintracht-frankfurd',
      name: 'Eintracht Frankfurd',
      city: 'Fráncfort',
      strength: 79,
      colors: ['#e1000f', '#000000']
    },
    {
      id: 'ger-vfb-stutgart',
      name: 'VfB Stutgart',
      city: 'Stuttgart',
      strength: 79,
      colors: ['#ffffff', '#e32219'],
      rival: 'ger-karlsruer-sc'
    },
    {
      id: 'ger-sc-freiborg',
      name: 'SC Freiborg',
      city: 'Friburgo',
      strength: 76,
      colors: ['#e2001a', '#000000']
    },
    {
      id: 'ger-fsv-meinz-05',
      name: 'FSV Meinz 05',
      city: 'Maguncia',
      strength: 76,
      colors: ['#c3141e', '#ffffff']
    },
    {
      id: 'ger-vfl-wolfburg',
      name: 'VfL Wolfburg',
      city: 'Wolfsburgo',
      strength: 75,
      colors: ['#65b32e', '#ffffff']
    },
    {
      id: 'ger-borussia-monchenglabach',
      name: 'Borussia Mönchenglabach',
      city: 'Mönchengladbach',
      strength: 75,
      colors: ['#ffffff', '#000000'],
      rival: 'ger-fc-kolne'
    },
    {
      id: 'ger-tsg-hoffenheym',
      name: 'TSG Hoffenheym',
      city: 'Sinsheim',
      strength: 74,
      colors: ['#1961b5', '#ffffff']
    },
    {
      id: 'ger-werder-brehmen',
      name: 'Werder Brehmen',
      city: 'Bremen',
      strength: 74,
      colors: ['#1d9053', '#ffffff'],
      rival: 'ger-hamborger-sv'
    },
    {
      id: 'ger-fc-union-berlim',
      name: 'FC Union Berlim',
      city: 'Berlín',
      strength: 73,
      colors: ['#eb1923', '#ffffff'],
      rival: 'ger-herta-bsc'
    },
    {
      id: 'ger-fc-augsburgo',
      name: 'FC Augsburgo',
      city: 'Augsburgo',
      strength: 73,
      colors: ['#ba3733', '#46714d']
    },
    {
      id: 'ger-fc-heidenhaim',
      name: 'FC Heidenhaim',
      city: 'Heidenheim',
      strength: 71,
      colors: ['#e2001a', '#003b79']
    },
    {
      id: 'ger-vfl-bochun',
      name: 'VfL Bochun',
      city: 'Bochum',
      strength: 71,
      colors: ['#005ca9', '#ffffff']
    },
    {
      id: 'ger-fc-st-paoli',
      name: 'FC St. Paoli',
      city: 'Hamburgo',
      strength: 70,
      colors: ['#624839', '#ffffff']
    },
    {
      id: 'ger-holstain-kiel',
      name: 'Holstain Kiel',
      city: 'Kiel',
      strength: 70,
      colors: ['#00508d', '#ffffff']
    }
  ],
  division2: [
    {
      id: 'ger-hamborger-sv',
      name: 'Hamborger SV',
      city: 'Hamburgo',
      strength: 69,
      colors: ['#0a3f86', '#ffffff'],
      rival: 'ger-werder-brehmen'
    },
    {
      id: 'ger-fc-kolne',
      name: 'FC Kölne',
      city: 'Colonia',
      strength: 69,
      colors: ['#ed1c24', '#ffffff'],
      rival: 'ger-borussia-monchenglabach'
    },
    {
      id: 'ger-fc-shalke-04',
      name: 'FC Shalke 04',
      city: 'Gelsenkirchen',
      strength: 67,
      colors: ['#004d9d', '#ffffff']
    },
    {
      id: 'ger-herta-bsc',
      name: 'Herta BSC',
      city: 'Berlín',
      strength: 67,
      colors: ['#004d9e', '#ffffff'],
      rival: 'ger-fc-union-berlim'
    },
    {
      id: 'ger-fortuna-duseldorf',
      name: 'Fortuna Düseldorf',
      city: 'Düsseldorf',
      strength: 66,
      colors: ['#da251d', '#ffffff']
    },
    {
      id: 'ger-hanover-96',
      name: 'Hanover 96',
      city: 'Hanóver',
      strength: 66,
      colors: ['#c3001a', '#000000'],
      rival: 'ger-eintracht-braunschwaig'
    },
    {
      id: 'ger-fc-kaiserlautern',
      name: 'FC Kaiserlautern',
      city: 'Kaiserslautern',
      strength: 65,
      colors: ['#e30613', '#ffffff']
    },
    {
      id: 'ger-sv-darmstatt-98',
      name: 'SV Darmstatt 98',
      city: 'Darmstadt',
      strength: 65,
      colors: ['#004e9f', '#ffffff']
    },
    {
      id: 'ger-sc-paterborn-07',
      name: 'SC Paterborn 07',
      city: 'Paderborn',
      strength: 64,
      colors: ['#005ca8', '#000000']
    },
    {
      id: 'ger-fc-magdenburg',
      name: 'FC Magdenburg',
      city: 'Magdeburgo',
      strength: 64,
      colors: ['#0067b1', '#ffffff']
    },
    {
      id: 'ger-karlsruer-sc',
      name: 'Karlsruer SC',
      city: 'Karlsruhe',
      strength: 64,
      colors: ['#0066b3', '#ffffff'],
      rival: 'ger-vfb-stutgart'
    },
    {
      id: 'ger-fc-nurmberg',
      name: 'FC Nürmberg',
      city: 'Núremberg',
      strength: 63,
      colors: ['#a50021', '#000000'],
      rival: 'ger-greuter-furth'
    },
    {
      id: 'ger-sv-elwersberg',
      name: 'SV Elwersberg',
      city: 'Spiesen-Elversberg',
      strength: 63,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'ger-greuter-furth',
      name: 'Greuter Fürth',
      city: 'Fürth',
      strength: 62,
      colors: ['#009a3d', '#ffffff'],
      rival: 'ger-fc-nurmberg'
    },
    {
      id: 'ger-eintracht-braunschwaig',
      name: 'Eintracht Braunschwaig',
      city: 'Brunswick',
      strength: 61,
      colors: ['#ffdd00', '#004b93'],
      rival: 'ger-hanover-96'
    },
    {
      id: 'ger-preussen-munsten',
      name: 'Preußen Münsten',
      city: 'Münster',
      strength: 60,
      colors: ['#00824a', '#000000']
    },
    {
      id: 'ger-ssv-olm-1846',
      name: 'SSV Olm 1846',
      city: 'Ulm',
      strength: 59,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'ger-jahn-regensberg',
      name: 'Jahn Regensberg',
      city: 'Ratisbona',
      strength: 58,
      colors: ['#d20f26', '#ffffff']
    }
  ],
  firstOffers: ['ger-borussia-dortmumd', 'ger-sc-freiborg', 'ger-hamborger-sv']
}
