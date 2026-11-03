import { VIEWPORTS } from './support/checks'
import { expect, test } from './support/fixtures'

// Chrome let the canvas's own size stretch its aspect-ratio box, so the
// hero rendered taller there than in Firefox and Safari.
for (const [name, ratio] of [
  ['desktop', 2],
  ['phone', 1.5],
] as const) {
  test(`the hero is ${ratio}:1 on ${name}`, async ({ page }) => {
    await page.setViewportSize(VIEWPORTS[name])
    await page.goto('/')

    const box = await page.locator('main canvas').first().boundingBox()
    expect(box).not.toBeNull()
    expect(box!.width / box!.height).toBeCloseTo(ratio, 1)
  })
}
