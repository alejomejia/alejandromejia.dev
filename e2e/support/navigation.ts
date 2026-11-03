import type { Page } from '@playwright/test'

/**
 * Opens a page and waits until React has hydrated it, so key and wheel
 * listeners are attached before a test presses or scrolls. Network idle
 * isn't enough: on a busy CI machine hydration can finish after it, and an
 * early ⌘K then does nothing.
 */
export async function visit(page: Page, path: string) {
  const response = await page.goto(path)
  // Lenis starts in an effect of the root layout, and React runs the effects
  // below it first (the ⌘K and I shortcuts): its class means they're attached.
  await page.locator('html.lenis').waitFor({ state: 'attached' })
  // Two more frames for the renders those effects trigger (reduced motion
  // rebuilds Lenis without smoothing).
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  return response
}
