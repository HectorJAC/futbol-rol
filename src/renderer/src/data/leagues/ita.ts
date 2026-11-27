import type { CountryLeagues } from './types'

/** Italia: Serie A y Serie B 2024-25 con nombres alterados. */
export const ITA_LEAGUES: CountryLeagues = {
  countryId: 'ITA',
  division1Name: 'Primera División de Italia',
  division2Name: 'Segunda División de Italia',
  cupName: 'Copa de Italia',
  division1: [
    {
      id: 'ita-inter-de-milam',
      name: 'Inter de Milám',
      city: 'Milán',
      strength: 85,
      colors: ['#0068a8', '#000000'],
      rival: 'ita-juventis'
    },
    {
      id: 'ita-napolli',
      name: 'Napolli',
      city: 'Nápoles',
      strength: 83,
      colors: ['#12a0d7', '#ffffff'],
      rival: 'ita-as-rome'
    },
    {
      id: 'ita-juventis',
      name: 'Juventis',
      city: 'Turín',
      strength: 82,
      colors: ['#000000', '#ffffff'],
      rival: 'ita-inter-de-milam'
    },
    {
      id: 'ita-ac-milen',
      name: 'AC Milen',
      city: 'Milán',
      strength: 82,
      colors: ['#fb090b', '#000000']
    },
    {
      id: 'ita-atalante',
      name: 'Atalante',
      city: 'Bérgamo',
      strength: 81,
      colors: ['#1e71b8', '#000000'],
      rival: 'ita-brecia-calcio'
    },
    {
      id: 'ita-as-rome',
      name: 'AS Rome',
      city: 'Roma',
      strength: 79,
      colors: ['#8e1f2f', '#f0bc42'],
      rival: 'ita-napolli'
    },
    {
      id: 'ita-ss-lacio',
      name: 'SS Lacio',
      city: 'Roma',
      strength: 78,
      colors: ['#87d8f7', '#ffffff']
    },
    {
      id: 'ita-fiorantina',
      name: 'Fiorantina',
      city: 'Florencia',
      strength: 78,
      colors: ['#482e92', '#ffffff'],
      rival: 'ita-bolonia-fc'
    },
    {
      id: 'ita-bolonia-fc',
      name: 'Bolonia FC',
      city: 'Bolonia',
      strength: 77,
      colors: ['#a21c26', '#1a2f48'],
      rival: 'ita-fiorantina'
    },
    {
      id: 'ita-komo-1907',
      name: 'Komo 1907',
      city: 'Como',
      strength: 75,
      colors: ['#0055a4', '#ffffff']
    },
    {
      id: 'ita-torrino',
      name: 'Torrino',
      city: 'Turín',
      strength: 75,
      colors: ['#881f19', '#ffffff']
    },
    {
      id: 'ita-udinesse',
      name: 'Udinesse',
      city: 'Udine',
      strength: 74,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'ita-gennoa',
      name: 'Gennoa',
      city: 'Génova',
      strength: 73,
      colors: ['#a6192e', '#002d62'],
      rival: 'ita-samdoria'
    },
    {
      id: 'ita-cagliary',
      name: 'Cagliary',
      city: 'Cagliari',
      strength: 72,
      colors: ['#a50034', '#002350']
    },
    {
      id: 'ita-parme-calcio',
      name: 'Parme Calcio',
      city: 'Parma',
      strength: 72,
      colors: ['#ffd200', '#003a8c'],
      rival: 'ita-regiana'
    },
    {
      id: 'ita-helas-verona',
      name: 'Helas Verona',
      city: 'Verona',
      strength: 72,
      colors: ['#003a70', '#ffd200']
    },
    {
      id: 'ita-us-lece',
      name: 'US Lece',
      city: 'Lecce',
      strength: 71,
      colors: ['#ffd700', '#d50000'],
      rival: 'ita-ssc-barri'
    },
    {
      id: 'ita-empolo-fc',
      name: 'Empolo FC',
      city: 'Empoli',
      strength: 71,
      colors: ['#00579c', '#ffffff']
    },
    {
      id: 'ita-venecia-fc',
      name: 'Venecia FC',
      city: 'Venecia',
      strength: 70,
      colors: ['#000000', '#f58025']
    },
    {
      id: 'ita-ac-monsa',
      name: 'AC Monsa',
      city: 'Monza',
      strength: 70,
      colors: ['#e30613', '#ffffff']
    }
  ],
  division2: [
    {
      id: 'ita-sasuolo',
      name: 'Sasuolo',
      city: 'Sassuolo',
      strength: 68,
      colors: ['#00a752', '#000000']
    },
    {
      id: 'ita-samdoria',
      name: 'Samdoria',
      city: 'Génova',
      strength: 67,
      colors: ['#1b5497', '#ffffff'],
      rival: 'ita-gennoa'
    },
    {
      id: 'ita-palerno-fc',
      name: 'Palerno FC',
      city: 'Palermo',
      strength: 67,
      colors: ['#f5a9c6', '#000000']
    },
    {
      id: 'ita-cremonesa',
      name: 'Cremonesa',
      city: 'Cremona',
      strength: 66,
      colors: ['#c8102e', '#a0a0a0']
    },
    {
      id: 'ita-piza-sc',
      name: 'Piza SC',
      city: 'Pisa',
      strength: 66,
      colors: ['#000000', '#0066b3']
    },
    {
      id: 'ita-spezzia',
      name: 'Spezzia',
      city: 'La Spezia',
      strength: 65,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'ita-frossinone',
      name: 'Frossinone',
      city: 'Frosinone',
      strength: 65,
      colors: ['#ffd400', '#1b3c87']
    },
    {
      id: 'ita-salernitena',
      name: 'Salernitena',
      city: 'Salerno',
      strength: 64,
      colors: ['#7b1c2e', '#ffffff']
    },
    {
      id: 'ita-ssc-barri',
      name: 'SSC Barri',
      city: 'Bari',
      strength: 64,
      colors: ['#ffffff', '#e30613'],
      rival: 'ita-us-lece'
    },
    {
      id: 'ita-brecia-calcio',
      name: 'Brecia Calcio',
      city: 'Brescia',
      strength: 63,
      colors: ['#004a9f', '#ffffff'],
      rival: 'ita-atalante'
    },
    {
      id: 'ita-katanzaro',
      name: 'Katanzaro',
      city: 'Catanzaro',
      strength: 63,
      colors: ['#ffcc00', '#c8102e'],
      rival: 'ita-cosensa'
    },
    {
      id: 'ita-modenna',
      name: 'Modenna',
      city: 'Módena',
      strength: 62,
      colors: ['#ffd400', '#0047ab']
    },
    {
      id: 'ita-regiana',
      name: 'Regiana',
      city: 'Reggio Emilia',
      strength: 61,
      colors: ['#8b1e2d', '#ffffff'],
      rival: 'ita-parme-calcio'
    },
    {
      id: 'ita-chesena',
      name: 'Chesena',
      city: 'Cesena',
      strength: 61,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'ita-cosensa',
      name: 'Cosensa',
      city: 'Cosenza',
      strength: 60,
      colors: ['#c8102e', '#002f6c'],
      rival: 'ita-katanzaro'
    },
    {
      id: 'ita-fc-sudtyrol',
      name: 'FC Südtyrol',
      city: 'Bolzano',
      strength: 60,
      colors: ['#ffffff', '#e30613']
    },
    {
      id: 'ita-juve-stabbia',
      name: 'Juve Stabbia',
      city: 'Castellammare di Stabia',
      strength: 60,
      colors: ['#ffd400', '#003a8c']
    },
    {
      id: 'ita-citadella',
      name: 'Citadella',
      city: 'Cittadella',
      strength: 59,
      colors: ['#8b1e2d', '#ffffff']
    },
    {
      id: 'ita-mantoba',
      name: 'Mantoba',
      city: 'Mantua',
      strength: 59,
      colors: ['#ffffff', '#c8102e']
    },
    {
      id: 'ita-carrerese',
      name: 'Carrerese',
      city: 'Carrara',
      strength: 58,
      colors: ['#ffd400', '#004a9f']
    }
  ],
  firstOffers: ['ita-juventis', 'ita-torrino', 'ita-samdoria']
}
