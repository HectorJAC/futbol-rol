import type { CountryLeagues } from './types'

/** Japón: los 20 clubes de la J1 League y los 20 de la J2 League (temporada 2024). */
export const JPN_LEAGUES: CountryLeagues = {
  countryId: 'JPN',
  division1Name: 'Primera División de Japón',
  division2Name: 'Segunda División de Japón',
  cupName: 'Copa de Japón',
  division1: [
    {
      id: 'jpn-visel-kobe',
      name: 'Visel Kobe',
      city: 'Kobe',
      strength: 72,
      colors: ['#a6192e', '#000000']
    },
    {
      id: 'jpn-sanfreche-hiroshima',
      name: 'Sanfreche Hiroshima',
      city: 'Hiroshima',
      strength: 72,
      colors: ['#5b2c86', '#ffffff']
    },
    {
      id: 'jpn-machida-zelbia',
      name: 'Machida Zelbia',
      city: 'Machida',
      strength: 71,
      colors: ['#003087', '#ffffff']
    },
    {
      id: 'jpn-kashima-antlerz',
      name: 'Kashima Antlerz',
      city: 'Kashima',
      strength: 70,
      colors: ['#b71234', '#0b1f4e'],
      rival: 'jpn-urawa-red-diamons'
    },
    {
      id: 'jpn-ganba-osaka',
      name: 'Ganba Osaka',
      city: 'Osaka',
      strength: 69,
      colors: ['#0047ab', '#000000'],
      rival: 'jpn-serezo-osaka'
    },
    {
      id: 'jpn-kawasaki-frontali',
      name: 'Kawasaki Frontali',
      city: 'Kawasaki',
      strength: 68,
      colors: ['#33b5e5', '#000000'],
      rival: 'jpn-fc-tokio'
    },
    {
      id: 'jpn-yokohama-f-marinoz',
      name: 'Yokohama F. Marinoz',
      city: 'Yokohama',
      strength: 68,
      colors: ['#003087', '#ffffff']
    },
    {
      id: 'jpn-urawa-red-diamons',
      name: 'Urawa Red Diamons',
      city: 'Saitama',
      strength: 68,
      colors: ['#e60012', '#000000'],
      rival: 'jpn-kashima-antlerz'
    },
    {
      id: 'jpn-fc-tokio',
      name: 'FC Tokio',
      city: 'Tokio',
      strength: 67,
      colors: ['#002e7d', '#e60012'],
      rival: 'jpn-kawasaki-frontali'
    },
    {
      id: 'jpn-serezo-osaka',
      name: 'Serezo Osaka',
      city: 'Osaka',
      strength: 67,
      colors: ['#e5007f', '#00205b'],
      rival: 'jpn-ganba-osaka'
    },
    {
      id: 'jpn-tokio-verdy',
      name: 'Tokio Verdy',
      city: 'Tokio',
      strength: 66,
      colors: ['#006b3f', '#ffffff']
    },
    {
      id: 'jpn-nagoya-grampuz',
      name: 'Nagoya Grampuz',
      city: 'Nagoya',
      strength: 66,
      colors: ['#d7000f', '#f6ab00']
    },
    {
      id: 'jpn-abispa-fukuoka',
      name: 'Abispa Fukuoka',
      city: 'Fukuoka',
      strength: 65,
      colors: ['#002060', '#c0c0c0']
    },
    {
      id: 'jpn-kioto-sanga',
      name: 'Kioto Sanga',
      city: 'Kioto',
      strength: 64,
      colors: ['#4f2683', '#c8102e']
    },
    {
      id: 'jpn-kashiwa-reisol',
      name: 'Kashiwa Reisol',
      city: 'Kashiwa',
      strength: 64,
      colors: ['#ffe100', '#000000'],
      rival: 'jpn-jef-united-chiva'
    },
    {
      id: 'jpn-alvirex-niigata',
      name: 'Alvirex Niigata',
      city: 'Niigata',
      strength: 64,
      colors: ['#ff6600', '#002e6d']
    },
    {
      id: 'jpn-shonan-belmare',
      name: 'Shonan Belmare',
      city: 'Hiratsuka',
      strength: 63,
      colors: ['#7bbf34', '#005bac']
    },
    {
      id: 'jpn-jubilo-iwada',
      name: 'Júbilo Iwada',
      city: 'Iwata',
      strength: 63,
      colors: ['#6cace4', '#ffffff'],
      rival: 'jpn-shimisu-s-pulse'
    },
    {
      id: 'jpn-consadole-saporo',
      name: 'Consadole Saporo',
      city: 'Sapporo',
      strength: 62,
      colors: ['#e60012', '#000000']
    },
    {
      id: 'jpn-sagan-tossu',
      name: 'Sagan Tossu',
      city: 'Tosu',
      strength: 62,
      colors: ['#5ec4ef', '#f39eb5']
    }
  ],
  division2: [
    {
      id: 'jpn-shimisu-s-pulse',
      name: 'Shimisu S-Pulse',
      city: 'Shizuoka',
      strength: 62,
      colors: ['#f39800', '#1f2e5a'],
      rival: 'jpn-jubilo-iwada'
    },
    {
      id: 'jpn-yocohama-fc',
      name: 'Yocohama FC',
      city: 'Yokohama',
      strength: 62,
      colors: ['#00a0e9', '#ffffff']
    },
    {
      id: 'jpn-v-varen-nagazaki',
      name: 'V-Varen Nagazaki',
      city: 'Nagasaki',
      strength: 61,
      colors: ['#f39800', '#0057a8']
    },
    {
      id: 'jpn-fajiano-okayama',
      name: 'Fajiano Okayama',
      city: 'Okayama',
      strength: 60,
      colors: ['#a5143c', '#002060']
    },
    {
      id: 'jpn-vegalta-senday',
      name: 'Vegalta Senday',
      city: 'Sendai',
      strength: 60,
      colors: ['#ffd200', '#0b2c6e'],
      rival: 'jpn-montedio-yamagatta'
    },
    {
      id: 'jpn-montedio-yamagatta',
      name: 'Montedio Yamagatta',
      city: 'Yamagata',
      strength: 59,
      colors: ['#003da5', '#ffffff'],
      rival: 'jpn-vegalta-senday'
    },
    {
      id: 'jpn-jef-united-chiva',
      name: 'JEF United Chiva',
      city: 'Chiba',
      strength: 59,
      colors: ['#ffd700', '#00873c'],
      rival: 'jpn-kashiwa-reisol'
    },
    {
      id: 'jpn-venforet-kofu',
      name: 'Venforet Kofu',
      city: 'Kofu',
      strength: 58,
      colors: ['#002c8b', '#e60012']
    },
    {
      id: 'jpn-iwaky-fc',
      name: 'Iwaky FC',
      city: 'Iwaki',
      strength: 58,
      colors: ['#e60012', '#ffffff']
    },
    {
      id: 'jpn-tokushima-vortiz',
      name: 'Tokushima Vortiz',
      city: 'Tokushima',
      strength: 57,
      colors: ['#1b3c8b', '#00a651']
    },
    {
      id: 'jpn-ehimi-fc',
      name: 'Ehimi FC',
      city: 'Matsuyama',
      strength: 56,
      colors: ['#f39800', '#0a2240']
    },
    {
      id: 'jpn-renova-yamaguchi',
      name: 'Renova Yamaguchi',
      city: 'Yamaguchi',
      strength: 56,
      colors: ['#f05a28', '#ffffff']
    },
    {
      id: 'jpn-mito-holyhock',
      name: 'Mito HolyHock',
      city: 'Mito',
      strength: 56,
      colors: ['#003da5', '#ffffff']
    },
    {
      id: 'jpn-oita-trinida',
      name: 'Oita Trinida',
      city: 'Oita',
      strength: 55,
      colors: ['#0047ab', '#ffd700']
    },
    {
      id: 'jpn-roaso-kumamoto',
      name: 'Roaso Kumamoto',
      city: 'Kumamoto',
      strength: 55,
      colors: ['#c8102e', '#ffffff']
    },
    {
      id: 'jpn-blaublitz-akida',
      name: 'Blaublitz Akida',
      city: 'Akita',
      strength: 54,
      colors: ['#0047ab', '#ffffff']
    },
    {
      id: 'jpn-fujeda-myfc',
      name: 'Fujeda MYFC',
      city: 'Fujieda',
      strength: 54,
      colors: ['#5b2c86', '#ffffff']
    },
    {
      id: 'jpn-tochigui-sc',
      name: 'Tochigui SC',
      city: 'Utsunomiya',
      strength: 54,
      colors: ['#ffd700', '#003da5']
    },
    {
      id: 'jpn-kagoshima-yunited',
      name: 'Kagoshima Yunited',
      city: 'Kagoshima',
      strength: 53,
      colors: ['#1d2088', '#ffffff']
    },
    {
      id: 'jpn-thespakusatsu-gumma',
      name: 'Thespakusatsu Gumma',
      city: 'Maebashi',
      strength: 52,
      colors: ['#00479d', '#ffffff']
    }
  ],
  firstOffers: ['jpn-visel-kobe', 'jpn-nagoya-grampuz', 'jpn-shimisu-s-pulse']
}
