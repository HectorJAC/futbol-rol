import type { CountryLeagues } from './types'

export const FRA_LEAGUES: CountryLeagues = {
  countryId: 'FRA',
  division1Name: 'Primera División de Francia',
  division2Name: 'Segunda División de Francia',
  cupName: 'Copa de Francia',
  division1: [
    {
      id: 'fra-paris-saint-germaim',
      name: 'Paris Saint-Germaim',
      city: 'París',
      strength: 86,
      colors: ['#004170', '#da291c'],
      rival: 'fra-olympique-de-marseile'
    },
    {
      id: 'fra-as-monacco',
      name: 'AS Monacco',
      city: 'Mónaco',
      strength: 80,
      colors: ['#e51b22', '#ffffff'],
      rival: 'fra-ogc-nise'
    },
    {
      id: 'fra-olympique-de-marseile',
      name: 'Olympique de Marseile',
      city: 'Marsella',
      strength: 79,
      colors: ['#ffffff', '#2faee0'],
      rival: 'fra-paris-saint-germaim'
    },
    {
      id: 'fra-losc-lile',
      name: 'LOSC Lile',
      city: 'Lille',
      strength: 78,
      colors: ['#e01e13', '#24216a'],
      rival: 'fra-rc-lenz'
    },
    {
      id: 'fra-olympique-lyonais',
      name: 'Olympique Lyonais',
      city: 'Lyon',
      strength: 77,
      colors: ['#ffffff', '#1e3c96'],
      rival: 'fra-as-saint-etiene'
    },
    {
      id: 'fra-ogc-nise',
      name: 'OGC Nise',
      city: 'Niza',
      strength: 76,
      colors: ['#c8102e', '#000000'],
      rival: 'fra-as-monacco'
    },
    {
      id: 'fra-rc-lenz',
      name: 'RC Lenz',
      city: 'Lens',
      strength: 75,
      colors: ['#fdd100', '#e30613'],
      rival: 'fra-losc-lile'
    },
    {
      id: 'fra-stade-rennois',
      name: 'Stade Rennois',
      city: 'Rennes',
      strength: 74,
      colors: ['#e13327', '#000000'],
      rival: 'fra-fc-nantez'
    },
    {
      id: 'fra-rc-strasburg',
      name: 'RC Strasburg',
      city: 'Estrasburgo',
      strength: 74,
      colors: ['#009fe3', '#ffffff'],
      rival: 'fra-fc-mets'
    },
    {
      id: 'fra-stade-brestais',
      name: 'Stade Brestais',
      city: 'Brest',
      strength: 73,
      colors: ['#e30613', '#ffffff']
    },
    {
      id: 'fra-toulause-fc',
      name: 'Toulause FC',
      city: 'Toulouse',
      strength: 72,
      colors: ['#5b2d86', '#ffffff']
    },
    {
      id: 'fra-fc-nantez',
      name: 'FC Nantez',
      city: 'Nantes',
      strength: 71,
      colors: ['#fcd405', '#00843d'],
      rival: 'fra-stade-rennois'
    },
    {
      id: 'fra-stade-de-rheims',
      name: 'Stade de Rheims',
      city: 'Reims',
      strength: 70,
      colors: ['#e30613', '#ffffff']
    },
    {
      id: 'fra-aj-auxere',
      name: 'AJ Auxere',
      city: 'Auxerre',
      strength: 69,
      colors: ['#ffffff', '#0055a4']
    },
    {
      id: 'fra-le-avre-ac',
      name: 'Le Avre AC',
      city: 'El Havre',
      strength: 68,
      colors: ['#79bde8', '#1c2c5b']
    },
    {
      id: 'fra-angers-sko',
      name: 'Angers SKO',
      city: 'Angers',
      strength: 67,
      colors: ['#000000', '#ffffff']
    },
    {
      id: 'fra-as-saint-etiene',
      name: 'AS Saint-Étiene',
      city: 'Saint-Étienne',
      strength: 67,
      colors: ['#009639', '#ffffff'],
      rival: 'fra-olympique-lyonais'
    },
    {
      id: 'fra-montpelier-hsc',
      name: 'Montpelier HSC',
      city: 'Montpellier',
      strength: 66,
      colors: ['#f15a22', '#002d72']
    }
  ],
  division2: [
    {
      id: 'fra-fc-lorien',
      name: 'FC Lorien',
      city: 'Lorient',
      strength: 66,
      colors: ['#f58220', '#000000']
    },
    {
      id: 'fra-fc-mets',
      name: 'FC Mets',
      city: 'Metz',
      strength: 65,
      colors: ['#8b0e3a', '#ffffff'],
      rival: 'fra-rc-strasburg'
    },
    {
      id: 'fra-pari-fc',
      name: 'Pari FC',
      city: 'París',
      strength: 65,
      colors: ['#1b2a4a', '#8ec6ea']
    },
    {
      id: 'fra-ea-guingam',
      name: 'EA Guingam',
      city: 'Guingamp',
      strength: 63,
      colors: ['#e30613', '#000000']
    },
    {
      id: 'fra-usl-dunkerke',
      name: 'USL Dunkerke',
      city: 'Dunkerque',
      strength: 62,
      colors: ['#0055a4', '#ffffff']
    },
    {
      id: 'fra-clermond-foot',
      name: 'Clermond Foot',
      city: 'Clermont-Ferrand',
      strength: 62,
      colors: ['#c8102e', '#002d62']
    },
    {
      id: 'fra-sm-kaen',
      name: 'SM Kaen',
      city: 'Caen',
      strength: 61,
      colors: ['#0055a4', '#e30613']
    },
    {
      id: 'fra-estac-troyez',
      name: 'ESTAC Troyez',
      city: 'Troyes',
      strength: 61,
      colors: ['#0055a4', '#ffffff']
    },
    {
      id: 'fra-fc-anecy',
      name: 'FC Anecy',
      city: 'Annecy',
      strength: 60,
      colors: ['#e30613', '#ffffff']
    },
    {
      id: 'fra-sc-bastya',
      name: 'SC Bastya',
      city: 'Bastia',
      strength: 60,
      colors: ['#0055a4', '#ffffff'],
      rival: 'fra-ac-ajacio'
    },
    {
      id: 'fra-stade-lavalois',
      name: 'Stade Lavalois',
      city: 'Laval',
      strength: 60,
      colors: ['#f58220', '#000000']
    },
    {
      id: 'fra-amienz-sc',
      name: 'Amienz SC',
      city: 'Amiens',
      strength: 60,
      colors: ['#ffffff', '#000000']
    },
    {
      id: 'fra-grenobel-foot-38',
      name: 'Grenobel Foot 38',
      city: 'Grenoble',
      strength: 59,
      colors: ['#0055a4', '#ffffff']
    },
    {
      id: 'fra-paux-fc',
      name: 'Paux FC',
      city: 'Pau',
      strength: 59,
      colors: ['#ffd700', '#002d62']
    },
    {
      id: 'fra-rodes-af',
      name: 'Rodes AF',
      city: 'Rodez',
      strength: 59,
      colors: ['#e30613', '#ffd700']
    },
    {
      id: 'fra-red-starr-fc',
      name: 'Red Starr FC',
      city: 'Saint-Ouen',
      strength: 58,
      colors: ['#00843d', '#ffffff']
    },
    {
      id: 'fra-ac-ajacio',
      name: 'AC Ajacio',
      city: 'Ajaccio',
      strength: 57,
      colors: ['#e30613', '#ffffff'],
      rival: 'fra-sc-bastya'
    },
    {
      id: 'fra-fc-martigue',
      name: 'FC Martigue',
      city: 'Martigues',
      strength: 56,
      colors: ['#e30613', '#ffd700']
    }
  ],
  firstOffers: ['fra-as-monacco', 'fra-toulause-fc', 'fra-fc-lorien']
}
