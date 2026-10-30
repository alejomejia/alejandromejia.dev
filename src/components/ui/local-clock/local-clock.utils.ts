const MINUTE = 60_000

/**
 * Calls `onTick` at the start of every minute, and when the tab comes back
 * into view (timers are throttled while it is hidden). Shaped for
 * `useSyncExternalStore`.
 */
export function subscribeMinutes(onTick: () => void): () => void {
  let timer: ReturnType<typeof setTimeout>

  function schedule() {
    // A few ms past the boundary, so the new minute has surely started.
    timer = setTimeout(
      () => {
        onTick()
        schedule()
      },
      MINUTE - (Date.now() % MINUTE) + 20,
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

/** The current minute since the epoch: a snapshot that only changes once a minute. */
export function currentMinute(): number {
  return Math.floor(Date.now() / MINUTE)
}

/**
 * The time at `minute` in `timeZone` as 24-hour `HH:mm`, and the zone's short
 * name (`CET`, `CEST`). `null` for a zone the browser doesn't know.
 */
export function formatClock(minute: number, timeZone: string): { time: string; zone: string } | null {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'short',
      timeZone,
    }).formatToParts(new Date(minute * MINUTE))
    const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
    return { time: `${part('hour')}:${part('minute')}`, zone: part('timeZoneName') }
  } catch {
    return null
  }
}
