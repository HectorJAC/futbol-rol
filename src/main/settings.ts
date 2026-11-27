import { app, BrowserWindow, screen } from 'electron'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import { join } from 'path'
import { parseWindowSize, sanitizeSettings, type GameSettings } from '../shared/settings'

function settingsPath(): string {
  return join(app.getPath('userData'), 'settings.json')
}

export async function loadSettings(): Promise<GameSettings> {
  try {
    return sanitizeSettings(JSON.parse(await readFile(settingsPath(), 'utf8')))
  } catch {
    return sanitizeSettings(null) // primera vez o archivo dañado: valores por defecto
  }
}

async function writeSettings(settings: GameSettings): Promise<void> {
  await mkdir(app.getPath('userData'), { recursive: true })
  const tmp = `${settingsPath()}.tmp`
  await writeFile(tmp, JSON.stringify(settings, null, 2), 'utf8')
  await rename(tmp, settingsPath())
}

/** Aplica a la ventana los ajustes que la afectan (pantalla completa y tamaño). */
export function applyWindowSettings(window: BrowserWindow, settings: GameSettings): void {
  window.setFullScreen(settings.fullscreen)
  if (!settings.fullscreen) {
    const { width, height } = fitToScreen(parseWindowSize(settings.windowSize))
    window.setContentSize(width, height)
    window.center()
  }
}

/** Nunca más grande que el área útil de la pantalla (p. ej. 1920×1080 en un portátil de 1366×768). */
export function fitToScreen(size: { width: number; height: number }): {
  width: number
  height: number
} {
  const area = screen.getPrimaryDisplay().workAreaSize
  return { width: Math.min(size.width, area.width), height: Math.min(size.height, area.height) }
}

/** Mezcla los cambios, los valida, los guarda y los aplica a la ventana. */
export async function updateSettings(
  window: BrowserWindow | null,
  patch: Partial<GameSettings>
): Promise<GameSettings> {
  const next = sanitizeSettings({ ...(await loadSettings()), ...patch })
  await writeSettings(next)
  if (window) applyWindowSettings(window, next)
  return next
}
