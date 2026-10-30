# Image

The project's image component. Use it everywhere instead of `next/image`
(ESLint blocks direct `next/image` imports outside this folder).

## What it does

A thin wrapper over `next/image` (optimization, `srcset`, lazy loading and
async decoding all stay) that closes the defaults that cost performance:

- **`fill` requires `sizes`** (a type error otherwise). Without `sizes`, the
  browser assumes the image spans the whole viewport and downloads a
  full-width file for a thumbnail.
- **One switch for above-the-fold images.** `lcp` sets `loading="eager"` and
  `fetchPriority="high"`, which Next 16 recommends over `preload`.
- **No deprecated props.** `priority` (deprecated in Next 16), `preload` and
  `onLoadingComplete` are removed from the types.

SVGs, `data:` and `blob:` sources are served unoptimized automatically by
`next/image`; nothing to do.

## Setup

Allow every remote host in `next.config.ts` → `images.remotePatterns`. Static
imports and `/public` paths need nothing.

## Usage

```tsx
import { Image } from '@/components/ui/image'

// Cover image inside a sized, positioned box
<div className="relative aspect-4/3">
  <Image src={src} alt="" fill sizes="(min-width: 48rem) 50vw, 100vw" className="object-cover" />
</div>

// The hero: the page's LCP element
<Image src={hero} alt="Our studio" fill sizes="100vw" lcp className="object-cover" />

// Intrinsic size, responsive width
<Image src={media.url} alt={media.alt} width={media.width} height={media.height} sizes="100vw" className="h-auto w-full" />

// Static import (width/height come from the file)
<Image src={logo} alt="Logo" className="h-8 w-auto" />
```

## Configuration

| Prop     | Type      | Default | Description                                                      |
| -------- | --------- | ------- | ---------------------------------------------------------------- |
| `lcp`    | `boolean` | `false` | Above-the-fold LCP image: eager load, high fetch priority.       |
| `fill`   | `true`    | -       | Fill the positioned parent. Requires `sizes`; forbids `width`/`height`. |
| `sizes`  | `string`  | -       | Rendered width per breakpoint. Required with `fill`; set it too whenever CSS makes the image responsive. |
| …rest    | `next/image` props | - | `src`, `alt` (required), `width`, `height`, `quality`, `placeholder`, `ref`, … |

## Where to use it

All content imagery. For decorative CSS backgrounds or inline SVG icons, use
CSS or the `icons` components instead.

## Dependencies

`next/image` only.

## Porting to another project

Copy the folder. Add the `no-restricted-imports` entry for `next/image` from
`eslint.config.mjs`, and set `images.remotePatterns` for the media host.

## Performance / gotchas

- Use `lcp` on **one** image per viewport. Marking several images eager makes
  them compete for bandwidth, which slows the real LCP image down.
- `sizes` should describe the rendered width, not the file width:
  `sizes="21rem"` for a fixed 21rem card, `"(min-width: 48rem) 33vw, 100vw"`
  for a three-column grid that stacks on mobile.
- Without `sizes`, a non-`fill` image only gets `1x`/`2x` candidates of its
  `width`. Fine for fixed-size images, wasteful for `w-full` ones.
- Next 16 only serves qualities listed in `images.qualities` (default `[75]`);
  other `quality` values snap to the closest allowed one.
