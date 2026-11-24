export type TrophyKind = 'colectivo' | 'individual'

export type TrophyId =
  | 'liga'
  | 'segunda'
  | 'copa'
  | 'continental'
  | 'copa-europa'
  | 'conferencia'
  | 'intercontinental'
  | 'mundial'
  | 'copa-naciones'
  | 'goleador'
  | 'asistente'
  | 'joven'
  | 'mvp'
  | 'equipo-ideal'
  | 'balon-dorado'
  | 'bota-torneo'

export interface TrophyInfo {
  id: TrophyId
  /** Nombres propios del juego: sin licencias no se usan trofeos reales. */
  name: string
  kind: TrophyKind
  description: string
}

/** Catálogo de títulos. El orden es el de la vitrina. */
export const TROPHIES: readonly TrophyInfo[] = [
  { id: 'liga', name: 'Liga Nacional', kind: 'colectivo', description: 'Campeón de liga.' },
  {
    id: 'segunda',
    name: 'Campeón de Segunda',
    kind: 'colectivo',
    description: 'Campeón de la segunda división (y ascenso).'
  },
  { id: 'copa', name: 'Copa Nacional', kind: 'colectivo', description: 'Campeón de copa.' },
  {
    id: 'continental',
    name: 'Copa de Campeones',
    kind: 'colectivo',
    description: 'El gran torneo continental de clubes.'
  },
  {
    id: 'copa-europa',
    name: 'Copa de Europa',
    kind: 'colectivo',
    description: 'Segundo torneo europeo: 5º y 6º de cada liga.'
  },
  {
    id: 'conferencia',
    name: 'Copa Conferencia',
    kind: 'colectivo',
    description: 'Tercer torneo europeo: 7º de cada liga.'
  },
  {
    id: 'intercontinental',
    name: 'Copa Intercontinental',
    kind: 'colectivo',
    description: 'Torneo de clubes de América y Asia.'
  },
  {
    id: 'mundial',
    name: 'Copa Mundial de Naciones',
    kind: 'colectivo',
    description: 'Campeón del mundo con tu selección.'
  },
  {
    id: 'copa-naciones',
    name: 'Copa de Naciones',
    kind: 'colectivo',
    description: 'Campeón continental con tu selección.'
  },
  {
    id: 'balon-dorado',
    name: 'Balón Dorado',
    kind: 'individual',
    description: 'Mejor jugador del mundo de la temporada.'
  },
  {
    id: 'mvp',
    name: 'Jugador de la Temporada',
    kind: 'individual',
    description: 'Mejor jugador de la liga.'
  },
  {
    id: 'goleador',
    name: 'Bota de Plata',
    kind: 'individual',
    description: 'Máximo goleador de la liga.'
  },
  {
    id: 'asistente',
    name: 'Rey de las Asistencias',
    kind: 'individual',
    description: 'Máximo asistente de la liga.'
  },
  {
    id: 'equipo-ideal',
    name: 'Equipo Ideal',
    kind: 'individual',
    description: 'Elegido en el once ideal de la temporada.'
  },
  {
    id: 'joven',
    name: 'Mejor Jugador Joven',
    kind: 'individual',
    description: 'Mejor jugador de 21 años o menos.'
  },
  {
    id: 'bota-torneo',
    name: 'Bota de Oro de Selecciones',
    kind: 'individual',
    description: 'Máximo goleador de un torneo de selecciones.'
  }
]

export function getTrophy(id: TrophyId): TrophyInfo {
  const trophy = TROPHIES.find((t) => t.id === id)
  if (!trophy) throw new Error(`Trofeo desconocido: ${id}`)
  return trophy
}
