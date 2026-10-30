'use client'

import Script from 'next/script'
import { useEffect } from 'react'

import { flushUmamiQueue, track } from './track'
import { UMAMI_EVENTS, UMAMI_IGNORE_ATTRIBUTE } from './umami.const'
import type { UmamiConfig } from './umami.types'

/**
 * Loads Umami's tracker and tracks the site's links by where they go, so
 * every email and outbound link counts wherever it sits (header, footer, the
 * ⌘K menu, content) without tagging each one. Umami is cookieless: no consent banner is needed for it. Mounted by
 * the frontend layout only when `getUmamiConfig()` returns a config.
 */
export function UmamiAnalytics({ scriptUrl, websiteId, domains }: UmamiConfig) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      // Left and middle clicks; both open the link.
      if (event.button > 1 || !(event.target instanceof Element)) return
      const anchor = event.target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement) || anchor.closest(`[${UMAMI_IGNORE_ATTRIBUTE}]`)) return

      const page = window.location.pathname
      const href = anchor.href
      if (href.startsWith('mailto:')) return track(UMAMI_EVENTS.contactEmail, { page })

      let url: URL
      try {
        url = new URL(href)
      } catch {
        return
      }
      if (url.origin === window.location.origin || !url.protocol.startsWith('http')) return

      const host = url.hostname.replace(/^www\./, '')
      track(UMAMI_EVENTS.outboundLink, { page, host, url: `${url.origin}${url.pathname}` })
    }

    document.addEventListener('click', handleClick, { capture: true })
    document.addEventListener('auxclick', handleClick, { capture: true })
    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
      document.removeEventListener('auxclick', handleClick, { capture: true })
    }
  }, [])

  return (
    <Script
      src={scriptUrl}
      strategy="afterInteractive"
      data-website-id={websiteId}
      data-domains={domains || undefined}
      onLoad={flushUmamiQueue}
    />
  )
}
