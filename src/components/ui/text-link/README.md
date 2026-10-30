# TextLink

Inline text link with two animated hover treatments, rendered as a link or
as a `<button>` depending on `href`.

## What it does

- With `href` it renders the project's `Link` (intent prefetch, external URLs
  open in a new tab with a safe `rel`). Without it, a `<button>`
  (`type="button"` by default). TypeScript only accepts the props that fit
  the element.
- `underline`: a 1px underline retracts to the right on hover and redraws from
  the left on leave. Used for inline "read more" style links.
- `underline-reveal` (default): the reverse. Hidden by default, it draws from
  the left on hover and retracts to the right on leave. Used for nav lists and
  text toggles.
- `active` keeps the hover treatment visible and disables pointer events; on a
  link it also sets `aria-current="page"`. Pass it when the link points to the
  current path, or when a toggle is the selected option.
- `NavTextLink` (`nav-text-link.tsx`, client) sets `active` by itself when
  its `href` is the current page (`isCurrentPath` from `@/lib/utils`,
  query and trailing slash ignored). Use it for nav lists, including ones
  rendered from Server Components.
- Content-sized (`w-fit`) even inside flex columns and grids.
- `textLinkClassName()` exposes the same classes for other elements.

## Setup

Uses the `ease-out-quad` / `ease-out-expo` theme easings from `lib/styles/theme.css`.
No other setup.

## Usage

```tsx
import { TextLink, textLinkClassName } from '@/components/ui/text-link'

<TextLink href="/work">Work</TextLink>
<TextLink href="/about" variant="underline">Meet the studio</TextLink>
<TextLink href="/about" variant="underline-reveal">Meet the studio</TextLink>

// No href: a <button>.
<TextLink onClick={openMenu} aria-expanded={menuOpen}>Menu</TextLink>

<summary className={textLinkClassName({ variant: 'underline' })}>More</summary>

// Underlined while on /terms.
import { NavTextLink } from '@/components/ui/text-link/nav-text-link'
<NavTextLink href="/terms">Terms</NavTextLink>
```

## Configuration

| Prop        | Type                                            | Default    | Description |
| ----------- | ----------------------------------------------- | ---------- | ----------- |
| `href`      | `LinkProps['href']`                             | -          | Renders a link when set; all `Link` props then apply. |
| `variant`   | `'underline' \| 'underline-reveal'` | `'underline-reveal'` | Hover treatment (`text-link.const.ts`). |
| `active`    | `boolean`                                       | `false`    | Current state. |
| `className` | `string`                                        | -          | Extra classes (merged with `cn`). |
| …rest       | `<button>` or `Link` props                      | -          | `onClick`, `disabled`, `aria-*`, `prefetch`, `newTab`, … |

## Where to use it

Navigation lists, footers, inline CTAs inside copy, text-style toggles. For
pill-shaped actions use `Button`.

## Dependencies

`Link` from `@/components/ui/link`, `cn` from `@/lib/utils`, the easing tokens above.

## Porting to another project

Copy the folder (and `components/ui/link` if the project lacks it) and recreate the two easing tokens (or replace them with
`ease-out` in `text-link.const.ts`).

## Performance / gotchas

- `w-fit` keeps it content-sized; pass `className="w-full"` to stretch it.
- The underlines transition only `background-size`; `background-position`
  snaps, which picks the side the line grows from or retracts to. Transitioning
  both would make the line slide instead.
