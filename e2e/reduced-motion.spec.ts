import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { visit } from './support/navigation'

/**
 * Wheels 400px down over the content and reports whether Lenis eased it.
 * Lenis puts `lenis-smooth` on `<html>` while it animates a scroll, so this
 * checks behavior, not timing (browsers animate native wheel scrolls a
 * little too, and a busy CI machine stretches every frame).
 */
async function wheelDown(page: Page) {
  await visit(page, '/work')
  await page.evaluate(() => {
    const root = document.documentElement
    new MutationObserver(() => {
      if (root.classList.contains('lenis-smooth')) root.dataset.sawSmooth = ''
    }).observe(root, { attributeFilter: ['class'] })
  })
  await page.mouse.move(720, 450)
  await page.mouse.wheel(0, 400)
  await expect.poll(() => page.evaluate(() => Math.round(scrollY))).toBe(400)
  return { eased: await page.evaluate(() => 'sawSmooth' in document.documentElement.dataset) }
}

test.describe('with reduced motion', () => {
  test('the wheel scrolls natively, with no smoothing', async ({ page }) => {
    expect(await wheelDown(page)).toEqual({ eased: false })
  })

  test('entrances are skipped', async ({ page }) => {
    await visit(page, '/work')
    const animation = await page
      .locator('[class*="animate-enter"]')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName)
    expect(animation).toBe('none')
  })
})

test.describe('without reduced motion', () => {
  test.use({ reducedMotion: 'no-preference' })

  test('the wheel eases (the check above can tell the difference)', async ({ page }) => {
    expect(await wheelDown(page)).toEqual({ eased: true })
  })
})
