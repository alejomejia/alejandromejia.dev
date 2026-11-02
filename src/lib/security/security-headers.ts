import type { NextConfig } from 'next'

type HeaderRule = Awaited<ReturnType<NonNullable<NextConfig['headers']>>>[number]

type SecurityHeadersOptions = {
  /** The public R2 origin Media is served from, if any. */
  mediaOrigin?: string
  /** Umami's script and event origins. */
  analytics: { scriptOrigin: string; apiOrigin: string }
  isDev: boolean
}

/** Joins CSP directives, dropping empty sources. */
function toPolicy(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([name, sources]) => [name, ...sources.filter(Boolean)].join(' '))
    .join('; ')
}

/**
 * The site's security headers, as `next.config` header rules. Every route
 * gets the basics and a CSP that only forbids framing by other sites, plugins
 * and base/form hijacking (the admin loads its code editor from a CDN, so it
 * can't take more). Public pages get the full CSP, which overrides it: Next
 * applies the last matching rule for a header.
 *
 * Scripts allow `'unsafe-inline'` because Next streams the RSC payload in
 * inline scripts; a nonce would make every page render per request. Origins
 * are still locked to the site, Umami and the media domain. Imported by
 * `next.config.ts`, so it can't use path aliases: origins come in as options.
 */
export function securityHeaders({ mediaOrigin = '', analytics, isDev }: SecurityHeadersOptions): HeaderRule[] {
  const basePolicy = toPolicy({
    // `'self'`: the admin's live preview frames the site.
    'frame-ancestors': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
  })

  const publicPolicy = toPolicy({
    'default-src': ["'self'"],
    // React needs eval in dev only, for its error stacks.
    'script-src': ["'self'", "'unsafe-inline'", isDev ? "'unsafe-eval'" : '', analytics.scriptOrigin],
    // Next inlines critical CSS, and runtime values reach CSS through `style`.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', mediaOrigin],
    'media-src': ["'self'", mediaOrigin],
    'font-src': ["'self'"],
    'connect-src': ["'self'", analytics.apiOrigin],
    'frame-src': ["'self'"],
    'frame-ancestors': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    // No `upgrade-insecure-requests`: nothing loads over http, HSTS covers
    // the rest, and Safari would upgrade a local production run to https.
  })

  return [
    {
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        { key: 'Content-Security-Policy', value: basePolicy },
      ],
    },
    {
      // Everything but the admin and Payload's API.
      source: '/((?!admin|api).*)',
      headers: [{ key: 'Content-Security-Policy', value: publicPolicy }],
    },
  ]
}
