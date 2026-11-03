import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

import { expect } from './fixtures'

/** The viewports every page is checked at: a laptop and a phone. */
export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  phone: { width: 390, height: 844 },
} as const

// WCAG 2.2 A and AA, the level the site commits to.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

/** Fails (softly, so one run lists every page) on any WCAG A/AA violation axe finds. */
export async function expectAccessible(page: Page, label: string) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const summary = violations.map(
    ({ id, impact, nodes }) => `${impact} ${id}: ${nodes.map((node) => node.target.join(' ')).join(', ')}`,
  )
  expect.soft(summary, `axe violations on ${label}`).toEqual([])
}

/** Fails softly when the page scrolls sideways. */
export async function expectNoHorizontalScroll(page: Page, label: string) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect.soft(overflow, `horizontal overflow on ${label}`).toBeLessThanOrEqual(0)
}
