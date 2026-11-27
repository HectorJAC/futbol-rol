import type { CountryLeagues } from './types'

export const ESP_LEAGUES: CountryLeagues = {
  countryId: 'ESP',
  division1Name: 'Primera División de España',
  division2Name: 'Segunda División de España',
  cupName: 'Copa de España',
  division1: [
    {
      id: 'esp-real-madrik',
      name: 'Real Madrik',
      city: 'Madrid',
      strength: 88,
      colors: ['#ffffff', '#febe10'],
      rival: 'esp-fc-barkelone'
    },
    {
      id: 'esp-fc-barkelone',
      name: 'FC Barkelone',
      city: 'Barcelona',
      strength: 87,
      colors: ['#a50044', '#004d98'],
      rival: 'esp-real-madrik'
    },
    {
      id: 'esp-atletico-de-madrit',
      name: 'Atlético de Madrit',
      city: 'Madrid',
      strength: 84,
      colors: ['#cb3524', '#ffffff']
    },
    {
      id: 'esp-athletik-club',
      name: 'Athletik Club',
      city: 'Bilbao',
      strength: 81,
      colors: ['#ee2523', '#ffffff'],
      rival: 'esp-real-sociedat'
    },
    {
      id: 'esp-villareal-cf',
      name: 'Villareal CF',
      city: 'Villarreal',
      strength: 80,
      colors: ['#ffe667', '#005187']
    },
    {
      id: 'esp-real-sociedat',
      name: 'Real Sociedat',
      city: 'San Sebastián',
      strength: 79,
      colors: ['#0067b1', '#ffffff'],
      rival: 'esp-athletik-club'
    },
    {
      id: 'esp-real-betys',
      name: 'Real Betys',
      city: 'Sevilla',
      strength: 78,
      colors: ['#00954c', '#ffffff'],
      rival: 'esp-sevilla-fk'
    },
    {
      id: 'esp-girone-fc',
      name: 'Girone FC',
      city: 'Gerona',
      strength: 77,
      colors: ['#cd2534', '#ffffff']
    },
    {
      id: 'esp-sevilla-fk',
      name: 'Sevilla FK',
      city: 'Sevilla',
      strength: 77,
      colors: ['#ffffff', '#d4001f'],
      rival: 'esp-real-betys'
    },
    {
      id: 'esp-zelta-de-vigo',
      name: 'Zelta de Vigo',
      city: 'Vigo',
      strength: 75,
      colors: ['#8ac3ee', '#ffffff'],
      rival: 'esp-deportibo-de-la-coruna'
    },
    {
      id: 'esp-valensia-cf',
      name: 'Valensia CF',
      city: 'Valencia',
      strength: 75,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'esp-ca-osazuna',
      name: 'CA Osazuna',
      city: 'Pamplona',
      strength: 74,
      colors: ['#d91a21', '#0a346f']
    },
    {
      id: 'esp-rcd-mallorka',
      name: 'RCD Mallorka',
      city: 'Palma',
      strength: 74,
      colors: ['#e20613', '#000000']
    },
    {
      id: 'esp-rayo-vallekano',
      name: 'Rayo Vallekano',
      city: 'Madrid',
      strength: 73,
      colors: ['#ffffff', '#e30613']
    },
    {
      id: 'esp-jetafe-cf',
      name: 'Jetafe CF',
      city: 'Getafe',
      strength: 73,
      colors: ['#005999', '#ffffff']
    },
    {
      id: 'esp-deportivo-alavez',
      name: 'Deportivo Alavéz',
      city: 'Vitoria',
      strength: 72,
      colors: ['#0761af', '#ffffff']
    },
    {
      id: 'esp-rcd-espanyel',
      name: 'RCD Espanyel',
      city: 'Barcelona',
      strength: 71,
      colors: ['#007fc8', '#ffffff']
    },
    {
      id: 'esp-ud-las-palmaz',
      name: 'UD Las Palmaz',
      city: 'Las Palmas de Gran Canaria',
      strength: 71,
      colors: ['#ffe600', '#0055a4'],
      rival: 'esp-cd-teneriffe'
    },
    {
      id: 'esp-cd-leganez',
      name: 'CD Leganéz',
      city: 'Leganés',
      strength: 70,
      colors: ['#1b4b9b', '#ffffff']
    },
    {
      id: 'esp-real-valladolit',
      name: 'Real Valladolit',
      city: 'Valladolid',
      strength: 70,
      colors: ['#5d2a8a', '#ffffff']
    }
  ],
  division2: [
    {
      id: 'esp-ud-almerya',
      name: 'UD Almerya',
      city: 'Almería',
      strength: 69,
      colors: ['#ee2523', '#ffffff']
    },
    {
      id: 'esp-lebante-ud',
      name: 'Lebante UD',
      city: 'Valencia',
      strength: 68,
      colors: ['#004c9d', '#ce1126']
    },
    {
      id: 'esp-elxe-cf',
      name: 'Elxe CF',
      city: 'Elche',
      strength: 68,
      colors: ['#ffffff', '#05642c']
    },
    {
      id: 'esp-grenada-cf',
      name: 'Grenada CF',
      city: 'Granada',
      strength: 67,
      colors: ['#c8102e', '#ffffff']
    },
    {
      id: 'esp-real-obiedo',
      name: 'Real Obiedo',
      city: 'Oviedo',
      strength: 67,
      colors: ['#0047ab', '#ffffff'],
      rival: 'esp-sporting-de-xixon'
    },
    {
      id: 'esp-racing-de-santanter',
      name: 'Racing de Santanter',
      city: 'Santander',
      strength: 66,
      colors: ['#ffffff', '#008a3e']
    },
    {
      id: 'esp-cadis-cf',
      name: 'Cádis CF',
      city: 'Cádiz',
      strength: 66,
      colors: ['#fde100', '#0047ab']
    },
    {
      id: 'esp-malega-cf',
      name: 'Málega CF',
      city: 'Málaga',
      strength: 65,
      colors: ['#6caddf', '#ffffff']
    },
    {
      id: 'esp-sporting-de-xixon',
      name: 'Sporting de Xixón',
      city: 'Gijón',
      strength: 65,
      colors: ['#e30613', '#ffffff'],
      rival: 'esp-real-obiedo'
    },
    {
      id: 'esp-deportibo-de-la-coruna',
      name: 'Deportibo de La Coruña',
      city: 'La Coruña',
      strength: 65,
      colors: ['#0055a4', '#ffffff'],
      rival: 'esp-zelta-de-vigo'
    },
    {
      id: 'esp-real-zaragosa',
      name: 'Real Zaragosa',
      city: 'Zaragoza',
      strength: 64,
      colors: ['#ffffff', '#0b4ea2']
    },
    {
      id: 'esp-cd-mirandez',
      name: 'CD Mirandéz',
      city: 'Miranda de Ebro',
      strength: 64,
      colors: ['#e30613', '#000000']
    },
    {
      id: 'esp-sd-huezca',
      name: 'SD Huezca',
      city: 'Huesca',
      strength: 63,
      colors: ['#1a3e8c', '#c8102e']
    },
    {
      id: 'esp-sd-eybar',
      name: 'SD Eybar',
      city: 'Éibar',
      strength: 63,
      colors: ['#a50044', '#004d98']
    },
    {
      id: 'esp-cordova-cf',
      name: 'Córdova CF',
      city: 'Córdoba',
      strength: 62,
      colors: ['#ffffff', '#00843d']
    },
    {
      id: 'esp-albazete',
      name: 'Albazete',
      city: 'Albacete',
      strength: 61,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'esp-burgoz-cf',
      name: 'Burgoz CF',
      city: 'Burgos',
      strength: 61,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'esp-cd-kastellon',
      name: 'CD Kastellón',
      city: 'Castellón de la Plana',
      strength: 60,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'esp-cd-teneriffe',
      name: 'CD Teneriffe',
      city: 'Santa Cruz de Tenerife',
      strength: 59,
      colors: ['#ffffff', '#0047ab'],
      rival: 'esp-ud-las-palmaz'
    },
    {
      id: 'esp-fc-kartagena',
      name: 'FC Kartagena',
      city: 'Cartagena',
      strength: 58,
      colors: ['#000000', '#ffffff']
    }
  ],
  firstOffers: ['esp-atletico-de-madrit', 'esp-valensia-cf', 'esp-deportibo-de-la-coruna']
}
