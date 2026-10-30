'use client'

import { useEffect, useEffectEvent, useRef, type RefObject } from 'react'

export interface UseInViewportOptions {
  /** Expands (or shrinks) the viewport box the observer tests against, so
   *  visibility flips before/after the element is actually on screen. Use a
   *  positive margin (e.g. `'15%'`) to spin an effect up just before it shows. */
  rootMargin?: string
  /** Intersection ratio(s) at which visibility flips. */
  threshold?: number | number[]
  /** Stop observing after the first time the element enters view (reveal-once). */
  once?: boolean
  /** Skip observing entirely: `inView` stays `true`, so a gated effect runs
   *  unconditionally. Use to bypass the gate (e.g. when the effect is disabled). */
  disabled?: boolean
  /** Fired whenever visibility changes. */
  onChange?: (inView: boolean) => void
  /** Fired when the element enters view. */
  onEnter?: () => void
  /** Fired when the element leaves view. */
  onLeave?: () => void
}

export interface UseInViewportReturn<T extends Element> {
  /** Attach to the element to observe. */
  ref: RefObject<T | null>
  /** Live visibility as a **ref**; read `inView.current` inside `requestAnimationFrame`
   *  / animation loops so visibility changes never cause a React re-render. */
  inView: RefObject<boolean>
}

/**
 * Observes whether an element is in (or near) the viewport **and** its tab is
 * visible, so animations pause off-screen and in background tabs, the house
 * performance rule (see the `code-conventions` skill). Ref-based on
 * purpose: visibility is exposed as a ref for zero-rerender frame loops, with
 * `onEnter`/`onLeave`/`onChange` callbacks for imperative play/pause (e.g. a
 * GSAP timeline or a video). One `IntersectionObserver` per element.
 *
 * @example Frame loop (poll the ref)
 * ```ts
 * const { ref, inView } = useInViewport<HTMLDivElement>({ rootMargin: '15%' })
 * useTempus(() => { if (!inView.current) return; /* per-frame work *\/ })
 * ```
 * @example Imperative play/pause
 * ```ts
 * const { ref } = useInViewport<HTMLDivElement>({
 *   onEnter: () => timeline.play(),
 *   onLeave: () => timeline.pause(),
 * })
 * ```
 */
export function useInViewport<T extends Element = HTMLElement>({
  rootMargin,
  threshold,
  once = false,
  disabled = false,
  onChange,
  onEnter,
  onLeave,
}: UseInViewportOptions = {}): UseInViewportReturn<T> {
  const ref = useRef<T>(null)
  // Default true so a gated effect runs until the observer reports otherwise
  // (it fires synchronously on `observe`), and whenever observing is disabled.
  const inView = useRef(true)

  // Effect Event: always calls the latest callbacks, but is non-reactive, so
  // passing fresh inline functions each render never rebuilds the observer.
  const onVisibilityChange = useEffectEvent((next: boolean) => {
    onChange?.(next)
    if (next) onEnter?.()
    else onLeave?.()
  })

  // Stable primitive key for the array/number threshold so the effect below
  // does not re-run on every render when an inline array literal is passed.
  const thresholdKey = Array.isArray(threshold) ? threshold.join(',') : String(threshold ?? 0)

  useEffect(() => {
    const element = ref.current
    if (disabled || !element) {
      inView.current = true
      return
    }

    // Visible = intersecting the (widened) viewport while the tab is shown.
    // rAF already stops in a background tab, but videos, timers and CSS
    // animations don't, so hiding the tab counts as leaving the viewport.
    let intersecting = false
    let settled = false
    function update() {
      const next = intersecting && document.visibilityState === 'visible'
      if (settled && next === inView.current) return
      settled = true
      inView.current = next
      onVisibilityChange(next)
      // Reveal-once: done after the first time it is actually seen.
      if (next && once) stop()
    }

    // Rebuilt from the key so the effect depends only on what it reads.
    const thresholdList = thresholdKey.split(',').map(Number)
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting
        update()
      },
      { rootMargin, threshold: thresholdList },
    )
    function stop() {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
    observer.observe(element)
    document.addEventListener('visibilitychange', update)
    return stop
  }, [disabled, once, rootMargin, thresholdKey])

  return { ref, inView }
}
