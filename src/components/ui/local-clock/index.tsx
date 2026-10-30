'use client'

import { useSyncExternalStore } from 'react'

import { cn } from '@/lib/utils'

import { currentMinute, formatClock, subscribeMinutes } from './local-clock.utils'

type LocalClockProps = {
  /** IANA time zone, e.g. `Europe/Madrid`. */
  timeZone: string
  /** Shows the zone's short name after the time (`14:32 CET`). */
  showZone?: boolean
  className?: string
}

/**
 * The current time in a time zone, `HH:mm`, updated on the minute. Rendered
 * only in the browser: pages are cached, so a server time would be stale. The
 * server renders an invisible `00:00` of the same width (tabular figures),
 * so nothing moves when the time appears.
 *
 * @example
 * <LocalClock timeZone="Europe/Madrid" />
 */
export function LocalClock({ timeZone, showZone = true, className }: LocalClockProps) {
  const minute = useSyncExternalStore(subscribeMinutes, currentMinute, () => null)
  const clock = minute === null ? null : formatClock(minute, timeZone)

  return (
    <span className={cn('tabular-nums', className)}>
      {clock ? (
        <time dateTime={clock.time}>
          {clock.time}
          {showZone && clock.zone && ` ${clock.zone}`}
        </time>
      ) : (
        <span aria-hidden className="invisible">
          00:00
        </span>
      )}
    </span>
  )
}
