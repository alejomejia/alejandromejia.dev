'use client'

import { useLenis } from 'lenis/react'
import { useEffect } from 'react'

/**
 * Keeps the root Lenis's scroll limit in step with the page height. Renders
 * nothing; mounted automatically by `<Lenis root />`.
 *
 * Lenis caches the page height and re-measures it only when its own observer
 * on `<html>` fires, debounced by 250ms. Until then the page can outgrow the
 * cached height (images or fonts loading, a section changing height, a
 * client-side navigation to a taller page) and the smooth scroll stops short of
 * the footer. This re-measures on the next frame instead. It watches `<body>`
 * so it keeps working even if a layout pins `<html>` to the viewport
 * (`h-full`), which hides every growth from Lenis's observer.
 */
export function LenisAutoResize() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return
    // ResizeObserver already batches to one callback per frame.
    const observer = new ResizeObserver(() => lenis.resize())
    observer.observe(document.body)
    return () => observer.disconnect()
  }, [lenis])

  return null
}
