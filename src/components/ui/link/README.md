# Link

The project's link component. Use it everywhere instead of `next/link`
(ESLint blocks direct `next/link` imports outside this folder).

## What it does

- **Prefetches on intent, not on sight.** `next/link` prefetches every link
  that scrolls into view (in production). On a page with a menu, a footer and a
  grid of cards, that means dozens of RSC requests the visitor never uses,
  competing with the page's own images and scripts. `Link` defaults to
  `prefetch="intent"`: nothing is fetched until the visitor hovers, touches or
  keyboard-focuses the link, which usually still leaves a few hundred
  milliseconds before the click.
- **External links skip the router.** Other websites, `mailto:`, `tel:` and
  in-page `#hash` hrefs render a plain `<a>` (no router work, no prefetch).
- **Full URLs to this site become paths.** `https://<site>/about` (with or
  without `www.`, http or https) is rewritten to `/about` and routed like any
  internal link, so CMS editors can paste full URLs. The site is
  `NEXT_PUBLIC_SERVER_URL`.
- **Safe new tabs.** Other websites (`http(s)://`, `//…`) open in a new tab
  with `rel="noopener noreferrer"` by default; `newTab` overrides it either way.
- Everything else (`replace`, `scroll`, `onNavigate`, `transitionTypes`, `ref`,
  any `<a>` attribute) passes straight to `next/link`. Pages Router props
  (`as`, `shallow`, `passHref`, `legacyBehavior`, `locale`) are removed.

## Setup

None. It is a client component (it tracks intent in state) and can be rendered
from server components.

## Usage

```tsx
import { Link } from '@/components/ui/link'

<Link href="/about">About</Link>                                // intent prefetch
<Link href="/" prefetch="viewport">Home</Link>                  // Next's default
<Link href="/privacy" prefetch="none">Privacy</Link>
<Link href="https://instagram.com/example">Instagram</Link>     // new tab
<Link href="https://maps.app.goo.gl/…" newTab={false}>Map</Link>
<Link href="mailto:hello@example.com">hello@example.com</Link>  // plain <a>
<Link href="#contact">Contact</Link>                            // plain <a>
```

## Configuration

| Prop       | Type                               | Default                 | Description                                        |
| ---------- | ---------------------------------- | ----------------------- | -------------------------------------------------- |
| `prefetch` | `'intent' \| 'viewport' \| 'none'` | `'intent'`              | When the route is prefetched (see above).          |
| `newTab`   | `boolean`                          | `true` for web URLs     | Open in a new tab (adds `noopener noreferrer`).    |
| …rest      | `next/link` / `<a>` props          | -                       | `href`, `replace`, `scroll`, `onNavigate`, `rel`, … |

### Choosing `prefetch`

- `intent`: the default; right for almost every link.
- `viewport`: the one or two links most visitors click next, where even the
  hover-to-click gap matters (the main nav, a "Read the case study" link).
- `none`: links that are rarely used or point to heavy dynamic routes (long
  archive lists, pagination).

## Where to use it

Every internal or external link. Styled wrappers (`TextLink`, `Button`,
`CMSLink`) are built on it. Not for `app/global-not-found.tsx`, which renders
outside the router and must use plain `<a>`.

## Dependencies

`next/link`, `isExternalHref` / `isWebHref` / `toSitePath` from `@/lib/utils` (`url.ts`).

## Porting to another project

Copy the folder and the three helpers from `src/lib/utils/url.ts`. Add the
`no-restricted-imports` entry for `next/link` from `eslint.config.mjs` so new
code can't bypass it.

## Performance / gotchas

- Prefetching only runs in production builds, so dev shows no difference.
- After the first hover, the link switches to Next's default (`auto`) prefetch:
  a static route is fetched in full, a dynamic one down to its nearest
  `loading.tsx`. Add a `loading.tsx` to a dynamic route if its links should
  feel instant.
- Full-URL detection needs `NEXT_PUBLIC_SERVER_URL` set at **build** time. If
  it's missing, or set to a different domain (a staging URL in production),
  same-site URLs stay external and open in a new tab.
