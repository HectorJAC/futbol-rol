import { create } from 'zustand'
import { emptyAttributes, type AttributeId, type Attributes } from '../data/attributes'
import type { EventEffects } from '../data/events'
import { defaultMode, type GameMode } from '../data/gameModes'
import type { MatchMomentEffects } from '../data/matchTypes'
import { cycleNationality, DEFAULT_NATIONALITY_ID } from '../data/nationalities'
import { getOrigin, randomExtraOrigin, type OriginId } from '../data/origins'
import { DEFAULT_POSITION_ID } from '../data/positions'
import { canAllocate, createCareer, remainingPoints } from '../logic/career'
import { normalizeName, validateName } from '../logic/characterName'
import { buyItem } from '../logic/finance'
import { finishLiveMatch, isLiveMatchOver, resolveMoment } from '../logic/match'
import { toSaveFile } from '../logic/saveGame'
import {
  advanceSeason,
  applyTrainingPoints,
  finishSeason,
  isCareerOver,
  isSeasonReadyToFinish,
  resolveChoice,
  seasonStep,
  startSeason
} from '../logic/season'
import { applyTransferDecision, isMarketPending, setTransferTarget } from '../logic/transfers'
import type { Career, EventResolution, MomentResolution, SeasonRecord } from '../types/career'
import type { CharacterDraft } from '../types/character'

export type Screen =
  | 'mainMenu'
  | 'loadGame'
  | 'characterCreation'
  | 'originSelection'
  | 'attributes'
  | 'clubSelection'
  | 'careerHub'
  | 'seasonEvent'
  | 'seasonSummary'
  | 'trophyRoom'
  | 'transferMarket'
  | 'records'
  | 'settings'
  | 'relationships'
  | 'modeSelection'
  | 'extras'
  | 'originCatalog'
  | 'competitions'
  | 'match'
  | 'contract'
  | 'trainingPoints'
  | 'clubSearch'

/** Pasos de "Nueva partida", en orden. */
export const CREATION_STEPS = [
  'characterCreation',
  'modeSelection',
  'originSelection',
  'attributes',
  'clubSelection'
] as const satisfies readonly Screen[]

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface NewGameDraft {
  character: CharacterDraft
  mode: GameMode
  originId: OriginId | null
  /** Origen extra que se ofrece en esta partida (uno al azar de los 10). */
  extraOriginId: OriginId
  /** Puntos libres repartidos en cada atributo. */
  allocation: Attributes
  clubId: string | null
}

export function createDefaultDraft(): NewGameDraft {
  return {
    character: {
      name: '',
      sex: 'M',
      position: DEFAULT_POSITION_ID,
      nationalityId: DEFAULT_NATIONALITY_ID
    },
    mode: defaultMode('normal'),
    originId: null,
    extraOriginId: randomExtraOrigin().id,
    allocation: emptyAttributes(),
    clubId: null
  }
}

interface GameState {
  screen: Screen
  draft: NewGameDraft
  career: Career | null
  saveStatus: SaveStatus
  /** Resultado de la última decisión (se muestra antes de pasar al siguiente evento). */
  lastChoice: { resolution: EventResolution; effects: EventEffects } | null
  /** Resultado de la última jugada de un partido importante. */
  lastMoment: { resolution: MomentResolution; effects: MatchMomentEffects } | null
  /** Temporada recién terminada (pantalla de resumen). */
  lastRecord: SeasonRecord | null

  // Menú
  startNewGame: () => void
  openLoadGame: () => void
  openRecords: () => void
  openSettings: () => void
  openExtras: () => void
  openOriginCatalog: () => void
  backToMenu: () => void

  // Paso 1: jugador
  setDraftName: (name: string) => void
  changeNationality: (step: 1 | -1) => void
  /** Valida el nombre; si es correcto pasa a elegir el modo de juego. */
  confirmCharacter: () => boolean

