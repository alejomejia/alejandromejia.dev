import { expect, test } from './support/fixtures'
import { visit } from './support/navigation'

test('the skip link is the first tab stop and lands in the content', async ({ page, browserName }) => {
  // Safari on macOS skips links on Tab unless a setting is on; its keyboard
  // users press Option+Tab. Linux WebKit (CI) tabs to links like the others.
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab'
  await visit(page, '/work')

  await page.keyboard.press(tab)
  const skipLink = page.getByRole('link', { name: 'Skip to content' })
  await expect(skipLink).toBeFocused()
  // Hidden until focused, then a visible box.
  expect((await skipLink.boundingBox())?.width).toBeGreaterThan(40)

  await page.keyboard.press('Enter')
  await expect(page.locator('main#content')).toBeFocused()

  // The next stop is inside the content, past the sidebar.
  await page.keyboard.press(tab)
  await expect(page.locator('main :focus')).toHaveCount(1)
})
