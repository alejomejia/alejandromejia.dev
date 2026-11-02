# HalftoneShape

A slowly tumbling box that rounds from a cube into a sphere and back, drawn as
halftone dots on an 8px grid: a corner-radius token being dragged. A canvas
loop that is quiet enough for a minimal page and alive enough to show craft.

## What it does

- Ray-marches a rounded box's signed distance function per grid cell and
  sizes each dot by how much light that surface catches, with a little
  ambient light (so faces in shadow keep small dots) and a depth fade (so
  flat faces get a gradient).
- The corner radius eases from almost none to half the box and back every
  8s, resting a moment as a cube and as a sphere.
- Draws a faint dot at every grid point behind it, so the shape seems to
  surface out of the page's grid.
- Tilts toward the cursor (fine pointers only), eased.
- Draws in the canvas' `color` (`text-foreground` by default), read when
  the scene is built: on mount and on every resize.
- Paused off screen and in background tabs; under reduced motion it draws one
  still frame and never starts the loop.

## Setup

None. It ticks on the shared Tempus loop (`tempus/react`), like the rest of
the template's frame loops.

## Usage

```tsx
import { HalftoneShape } from '@/components/effects/halftone-shape'

<HalftoneShape className="aspect-square w-full max-w-80" />

{/* Calmer and denser */}
<HalftoneShape className="size-64" speed={0.6} dotScale={0.9} tilt={0} />
```

The canvas fills its box: give the box a size so nothing shifts on load. In
an aspect-ratio box, add `min-h-0` (or place the canvas `absolute inset-0`):
Chrome lets the canvas's own size raise the box's minimum height, so it
renders taller there than in Firefox and Safari.

## Configuration

| Prop        | Type                              | Default    | Description                                                   |
| ----------- | --------------------------------- | ---------- | ------------------------------------------------------------- |
| `className` | `string`                          | -          | Sizes the canvas (it is `size-full`).                         |
| `cell`      | `number`                          | `8`        | Grid pitch in CSS px. Keep it on the 8px grid.                |
| `speed`     | `number`                          | `1`        | Rotation and animation speed multiplier.                      |
| `tilt`      | `number`                          | `0.5`      | Largest tilt toward the cursor, in radians. `0` turns it off. |
| `dotScale`  | `number`                          | `0.8`      | Largest dot as a fraction of the cell.                        |

The morph's sizes and period, the resting angles and spin, the light,
camera, grid dots and still frame are constants in `halftone-shape.const.ts`.

## Where to use it

- Once per site, as a signature: the home page beside the intro, a 404, an
  about page. Two on one screen compete with each other.
- Not as a background behind text: the dots fight with letters.

## Changing the shape

Replace `distanceFunction` with another signed distance function (Inigo
Quilez's distance functions article has most primitives) and set
`HALFTONE_SHAPE_MOTION.bound` to a radius that contains the whole shape at
every point of its animation, or rays that would hit it get skipped. A
torus, stacked plates and this morph were compared before picking the morph.

## Dependencies

- `tempus/react` (`useTempus`).
- `@/lib/hooks`: `useInViewport`, `usePrefersReducedMotion`.
- `@/lib/utils`: `cn`, `clamp`, `frameLerp`.

## Porting to another project

1. Copy the folder.
2. Repoint the `@/lib/hooks` and `@/lib/utils` imports, or inline them:
   `clamp` and `frameLerp` are one-liners, and `useInViewport` can be any
   IntersectionObserver + `document.visibilityState` gate.
3. Without Tempus, replace `useTempus` with a `requestAnimationFrame` loop
   that passes the frame's `deltaTime` in ms.
4. On a site that switches color schemes, rebuild the scene when the scheme
   changes (or remount the component): the color is read only on rebuild.

## Performance and gotchas

- One ray per cell (1,600 at 320px), skipped early when it misses the
  bounding sphere; hits cost 4 extra samples for the normal. Every dot is drawn in a single path and `fill()`, and the background
  grid is pre-rendered once per size and color.
- The rotation is applied to the ray, not the shape, so distance functions
  stay in object space with no matrix math per step.
- The canvas is sized at the device pixel ratio; it rebuilds on resize, which
  also clears it (the loop redraws on the next frame).
- `getComputedStyle` runs only on rebuild, never per frame.
