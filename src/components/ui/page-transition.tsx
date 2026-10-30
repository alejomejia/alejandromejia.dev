'use client'

import { useEffect, useLayoutEffect, ViewTransition } from 'react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

// Set on the link that started a navigation until the new page mounts, so it
// keeps its hover look in the old page's snapshot (see `TextLink`).
const LEAVING_ATTRIBUTE = 'data-leaving'

/**
 * Animates every route change as a blur cross-fade of the page content: the
 * old `<main>` leaves with the `page-out` class and the new one arrives with
 * `page-in` (motion in `lib/styles/view-transitions.css`). The sidebar names
 * its own snapshot and stays still; the root snapshot (the background)
 * fades in with the new content. `<html>` names itself `root` inline
 * (frontend layout), which keeps React from opting the root out.
 *
 * Keyed on the pathname, every navigation remounts this boundary, even
 * between two dynamic segments of one route (`/privacy` → `/terms`), so React
 * runs its exit and enter. It has no `name`, so the old and new `<main>` are
 * separate snapshots: each one fades where it is, and nothing slides when the
 * new page starts at a different scroll position.
 */
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname()
  useSettleClickedLink(pathname)

  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      {/* `flex-1` so pages that fill the viewport height keep doing so. It is
          also the page's `<main>` landmark, which crawlers and AI readers use
          to separate content from header/footer chrome, so pages must not
          render another. The content column: inspect mode anchors its 8px
          grid here. */}
      <main data-page-transition data-inspect-origin className={cn('flex flex-1 flex-col', className)}>
        {children}
      </main>
    </ViewTransition>
  )
}

/**
 * The old page leaves as a still snapshot, taken when the new page is ready:
 * a link whose hover was still animating when clicked (an underline half
 * drawn) would freeze mid-way, or half retracted if the pointer moved off in
 * the meantime. On a click the router handles, the link is marked leaving
 * (it keeps its hover look) and its hover transitions jump to their end; the
 * mark comes off once the new page has mounted.
 */
function useSettleClickedLink(pathname: string) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      // Runs after React's handlers: the router has claimed the click by now.
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || !event.defaultPrevented) return
      if (link.origin !== location.origin || link.pathname === location.pathname) return
      link.setAttribute(LEAVING_ATTRIBUTE, '')
      for (const animation of link.getAnimations({ subtree: true })) {
        if (animation instanceof CSSTransition) animation.finish()
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useLayoutEffect(() => {
    for (const link of document.querySelectorAll(`[${LEAVING_ATTRIBUTE}]`)) link.removeAttribute(LEAVING_ATTRIBUTE)
  }, [pathname])
}
