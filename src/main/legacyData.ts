import { access, cp } from 'fs/promises'
import { join } from 'path'

/** Carpeta de datos del juego cuando se llamaba "Futbol-Rol" (hasta la v0.14). */
export const LEGACY_DATA_DIR = 'futbol-rol'

/** Lo que se trae de la carpeta antigua: las partidas y los ajustes (no las cachés). */
const LEGACY_ITEMS = ['saves', 'settings.json'] as const

const exists = (path: string): Promise<boolean> =>
  access(path).then(
    () => true,
    () => false
  )

/**
 * La primera vez que se abre el juego con su nombre definitivo ("Your Football
 * Path"), copia las partidas y los ajustes de la carpeta antigua a la nueva.
 * Solo si la nueva aún no tiene ninguno; la carpeta antigua no se toca y queda
 * como copia de seguridad. Devuelve si se copió algo.
 */
export async function importLegacyData(userData: string, appData: string): Promise<boolean> {
  const legacy = join(appData, LEGACY_DATA_DIR)
  // Windows no distingue mayúsculas: "Futbol-Rol" y "futbol-rol" son la misma carpeta.
  if (legacy.toLowerCase() === userData.toLowerCase()) return false
  if (!(await exists(legacy))) return false
  for (const item of LEGACY_ITEMS) {
    if (await exists(join(userData, item))) return false
  }
  let copied = false
  for (const item of LEGACY_ITEMS) {
    const from = join(legacy, item)
    if (await exists(from)) {
      await cp(from, join(userData, item), { recursive: true, force: false, errorOnExist: false })
      copied = true
    }
  }
  return copied
}
