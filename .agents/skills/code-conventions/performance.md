# Performance

This site is built for **top-tier web-vitals**: it must load fast and run
smoothly. Performance is a hard requirement, not a
nice-to-have — treat these as rules, not suggestions.

## Pause off-screen work (mandatory)

**Any effect that does per-frame or continuous work must stop while its element
is off-screen.** This is not an opt-in flag — build it in and give the consumer
no way to disable it. Covers: `requestAnimationFrame` / Tempus loops,
scroll-driven animation, GSAP timelines, canvas/WebGL, video, marquees,
`setInterval` polling — anything that keeps running when nobody can see it.

Use the shared hook — do **not** hand-roll an `IntersectionObserver` per
component:

```ts
import { useInViewport } from '@/lib/hooks'

// Frame loop — poll the ref (zero re-renders):
const { ref, inView } = useInViewport<HTMLDivElement>({ rootMargin: '15%' })
useTempus(() => {
  if (!inView.current) return
  // …per-frame work…
})

// Imperative play/pause (GSAP, video):
const { ref } = useInViewport<HTMLDivElement>({
  onEnter: () => timeline.play(),
  onLeave: () => timeline.pause(),
})
```

- "In view" also requires the tab to be visible: the hook treats a hidden
  tab as leaving the viewport, so videos, timers and GSAP loops stop in
  background tabs too (rAF alone would not stop a `<video>` or a timer).
- Skip DOM writes when the value hasn't changed (a settled lerp, an idle
  loupe): an unchanged style write still costs a style recalc every frame.
- Drop `will-change` once a one-shot animation ends (e.g. a reveal), so long
  grids don't keep one GPU layer per photo for the life of the page.
- Prefer reading `inView.current` inside the loop over toggling React state —
  visibility changes must never trigger re-renders.
- Use a **positive `rootMargin`** (e.g. `'15%'`) so the effect resumes just
  before the element is visible — no catch-up "pop" on entry.
- If `useInViewport` is missing a capability you need, extend the shared hook;
  don't fork a private observer.

## The rest

- **Respect `prefers-reduced-motion`.** Motion-heavy effects fall back to a
  static state (the halftone-shape loop draws one still frame).
- **Animate compositor-only properties** — `transform` / `opacity`, with
  `will-change` and `translate3d`. Never animate layout properties
  (`top`/`left`/`width`/`height`) per frame.
- **Write transforms via refs in the frame loop**, never through React state.
- **One rAF for the app.** Tick on the shared Tempus loop (as `<Lenis>` and
  `HalftoneShape` do); never start a second `requestAnimationFrame` when Tempus is
  available.
- **Images go through `next/image`** with correct `sizes`; never ship an
  unoptimized `<img>` for content imagery.
- **Lazy-load heavy client-only payloads** (GSAP plugins, WebGL) with
  `next/dynamic` (`ssr: false`) so they stay out of the entry bundle for
  sessions that never render them.
