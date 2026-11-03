import { type ClassValue, clsx } from 'clsx'
import type { CSSProperties } from 'react'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge reads any unknown `text-*` as a color, so `cn('text-foreground', 'text-body')`
// would drop the color. Register the project's type tokens (`--text-*` in
// `src/lib/styles/theme.css`) and keep this list in sync with them.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['micro', 'caption', 'body', 'lead', 'display-s', 'display-m', 'display-l', 'display-xl'],
    },
  },
})

/**
 * Merges class values and dedupes conflicting Tailwind classes.
 * @example
 * cn('px-2', condition && 'px-4') // 'px-4' when condition is true
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Converts a plain object into a CSS custom-properties map for a `style`
 * prop: the only way runtime values reach CSS (Tailwind reads them with the
 * `(--name)` shorthand). Numbers are emitted in `unit` (rem divides by 16),
 * so pass unitless values (opacity, scale) as strings. Strings pass through
 * unchanged, and `null`/`undefined` are left out.
 * @example
 * toCSSVars({ gap: 16, color: 'red' }) // { '--gap': '1rem', '--color': 'red' }
 * <div className="bg-(--overlay) opacity-(--overlay-opacity)" style={toCSSVars({ overlay: hex, 'overlay-opacity': String(0.4) })} />
 */
export function toCSSVars(
  vars: Record<string, number | string | null | undefined>,
  unit: 'px' | 'rem' = 'rem',
): CSSProperties {
  return Object.fromEntries(
    Object.entries(vars)
      .filter(([, value]) => value != null)
      .map(([key, value]) => [
        `--${key}`,
        typeof value === 'number' ? `${unit === 'rem' ? value / 16 : value}${unit}` : value,
      ]),
  ) as CSSProperties
}

/** Delay between one entrance step and the next, in ms: quick enough that a list reads as one cascade. */
export const ENTER_STAGGER = 50

/** The last entrance step: items past it enter together, since a long stagger reads as slow (and they're below the fold by then). */
export const ENTER_LAST_STEP = 12

/**
 * Props for the brand's entrance (`animate-enter` in `theme.css`): a fade up
 * from a slight blur, staggered `ENTER_STAGGER` ms per `index` (capped at
 * `ENTER_LAST_STEP`). Skipped under reduced motion, and held while a page
 * transition runs (`view-transitions.css`). Spread it on the element, with
 * its own classes as `className`.
 * @example <li {...enter(2, 'flex gap-4')}>…</li>
 */
export function enter(
  index: number,
  className?: string,
): { className: string; style: CSSProperties; 'data-enter': '' } {
  return {
    className: cn('motion-safe:animate-enter', className),
    style: toCSSVars({ 'enter-delay': `${Math.min(index, ENTER_LAST_STEP) * ENTER_STAGGER}ms` }),
    'data-enter': '',
  }
}
