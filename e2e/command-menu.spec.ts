import type { Page } from '@playwright/test'

import { expect, test } from './support/fixtures'
import { visit } from './support/navigation'

async function openMenu(page: Page) {
  await page.keyboard.press('ControlOrMeta+k')
  const menu = page.getByRole('dialog', { name: 'Menu' })
  await expect(menu).toBeVisible()
  return menu
}

test('⌘K opens the menu, filters it and navigates', async ({ page }) => {
  await visit(page, '/')
  const menu = await openMenu(page)

  await page.keyboard.type('craft')
  await expect(menu.getByRole('option').first()).toHaveAttribute('aria-selected', 'true')
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL('/craft')
  await expect(menu).toBeHidden()
})

// Search used to miss articles and Craft pieces: it only read published CMS
// writing, while the pages render the mock data.
test('search finds work, articles and craft', async ({ page }) => {
  await visit(page, '/')
  const menu = await openMenu(page)
  const group = (name: string) => menu.getByRole('group', { name })

  await page.keyboard.type('storybook')
  await expect(group('Work').getByRole('option')).not.toHaveCount(0)
  await expect(group('Writing').getByRole('option', { name: /Storybook is a product/ })).toBeVisible()

  await page.keyboard.press('ControlOrMeta+a')
  await page.keyboard.type('tocss')
  await expect(group('Craft').getByRole('option', { name: /toCSSVars/ })).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL('/craft/to-css-vars')
})

test('Esc closes the menu', async ({ page }) => {
  await visit(page, '/')
  const menu = await openMenu(page)
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
})

// The whole dialog used to opt out of Lenis, so a wheel over the backdrop or
// the search box scrolled the page behind it; on a list too short to scroll,
// Firefox did too.
for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test.describe(`motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion })

    test('the page stays still behind the open menu', async ({ page }) => {
      await visit(page, '/work')
      const menu = await openMenu(page)
      const scrollY = () => page.evaluate(() => Math.round(window.scrollY))

      async function wheelOver(x: number, y: number) {
        await page.mouse.move(x, y)
        await page.mouse.wheel(0, 400)
        // Long enough for Lenis's easing to have moved the page, if it could.
        await page.waitForTimeout(600)
        return scrollY()
      }

      const viewport = page.viewportSize()!
      const input = (await menu.getByRole('combobox').boundingBox())!
      expect(await wheelOver(40, viewport.height - 40), 'over the backdrop').toBe(0)
      expect(await wheelOver(input.x + 40, input.y + input.height / 2), 'over the search box').toBe(0)

      const list = menu.getByRole('listbox')
      const listBox = (await list.boundingBox())!
      expect(await wheelOver(listBox.x + 40, listBox.y + 40), 'over the list').toBe(0)
      // The list itself still scrolls.
      expect(await list.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)

      await page.keyboard.type('zzzz')
      const shortList = (await list.boundingBox())!
      expect(await wheelOver(shortList.x + 40, shortList.y + shortList.height / 2), 'over a short list').toBe(0)

      // Closed, the page scrolls again.
      await page.keyboard.press('Escape')
      await page.mouse.move(viewport.width / 2, viewport.height / 2)
      await page.mouse.wheel(0, 400)
      await expect.poll(scrollY).toBeGreaterThan(0)
    })
  })
}
