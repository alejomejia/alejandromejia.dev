'use client'

import NextLink from 'next/link'
import { type ComponentProps, useState } from 'react'

import { isExternalHref, isWebHref, toSitePath } from '@/lib/utils'

/**
 * When a route is prefetched:
 * - `intent`: on hover, touch or keyboard focus (only links the visitor is about to use).
 * - `viewport`: as soon as the link scrolls into view (Next's default).
 * - `none`: never; the route loads on click.
 */
export type LinkPrefetch = 'intent' | 'viewport' | 'none'

export type LinkProps = Omit<
  ComponentProps<typeof NextLink>,
  // Pages Router leftovers, and `prefetch`, which is replaced below.
  'prefetch' | 'as' | 'shallow' | 'locale' | 'passHref' | 'legacyBehavior' | 'unstable_dynamicOnHover'
> & {
  prefetch?: LinkPrefetch
  /** Opens in a new tab. Defaults to `true` for other websites, `false` otherwise. */
  newTab?: boolean
}

/**
 * The project's link. Use it instead of `next/link`: it prefetches on intent
 * rather than for every link in view, renders a plain `<a>` for external,
 * `mailto:`, `tel:` and in-page `#hash` hrefs, opens other websites in a new
 * tab with a safe `rel`, and treats full URLs to this site as internal paths.
 *
 * @example
 * ```tsx
 * <Link href="/about">About</Link>
 * <Link href="/" prefetch="viewport">Home</Link>
 * <Link href="https://instagram.com/example">Instagram</Link>
 * ```
 */
export function Link({
  href,
  prefetch = 'intent',
  newTab,
  replace,
  scroll,
  onNavigate,
  transitionTypes,
  onMouseEnter,
  onTouchStart,
  onFocus,
  rel,
  target,
  ...anchorProps
}: LinkProps) {
  // Flipped on the first sign of intent; from then on Next prefetches as usual.
  const [hasIntent, setHasIntent] = useState(false)

  // A full URL to this site (common in CMS content) becomes a path, so it
  // routes client-side instead of reloading the page in a new tab.
  const stringHref = typeof href === 'string' ? toSitePath(href) : null
  const opensNewTab = newTab ?? (stringHref !== null && isWebHref(stringHref))
  const newTabProps = opensNewTab
    ? { target: '_blank', rel: rel ? `noopener noreferrer ${rel}` : 'noopener noreferrer' }
    : { target, rel }

  // The router can't handle other origins or schemes, and `#hash` only scrolls
  // the current page, so these skip Next's client-side navigation entirely.
  if (stringHref !== null && (isExternalHref(stringHref) || stringHref.startsWith('#'))) {
    return (
      <a
        href={stringHref}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
        onFocus={onFocus}
        {...newTabProps}
        {...anchorProps}
      />
    )
  }

  // `null` is Next's default ("auto") prefetch; `false` disables it, including on hover.
  const nextPrefetch = prefetch === 'viewport' || (prefetch === 'intent' && hasIntent) ? null : false

  return (
    <NextLink
      href={stringHref ?? href}
      prefetch={nextPrefetch}
      replace={replace}
      scroll={scroll}
      onNavigate={onNavigate}
      transitionTypes={transitionTypes}
      onMouseEnter={(event) => {
        if (prefetch === 'intent') setHasIntent(true)
        onMouseEnter?.(event)
      }}
      onTouchStart={(event) => {
        if (prefetch === 'intent') setHasIntent(true)
        onTouchStart?.(event)
      }}
      onFocus={(event) => {
        if (prefetch === 'intent') setHasIntent(true)
        onFocus?.(event)
      }}
      {...newTabProps}
      {...anchorProps}
    />
  )
}
