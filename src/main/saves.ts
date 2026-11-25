import { app } from 'electron'
import { mkdir, readdir, readFile, rename, rm, writeFile } from 'fs/promises'
import { join } from 'path'
import { isValidSaveId, type SaveFile, type SaveSummary } from '../shared/saves'

/**
 * Partidas guardadas como JSON en la carpeta de datos del usuario:
 * %APPDATA%/Your Football Path/saves/<id>.json en Windows.
 */
export function savesDir(): string {
  return join(app.getPath('userData'), 'saves')
}

function savePath(id: string): string {
  if (!isValidSaveId(id)) throw new Error(`Id de partida no válido: ${id}`)
  return join(savesDir(), `${id}.json`)
}

function isSaveFile(value: unknown): value is SaveFile {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Partial<SaveFile>
  return (
    typeof v.version === 'number' &&
    typeof v.summary === 'object' &&
    v.summary !== null &&
    isValidSaveId(v.summary.id) &&
    'career' in v
  )
}

export async function listSaves(): Promise<SaveSummary[]> {
  let files: string[]
  try {
    files = await readdir(savesDir())
  } catch {
    return [] // aún no hay carpeta de partidas
  }

  const summaries: SaveSummary[] = []
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    try {
      const parsed: unknown = JSON.parse(await readFile(join(savesDir(), file), 'utf8'))
      if (isSaveFile(parsed)) summaries.push(parsed.summary)
    } catch {
      // Archivo dañado: se ignora en la lista en vez de romper la pantalla.
    }
  }
  return summaries.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function readSave(id: string): Promise<SaveFile | null> {
  try {
    const parsed: unknown = JSON.parse(await readFile(savePath(id), 'utf8'))
    return isSaveFile(parsed) ? parsed : null
  } catch {
    return null
  }
}

/** Escribe primero en un archivo temporal y luego lo renombra, para no dejar partidas a medias. */
export async function writeSave(file: SaveFile): Promise<void> {
  if (!isSaveFile(file)) throw new Error('Formato de partida no válido')
  await mkdir(savesDir(), { recursive: true })
  const target = savePath(file.summary.id)
  const tmp = `${target}.tmp`
  await writeFile(tmp, JSON.stringify(file, null, 2), 'utf8')
  await rename(tmp, target)
}

export async function deleteSave(id: string): Promise<void> {
  await rm(savePath(id), { force: true })
}
