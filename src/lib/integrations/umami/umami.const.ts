/**
 * Every custom event the site sends to Umami, by name. Pageviews (and the UTM
 * tags on them) are tracked by the script itself; these cover what a pageview
 * can't tell: who got in touch and where visitors went next. Each event's
 * properties are typed in `UmamiEventData` (umami.types.ts).
 */
export const UMAMI_EVENTS = {
  contactEmail: 'contact_email',
  outboundLink: 'outbound_link',
} as const

/** Umami caps event names at 50 characters and string property values at 500. */
export const UMAMI_MAX_VALUE_LENGTH = 500

/**
 * Put on a link (or around it) that tracks its own event, so the layout's
 * link tracker doesn't count it a second time.
 */
export const UMAMI_IGNORE_ATTRIBUTE = 'data-track-ignore'

/** The tracker script: the site reports to Umami Cloud. */
export const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js'
