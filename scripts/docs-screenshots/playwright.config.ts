import { defineConfig } from '@playwright/test';

// Screenshots for the help center, taken from a LOCAL Sile running the fictitious documentation
// dataset (Clínica Aurora). See scripts/docs-screenshots/README.md.
// Never point this at production: helpers.ts refuses any host other than localhost.
export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 120_000,
  reporter: [['list']],
  outputDir: '../../test-results',
  use: {
    baseURL: process.env.DOCS_APP_URL || 'http://localhost:5174',
    channel: process.env.DOCS_BROWSER_CHANNEL || 'chrome',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    actionTimeout: 15_000,
  },
});
