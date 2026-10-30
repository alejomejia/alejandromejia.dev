import { UMAMI_MAX_VALUE_LENGTH } from './umami.const'
import type { UmamiEventData, UmamiEventName } from './umami.types'

type QueuedEvent = [name: string, data: Record<string, string | number | boolean>]

/**
 * Events sent before the script finished loading (a click during
 * hydration). `flushUmamiQueue` sends them once
 * it has. Capped, so a blocked script (ad blockers, tracking off) never
 * makes it grow without end.
 */
const queue: QueuedEvent[] = []
const MAX_QUEUED = 50

/**
 * Sends a custom event to Umami. Safe to call anywhere on the client: it does
 * nothing on the server, and nothing at all while tracking is off (the
 * script is only mounted when `getUmamiConfig()` allows it), apart from
 * holding a few events in a queue nobody flushes.
 *
 * @example
 * ```ts
 * track(UMAMI_EVENTS.contactEmail, { page: window.location.pathname })
 * ```
 */
export function track<Name extends UmamiEventName>(name: Name, data: UmamiEventData[Name]): void {
  if (typeof window === 'undefined') return
  const payload = clean(data)
  try {
    if (window.umami) void window.umami.track(name, payload)
    else if (queue.length < MAX_QUEUED) queue.push([name, payload])
  } catch {
    // Analytics never breaks the page.
  }
}

/** Sends what `track` queued before the script loaded. Called from the script's `onLoad`. */
export function flushUmamiQueue(): void {
  const umami = window.umami
  if (!umami) return
  for (const [name, data] of queue.splice(0)) {
    try {
      void umami.track(name, data)
    } catch {
      // Analytics never breaks the page.
    }
  }
}

// Drops empty values and trims strings to Umami's limit.
function clean(data: object): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') continue
    result[key] = typeof value === 'string' ? value.slice(0, UMAMI_MAX_VALUE_LENGTH) : value
  }
  return result
}