  // Paso 2: modo de juego
  setMode: (mode: GameMode) => void
  confirmMode: () => void

  // Paso 2: origen
  selectOrigin: (id: OriginId) => void
  confirmOrigin: () => boolean

  // Paso 3: atributos
  allocatePoint: (id: AttributeId, step: 1 | -1) => void
  resetAllocation: () => void
  confirmAttributes: () => boolean

  // Paso 4: club
  selectClub: (id: string) => void
  /** Firma con el club elegido: crea la carrera, la guarda y abre el hub. */
  confirmClub: () => Promise<boolean>

  /** Vuelve al paso anterior de la creación sin perder lo elegido. */
  previousStep: () => void

  // Partidas
  loadCareer: (career: Career) => void
  saveCareer: () => Promise<boolean>

  // Temporada
  /** Empieza la temporada (o continúa la que está en curso). */
  playSeason: () => void
  /** Elige una opción del evento actual y guarda (no se puede deshacer). */
  chooseOption: (optionIndex: number) => Promise<void>
  /** Pasa a lo siguiente del calendario (evento, partido importante o resumen). */
  continueSeason: () => Promise<void>
  /** Decide una jugada del partido importante (se guarda al momento). */
  chooseMoment: (optionIndex: number) => Promise<void>
  /** Tras ver el resultado de la jugada: pasa a la siguiente o al pitido final. */
  continueMatch: () => void
  /** Cierra el partido importante y sigue la temporada. */
  finishMatch: () => Promise<void>
  openTrophyRoom: () => void
  openRelationships: () => void
  openCompetitions: () => void
  openContract: () => void
  /** Pantalla para repartir los puntos de fin de temporada. */
  openTrainingPoints: () => void
  /** Aplica el reparto de puntos, guarda y vuelve (al mercado si toca). */
  applyTrainingPoints: (allocation: Partial<Career['attributes']>) => Promise<void>
  /** Sigue sin repartir los puntos (se guardan para más adelante): al mercado si toca o al hub. */
  skipTrainingPoints: () => void
  /** Buscador de equipos. */
  openClubSearch: () => void
  /** Marca (o quita, con `null`) el club que quieres fichar al acabar la temporada. */
  chooseTransferTarget: (clubId: string | null) => Promise<void>
  /** Compra una mejora de la tienda y guarda. */
  buyUpgrade: (itemId: string) => Promise<boolean>
  backToHub: () => void

  // Mercado de fichajes (entre temporadas)
  /** Mensaje tras decidir en el mercado (se muestra en el hub). */
  marketMessage: string | null
  openMarket: () => void
  /** `null` = quedarse en el club actual. */
  resolveMarket: (clubId: string | null) => Promise<void>
}

/** `window.api` solo existe dentro de Electron (no en los tests unitarios). */
function getApi(): Window['api'] | null {
  return typeof window !== 'undefined' && window.api ? window.api : null
}

