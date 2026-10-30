# AutoplayVideo

A muted, looping, inline `<video>` for decorative/background footage that plays
only while it is on screen.

## What it does

- Plays when the element enters the viewport (widened by a `10%` root margin so
  it is already moving on its first visible frame) and **pauses when it
  leaves**: the house "pause off-screen work" rule, built in.
- Always `muted`, `loop`, `playsInline`, the combination browsers require for
  autoplay, especially on iOS.
- Honors `prefers-reduced-motion`: no playback, the `poster` frame is shown.

## Setup

None. It is a `'use client'` leaf; render it from any server or client
component.

## Usage

```tsx
import { AutoplayVideo } from '@/components/ui/autoplay-video'

<div className="relative aspect-video overflow-hidden">
  <AutoplayVideo
    src="/media/clip.mp4"
    poster="/media/clip.jpg"
    className="absolute inset-0 size-full object-cover"
  />
</div>
```

## Configuration

| Prop       | Type     | Default      | Description                                    |
| ---------- | -------- | ------------ | ---------------------------------------------- |
| `src`      | `string` | -            | Video URL (MP4/H.264 is the safest bet).       |
| `poster`   | `string` | -            | Still frame before playback / reduced motion.  |
| `preload`  | `string` | `'metadata'` | Forwarded to `<video>`.                        |
| …rest      |          |              | Any other `<video>` attribute except the four the component owns (`autoPlay`, `muted`, `loop`, `playsInline`). |

Root margin lives in `autoplay-video.const.ts`.

## Where to use it

Hero backgrounds, ambient loops inside cards, fullscreen media blocks. Not for
videos with sound or user-facing controls; use a regular player for those.

## Dependencies

- `useInViewport`, `usePrefersReducedMotion` from `@/lib/hooks`
- `cn` from `@/lib/utils`

## Porting to another project

Copy the folder, then make sure the target project exposes `useInViewport` and
`usePrefersReducedMotion` (both in `src/lib/hooks/`) and `cn`. No global CSS.

## Performance / gotchas

- Size and crop the video with `className` (`object-cover` + an absolutely
  positioned box); the component itself only adds `display: block`.
- Keep `preload="metadata"` for below-the-fold videos; raise it to `auto` only
  for a hero clip that must start instantly.
- Per-breakpoint copies (one `hidden sm:block`, one `sm:hidden`) are fine: a
  `display: none` video never intersects, so it never plays. It still fetches
  its metadata, though.
- Changing `src` while the video is in view keeps it playing (loading a new
  source pauses a `<video>`, so the component resumes it).
- Purely decorative footage can take `aria-hidden` so screen readers skip it.
  Loops longer than 5 seconds next to content may need a visible pause button
  to meet WCAG 2.2.2. The component doesn't render one.
