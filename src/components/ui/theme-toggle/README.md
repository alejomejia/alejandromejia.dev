# ThemeToggle

A 32px icon button that switches between light and dark. The icon is one
shape: a sun whose body grows while a masked circle slides in to bite out a
crescent, and the rays fade.

## What it does

- Clicking switches to the other scheme from the one on screen
  (`toggleTheme` from `@/lib/styles/theme-preference`). Landing back on the OS's scheme clears
  the stored choice, so the site follows the OS again.
- The icon follows the theme through CSS (`dark:`), not React state, so it is
  right before hydration and never flashes.
- Only `transform` and `opacity` animate (500ms `ease-out-quint`); reduced
  motion snaps.
- Static `aria-label` and tooltip ("Switch theme", from `COPY`): a
  label naming the current theme would differ between server and client.

## Setup

The theme lives in `src/lib/styles/theme-preference.ts` and needs two things in the root layout:

1. `THEME_SCRIPT` inlined in `<head>` (applies a stored choice before the
   first paint), and `suppressHydrationWarning` on `<html>`, since the script
   may add `data-theme` before React hydrates.
2. Tokens that react to `data-theme` (`tokens.css`) and the `dark:` custom
   variant (`theme.css`), which reads both the attribute and the OS.

```tsx
<html suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
  </head>
```

## Usage

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

<ThemeToggle />
<ThemeToggle className="-mr-2" /> {/* optical alignment at a row's end */}
```

For a three-way picker (light, dark, system), call `setThemePreference` and
read the current choice with `useThemePreference()` from `@/lib/hooks`, as
the command menu does.

## Configuration

| Prop        | Type     | Default | Description                     |
| ----------- | -------- | ------- | ------------------------------- |
| `className` | `string` | -       | Extra classes for the button.   |

## Where to use it

Once per page, in the footer. The command menu offers the same choice with a
"System" option.

## Dependencies

- `@/lib/styles/theme-preference` (`toggleTheme`) and the layout setup above.
- `@/lib/constants/copy` (`COPY.theme.toggle`).
- `@/lib/utils` (`cn`).

## Porting to another project

1. Copy this folder and `src/lib/styles/theme-preference.ts`.
2. Add the `<head>` script and `suppressHydrationWarning` to the root layout.
3. Make the color tokens switch on `[data-theme='dark']` (and on
   `prefers-color-scheme: dark` when no `data-theme='light'` is set), and add
   the `dark:` custom variant from `theme.css`.
4. Replace `COPY.theme` with that project's copy or a plain label.

## Gotchas

- The mask id comes from `useId`, cleaned up for `url(#…)`: several toggles
  on one page each keep their own mask.
- SVG transforms run in the viewBox's units: `translate-x-2.5` is 10 units
  of the 24-unit icon, not 10 screen pixels.
