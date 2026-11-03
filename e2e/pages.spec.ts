import type { Page } from '@playwright/test'

import { VIEWPORTS, expectAccessible, expectNoHorizontalScroll } from './support/checks'
import { expect, test } from './support/fixtures'
import { SECTIONS, discoverRoutes, onePerTemplate } from './support/routes'

/**
 * Public pages load, have one `<main>` and one `<h1>`, pass axe at WCAG 2.2
 * AA and never scroll sideways, on a laptop and on a phone. Console errors
 * fail them too (the shared fixture).
 *
 * Coverage follows what varies: content varies per page, so Chromium checks
 * every page; rendering varies per engine, so Firefox and WebKit check one
 * page per template.
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

test('home, CV and how it’s built', async ({ page }) => {
  await checkPage(page, '/')
  await checkPage(page, '/cv')
  await checkPage(page, '/how-its-built')
})

for (const section of SECTIONS) {
  test(`pages under ${section}`, async ({ page, browserName }) => {
    // A section can hold a dozen pages, each checked twice.
    test.setTimeout(180_000)
    const routes = await discoverRoutes(page, section)
    expect(routes.length, `pages found under ${section}`).toBeGreaterThan(1)
    const checked = browserName === 'chromium' ? routes : onePerTemplate(routes)
    for (const path of checked) await checkPage(page, path)
  })
}

test.describe('missing page', () => {
  // Browsers log the 404 status of the document itself.
  test.use({ allowedConsoleErrors: [/404/] })

  test('answers 404 with the site around it', async ({ page }) => {
    await checkPage(page, '/this-page-does-not-exist', 404)
  })
})
