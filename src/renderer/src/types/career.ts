import type { AttributeId, Attributes } from '../data/attributes'
import type { Division } from '../data/clubs'
import type { ContinentalCupId, ContinentalQualifiers } from '../data/continentalCups'
import type { GameMode } from '../data/gameModes'
import type { MatchPhase } from '../data/matchTypes'
import type { NationalityId } from '../data/nationalities'
import type { TournamentId, TournamentRound } from '../data/nationalTeams'
import type { OriginId } from '../data/origins'
import type { TrophyId } from '../data/trophies'
import type { Character } from './character'

export type Flags = Record<string, string | number | boolean>

export type CompetitionId = 'liga' | 'copa' | 'continental'

/** Equipos de cada competición en una temporada (se fija al empezarla). */
export interface SeasonSetup {
  countryId: NationalityId
  /** División en la que juega tu club. */
  division: Division
  /** Equipos de tu división. */
  league: string[]
  /** 32 equipos de la copa de tu país. */
  cup: string[]
  /** Equipos de la copa internacional que juega tu club (o la principal de tu zona). */
  continental: string[]
  /** Copa internacional (desde la v0.10; sin valor, la copa antigua de 16 equipos). */
  continentalCup?: ContinentalCupId
  /** 2 = calendario que alterna casa y fuera (v0.9); sin valor, el de antes. */
  schedule?: 2
}

/** Primera y segunda división de cada país en la temporada actual (cambian con los ascensos). */
export type DivisionsState = Record<NationalityId, [string[], string[]]>

/** Resultado de una decisión ya tomada (se guarda para el diario de la temporada). */
export interface EventResolution {
  eventId: string
  optionIndex: number
  /** Si la opción tenía tirada: valor necesario, tirada y si salió bien. */
  roll?: { attribute: AttributeId; chance: number; roll: number; success: boolean }
  text: string
  /** Excompañero protagonista del evento, si lo hay (id de `Teammate`). */
  featured?: string
}

/** Papel de un compañero destacado en el vestuario. */
export type TeammateRole = 'capitan' | 'rival' | 'veterano' | 'amigo' | 'joven'

/** Compañero (o excompañero) con el que tienes relación. */
export interface Teammate {
  /** `${clubId}#${índice en la plantilla}` */
  id: string
  name: string
  role: TeammateRole
  /** Club en el que coincidisteis. */
  clubId: string
  /** Relación contigo, 0–100 (50 = neutral). */
  relation: number
  /** Temporada en la que empezasteis a coincidir. */
  since: number
}

/** Un partido de tu club (los del resto de equipos se recalculan con la semilla). */
export interface ClubMatch {
  /** Hueco del calendario de la temporada. */
  slot: number
  competition: CompetitionId
  opponentId: string
  home: boolean
  goalsFor: number
  goalsAgainst: number
  /** Tanda de penaltis en eliminatorias que acaban en empate. */
  penalties?: { for: number; against: number }
  /** ¿Jugaste? */
  played: boolean
  /** No jugaste por lesión. */
  injured?: boolean
  /** Si no jugaste: 'banca' = convocado sin salir; 'fuera' = no convocado (desde la v0.11). */
  squad?: 'banca' | 'fuera'
  playerGoals: number
  playerAssists: number
  /** Nota del partido (solo si jugaste). */
  rating?: number
  /** Partido importante jugado jugada a jugada. */
  important?: boolean
}

/** Decisión tomada en una jugada de un partido importante. */
export interface MomentResolution {
  momentId: string
  minute: number
  optionIndex: number
  roll?: EventResolution['roll']
  text: string
}

/** Tu papel en un partido importante: titular, suplente (sales al campo) o no convocado. */
export type MatchRole = 'titular' | 'suplente' | 'noConvocado'

/** Partido importante en curso (modo con temporadas completas). */
export interface LiveMatch {
  slot: number
  competition: CompetitionId
  /** Jornada o ronda (para el nombre: "Final", "Jornada 12"…). */
  round: number
  opponentId: string
  home: boolean
  /** Eliminatoria (si acaba en empate hay penaltis) y campo neutral (finales). */
  knockout: boolean
  neutral: boolean
  /** Fase y minuto de cada jugada que vas a vivir. */
  phases: MatchPhase[]
  minutes: number[]
  /** Jugadas ya elegidas (la siguiente se elige según cómo va el marcador). */
  momentIds: string[]
  resolutions: MomentResolution[]
  /** Goles que pasan sin que tú decidas (compañeros y rival), con su minuto. */
  background: Array<{ minute: number; side: 'for' | 'against' }>
  /** Goles y asistencias tuyas y goles extra salidos de tus decisiones. */
  playerGoals: number
  playerAssists: number
  momentGoalsFor: number
  momentGoalsAgainst: number
  /** Desde la v0.11: tu papel, el minuto en que entras (suplente) o en que te cambian (titular). */
  role?: MatchRole
  enterMinute?: number
  exitMinute?: number
  /** Ya viste la convocatoria y empezó el partido. */
  started?: boolean
}

