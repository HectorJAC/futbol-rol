import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { importLegacyData, LEGACY_DATA_DIR } from './legacyData'

let appData = ''
afterEach(() => rmSync(appData, { recursive: true, force: true }))

/** %APPDATA% de prueba con la carpeta antigua (partidas y ajustes) y la nueva vacía. */
function setup(): { legacy: string; userData: string } {
  appData = mkdtempSync(join(tmpdir(), 'yfp-'))
  const legacy = join(appData, LEGACY_DATA_DIR)
  mkdirSync(join(legacy, 'saves'), { recursive: true })
  writeFileSync(join(legacy, 'saves', 'diego.json'), '{"version":6}')
  writeFileSync(join(legacy, 'settings.json'), '{"fullscreen":false}')
  mkdirSync(join(legacy, 'Cache'))
  return { legacy, userData: join(appData, 'Your Football Path') }
}

describe('cambio de nombre a Your Football Path', () => {
  it('copia las partidas y los ajustes de la carpeta antigua (sin cachés) y la deja intacta', async () => {
    const { legacy, userData } = setup()
    expect(await importLegacyData(userData, appData)).toBe(true)
    expect(readFileSync(join(userData, 'saves', 'diego.json'), 'utf8')).toBe('{"version":6}')
    expect(readFileSync(join(userData, 'settings.json'), 'utf8')).toBe('{"fullscreen":false}')
    expect(existsSync(join(userData, 'Cache'))).toBe(false)
    expect(existsSync(join(legacy, 'saves', 'diego.json'))).toBe(true)
  })

  it('no pisa nada si el juego nuevo ya tiene partidas o ajustes', async () => {
    const { userData } = setup()
    mkdirSync(join(userData, 'saves'), { recursive: true })
    writeFileSync(join(userData, 'saves', 'nueva.json'), '{}')
    expect(await importLegacyData(userData, appData)).toBe(false)
    expect(existsSync(join(userData, 'saves', 'diego.json'))).toBe(false)
    expect(existsSync(join(userData, 'settings.json'))).toBe(false)
  })

  it('sin carpeta antigua no hace nada', async () => {
    appData = mkdtempSync(join(tmpdir(), 'yfp-'))
    expect(await importLegacyData(join(appData, 'Your Football Path'), appData)).toBe(false)
  })

  it('si la carpeta de datos ya es la antigua, no se copia sobre sí misma', async () => {
    const { legacy } = setup()
    expect(await importLegacyData(legacy.toUpperCase(), appData)).toBe(false)
  })
})
