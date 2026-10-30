# InspectMode

Turns any page into a Figma-like inspection view, to show the site sits on
its 8px grid: boxes, padding, sizes and the redlines between elements.

## What it does

- **Hover:** the element's outline, its padding shaded and its size
  (`480 × 135`).
- **Click** selects it (clicks never follow links or press buttons while it
  is on). **Hover another** for the redlines between the two: the gap
  between facing edges, or each edge's distance when one sits inside the
  other. Labels read px plus the spacing token when one matches
  (`16 · pad-s`), else rem (`49 · 3.1rem`).
- **Behind everything:** an 8px hairline grid anchored to the layout
  column, and the column itself as a faint band, like a Figma layout grid.
- **Panel** (top right): the selection's tag and text, size, padding, gap,
  radius and type (`Geist 32/36.8 · 500`), and an Exit button.
- **Keys:** `I` toggles (outside text fields and open dialogs); `Esc` clears
  the selection, then exits. Also `InspectModeToggle` and the command menu.
- **Touch screens:** the grid and the panel only (no hover to measure with).

## Setup

Mount it once in the root layout, and mark the layout column's container
with `data-inspect-origin` (the header's inner `div`):

```tsx
<InspectMode />
<div data-inspect-origin className="mx-auto max-w-(--shell-width)">…</div>
```

Give `data-inspect-ignore` to anything that must stay usable while it is on
(the command menu's dialog, the draft switcher); its own toggle and panel
already have it.

## Usage

```tsx
import { InspectModeToggle, setInspectEnabled, useInspectEnabled } from '@/components/effects/inspect-mode'

<InspectModeToggle />
setInspectEnabled(true)
const on = useInspectEnabled()
```

## Configuration

None. The colors (Figma's blue and red), the shortcut key and the spacing
token names live in `inspect-mode.const.ts`; keep `SPACING_TOKENS` in step
with `--spacing-pad-*` in `theme.css`.

## Where to use it

Site-wide, once. It is also the first Craft piece (Phase 7).

## Dependencies

- `@/lib/constants/copy` (`COPY.inspect`), `@/lib/utils`
  (`cn`, `toCSSVars`), `lucide-react` (`Frame`, in the toggle).

## Porting to another project

1. Copy the folder.
2. Mount `<InspectMode />` and set `data-inspect-origin` on the column.
3. Rewrite `SPACING_TOKENS` for that project's spacing scale.
4. Replace `COPY.inspect` with that project's copy.

## Performance and gotchas

- Nothing runs while it is off: the overlay mounts only when on, and its
  listeners go with it.
- Measuring happens at most once per frame (`requestAnimationFrame`), after
  a hover change, a click, a scroll or a resize, and goes into one state
  update. Elements are kept in refs, so render never reads the DOM.
- The click listener is on `window` in the capture phase, so it runs before
  React's root listener and can stop links and buttons.
- The crosshair cursor is a `<style>` added while on and removed after.
- Sizes are fractional where the layout is (`542.3 × 73.6`): it reports what
  the browser drew, which is the point.
