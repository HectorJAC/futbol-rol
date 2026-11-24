import type { SaveFile, SaveSummary } from './saves'
import type { GameSettings } from './settings'

/** Lo que el preload expone al juego como `window.api`. */
export interface GameApi {
  quit: () => void
  saves: {
    list: () => Promise<SaveSummary[]>
    read: (id: string) => Promise<SaveFile | null>
    write: (file: SaveFile) => Promise<void>
    remove: (id: string) => Promise<void>
  }
  settings: {
    get: () => Promise<GameSettings>
    set: (patch: Partial<GameSettings>) => Promise<GameSettings>
  }
}
