import { expect, test } from './support/fixtures'

// Headers come from the server, not the browser: one engine is enough. CSP
// violations in the pages themselves fail every test (the shared fixture).
test.skip(({ browserName }) => browserName !== 'chromium', 'headers are the same in every engine')

test('public pages send the security headers and the full CSP', async ({ request }) => {
  const headers = (await request.get('/')).headers()

  expect(headers['strict-transport-security']).toContain('max-age=63072000')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['permissions-policy']).toContain('camera=()')
  expect(headers['x-powered-by']).toBeUndefined()

  const csp = headers['content-security-policy']
  expect(csp).toContain("default-src 'self'")
  expect(csp).toContain("frame-ancestors 'self'")
  expect(csp).toContain("object-src 'none'")
  // Production never allows eval; only the dev server needs it.
  expect(csp).not.toContain('unsafe-eval')
})

test('the admin gets the base CSP only, so its code editor can load', async ({ request }) => {
  const csp = (await request.get('/admin')).headers()['content-security-policy']

  expect(csp).toContain("frame-ancestors 'self'")
  expect(csp).not.toContain('default-src')
})
