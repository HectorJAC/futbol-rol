import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { importLegacyData } from './legacyData'
import { deleteSave, listSaves, readSave, writeSave } from './saves'
import { fitToScreen, loadSettings, updateSettings } from './settings'
import { parseWindowSize, type GameSettings } from '../shared/settings'

const GAME_TITLE = 'Your Football Path'

// Los tests e2e usan una carpeta de datos aparte para no tocar las partidas reales.
const testUserData = process.env['YFP_USER_DATA']
if (testUserData) {
  app.setPath('userData', testUserData)
}

function createWindow(settings: GameSettings): void {
  const { width, height } = fitToScreen(parseWindowSize(settings.windowSize))
  const mainWindow = new BrowserWindow({
    width,
    height,
    useContentSize: true,
    fullscreen: settings.fullscreen,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    title: GAME_TITLE,
    backgroundColor: '#070b14',
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Cualquier enlace externo se abre en el navegador del sistema, nunca dentro del juego.
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.yourfootballpath.game')

  // Hasta la v0.14 el juego se llamaba "Futbol-Rol": sus partidas y ajustes pasan a la carpeta nueva.
  if (!testUserData) {
    await importLegacyData(app.getPath('userData'), app.getPath('appData')).catch(() => false)
  }

  // F12 abre DevTools en desarrollo; Ctrl+R se ignora en producción.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Botón "Salir del juego" del menú principal.
  ipcMain.on('app:quit', () => {
    app.quit()
  })

  // Partidas guardadas.
  ipcMain.handle('saves:list', () => listSaves())
  ipcMain.handle('saves:read', (_, id: string) => readSave(id))
  ipcMain.handle('saves:write', (_, file) => writeSave(file))
  ipcMain.handle('saves:delete', (_, id: string) => deleteSave(id))

  // Ajustes (se aplican al momento a la ventana que los pide).
  ipcMain.handle('settings:get', () => loadSettings())
  ipcMain.handle('settings:set', (event, patch: Partial<GameSettings>) =>
    updateSettings(BrowserWindow.fromWebContents(event.sender), patch)
  )

  const settings = await loadSettings()
  createWindow(settings)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) loadSettings().then(createWindow)
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