export const useGameStore = create<GameState>()((set, get) => ({
  screen: 'mainMenu',
  draft: createDefaultDraft(),
  career: null,
  saveStatus: 'idle',
  lastChoice: null,
  lastMoment: null,
  lastRecord: null,
  marketMessage: null,

  startNewGame: () =>
    set({ screen: 'characterCreation', draft: createDefaultDraft(), career: null }),

  openLoadGame: () => set({ screen: 'loadGame' }),

  openRecords: () => set({ screen: 'records' }),

  openSettings: () => set({ screen: 'settings' }),

  openExtras: () => set({ screen: 'extras' }),

  openOriginCatalog: () => set({ screen: 'originCatalog' }),

  backToMenu: () =>
    set({
      screen: 'mainMenu',
      draft: createDefaultDraft(),
      career: null,
      saveStatus: 'idle',
      lastChoice: null,
      lastMoment: null,
      lastRecord: null,
      marketMessage: null
    }),

  setDraftName: (name) =>
    set((state) => ({ draft: { ...state.draft, character: { ...state.draft.character, name } } })),

  changeNationality: (step) =>
    set((state) => {
      const character = state.draft.character
      const nationalityId = cycleNationality(character.nationalityId, step)
      // Cambiar de país cambia las ofertas de club y los orígenes: se descarta lo elegido.
      const origin = state.draft.originId ? getOrigin(state.draft.originId) : null
      const keepOrigin = origin !== null && origin.nationalityId === null
      return {
        draft: {
          ...state.draft,
          character: { ...character, nationalityId },
          originId: keepOrigin ? state.draft.originId : null,
          clubId: null
        }
      }
    }),

  confirmCharacter: () => {
    const { draft } = get()
    if (validateName(draft.character.name) !== null) return false
    set({
      screen: 'modeSelection',
      draft: {
        ...draft,
        character: { ...draft.character, name: normalizeName(draft.character.name) }
      }
    })
    return true
  },

  // Cambiar de modo cambia la escala de los atributos: se reinicia el reparto.
  setMode: (mode) =>
    set((state) => ({ draft: { ...state.draft, mode, allocation: emptyAttributes() } })),

  confirmMode: () => set({ screen: 'originSelection' }),

  selectOrigin: (id) =>
    set((state) => {
      if (state.draft.originId === id) return {}
      // Otro origen cambia los atributos base y el vínculo con los clubes: se reinician.
      return {
        draft: { ...state.draft, originId: id, allocation: emptyAttributes(), clubId: null }
      }
    }),

  confirmOrigin: () => {
    if (!get().draft.originId) return false
    set({ screen: 'attributes' })
    return true
  },

  allocatePoint: (id, step) =>
    set((state) => {
      const { originId, allocation, mode } = state.draft
      if (!originId || !canAllocate(originId, allocation, id, step, mode)) return {}
      return {
        draft: { ...state.draft, allocation: { ...allocation, [id]: allocation[id] + step } }
      }
    }),

  resetAllocation: () =>
    set((state) => ({ draft: { ...state.draft, allocation: emptyAttributes() } })),

  confirmAttributes: () => {
    const { draft } = get()
    if (!draft.originId || remainingPoints(draft.allocation, draft.mode) !== 0) return false
    set({ screen: 'clubSelection' })
    return true
  },

  selectClub: (id) => set((state) => ({ draft: { ...state.draft, clubId: id } })),

  confirmClub: async () => {
    const { draft } = get()
    if (!draft.originId || !draft.clubId) return false
    const career = createCareer({
      character: draft.character,
      mode: draft.mode,
      originId: draft.originId,
      allocation: draft.allocation,
      clubId: draft.clubId
    })
    set({ career, screen: 'careerHub', draft: createDefaultDraft(), saveStatus: 'idle' })
    await get().saveCareer() // autoguardado al empezar la carrera
    return true
  },

  previousStep: () =>
    set((state) => {
      const index = CREATION_STEPS.indexOf(state.screen as (typeof CREATION_STEPS)[number])
      if (index <= 0) return {}
      return { screen: CREATION_STEPS[index - 1] }
    }),

  loadCareer: (career) => set({ career, screen: 'careerHub', saveStatus: 'idle' }),

  saveCareer: async () => {
    const { career } = get()
    const api = getApi()
    if (!career || !api) return false
    const updated: Career = { ...career, updatedAt: new Date().toISOString() }
    set({ saveStatus: 'saving' })
    try {
      await api.saves.write(toSaveFile(updated))
      set({ career: updated, saveStatus: 'saved' })
      return true
    } catch (error) {
      console.error('No se pudo guardar la partida', error)
      set({ saveStatus: 'error' })
      return false
    }
  },

  playSeason: () => {
    const { career } = get()
    if (!career || isCareerOver(career)) return
    if (isMarketPending(career)) {
      set({ screen: 'transferMarket' })
      return
    }
    set({
      career: career.seasonProgress ? career : startSeason(career),
      lastChoice: null,
      lastMoment: null,
      saveStatus: 'idle'
    })
    void get().continueSeason()
  },

  chooseOption: async (optionIndex) => {
    const { career, lastChoice } = get()
    if (!career?.seasonProgress || lastChoice) return
    const result = resolveChoice(career, optionIndex)
    set({
      career: result.career,
      lastChoice: { resolution: result.resolution, effects: result.effects }
    })
    await get().saveCareer() // la decisión queda guardada: no se puede repetir cargando
  },

  continueSeason: async () => {
    const { career } = get()
    if (!career?.seasonProgress) return
    // Se juega el calendario hasta la siguiente decisión.
    const advanced = advanceSeason(career)
    if (isSeasonReadyToFinish(advanced)) {
      const { career: next, record } = finishSeason(advanced)
      set({
        career: next,
        lastRecord: record,
        lastChoice: null,
        lastMoment: null,
        screen: 'seasonSummary'
      })
    } else {
      set({
        career: advanced,
        lastChoice: null,
        lastMoment: null,
        screen: seasonStep(advanced) === 'match' ? 'match' : 'seasonEvent'
      })
    }
    await get().saveCareer()
  },

  chooseMoment: async (optionIndex) => {
    const { career, lastMoment } = get()
    if (!career?.seasonProgress?.liveMatch || lastMoment) return
    const result = resolveMoment(career, optionIndex)
    set({
      career: result.career,
      lastMoment: { resolution: result.resolution, effects: result.effects }
    })
    await get().saveCareer()
  },

  continueMatch: () => set({ lastMoment: null }),

  finishMatch: async () => {
    const { career } = get()
    const live = career?.seasonProgress?.liveMatch
    if (!career || !live || !isLiveMatchOver(live)) return
    set({ career: finishLiveMatch(career), lastMoment: null })
    await get().continueSeason()
  },

  openTrophyRoom: () => set({ screen: 'trophyRoom' }),

  openRelationships: () => set({ screen: 'relationships' }),

  openCompetitions: () => set({ screen: 'competitions' }),

  openContract: () => set({ screen: 'contract' }),

  openTrainingPoints: () => set({ screen: 'trainingPoints' }),

  applyTrainingPoints: async (allocation) => {
    const { career, lastRecord } = get()
    if (!career) return
    const updated = applyTrainingPoints(career, allocation)
    set({
      career: updated,
      lastRecord: null,
      screen: lastRecord && isMarketPending(updated) ? 'transferMarket' : 'careerHub'
    })
    await get().saveCareer()
  },

  skipTrainingPoints: () => {
    const { career, lastRecord } = get()
    if (!career) return
    // Desde el resumen de la temporada se sigue (al mercado si toca); desde el hub, se vuelve.
    const toMarket = !!lastRecord && isMarketPending(career) && !isCareerOver(career)
    set({ lastRecord: null, screen: toMarket ? 'transferMarket' : 'careerHub' })
  },

  openClubSearch: () => set({ screen: 'clubSearch' }),

  chooseTransferTarget: async (clubId) => {
    const { career } = get()
    if (!career) return
    try {
      set({ career: setTransferTarget(career, clubId) })
    } catch {
      return
    }
    await get().saveCareer()
  },

  buyUpgrade: async (itemId) => {
    const { career } = get()
    if (!career) return false
    try {
      set({ career: buyItem(career, itemId) })
    } catch {
      return false
    }
    await get().saveCareer()
    return true
  },

  backToHub: () =>
    set({ screen: 'careerHub', lastRecord: null, saveStatus: 'idle', marketMessage: null }),

  openMarket: () => set({ screen: 'transferMarket' }),

  resolveMarket: async (clubId) => {
    const { career } = get()
    if (!career || !isMarketPending(career)) return
    const decision = applyTransferDecision(career, clubId)
    set({ career: decision.career, screen: 'careerHub', marketMessage: decision.message })
    await get().saveCareer()
  }
}))
