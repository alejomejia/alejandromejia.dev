import { expect, test } from './support/fixtures'
import { visit } from './support/navigation'

test('I toggles inspect mode, and a click shows the element specs', async ({ page }) => {
  await visit(page, '/work')
  const panel = page.getByRole('complementary', { name: 'Inspect mode' })

  await page.keyboard.press('i')
  await expect(panel).toBeVisible()

  // The page title: text-display-s, 24px on a 30px line.
  await page.locator('main h1').click()
  await expect(panel).toContainText('24/30')

  await page.keyboard.press('i')
  await expect(panel).toBeHidden()
})

test.describe('at a 20px default font size', () => {
  // Only Chromium can change the default font size from a test (DevTools protocol).
  test.skip(({ browserName }) => browserName !== 'chromium', 'needs the DevTools protocol')

  test('the site scales with it, and inspect mode still reads in design px', async ({ page }) => {
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('Page.setFontSizes', { fontSizes: { standard: 20 } })
    await page.setViewportSize({ width: 390, height: 844 })
    await visit(page, '/work')

    // The site never pins the root size, so the visitor's setting wins.
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('20px')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    ).toBeLessThanOrEqual(0)

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.keyboard.press('i')
    const panel = page.getByRole('complementary', { name: 'Inspect mode' })
    await expect(panel).toBeVisible()
    await page.locator('main h1').click()
    await expect(panel).toContainText('24/30')
  })
})
