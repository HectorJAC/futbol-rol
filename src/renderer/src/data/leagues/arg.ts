import type { CountryLeagues } from './types'

/** Argentina: 20 clubes de la Liga Profesional y 20 de la Primera Nacional (temporada 2024). */
export const ARG_LEAGUES: CountryLeagues = {
  countryId: 'ARG',
  division1Name: 'Primera División de Argentina',
  division2Name: 'Segunda División de Argentina',
  cupName: 'Copa de Argentina',
  division1: [
    {
      id: 'arg-river-plata',
      name: 'River Plata',
      city: 'Buenos Aires',
      strength: 79,
      colors: ['#e30613', '#ffffff'],
      rival: 'arg-boka-juniors'
    },
    {
      id: 'arg-boka-juniors',
      name: 'Boka Juniors',
      city: 'Buenos Aires',
      strength: 78,
      colors: ['#003c82', '#f9b500'],
      rival: 'arg-river-plata'
    },
    {
      id: 'arg-rasing-club',
      name: 'Rasing Club',
      city: 'Avellaneda',
      strength: 75,
      colors: ['#6cace4', '#ffffff'],
      rival: 'arg-independiende'
    },
    {
      id: 'arg-tallerez',
      name: 'Tallerez',
      city: 'Córdoba',
      strength: 74,
      colors: ['#002f6c', '#ffffff'],
      rival: 'arg-velgrano'
    },
    {
      id: 'arg-velez-zarsfield',
      name: 'Vélez Zarsfield',
      city: 'Buenos Aires',
      strength: 74,
      colors: ['#ffffff', '#0033a0'],
      rival: 'arg-fero-carril-oeste'
    },
    {
      id: 'arg-estudiantez-de-la-plata',
      name: 'Estudiantez de La Plata',
      city: 'La Plata',
      strength: 72,
      colors: ['#e2001a', '#ffffff'],
      rival: 'arg-gimnacia-la-plata'
    },
    {
      id: 'arg-independiende',
      name: 'Independiende',
      city: 'Avellaneda',
      strength: 71,
      colors: ['#d50000', '#ffffff'],
      rival: 'arg-rasing-club'
    },
    {
      id: 'arg-rosario-sentral',
      name: 'Rosario Sentral',
      city: 'Rosario',
      strength: 71,
      colors: ['#00337f', '#ffd100'],
      rival: 'arg-newels-old-boys'
    },
    {
      id: 'arg-hurakan',
      name: 'Hurakán',
      city: 'Buenos Aires',
      strength: 70,
      colors: ['#ffffff', '#e2001a'],
      rival: 'arg-san-lorenso'
    },
    {
      id: 'arg-san-lorenso',
      name: 'San Lorenso',
      city: 'Buenos Aires',
      strength: 70,
      colors: ['#002f6c', '#d50032'],
      rival: 'arg-hurakan'
    },
    {
      id: 'arg-lanuz',
      name: 'Lanúz',
      city: 'Lanús',
      strength: 69,
      colors: ['#7b1e2e', '#ffffff'],
      rival: 'arg-bamfield'
    },
    {
      id: 'arg-argentinos-yuniors',
      name: 'Argentinos Yuniors',
      city: 'Buenos Aires',
      strength: 69,
      colors: ['#e2001a', '#ffffff']
    },
    {
      id: 'arg-defensa-y-justisia',
      name: 'Defensa y Justisia',
      city: 'Florencio Varela',
      strength: 68,
      colors: ['#ffd200', '#00843d']
    },
    {
      id: 'arg-newels-old-boys',
      name: "Newel's Old Boys",
      city: 'Rosario',
      strength: 67,
      colors: ['#d50032', '#000000'],
      rival: 'arg-rosario-sentral'
    },
    {
      id: 'arg-velgrano',
      name: 'Velgrano',
      city: 'Córdoba',
      strength: 67,
      colors: ['#5bc2e7', '#ffffff'],
      rival: 'arg-tallerez'
    },
    {
      id: 'arg-godoi-cruz',
      name: 'Godoi Cruz',
      city: 'Mendoza',
      strength: 66,
      colors: ['#0033a0', '#ffffff']
    },
    {
      id: 'arg-platence',
      name: 'Platence',
      city: 'Vicente López',
      strength: 65,
      colors: ['#5c3317', '#ffffff']
    },
    {
      id: 'arg-gimnacia-la-plata',
      name: 'Gimnacia La Plata',
      city: 'La Plata',
      strength: 65,
      colors: ['#002855', '#ffffff'],
      rival: 'arg-estudiantez-de-la-plata'
    },
    {
      id: 'arg-unio-de-santa-fe',
      name: 'Unió de Santa Fe',
      city: 'Santa Fe',
      strength: 64,
      colors: ['#e2001a', '#ffffff'],
      rival: 'arg-kolon'
    },
    {
      id: 'arg-bamfield',
      name: 'Bamfield',
      city: 'Banfield',
      strength: 64,
      colors: ['#00843d', '#ffffff'],
      rival: 'arg-lanuz'
    }
  ],
  division2: [
    {
      id: 'arg-kolon',
      name: 'Kolón',
      city: 'Santa Fe',
      strength: 64,
      colors: ['#e2001a', '#000000'],
      rival: 'arg-unio-de-santa-fe'
    },
    {
      id: 'arg-san-martin-de-tukuman',
      name: 'San Martín de Tukumán',
      city: 'San Miguel de Tucumán',
      strength: 63,
      colors: ['#e2001a', '#ffffff']
    },
    {
      id: 'arg-aldosibi',
      name: 'Aldosibi',
      city: 'Mar del Plata',
      strength: 63,
      colors: ['#00843d', '#ffd200']
    },
    {
      id: 'arg-arsenal-de-zarandi',
      name: 'Arsenal de Zarandí',
      city: 'Sarandí',
      strength: 62,
      colors: ['#6cace4', '#e2001a']
    },
    {
      id: 'arg-quilmez',
      name: 'Quilmez',
      city: 'Quilmes',
      strength: 62,
      colors: ['#ffffff', '#002855']
    },
    {
      id: 'arg-gimnasia-de-mendosa',
      name: 'Gimnasia de Mendosa',
      city: 'Mendoza',
      strength: 62,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'arg-san-marin-de-san-juan',
      name: 'San Marín de San Juan',
      city: 'San Juan',
      strength: 61,
      colors: ['#006633', '#000000']
    },
    {
      id: 'arg-chakarita-juniors',
      name: 'Chakarita Juniors',
      city: 'San Martín',
      strength: 61,
      colors: ['#e2001a', '#000000'],
      rival: 'arg-atlanda'
    },
    {
      id: 'arg-fero-carril-oeste',
      name: 'Fero Carril Oeste',
      city: 'Buenos Aires',
      strength: 60,
      colors: ['#006633', '#ffffff'],
      rival: 'arg-velez-zarsfield'
    },
    {
      id: 'arg-nueba-chicago',
      name: 'Nueba Chicago',
      city: 'Buenos Aires',
      strength: 59,
      colors: ['#006633', '#000000']
    },
    {
      id: 'arg-atlanda',
      name: 'Atlanda',
      city: 'Buenos Aires',
      strength: 59,
      colors: ['#ffd200', '#003087'],
      rival: 'arg-chakarita-juniors'
    },
    {
      id: 'arg-all-boyz',
      name: 'All Boyz',
      city: 'Buenos Aires',
      strength: 58,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'arg-temperlei',
      name: 'Temperlei',
      city: 'Temperley',
      strength: 58,
      colors: ['#6cace4', '#ffffff']
    },
    {
      id: 'arg-patronado',
      name: 'Patronado',
      city: 'Paraná',
      strength: 57,
      colors: ['#e2001a', '#000000']
    },
    {
      id: 'arg-almagros',
      name: 'Almagros',
      city: 'José Ingenieros',
      strength: 56,
      colors: ['#002f6c', '#ffffff']
    },
    {
      id: 'arg-atletico-de-rafaella',
      name: 'Atlético de Rafaella',
      city: 'Rafaela',
      strength: 56,
      colors: ['#6cace4', '#ffffff']
    },
    {
      id: 'arg-deportibo-moron',
      name: 'Deportibo Morón',
      city: 'Morón',
      strength: 55,
      colors: ['#e2001a', '#ffffff']
    },
    {
      id: 'arg-almirante-braun',
      name: 'Almirante Braun',
      city: 'Isidro Casanova',
      strength: 55,
      colors: ['#ffd200', '#000000']
    },
    {
      id: 'arg-defenzores-de-belgrano',
      name: 'Defenzores de Belgrano',
      city: 'Buenos Aires',
      strength: 54,
      colors: ['#e2001a', '#000000']
    },
    {
      id: 'arg-chaco-four-ever',
      name: 'Chaco Four Ever',
      city: 'Resistencia',
      strength: 54,
      colors: ['#000000', '#ffffff']
    }
  ],
  firstOffers: ['arg-boka-juniors', 'arg-lanuz', 'arg-quilmez']
}
