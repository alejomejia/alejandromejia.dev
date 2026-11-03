'use client'

import { useState, useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'

import { LOCAL_CLOCK_CSS, LOCAL_CLOCK_WIPE } from './local-clock.const'
import { currentMinute, currentSecond, formatClock, subscribeMinutes, subscribeSeconds } from './local-clock.utils'

type LocalClockProps = {
  /** IANA time zone, e.g. `Europe/Madrid`. */
  timeZone: string
  /** Shows the zone's short name after the time (`14:32 CET`). */
  showZone?: boolean
  /** Shows and ticks the seconds (`14:32:07`), so the clock visibly runs. */
  showSeconds?: boolean
  className?: string
}

/**
 * The current time in a time zone, `HH:mm` (or `HH:mm:ss`), updated on the
 * minute (or the second). Rendered only in the browser: pages are cached, so
 * a server time would be stale.
 * Until then a skeleton bar of the same width shimmers in its place (plain
 * CSS, so it runs before hydration); when the time is ready it sits under
 * the skeleton, which is wiped away from left to right.
 *
 * @example
 * <LocalClock timeZone="Europe/Madrid" />
 * <LocalClock timeZone="Europe/Madrid" showSeconds />
 */
export function LocalClock({ timeZone, showZone = true, showSeconds = false, className }: LocalClockProps) {
  const now = useSyncExternalStore(
    showSeconds ? subscribeSeconds : subscribeMinutes,
    showSeconds ? currentSecond : currentMinute,
    () => null,
  )
  const clock = now === null ? null : formatClock(now, timeZone, showSeconds)
  // Once the wipe ends the skeleton leaves the DOM; it never comes back (the time only updates).
  const [revealed, setRevealed] = useState(false)

  return (
    <span className={cn('relative inline-block tabular-nums', className)}>
      <style href="local-clock" precedence="default">
        {LOCAL_CLOCK_CSS}
      </style>
      {clock ? (
        <time dateTime={clock.time}>
          {clock.time}
          {showZone && clock.zone && ` ${clock.zone}`}
        </time>
      ) : (
        // Holds the width the time will take (tabular figures).
        <span aria-hidden className="invisible">
          {`${showSeconds ? '00:00:00' : '00:00'}${showZone ? ' CET' : ''}`}
        </span>
      )}
      {!revealed && (
        <span
          aria-hidden
          data-local-clock-mask={clock ? 'out' : 'loading'}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && event.animationName === LOCAL_CLOCK_WIPE) setRevealed(true)
          }}
          className="pointer-events-none absolute inset-0 overflow-hidden bg-background"
        >
          <span className="absolute inset-0 flex items-center">
            <span className="relative h-2 w-full overflow-hidden rounded-full bg-foreground/10">
              <span className="local-clock-shimmer absolute inset-0 bg-linear-to-r from-transparent via-foreground/10 to-transparent" />
            </span>
          </span>
        </span>
      )}
    </span>
  )
}
