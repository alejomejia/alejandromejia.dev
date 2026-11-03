import { defineConfig, devices } from '@playwright/test'

const isCI = Boolean(process.env.CI)

// Its own port, so a dev server on :3000 keeps running. Set
// PLAYWRIGHT_BASE_URL to test a server that is already up instead.
const PORT = 3100
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`

/**
 * End-to-end tests: the production build in Chromium, Firefox and WebKit.
 * Every test fails on a console error or an uncaught exception
 * (`e2e/support/fixtures.ts`). Locally the first run builds the site; later runs
 * reuse a server still running on the port.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL,
    // Entrances and page transitions are skipped, so pages settle at once.
    // Motion tests opt back in.
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `pnpm build && pnpm start --port ${PORT}`,
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 300_000,
        // Baked into the build: links to the site itself must point here.
        env: { NEXT_PUBLIC_SERVER_URL: baseURL },
      },
})
