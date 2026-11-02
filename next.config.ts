import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

import { UMAMI_API_ORIGIN, UMAMI_SCRIPT_URL } from './src/lib/integrations/umami/umami.const'
import { securityHeaders } from './src/lib/security/security-headers'
import { withProtocol } from './src/lib/utils'

// When Media is served from a public R2 domain, allow it through next/image.
// The domain is often set without `https://`, which `new URL` rejects.
const r2PublicUrl = process.env.R2_PUBLIC_URL ? withProtocol(process.env.R2_PUBLIC_URL) : ''
const r2RemotePattern = r2PublicUrl
  ? (() => {
      const { protocol, hostname } = new URL(r2PublicUrl)
      return [{ protocol: protocol.replace(':', '') as 'http' | 'https', hostname }]
    })()
  : []

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  headers: async () =>
    securityHeaders({
      mediaOrigin: r2PublicUrl && new URL(r2PublicUrl).origin,
      analytics: { scriptOrigin: new URL(UMAMI_SCRIPT_URL).origin, apiOrigin: UMAMI_API_ORIGIN },
      isDev: process.env.NODE_ENV === 'development',
    }),
  // Emit a self-contained server bundle for the production Docker image.
  output: 'standalone',
  images: {
    // AVIF first: roughly 20% lighter than WebP for photos, which shortens
    // LCP on image-heavy pages. Encoded once per size, then served from cache.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [...r2RemotePattern],
  },
  // The share image renderer reads its fonts and shape from disk at runtime,
  // which the standalone trace can't see.
  outputFileTracingIncludes: { '/og/[...segments]': ['./src/lib/seo/og/*'] },
  experimental: {
    // Enable `app/global-not-found.tsx` for unmatched URLs. Needed because the
    // app has multiple root layouts ((frontend) + (payload)), so there's no
    // single layout Next can compose an app-wide 404 from.
    globalNotFound: true,
  },
}

/**
 * `withPayload` sends `Critical-CH: Sec-CH-Prefers-Color-Scheme` on every
 * route, for the admin's theme. On public pages it makes Chrome drop the
 * first response and request the page again (an extra round trip before
 * anything renders), and its `Vary` splits the CDN cache by color scheme.
 * Scope those headers to the admin, the only place that reads the hint.
 */
function scopeClientHintsToAdmin(payloadConfig: NextConfig): NextConfig {
  const { headers } = payloadConfig
  if (!headers) return payloadConfig
  return {
    ...payloadConfig,
    headers: async () =>
      (await headers()).map((rule) =>
        rule.source === '/:path*' && rule.headers.some(({ key }) => key === 'Critical-CH')
          ? { ...rule, source: '/admin/:path*' }
          : rule,
      ),
  }
}

export default scopeClientHintsToAdmin(withPayload(nextConfig))
