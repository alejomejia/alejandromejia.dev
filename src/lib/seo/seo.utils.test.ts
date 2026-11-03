import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ROUTABLE_COLLECTIONS, absoluteURL, documentPath, llmsContactSection } from './seo.utils'

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://example.com'))
afterEach(() => vi.unstubAllEnvs())

describe('absoluteURL', () => {
  it('resolves site paths against the site URL', () => {
    expect(absoluteURL('/writing/hello')).toBe('https://example.com/writing/hello')
  })

  it('passes absolute URLs through', () => {
    expect(absoluteURL('https://cdn.example.com/a.png')).toBe('https://cdn.example.com/a.png')
  })
})

describe('documentPath', () => {
  it('gives every routable collection its public path', () => {
    expect(ROUTABLE_COLLECTIONS.map((collection) => documentPath(collection, 'x'))).toEqual([
      '/writing/x',
      '/work/x',
      '/craft/x',
    ])
  })
})

describe('llmsContactSection', () => {
  it('lists the email, then the profiles', () => {
    const section = llmsContactSection({
      contact: { email: 'hi@example.com' },
      socialLinks: [{ label: 'GitHub', href: 'https://github.com/someone' }],
    } as Parameters<typeof llmsContactSection>[0])
    expect(section).toBe('## Contact\n\n- Email: hi@example.com\n- GitHub: https://github.com/someone')
  })

  it('is null with nothing to list', () => {
    expect(
      llmsContactSection({ contact: { email: '' }, socialLinks: [] } as unknown as Parameters<
        typeof llmsContactSection
      >[0]),
    ).toBeNull()
  })
})
