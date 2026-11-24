import { contextBridge, ipcRenderer } from 'electron'
import type { GameApi } from '../shared/api'

/** API mínima que el juego (renderer) puede usar para hablar con Electron. */
const api: GameApi = {
  quit: () => ipcRenderer.send('app:quit'),
  saves: {
    list: () => ipcRenderer.invoke('saves:list'),
    read: (id) => ipcRenderer.invoke('saves:read', id),
    write: (file) => ipcRenderer.invoke('saves:write', file),
    remove: (id) => ipcRenderer.invoke('saves:delete', id)
  },
  settings: {
    get: () => ipcRenderer.invoke('settings:get'),
    set: (patch) => ipcRenderer.invoke('settings:set', patch)
  }
}

contextBridge.exposeInMainWorld('api', api)
