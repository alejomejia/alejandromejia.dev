import 'server-only'

import { cache } from 'react'

import type { Profile } from '@/payload-types'

import { getCachedGlobal } from './globals.server'

/** The Profile global's Intro tab, resolved for the header, footer and home page. Empty fields are `null`. */
export type ProfileIntro = {
  name: string
  headline: string
  intro: string
  /** "Open to work": shows the availability dot. */
  available: boolean
  /** The status line, e.g. "Open to senior design engineer roles, remote". */
  availability: string | null
  location: string | null
  /** IANA time zone (`Europe/Madrid`) for the footer clock. */
  timezone: string | null
}

/**
 * Reads the Profile global's intro.
 * Cached across requests under the global's tag, and once per request, so the
 * header and footer share one read.
 */
export const queryProfileIntro = cache(async function queryProfileIntro(): Promise<ProfileIntro> {
  const profile = await getCachedGlobal('profile')()

  return {
    name: profile.name,
    headline: profile.headline,
    intro: profile.intro,
    available: Boolean(profile.available),
    availability: profile.availability?.trim() || null,
    location: profile.location?.trim() || null,
    timezone: profile.timezone?.trim() || null,
  }
})

/**
 * Reads the whole Profile global, for
 * surfaces that describe the person in full, like the `Person` JSON-LD.
 * Shares the cached read with {@link queryProfileIntro}.
 */
export const queryProfile = cache(async function queryProfile(): Promise<Profile> {
  return getCachedGlobal('profile')()
})
