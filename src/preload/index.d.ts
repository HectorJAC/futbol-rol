import type { GameApi } from '../shared/api'

declare global {
  interface Window {
    api: GameApi
  }
}

export {}
