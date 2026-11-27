import type { CountryLeagues } from './types'

/** Estados Unidos: 20 clubes de la MLS y 20 de la USL Championship (temporada 2024). */
export const USA_LEAGUES: CountryLeagues = {
  countryId: 'USA',
  division1Name: 'Primera División de Estados Unidos',
  division2Name: 'Segunda División de Estados Unidos',
  cupName: 'Copa de Estados Unidos',
  division1: [
    {
      id: 'usa-inter-miani',
      name: 'Inter Miani',
      city: 'Miami',
      strength: 74,
      colors: ['#f7b5cd', '#231f20'],
      rival: 'usa-orlando-sity'
    },
    {
      id: 'usa-los-angelez-fc',
      name: 'Los Angelez FC',
      city: 'Los Ángeles',
      strength: 73,
      colors: ['#000000', '#c39e6d'],
      rival: 'usa-la-galaxi'
    },
    {
      id: 'usa-colombus-crew',
      name: 'Colombus Crew',
      city: 'Columbus',
      strength: 72,
      colors: ['#fedd00', '#000000'],
      rival: 'usa-fc-cincinatti'
    },
    {
      id: 'usa-la-galaxi',
      name: 'LA Galaxi',
      city: 'Los Ángeles',
      strength: 72,
      colors: ['#00245d', '#ffd200'],
      rival: 'usa-los-angelez-fc'
    },
    {
      id: 'usa-real-zalt-lake',
      name: 'Real Zalt Lake',
      city: 'Salt Lake City',
      strength: 70,
      colors: ['#b30838', '#013a81']
    },
    {
      id: 'usa-fc-cincinatti',
      name: 'FC Cincinatti',
      city: 'Cincinnati',
      strength: 70,
      colors: ['#f05323', '#263b80'],
      rival: 'usa-colombus-crew'
    },
    {
      id: 'usa-seattle-sounderz',
      name: 'Seattle Sounderz',
      city: 'Seattle',
      strength: 70,
      colors: ['#5d9741', '#236192'],
      rival: 'usa-portland-timberz'
    },
    {
      id: 'usa-orlando-sity',
      name: 'Orlando Sity',
      city: 'Orlando',
      strength: 69,
      colors: ['#633492', '#fde192'],
      rival: 'usa-inter-miani'
    },
    {
      id: 'usa-new-york-red-buls',
      name: 'New York Red Buls',
      city: 'Nueva York',
      strength: 68,
      colors: ['#d6001c', '#ffffff'],
      rival: 'usa-new-york-citi-fc'
    },
    {
      id: 'usa-new-york-citi-fc',
      name: 'New York Citi FC',
      city: 'Nueva York',
      strength: 68,
      colors: ['#6cace4', '#041e42'],
      rival: 'usa-new-york-red-buls'
    },
    {
      id: 'usa-atlanta-unided',
      name: 'Atlanta Unided',
      city: 'Atlanta',
      strength: 67,
      colors: ['#a2192f', '#000000']
    },
    {
      id: 'usa-philadelfia-union',
      name: 'Philadelfia Union',
      city: 'Filadelfia',
      strength: 67,
      colors: ['#071b2c', '#b19b69']
    },
    {
      id: 'usa-portland-timberz',
      name: 'Portland Timberz',
      city: 'Portland',
      strength: 66,
      colors: ['#00482b', '#d69a00'],
      rival: 'usa-seattle-sounderz'
    },
    {
      id: 'usa-houston-dinamo',
      name: 'Houston Dinamo',
      city: 'Houston',
      strength: 66,
      colors: ['#ff6b00', '#101820']
    },
    {
      id: 'usa-nashvile-sc',
      name: 'Nashvile SC',
      city: 'Nashville',
      strength: 65,
      colors: ['#ece83a', '#1f1646']
    },
    {
      id: 'usa-austen-fc',
      name: 'Austen FC',
      city: 'Austin',
      strength: 64,
      colors: ['#00b140', '#000000']
    },
    {
      id: 'usa-sporting-kanzas-city',
      name: 'Sporting Kanzas City',
      city: 'Kansas City',
      strength: 64,
      colors: ['#91b0d5', '#002f65']
    },
    {
      id: 'usa-new-ingland-revolution',
      name: 'New Ingland Revolution',
      city: 'Foxborough',
      strength: 63,
      colors: ['#0a2240', '#ce0e2d']
    },
    {
      id: 'usa-chicago-fyre',
      name: 'Chicago Fyre',
      city: 'Chicago',
      strength: 62,
      colors: ['#af2626', '#0a174a']
    },
    {
      id: 'usa-dc-unaited',
      name: 'D.C. Unaited',
      city: 'Washington',
      strength: 62,
      colors: ['#000000', '#ef3e42']
    }
  ],
  division2: [
    {
      id: 'usa-louisvile-city',
      name: 'Louisvile City',
      city: 'Louisville',
      strength: 62,
      colors: ['#4f2683', '#d4af37']
    },
    {
      id: 'usa-colorado-springs-switchbaks',
      name: 'Colorado Springs Switchbaks',
      city: 'Colorado Springs',
      strength: 61,
      colors: ['#0a2240', '#f7a800']
    },
    {
      id: 'usa-sacramento-republik',
      name: 'Sacramento Republik',
      city: 'Sacramento',
      strength: 61,
      colors: ['#b50938', '#000000']
    },
    {
      id: 'usa-tampa-bay-rowdiez',
      name: 'Tampa Bay Rowdiez',
      city: 'St. Petersburg',
      strength: 60,
      colors: ['#00843d', '#fdd100']
    },
    {
      id: 'usa-rode-island-fc',
      name: 'Rode Island FC',
      city: 'Pawtucket',
      strength: 59,
      colors: ['#002f6c', '#ffd100']
    },
    {
      id: 'usa-new-mexiko-united',
      name: 'New Mexiko United',
      city: 'Albuquerque',
      strength: 59,
      colors: ['#000000', '#ffd100']
    },
    {
      id: 'usa-charleston-batery',
      name: 'Charleston Batery',
      city: 'Charleston',
      strength: 59,
      colors: ['#ffd100', '#000000']
    },
    {
      id: 'usa-detroyt-city-fc',
      name: 'Detroyt City FC',
      city: 'Detroit',
      strength: 58,
      colors: ['#6b1f2a', '#d4af37']
    },
    {
      id: 'usa-indi-eleven',
      name: 'Indi Eleven',
      city: 'Indianápolis',
      strength: 58,
      colors: ['#0a2240', '#c8102e']
    },
    {
      id: 'usa-phoenix-raising',
      name: 'Phoenix Raising',
      city: 'Phoenix',
      strength: 57,
      colors: ['#e4002b', '#000000']
    },
    {
      id: 'usa-san-antonyo-fc',
      name: 'San Antonyo FC',
      city: 'San Antonio',
      strength: 57,
      colors: ['#000000', '#c8102e']
    },
    {
      id: 'usa-orange-kounty-sc',
      name: 'Orange Kounty SC',
      city: 'Irvine',
      strength: 56,
      colors: ['#f47a20', '#000000']
    },
    {
      id: 'usa-birmingam-legion',
      name: 'Birmingam Legion',
      city: 'Birmingham',
      strength: 56,
      colors: ['#000000', '#d4af37']
    },
    {
      id: 'usa-pittsburg-riverhounds',
      name: 'Pittsburg Riverhounds',
      city: 'Pittsburgh',
      strength: 56,
      colors: ['#000000', '#ffb81c']
    },
    {
      id: 'usa-el-paso-lokomotive',
      name: 'El Paso Lokomotive',
      city: 'El Paso',
      strength: 55,
      colors: ['#002b5c', '#f48120']
    },
    {
      id: 'usa-north-karolina-fc',
      name: 'North Karolina FC',
      city: 'Cary',
      strength: 54,
      colors: ['#002d62', '#c8102e']
    },
    {
      id: 'usa-oakland-rootz',
      name: 'Oakland Rootz',
      city: 'Oakland',
      strength: 54,
      colors: ['#004d2c', '#ffc72c']
    },
    {
      id: 'usa-fc-tulza',
      name: 'FC Tulza',
      city: 'Tulsa',
      strength: 53,
      colors: ['#000000', '#c99700']
    },
    {
      id: 'usa-menphis-901',
      name: 'Menphis 901',
      city: 'Memphis',
      strength: 53,
      colors: ['#000000', '#c8102e']
    },
    {
      id: 'usa-las-vegas-lightz',
      name: 'Las Vegas Lightz',
      city: 'Las Vegas',
      strength: 52,
      colors: ['#ff1493', '#000000']
    }
  ],
  firstOffers: ['usa-inter-miani', 'usa-new-york-citi-fc', 'usa-sacramento-republik']
}
