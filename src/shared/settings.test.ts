import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS, parseWindowSize, sanitizeSettings } from './settings'

describe('ajustes', () => {
  it('sin archivo o con basura devuelve los valores por defecto', () => {
    expect(sanitizeSettings(null)).toEqual(DEFAULT_SETTINGS)
    expect(sanitizeSettings('hola')).toEqual(DEFAULT_SETTINGS)
  })

  it('conserva los valores válidos y corrige los inválidos', () => {
    expect(
      sanitizeSettings({
        fullscreen: true,
        windowSize: '1600x900',
        animations: 'no',
        language: 'klingon'
      })
    ).toEqual({ fullscreen: true, windowSize: '1600x900', animations: true, language: 'es' })
  })

  it('el inglés ya se puede elegir (v0.18); un idioma desconocido vuelve al español', () => {
    expect(sanitizeSettings({ language: 'en' }).language).toBe('en')
    expect(sanitizeSettings({ language: 'fr' }).language).toBe('es')
  })

  it('convierte el tamaño de ventana a números', () => {
    expect(parseWindowSize('1920x1080')).toEqual({ width: 1920, height: 1080 })
  })
})
