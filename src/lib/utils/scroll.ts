import type { ScrollTrigger } from 'gsap/ScrollTrigger'

import { clamp } from './math'

/**
 * Swallows wheel input until none has arrived for `idleMs`. Call it as a
 * scroll lock lifts: the rest of a gesture made while locked (trackpad
 * momentum keeps firing for a second or more) would otherwise scroll the
 * page. It blocks native scrolling and, by stopping propagation in the
 * capture phase, smooth-scroll libraries listening on `window` (Lenis).
 * Returns a function that stops early. Client-only.
 */
export function blockWheelUntilIdle(idleMs: number): () => void {
  let timer = setTimeout(release, idleMs)

  function handleWheel(event: WheelEvent) {
    event.preventDefault()
    event.stopPropagation()
    clearTimeout(timer)
    timer = setTimeout(release, idleMs)
  }

  function release() {
    clearTimeout(timer)
    window.removeEventListener('wheel', handleWheel, { capture: true })
  }

  window.addEventListener('wheel', handleWheel, { capture: true, passive: false })
  return release
}

/** A scroll-edge fade: runs while a section edge rises from `from` to `to` (viewport fractions). */
export type EdgeFade = { readonly from: number; readonly to: number }

/** 0→1 progress of a section edge (px from the viewport top) rising through `fade`. */
export function edgeProgress(edge: number, fade: EdgeFade, viewport: number) {
  return clamp((fade.from * viewport - edge) / ((fade.from - fade.to) * viewport), 0, 1)
}

/**
 * Where a section sits in the viewport, read from a ScrollTrigger spanning
 * `top bottom` → `bottom top` (scroll clamped to that range): its top and
 * bottom edges in px from the viewport top, plus `pinOffset`, the
 * translateY that keeps a layer inside the section's sticky full-screen stage
 * glued to the viewport while that stage enters and leaves (so the layer
 * stays pinned for the section's whole on-screen life, not just while it
 * fills the screen). Client-only.
 */
export function sectionEdges(self: ScrollTrigger) {
  const viewport = window.innerHeight
  const scroll = clamp(self.scroll(), self.start, self.end)
  const top = self.start + viewport - scroll
  const bottom = self.end - scroll
  // The sticky stage sits below the top while entering and above it while leaving.
  const stageTop = top > 0 ? top : Math.min(bottom - viewport, 0)
  return { viewport, top, bottom, pinOffset: -stageTop }
}
