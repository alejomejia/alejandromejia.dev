'use client'

import { useId } from 'react'

import { COPY } from '@/lib/constants/copy'
import { toggleTheme } from '@/lib/styles/theme-preference'
import { cn } from '@/lib/utils'

// Shared by the three animated parts; reduced motion snaps between states.
const MORPH = 'transition-transform duration-500 ease-out-quint motion-reduce:transition-none'
const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

/**
 * A sun that turns into a moon: one circle is the body, and a second circle
 * in its mask slides in to bite the crescent out while the rays fade. One
 * shape, no crossfade between two icons. Clicking switches to the other
 * scheme (`toggleTheme`); landing back on the OS's scheme follows the OS
 * again.
 *
 * The icon reads the theme from CSS (`dark:`), not React state: the server
 * can't know the visitor's scheme, and CSS paints the right icon before
 * hydration with nothing to flash. Only `transform` and `opacity` animate.
 *
 * @example
 * <ThemeToggle />
 */
export function ThemeToggle({ className }: { className?: string }) {
  const copy = COPY.theme
  // One mask per instance; `useId` output isn't a valid `url(#…)` fragment as is.
  const maskId = `theme-toggle-${useId().replace(/[^\w-]/g, '')}`

  return (
    <button
      type="button"
      onClick={toggleTheme}
      // Static: a label that named the current theme would differ between the
      // server and the client.
      aria-label={copy.toggle}
      title={copy.toggle}
      className={cn(
        'inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground/60 transition-colors duration-250 hover:text-foreground',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn('size-4', MORPH, 'dark:-rotate-90')}>
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          {/* Parked up and to the right in light mode, over the body in dark.
              The offsets are viewBox units (10 and 8 of 24), not screen pixels. */}
          <circle
            cx="16"
            cy="8"
            r="9"
            fill="black"
            className={cn(MORPH, 'origin-center translate-x-2.5 -translate-y-2 dark:translate-0')}
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="currentColor"
          mask={`url(#${maskId})`}
          className={cn(MORPH, 'origin-center scale-55 dark:scale-100')}
        />
        {/* Each ray runs from radius 6.5 to 8.5: clear of the light-mode body
            (9 × 0.55 ≈ 5) and inside the viewBox. */}
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="transition-opacity duration-300 motion-reduce:transition-none dark:opacity-0"
        >
          {RAY_ANGLES.map((angle) => (
            <line key={angle} x1="12" y1="5.5" x2="12" y2="3.5" transform={`rotate(${angle} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  )
}
