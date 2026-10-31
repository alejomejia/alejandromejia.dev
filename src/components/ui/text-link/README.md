# TextLink

The site's text link, with two animated underline treatments, rendered as a
link or as a `<button>` depending on `href`. Every one turns ink on hover.

## What it does

- With `href` it renders the project's `Link` (intent prefetch, external URLs
  open in a new tab with a safe `rel`). Without it, a `<button>`
  (`type="button"` by default). TypeScript only accepts the props that fit
  the element.
- Ink (`text-foreground`) on hover, fading in 250ms, on every variant. Pass
  the resting color in `className` (e.g. `text-muted`).
- `underline`: a 1px underline at rest that retracts to the right on hover and
  redraws from the left on leave. For links inside a sentence or a value,
  whose color matches the text around them.
- `underline-reveal` (default): the reverse. Hidden at rest, it draws from the
  left on hover and retracts to the right on leave. For standalone links
  (menus, label rows, back links) and text toggles.
- The underline sits on an inner label, so it never runs under an `icon`.
  The icon (an arrow, `iconPosition` `end` by default or `start`) nudges on
  hover: a leading one steps back, a trailing one steps up and right.
- `active` keeps the hover treatment visible and disables pointer events; on a
  link it also sets `aria-current="page"`. Pass it when the link points to the
  current path, or when a toggle is the selected option.
- `NavTextLink` (`nav-text-link.tsx`, client) sets `active` by itself when
  its `href` is the current page (`isCurrentPath` from `@/lib/utils`,
  query and trailing slash ignored). Use it for nav lists, including ones
  rendered from Server Components.
- Content-sized (`w-fit`) even inside flex columns and grids.
- `textLinkClassName()` (the element) and `textLinkLabelClassName()` (the
  label inside, with the underline) expose the same classes for other
  elements.

## Setup

Uses the `ease-out-expo` and `ease-out-quint` theme easings from `lib/styles/theme.css`.
No other setup.

## Usage

```tsx
import { TextLink, textLinkClassName } from '@/components/ui/text-link'

// Standalone (a menu): the line draws on hover.
<TextLink href="/work" className="text-muted">Work</TextLink>
// Inline, inside a sentence: underlined at rest.
<p>Longer write-ups are in <TextLink href="/writing" variant="underline">Writing</TextLink>.</p>
// With an icon, outside the underline.
<TextLink href={url} variant="underline" icon={<ArrowUpRight strokeWidth={1.5} />}>chromaway.com</TextLink>

// No href: a <button>.
<TextLink onClick={openMenu} aria-expanded={menuOpen}>Menu</TextLink>

<summary className={textLinkClassName({ variant: 'underline' })}>
  <span className={textLinkLabelClassName({ variant: 'underline' })}>More</span>
</summary>

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
| `icon`      | `ReactNode`                                     | -          | An icon beside the label (sized to 14px), outside the underline. |
| `iconPosition` | `'start' \| 'end'`                           | `'end'`    | Which side the icon sits on; sets its hover nudge. |
| `className` | `string`                                        | -          | Extra classes (merged with `cn`). |
| …rest       | `<button>` or `Link` props                      | -          | `onClick`, `disabled`, `aria-*`, `prefetch`, `newTab`, … |

## Where to use it

Every text link: inline ones inside copy (`underline`), navigation lists,
footers, back links and text-style toggles (`underline-reveal`). Whole rows
and tiles are block links (a plain `Link` with a hover surface), and boxed
actions use `Button`.

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
- The color transitions on the element and the underline on the label, so a
  `transition-*` class in `className` no longer cancels the underline's.
- The hover is a named group (`group/link`), so a text link inside a row
  link (`group`) doesn't react to the row's hover.
