import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  displayURL,
  getServerSideURL,
  isCurrentPath,
  isExternalHref,
  isWebHref,
  matchesPath,
  toSitePath,
  withProtocol,
} from './url'

beforeEach(() => vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'https://example.com'))
afterEach(() => vi.unstubAllEnvs())

describe('getServerSideURL', () => {
  it('repairs a site URL set without protocol or with a trailing slash', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', 'example.com/')
    expect(getServerSideURL()).toBe('https://example.com')
  })

  it('falls back to localhost when unset', () => {
    vi.stubEnv('NEXT_PUBLIC_SERVER_URL', '')
    expect(getServerSideURL()).toBe('http://localhost:3000')
  })
})

describe('matchesPath', () => {
  it('matches exact paths and `/*` prefixes', () => {
    expect(matchesPath('/about', ['/about'])).toBe(true)
    expect(matchesPath('/posts', ['/posts/*'])).toBe(true)
    expect(matchesPath('/posts/a/b', ['/posts/*'])).toBe(true)
  })

  it("doesn't match a path that only shares the prefix's letters", () => {
    expect(matchesPath('/postscript', ['/posts/*'])).toBe(false)
  })
})

describe('isCurrentPath', () => {
  it('ignores the trailing slash and the query', () => {
    expect(isCurrentPath('/terms', '/terms/')).toBe(true)
    expect(isCurrentPath('/work?page=2', '/work')).toBe(true)
  })

  it('matches an absolute link to this site', () => {
    expect(isCurrentPath('https://www.example.com/cv', '/cv')).toBe(true)
  })

  it('never marks hash links, other sites or protocol-relative URLs', () => {
    expect(isCurrentPath('/cv#experience', '/cv')).toBe(false)
    expect(isCurrentPath('https://other.com/cv', '/cv')).toBe(false)
    expect(isCurrentPath('//cdn.example.com/cv', '/cv')).toBe(false)
  })
})

describe('href kinds', () => {
  it('treats any scheme or protocol-relative URL as external', () => {
    expect(isExternalHref('mailto:hi@example.com')).toBe(true)
    expect(isExternalHref('//cdn.example.com')).toBe(true)
    expect(isExternalHref('/work')).toBe(false)
  })

  it('treats only http(s) and protocol-relative URLs as websites', () => {
    expect(isWebHref('https://example.com')).toBe(true)
    expect(isWebHref('//example.com')).toBe(true)
    expect(isWebHref('mailto:hi@example.com')).toBe(false)
  })

  it('adds https only when there is no protocol', () => {
    expect(withProtocol('cdn.example.com')).toBe('https://cdn.example.com')
    expect(withProtocol('http://localhost:3000')).toBe('http://localhost:3000')
  })
})

describe('toSitePath', () => {
  it('turns an absolute link to this site into a path, keeping query and hash', () => {
    expect(toSitePath('https://example.com/about?x=1#team')).toBe('/about?x=1#team')
  })

  it('ignores the protocol and `www.`', () => {
    expect(toSitePath('http://www.example.com/cv')).toBe('/cv')
  })

  it('leaves other sites and relative paths alone', () => {
    expect(toSitePath('https://github.com/x')).toBe('https://github.com/x')
    expect(toSitePath('/work')).toBe('/work')
  })
})

describe('displayURL', () => {
  it('drops the protocol, `www.` and the trailing slash', () => {
    expect(displayURL('https://www.linkedin.com/in/someone/')).toBe('linkedin.com/in/someone')
  })
})
