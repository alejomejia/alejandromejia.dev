import { expect, test } from './support/fixtures'
import { visit } from './support/navigation'

const CHAPTER = '/work/desigual-design-system/the-problem'

test('the chapter bar appears once the chapter list scrolls away', async ({ page }) => {
  await visit(page, CHAPTER)
  // Hidden at the top, where the chapter list is in view: inert, so out of
  // the tab order and the accessibility tree (Playwright's roles still see it).
  const next = page.getByRole('link', { name: 'Next chapter', exact: true })
  const isInert = () => next.evaluate((link) => link.closest('[inert]') !== null)
  expect(await isInert()).toBe(true)

  await page.evaluate(() => window.scrollTo(0, 900))
  await expect.poll(isInert).toBe(false)
  await expect(next).toBeVisible()

  await page.getByRole('button', { name: /The problem/ }).click()
  await expect(page.getByRole('list', { name: 'Chapters' }).getByRole('link')).toHaveCount(7)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: /The problem/ })).toHaveAttribute('aria-expanded', 'false')
})

test('← and → move between chapters', async ({ page }) => {
  await visit(page, CHAPTER)
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(/\/tokens$/)
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(new RegExp(`${CHAPTER}$`))
})

test('the pager leads to the previous and next chapter', async ({ page }) => {
  await visit(page, CHAPTER)
  const pager = page.getByRole('navigation', { name: 'Chapter navigation' })
  await expect(pager.getByRole('link', { name: /Previous chapter/ })).toHaveAttribute(
    'href',
    '/work/desigual-design-system',
  )
  await expect(pager.getByRole('link', { name: /Next chapter/ })).toHaveAttribute(
    'href',
    '/work/desigual-design-system/tokens',
  )
})
