import { test as base, expect } from '@playwright/test'

type Fixtures = {
  /** Console errors a test expects (a 404 page logs its own status). */
  allowedConsoleErrors: RegExp[]
  /** Fails the test on any other console error or uncaught exception. */
  failOnPageErrors: void
}

/**
 * Playwright's `test`, failing on console errors and uncaught exceptions,
 * which also catches CSP violations and hydration mismatches. Import `test`
 * and `expect` from here, never from `@playwright/test`.
 */
export const test = base.extend<Fixtures>({
  allowedConsoleErrors: [[], { option: true }],
  failOnPageErrors: [
    async ({ page, allowedConsoleErrors }, provide) => {
      const errors: string[] = []
      page.on('console', (message) => {
        const text = message.text()
        if (message.type() === 'error' && !allowedConsoleErrors.some((pattern) => pattern.test(text))) {
          errors.push(`console: ${text}`)
        }
      })
      page.on('pageerror', (error) => errors.push(`exception: ${error.message}`))

      await provide()

      expect(errors, 'console errors or uncaught exceptions').toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
