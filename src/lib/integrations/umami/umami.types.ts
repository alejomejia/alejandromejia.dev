import type { UMAMI_EVENTS } from './umami.const'

/** An event name from `UMAMI_EVENTS`. */
export type UmamiEventName = (typeof UMAMI_EVENTS)[keyof typeof UMAMI_EVENTS]

/** The properties each event carries. */
export type UmamiEventData = {
  contact_email: { page: string }
  outbound_link: { page: string; host: string; url: string }
}

/** What the layout needs to load the tracker: the script and the site it reports to. */
export type UmamiConfig = {
  /** The tracker script (Umami Cloud's). */
  scriptUrl: string
  websiteId: string
  /** Comma-separated hostnames the script may report from (`data-domains`); empty: any. */
  domains: string
}

/** The tracker's global, once its script has loaded. */
export type UmamiTracker = {
  track: (event: string, data?: Record<string, string | number | boolean>) => Promise<unknown> | void
}

declare global {
  interface Window {
    umami?: UmamiTracker
  }
}
