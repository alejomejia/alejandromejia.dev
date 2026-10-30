'use client'

import { useEffect } from 'react'

// Marks the stand-ins, so they are told apart from the tags the router renders.
const HOLD_ATTRIBUTE = 'data-head-hold'
// What the browser tab shows: the title and the icons.
const TAB_TAGS = 'title, link[rel~="icon"], link[rel="apple-touch-icon"]'

// One watcher per document, even when Strict Mode runs the effect twice.
let watching = false

/**
 * Keeps the tab's title and icon steady through client navigations. Next's
 * router drops the old page's metadata as soon as a navigation starts and
 * renders the new page's once it arrives; for a page it hasn't prefetched
 * (every page in `next dev`) the tab flashes the bare
 * URL and a fallback icon in between. When a navigation starts (a link click
 * the router handles, or back/forward), this copies the current title and
 * icons into stand-ins, removed once the new page's own are in. A removal it
 * didn't see coming gets stand-ins too. Renders nothing; mount it once in the
 * root layout.
 */
export function HeadHold() {
  useEffect(() => {
    if (watching) return
    watching = true

    const head = document.head
    // The router's tags when the hold started: a title not among them is the new page's.
    let heldTags: Set<Element> | null = null
    let lastTags = routerTags()

    function routerTags() {
      return [...head.querySelectorAll(TAB_TAGS)].filter((tag) => !tag.hasAttribute(HOLD_ATTRIBUTE))
    }

    function release() {
      heldTags = null
      for (const standIn of head.querySelectorAll(`[${HOLD_ATTRIBUTE}]`)) standIn.remove()
    }

    function hold() {
      release()
      heldTags = new Set(routerTags())
      for (const tag of lastTags) {
        const standIn = tag.cloneNode(true) as Element
        standIn.setAttribute(HOLD_ATTRIBUTE, '')
        head.append(standIn)
      }
    }

    // Mutations made here call it again, and then change nothing.
    function sync() {
      const tags = routerTags()
      const title = tags.find((tag) => tag.localName === 'title')
      if (title) lastTags = tags
      if (heldTags && title && !heldTags.has(title)) release()
      else if (!heldTags && !title) hold()
    }

    function handleClick(event: MouseEvent) {
      // Runs after React's handlers: the router has claimed the click by now.
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || !event.defaultPrevented) return
      if (link.origin === location.origin && link.pathname !== location.pathname) hold()
    }

    new MutationObserver(sync).observe(head, { childList: true, subtree: true, characterData: true })
    document.addEventListener('click', handleClick)
    window.addEventListener('popstate', hold)
  }, [])

  return null
}
