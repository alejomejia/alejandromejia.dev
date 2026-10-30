# Button

The project's button. It has one look and renders either a `<button>` or a
link, depending on `href`.

## What it does

- Without `href` it renders a `<button>` (`type="button"` by default). With
  `href` it renders the project's `Link` (intent prefetch, external URLs open
  in a new tab with a safe `rel`). TypeScript only accepts the props that fit
  the element: `disabled`/`type` on a button, `prefetch`/`newTab` on a link.
- Two independent style axes: `variant` (color: `outline`, `solid`, `light`,
  `accent`, `blur`) and `shape` (geometry: `round`, `square`). Add new values to the
  maps in `button.const.ts`.
- An optional leading `icon`, static (no hover effect of its own).
- Not a client component itself. Only `Link` ships client JS.
- `buttonClassName()` exposes the same classes for other elements.

## Setup

None. Relies on theme tokens from `lib/styles/theme.css`: the `text-caption`
font size and the `background`, `foreground`,
`accent` and `accent-foreground` colors.

## Usage

```tsx
import { Button } from '@/components/ui/button'

// Link, with a leading icon.
<Button href="/cv" icon={<FileText />}>
  Read the CV
</Button>

// Button, plain label.
<Button variant="light" onClick={onClose} aria-controls="side-menu">
  Close
</Button>

// Same look on another element.
<label className={buttonClassName({ variant: 'solid' })}>…</label>
```

## Configuration

| Prop        | Type                                        | Default     | Description |
| ----------- | ------------------------------------------- | ----------- | ----------- |
| `children`  | `ReactNode`                                 | -           | Label. |
| `href`      | `LinkProps['href']`                         | -           | Renders a link when set; all `Link` props then apply. |
| `variant`   | `'outline' \| 'solid' \| 'light' \| 'accent' \| 'blur'` | `'outline'` | Color treatment. |
| `shape`     | `'round' \| 'square'`                       | `'round'`   | Geometry (height, radius, padding). |
| `icon`      | `ReactNode`                                 | -           | Leading icon; an `<svg>` is sized and filled with `currentColor`. |
| `className` | `string`                                    | -           | Extra classes (merged with `cn`). |
| …rest       | `<button>` or `Link` props                  | -           | `onClick`, `type`, `disabled`, `aria-*`, `prefetch`, `newTab`, … |

## Where to use it

Every CTA and action that should look like a button: header CTAs, menu
toggles, form submits. For inline links in copy use `TextLink`.

## Dependencies

`Link` from `@/components/ui/link`, `cn` from `@/lib/utils`, the theme tokens
listed in Setup.

## Porting to another project

Copy the folder (and `ui/link`, or swap it for `next/link`). Recreate the
tokens listed in Setup, or replace them with literal Tailwind values in
`index.tsx` / `button.const.ts`.

## Performance / gotchas

- `w-fit` keeps it content-sized even in flex columns and grids; pass
  `className="w-full"` for a full-width button.
- The icon slot targets a direct `<svg>` child; wrap other icon types yourself.
- Passing `onClick` from a server component is impossible (functions don't
  serialize); call it from a client component, or use `href`.