/** Temporada en curso. */
export interface SeasonProgress {
  setup: SeasonSetup
  /** Mensualidades del sueldo ya cobradas esta temporada (de 12). */
  salaryPaid: number
  /** Eventos de la temporada (vacío en las temporadas sin decisiones). */
  eventIds: string[]
  /** Hueco del calendario en el que aparece cada evento. */
  eventSlots: number[]
  resolutions: EventResolution[]
  /** Goles extra conseguidos en los eventos. */
  bonusGoals: number
  /** Dinero ganado o gastado en los eventos de esta temporada. */
  eventMoney: number
  /** Huecos del calendario ya jugados. */
  playedSlots: number
  clubMatches: ClubMatch[]
  liveMatch: LiveMatch | null
  /** Lesionado hasta este hueco del calendario (sin incluir). */
  injuredUntil: number
}

export interface SeasonEarnings {
  salary: number
  goalBonus: number
  titleBonus: number
  events: number
}

/** Una temporada terminada: lo que se muestra en la Sala de trofeos. */
export interface SeasonRecord {
  season: number
  /** "2026/27" */
  yearLabel: string
  clubId: string
  age: number
  matches: number
  goals: number
  assists: number
  /** Nota media 1–10. */
  rating: number
  leaguePosition: number
  trophies: TrophyId[]
  attributeChanges: Partial<Attributes>
  /** Selección nacional (desde la v0.5; las temporadas antiguas no lo tienen). */
  nationalTeam?: NationalTeamSeason
  /** Desde la v0.7: partidos del club y clasificación final de la liga (ids de club). */
  clubMatches?: ClubMatch[]
  finalTable?: string[]
  /** Hasta dónde llegó tu club en la copa y en la copa internacional. */
  cupRound?: string
  continentalRound?: string
  earnings?: SeasonEarnings
  /** Desde la v0.8: equipos de las competiciones, división, ascenso/descenso y puntos ganados. */
  setup?: SeasonSetup
  division?: Division
  movement?: 'ascenso' | 'descenso'
  trainingPoints?: number
  /** Desde la v0.10: capitanía (si lo eras, si te nombraron o si la perdiste esa temporada). */
  captain?: boolean
  becameCaptain?: boolean
  lostCaptaincy?: boolean
}

export interface NationalTeamSeason {
  calledUp: boolean
  caps: number
  goals: number
  /** Torneo de verano, si lo hubo y fuiste convocado. */
  tournament?: { id: TournamentId; round: TournamentRound }
}

export type ContractRole = 'Titular' | 'Rotación' | 'Promesa'

export interface Contract {
  clubId: string
  signedSeason: number
  /** Última temporada incluida. */
  endSeason: number
  /** Euros por semana. */
  weeklyWage: number
  /** Prima por cada gol con el club. */
  goalBonus: number
  /** Prima por cada título colectivo con el club. */
  titleBonus: number
  role: ContractRole
  releaseClause: number
}

/** Una mejora comprada en la tienda. */
export interface Purchase {
  itemId: string
  season: number
  cost: number
  /** Lo que se obtuvo de verdad (los atributos no pasan de 20). */
  attributes: Partial<Attributes>
  morale?: number
  reputation?: number
}

/** Decisión que dejó un flag (para explicar de dónde viene una consecuencia). */
export interface FlagSource {
  eventId: string
  optionIndex: number
  season: number
}

/** Estado completo de una carrera. Es lo que se guarda en disco. */
export interface Career {
  id: string
  createdAt: string
  updatedAt: string
  character: Character
  originId: OriginId
  /** Duración de la carrera y frecuencia de las decisiones (desde la v0.7). */
  mode: GameMode
  attributes: Attributes
  clubId: string
  age: number
  /** Temporada actual (1 = primera temporada como profesional). */
  season: number
  /** Confianza del entrenador, 0–100. */
  trust: number
  /** Moral, 0–100. */
  morale: number
  /** Fama, 0–100. */
  reputation: number
  /** Dinero ahorrado (euros). */
  money: number
  contract: Contract
  purchases: Purchase[]
  /** Divisiones de todos los países esta temporada. */
  divisions: DivisionsState
  /** Clasificados para cada copa internacional de esta temporada. */
  continentalTeams: ContinentalQualifiers
  /** Puntos de atributo ganados en la última temporada y aún sin repartir (máx. 5). */
  pendingPoints: number
  /** `null` cuando la temporada aún no ha empezado. */
  seasonProgress: SeasonProgress | null
  /** Temporadas terminadas, de la primera a la última. */
  history: SeasonRecord[]
  /** Memoria de decisiones para consecuencias futuras (p. ej. "rechazó al club X"). */
  flags: Flags
  /** Qué decisión dejó cada flag (desde la v0.9). */
  flagSources?: Record<string, FlagSource>
  /** Compañeros destacados de tu club actual (desde la v0.10). */
  teammates: Teammate[]
  /** Compañeros de tus clubes anteriores. */
  exTeammates: Teammate[]
  /** Capitán del equipo desde esa temporada (`null` si no lo eres). */
  captaincy: { clubId: string; since: number } | null
  /** Club que quieres fichar al final de la temporada (buscador de equipos). */
  transferTarget: { clubId: string; season: number } | null
}
