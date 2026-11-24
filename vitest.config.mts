import { defineConfig } from 'vitest/config'

// Tests unitarios de la lógica del juego (sin Electron). Los e2e están en /e2e con Playwright.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
})
