import { defineConfig } from '@playwright/test'

// Tests de extremo a extremo: lanzan la app de escritorio (Electron) ya compilada en /out.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  workers: 1,
  maxFailures: 1,
  reporter: 'list',
  outputDir: './e2e/.results'
})
