# Pitfalls

Bugs already hit while building sites this way, each with its fix. Skim it
before writing motion, image or layout code; add an entry whenever a new one
costs more than a few minutes.

## Images

- **Clipping an image with a translated wrapper breaks lazy loading.** A
  curtain reveal, or a hover photo slid in from outside its frame, leaves the
  `<img>` with zero visible area, so native lazy loading never fires and the
  photo pops in late. Keep the photo in place and move a page-colored overlay
  instead, or crossfade with opacity/scale. For a handful of images,
  `loading="eager"` with `fetchPriority="low"` also works.
- **Hairlines around a covered photo.** An overlay and a photo clipped by the
  same anti-aliased edge leak a 1px line. Render the photo
  `motion-safe:invisible` and make it visible when its reveal starts.
  Overscanning the overlay doesn't help.
- **"LCP image without `loading=eager`" warning on an eager image.** Next's
  dev check matches by `src`: a lazy thumbnail of the same file elsewhere on
  the page triggers it. Make the duplicate eager with `fetchPriority="low"`
  when it is above the fold too.
- **Crops hide the subject.** Set `position` (the focal point) on the image
  source when the subject isn't centered, e.g. `'50% 80%'`.

## Motion and GSAP

- **Flash before hydration.** Server HTML paints before GSAP hides things.
  Render animated elements hidden (`motion-safe:invisible`) and reveal with
  `fromTo` / `autoAlpha`. Never use `.from({ opacity: 0 })` on an element that
  already renders hidden: it tweens to its current hidden state.
- **State changes the page height (toggles, tabs).** Call
  `ScrollTrigger.refresh()` after the new DOM commits. `LenisScrollTriggerSync`
  only refreshes on route changes.
- **Elements already scrolled past never reveal** with `once` triggers. Give
  `ScrollTrigger.batch` `end: 'max'` so they still fire on creation.
- **Tweens started in callbacks or click handlers live outside the GSAP
  context.** Kill them on cleanup with `gsap.killTweensOf(...)`.
- **`contextSafe` called during render with ref reads** trips the React
  compiler lint (`react-hooks/refs`). Use a plain handler plus a cleanup.
- **GSAP and Tailwind transforms on one element.** `translate-*` / `scale-*`
  set separate CSS properties that stack with GSAP's `transform`. Put CSS
  hover transforms and GSAP tweens on different wrappers.
- **Initial offsets on an element GSAP will move.** Write the starting offset
  as `[transform:translateY(-100%)]` instead of `-translate-y-full`, and zero
  `y` in the tween (`fromTo(el, { y: 0, yPercent: -100 }, { y: 0, yPercent: 0 })`):
  GSAP reads a class offset into its pixel `y` and would add `yPercent` on top.
- **A size measured at mount can be 0.** Sections that mount while hidden
  (a closed panel, an intro still covering the page) measure 0, and never
  again if they only listen to window `resize`. Measure with a
  `ResizeObserver` on the element.
- **A frame loop gated by `inView` freezes mid-fade.** If the page scrolls
  away under a still pointer, the loop stops with the effect half visible.
  When the gate closes, snap to the resting state once, then idle.
- **`position: fixed` inside a transformed ancestor** stops following the
  viewport. Animate the children instead of the container, and
  `clearProps: 'transform'` after entrance tweens.
- **Animating React-owned text** (count-ups): write the text node's
  `nodeValue`, not `textContent`, so React keeps its node. Give screen readers
  the final value in `sr-only`.
- **SplitText on React-owned text**: key the element by its text
  (`key={title}`) so a change remounts it. SplitText rewrites the DOM, which
  React can't patch.

## Scroll-reactive chrome

Headers that hide on scroll, collapse their logo or flip colors must not
re-render React on every scroll frame. Read the scroll with
`useLenis(({ scroll }) => …)` and write straight to the DOM: a `transform`
through a ref, or a `data-*` attribute on the header that Tailwind's
`group-data-*` / `in-data-*` variants react to. Zero renders while scrolling.

## Layout and markup

- **Display sizes overflow long words.** Check the longest real word at the
  largest token on a narrow desktop; drop a step for interior `<h1>`s.
- **Nested links.** A card is an `<article>` with one `Link` around photo and
  title; secondary actions sit outside it.
- **A sticky panel taller than the viewport** hides its bottom until its
  column ends. Measure it and use a negative `top` so it sticks by its bottom.
- **Content replaced by something shorter** (a filtered list that empties)
  can land above the screen. Scroll it into view with Lenis and move focus to it.
- **The page can't scroll to the footer.** Lenis re-measures the page only
  when `<html>` resizes, which never happens while the root layout pins
  `<html>` to the viewport (`h-full`). Never pin `<html>`: give `<body>`
  `min-h-svh` instead. `LenisAutoResize` also re-measures whenever `<body>`
  resizes; keep it mounted with the root Lenis.

## Data

- **Dates.** Format with `formatDate` / `formatMonth` from `@/lib/utils`,
  never `toLocaleDateString()` bare: they pin `en-US`, so the server and the
  browser print the same string.
- **CMS edits that never show up.** Every CMS reader carries `CMS_CACHE_TAG`;
  a new reader without it stays stale after publishing. The clock fix in
  `src/instrumentation.ts` must stay until Next fixes vercel/next.js#99329.

## Verification

- **Frozen animations in automated screenshots**: the tab is hidden
  (`document.visibilityState === 'hidden'`), so `requestAnimationFrame` is
  paused. It happens when another tab of the window is in front or when the
  browser window is behind another app. Layout checks (overflow, headings,
  console) still work while hidden; motion can't be judged until it is visible.
- **The browser window may refuse to resize**: check phone width through an
  injected 390px iframe (see the `page-building` skill, step 8).
- **The local database is shared?** Two projects whose `.env` point at the
  same `DATABASE_URL` push each other's schema on `pnpm dev`. Give every
  project its own database name.
