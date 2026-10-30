/** True when running in a browser (has a usable DOM). */
const canUseDOM = Boolean(
  typeof window !== 'undefined' && window.document && window.document.createElement,
)

/**
 * `NEXT_PUBLIC_SERVER_URL` as a usable origin, or `''` when unset. The domain
 * is easily set without `https://` or with a trailing slash; either would break
 * `new URL()` (metadata, IndexNow), CORS and same-site link detection.
 */
function configuredSiteURL(): string {
  const value = process.env.NEXT_PUBLIC_SERVER_URL?.trim()
  return value ? withProtocol(value).replace(/\/+$/, '') : ''
}

/**
 * Absolute site URL for server-side use (SEO, CORS, Payload config).
 * Prefers NEXT_PUBLIC_SERVER_URL, then localhost.
 */
export function getServerSideURL(): string {
  const siteURL = configuredSiteURL()
  if (siteURL) return siteURL
  return 'http://localhost:3000'
}

/**
 * True when `pathname` matches one of `patterns`: an exact path (`/about`) or
 * a prefix ending in `/*` (`/posts/*` matches `/posts` and everything below).
 */
export function matchesPath(pathname: string, patterns: readonly string[]): boolean {
  return patterns.some((pattern) => {
    if (!pattern.endsWith('/*')) return pathname === pattern
    const base = pattern.slice(0, -2)
    return pathname === base || pathname.startsWith(`${base}/`)
  })
}

/**
 * True when `href` points to the page at `pathname` (query and trailing slash
 * ignored). In-page `#hash` links and anything that isn't a site path never
 * match.
 * @example isCurrentPath('/terms', '/terms/') // true
 */
export function isCurrentPath(href: string, pathname: string): boolean {
  const path = toSitePath(href)
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('#')) return false

  const normalize = (value: string) => value.split('?')[0].replace(/(.)\/$/, '$1')
  return normalize(path) === normalize(pathname)
}

/**
 * Absolute site URL for client-side use. In the browser it reads the live
 * `window.location`; on the server it falls back to the configured URL.
 */
export function getClientSideURL(): string {
  if (canUseDOM) {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }
  return configuredSiteURL()
}

/**
 * True when `href` leaves the app router: a URL with a scheme (`https:`,
 * `mailto:`, `tel:`) or a protocol-relative one (`//cdn.example.com`).
 */
export function isExternalHref(href: string): boolean {
  return /^([a-z][a-z\d+.-]*:|\/\/)/i.test(href)
}

/** True when `href` points to another website (`http(s):` or protocol-relative). */
export function isWebHref(href: string): boolean {
  return /^(https?:)?\/\//i.test(href)
}

/**
 * Adds `https://` to a URL written without a protocol (`cdn.example.com`), as
 * hosts in env vars often are. URLs that already have one pass through.
 */
export function withProtocol(url: string): string {
  return /^[a-z][a-z\d+.-]*:\/\//i.test(url) ? url : `https://${url}`
}

/** Host without a leading `www.`, so `www.example.com` and `example.com` match. */
function bareHost(url: URL): string {
  return url.host.replace(/^www\./i, '')
}

/**
 * Turns an absolute URL on this site (`https://example.com/about?x=1#team`)
 * into a path (`/about?x=1#team`) so it navigates client-side. Any other href
 * is returned unchanged. The site is `NEXT_PUBLIC_SERVER_URL`, inlined at build
 * time, so the server and the browser agree. Protocol and `www.` are ignored.
 */
export function toSitePath(href: string): string {
  const siteURL = configuredSiteURL()
  if (!siteURL || !isWebHref(href)) return href
  try {
    const url = new URL(href, siteURL)
    if (bareHost(url) !== bareHost(new URL(siteURL))) return href
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    // Malformed URL: leave it for the browser to handle.
    return href
  }
}
