import type { CountryLeagues } from './types'

/** Brasil: Série A y Série B 2024 con nombres alterados. */
export const BRA_LEAGUES: CountryLeagues = {
  countryId: 'BRA',
  division1Name: 'Primera División de Brasil',
  division2Name: 'Segunda División de Brasil',
  cupName: 'Copa de Brasil',
  division1: [
    {
      id: 'bra-botafugo',
      name: 'Botafugo',
      city: 'Río de Janeiro',
      strength: 80,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'bra-palmeyras',
      name: 'Palmeyras',
      city: 'São Paulo',
      strength: 80,
      colors: ['#006437', '#ffffff']
    },
    {
      id: 'bra-flamenko',
      name: 'Flamenko',
      city: 'Río de Janeiro',
      strength: 79,
      colors: ['#c52613', '#000000'],
      rival: 'bra-atletico-minero'
    },
    {
      id: 'bra-atletico-minero',
      name: 'Atlético Minero',
      city: 'Belo Horizonte',
      strength: 77,
      colors: ['#000000', '#ffffff'],
      rival: 'bra-flamenko'
    },
    {
      id: 'bra-sao-paolo',
      name: 'São Paolo',
      city: 'São Paulo',
      strength: 76,
      colors: ['#ffffff', '#e4002b']
    },
    {
      id: 'bra-fortalesa',
      name: 'Fortalesa',
      city: 'Fortaleza',
      strength: 75,
      colors: ['#e4002b', '#0033a0'],
      rival: 'bra-seara'
    },
    {
      id: 'bra-internazional',
      name: 'Internazional',
      city: 'Porto Alegre',
      strength: 75,
      colors: ['#e5050f', '#ffffff'],
      rival: 'bra-grenio'
    },
    {
      id: 'bra-corinthiens',
      name: 'Corinthiens',
      city: 'São Paulo',
      strength: 74,
      colors: ['#ffffff', '#000000'],
      rival: 'bra-santoz'
    },
    {
      id: 'bra-fluminence',
      name: 'Fluminence',
      city: 'Río de Janeiro',
      strength: 74,
      colors: ['#870a28', '#00613c']
    },
    {
      id: 'bra-cruceiro',
      name: 'Cruceiro',
      city: 'Belo Horizonte',
      strength: 74,
      colors: ['#2f529e', '#ffffff']
    },
    {
      id: 'bra-grenio',
      name: 'Grênio',
      city: 'Porto Alegre',
      strength: 73,
      colors: ['#0d80bf', '#000000'],
      rival: 'bra-internazional'
    },
    {
      id: 'bra-ec-baia',
      name: 'EC Baia',
      city: 'Salvador',
      strength: 73,
      colors: ['#0059a6', '#e4002b'],
      rival: 'bra-victoria'
    },
    {
      id: 'bra-athletico-paranense',
      name: 'Athletico Paranense',
      city: 'Curitiba',
      strength: 72,
      colors: ['#c8102e', '#000000'],
      rival: 'bra-coritiva'
    },
    {
      id: 'bra-vasco-da-gamma',
      name: 'Vasco da Gamma',
      city: 'Río de Janeiro',
      strength: 72,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'bra-rb-bragantinho',
      name: 'RB Bragantinho',
      city: 'Bragança Paulista',
      strength: 71,
      colors: ['#ffffff', '#e4002b']
    },
    {
      id: 'bra-victoria',
      name: 'Victória',
      city: 'Salvador',
      strength: 69,
      colors: ['#e4002b', '#000000'],
      rival: 'bra-ec-baia'
    },
    {
      id: 'bra-juventud',
      name: 'Juventud',
      city: 'Caxias do Sul',
      strength: 68,
      colors: ['#00843d', '#ffffff']
    },
    {
      id: 'bra-cuyaba',
      name: 'Cuyabá',
      city: 'Cuiabá',
      strength: 67,
      colors: ['#00843d', '#ffd100']
    },
    {
      id: 'bra-crisiuma',
      name: 'Crisiúma',
      city: 'Criciúma',
      strength: 67,
      colors: ['#ffd100', '#000000']
    },
    {
      id: 'bra-atletico-goianense',
      name: 'Atlético Goianense',
      city: 'Goiânia',
      strength: 66,
      colors: ['#c8102e', '#000000']
    }
  ],
  division2: [
    {
      id: 'bra-santoz',
      name: 'Santoz',
      city: 'Santos',
      strength: 66,
      colors: ['#ffffff', '#000000'],
      rival: 'bra-corinthiens'
    },
    {
      id: 'bra-sport-recive',
      name: 'Sport Recive',
      city: 'Recife',
      strength: 65,
      colors: ['#e4002b', '#000000']
    },
    {
      id: 'bra-seara',
      name: 'Seará',
      city: 'Fortaleza',
      strength: 64,
      colors: ['#000000', '#ffffff'],
      rival: 'bra-fortalesa'
    },
    {
      id: 'bra-goyas',
      name: 'Goyás',
      city: 'Goiânia',
      strength: 64,
      colors: ['#00843d', '#ffffff'],
      rival: 'bra-villa-nova'
    },
    {
      id: 'bra-coritiva',
      name: 'Coritiva',
      city: 'Curitiba',
      strength: 63,
      colors: ['#00543d', '#ffffff'],
      rival: 'bra-athletico-paranense'
    },
    {
      id: 'bra-amerika-mineiro',
      name: 'Amérika Mineiro',
      city: 'Belo Horizonte',
      strength: 63,
      colors: ['#00843d', '#000000']
    },
    {
      id: 'bra-mirasol',
      name: 'Mirasol',
      city: 'Mirassol',
      strength: 62,
      colors: ['#ffd100', '#006437']
    },
    {
      id: 'bra-novorisontino',
      name: 'Novorisontino',
      city: 'Novo Horizonte',
      strength: 61,
      colors: ['#ffd100', '#000000']
    },
    {
      id: 'bra-chapecuense',
      name: 'Chapecuense',
      city: 'Chapecó',
      strength: 61,
      colors: ['#00843d', '#ffffff']
    },
    {
      id: 'bra-abai',
      name: 'Abaí',
      city: 'Florianópolis',
      strength: 60,
      colors: ['#0033a0', '#ffffff']
    },
    {
      id: 'bra-villa-nova',
      name: 'Villa Nova',
      city: 'Goiânia',
      strength: 60,
      colors: ['#c8102e', '#ffffff'],
      rival: 'bra-goyas'
    },
    {
      id: 'bra-ponte-prieta',
      name: 'Ponte Prieta',
      city: 'Campinas',
      strength: 59,
      colors: ['#000000', '#ffffff'],
      rival: 'bra-guarany'
    },
    {
      id: 'bra-guarany',
      name: 'Guarany',
      city: 'Campinas',
      strength: 59,
      colors: ['#00843d', '#ffffff'],
      rival: 'bra-ponte-prieta'
    },
    {
      id: 'bra-paisandu',
      name: 'Paisandu',
      city: 'Belém',
      strength: 59,
      colors: ['#0072ce', '#ffffff']
    },
    {
      id: 'bra-operario-ferrovario',
      name: 'Operário Ferrovário',
      city: 'Ponta Grossa',
      strength: 58,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'bra-cr-brazil',
      name: 'CR Brazil',
      city: 'Maceió',
      strength: 58,
      colors: ['#e4002b', '#ffffff']
    },
    {
      id: 'bra-bottafogo-sp',
      name: 'Bottafogo SP',
      city: 'Ribeirão Preto',
      strength: 57,
      colors: ['#e4002b', '#ffffff']
    },
    {
      id: 'bra-amasonas-fc',
      name: 'Amasonas FC',
      city: 'Manaos',
      strength: 57,
      colors: ['#ffd100', '#000000']
    },
    {
      id: 'bra-ytuano',
      name: 'Ytuano',
      city: 'Itu',
      strength: 56,
      colors: ['#e4002b', '#000000']
    },
    {
      id: 'bra-brusqui',
      name: 'Brusqui',
      city: 'Brusque',
      strength: 56,
      colors: ['#ffd100', '#00843d']
    }
  ],
  firstOffers: ['bra-flamenko', 'bra-cruceiro', 'bra-santoz']
}
