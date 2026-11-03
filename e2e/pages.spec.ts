import type { Page } from '@playwright/test'

import { VIEWPORTS, expectAccessible, expectNoHorizontalScroll } from './support/checks'
import { expect, test } from './support/fixtures'
import { SECTIONS, discoverRoutes } from './support/routes'

/**
 * Every public page, in every engine: it loads, has one `<main>` and one
 * `<h1>`, passes axe at WCAG 2.2 AA and never scrolls sideways, on a laptop
 * and on a phone. Console errors fail it too (the shared fixture).
 */
async function checkPage(page: Page, path: string, status = 200) {
  await test.step(path, async () => {
    for (const [name, viewport] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(viewport)
      // Network idle: images are in before axe runs, and Next's link
      // prefetches finish instead of being cancelled by the next visit
      // (WebKit reports a cancelled fetch as an uncaught error).
      const response = await page.goto(path, { waitUntil: 'networkidle' })
      const label = `${path} (${name})`

      // A page the browser already has can come back as 304 Not Modified.
      const ok = status === 200 ? [200, 304] : [status]
      expect.soft(ok, `status of ${label}`).toContain(response?.status())
      await expect.soft(page.locator('main'), `<main> on ${label}`).toHaveCount(1)
      await expect.soft(page.locator('h1'), `<h1> on ${label}`).toHaveCount(1)
      await expectAccessible(page, label)
      await expectNoHorizontalScroll(page, label)
    }
  })
}

test('home and CV', async ({ page }) => {
  await checkPage(page, '/')
  await checkPage(page, '/cv')
})

for (const section of SECTIONS) {
  test(`every page under ${section}`, async ({ page }) => {
    // A section can hold a dozen pages, each checked twice.
    test.setTimeout(180_000)
    const routes = await discoverRoutes(page, section)
    expect(routes.length, `pages found under ${section}`).toBeGreaterThan(1)
    for (const path of routes) await checkPage(page, path)
  })
}

test.describe('missing page', () => {
  // Browsers log the 404 status of the document itself.
  test.use({ allowedConsoleErrors: [/404/] })

  test('answers 404 with the site around it', async ({ page }) => {
    await checkPage(page, '/this-page-does-not-exist', 404)
  })
})
