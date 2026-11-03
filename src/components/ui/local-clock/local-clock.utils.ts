const SECOND = 1000
const MINUTE = 60_000

/**
 * A subscription that calls `onTick` at the start of every `unit` (ms), and
 * when the tab comes back into view (timers are throttled while it is
 * hidden). Shaped for `useSyncExternalStore`.
 */
function tickEvery(unit: number) {
  return function subscribe(onTick: () => void): () => void {
    let timer: ReturnType<typeof setTimeout>

    function schedule() {
      // A few ms past the boundary, so the new unit has surely started.
      timer = setTimeout(
        () => {
          onTick()
          schedule()
        },
        unit - (Date.now() % unit) + 20,
      )
    }

    function handleVisibility() {
      if (document.visibilityState !== 'visible') return
      clearTimeout(timer)
      onTick()
      schedule()
    }

    schedule()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }
}

/** Ticks at the start of every minute. */
export const subscribeMinutes = tickEvery(MINUTE)

/** Ticks at the start of every second. */
export const subscribeSeconds = tickEvery(SECOND)

/** Now, rounded down to the minute (ms): a snapshot that only changes once a minute. */
export function currentMinute(): number {
  return Math.floor(Date.now() / MINUTE) * MINUTE
}

/** Now, rounded down to the second (ms): a snapshot that only changes once a second. */
export function currentSecond(): number {
  return Math.floor(Date.now() / SECOND) * SECOND
}

/**
 * The time at `timestamp` (ms) in `timeZone` as 24-hour `HH:mm`, or
 * `HH:mm:ss` with `showSeconds`, and the zone's short name (`CET`, `CEST`).
 * `null` for a zone the browser doesn't know.
 */
export function formatClock(
  timestamp: number,
  timeZone: string,
  showSeconds = false,
): { time: string; zone: string } | null {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds && { second: '2-digit' }),
      hourCycle: 'h23',
      timeZoneName: 'short',
      timeZone,
    }).formatToParts(new Date(timestamp))
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
    const time = [part('hour'), part('minute'), ...(showSeconds ? [part('second')] : [])].join(':')
    return { time, zone: part('timeZoneName') }
  } catch {
    return null
  }
}
