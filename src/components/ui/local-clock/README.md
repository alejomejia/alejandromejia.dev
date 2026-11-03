# LocalClock

The current time in a time zone, `HH:mm` plus the zone's short name
(`14:32 CET`), updated at the start of every minute; with `showSeconds`,
`HH:mm:ss` ticking every second.

## What it does

- Renders only in the browser: pages are cached, so a server-rendered time
  would be stale. Until then a skeleton bar shimmers in its place, as wide
  as the time will be (an invisible `00:00 CET`, or `00:00:00 CET`, in
  tabular figures holds the width).
- When the time is ready it renders under the skeleton, which is wiped away
  from left to right (600ms, `ease-out-quint`) and then leaves the DOM. The
  shimmer sweeps the same way, so the wipe reads as the loading finishing.
- Reduced motion: the bar stays still and the time replaces it at once.
- One timer per minute (or second), aligned to the boundary, and a refresh
  when the tab becomes visible again (hidden tabs throttle timers).
- An unknown time zone renders the placeholder instead of throwing.

## Setup

None. Its keyframes ship with it in a `<style>` that React hoists into the
`<head>` and dedupes (`local-clock.const.ts`), so they run before hydration
and need no global CSS.

## Usage

```tsx
import { LocalClock } from '@/components/ui/local-clock'

<LocalClock timeZone="Europe/Madrid" />
<LocalClock timeZone="America/Bogota" showZone={false} />
<LocalClock timeZone="Europe/Madrid" showSeconds />
```

## Configuration

| Prop        | Type      | Default | Description                                  |
| ----------- | --------- | ------- | -------------------------------------------- |
| `timeZone`  | `string`  | -       | IANA time zone, e.g. `Europe/Madrid`.        |
| `showZone`  | `boolean` | `true`  | Shows the zone's short name after the time.  |
| `showSeconds` | `boolean` | `false` | Shows and ticks the seconds (`14:32:07`). |
| `className` | `string`  | -       | Classes for the wrapping `<span>`.           |

## Where to use it

The header's status line, next to the country (the site reads it from the Profile
global's time zone). Inline in text; it inherits the font and color.

## Dependencies

- React 19 (hoisted `<style href precedence>`).
- `@/lib/utils` (`cn`). The minute subscription and formatting are in
  `local-clock.utils.ts`, the skeleton's motion in `local-clock.const.ts`.
- The site's `bg-background` and `bg-foreground/10` tokens, and
  `--ease-out-quint` (with a fallback curve).

## Porting to another project

Copy the folder; repoint `cn` or drop it, and swap the two color classes
for the target's surface and hairline colors.

## Gotchas

- The zone name comes from `Intl` with the `en-GB` locale, which prints
  `CET` / `CEST` for Spain; other zones may print an offset (`GMT-5`).
- It renders a `<time>` element whose `dateTime` is the `HH:mm` value.
- The mask needs an opaque background (`bg-background`) to hide the time
  under it, so the clock must sit on the page background. On another
  surface, change that class.
- The wipe moves only transforms: the mask slides right and its content
  slides left by as much, so the bar stays put while its left edge is cut
  away. Animating `clip-path` would look the same but run on the main
  thread.
