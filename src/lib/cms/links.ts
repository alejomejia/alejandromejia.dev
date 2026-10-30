import { documentPath, type RoutableCollection } from '@/lib/seo/seo.utils'

/** A link authored with the `link()` field: an internal document reference or a custom URL. */
export type CMSLinkData = {
  type?: 'custom' | 'reference' | null
  url?: string | null
  reference?: {
    relationTo: RoutableCollection
    value: { slug?: string | null } | string | number
  } | null
}

/** A resolved link, ready to render (and to pass to Client Components). */
export type NavLink = {
  label: string
  href: string
  newTab?: boolean
}

/**
 * Public href of a CMS link. `null` when it can't be resolved: an empty URL,
 * or a reference that is still an id (read it with `depth >= 1`).
 */
export function cmsLinkHref({ type, url, reference }: CMSLinkData): string | null {
  if (type !== 'reference') return url?.trim() || null
  const value = reference?.value
  if (typeof value !== 'object' || !value?.slug) return null
  return documentPath(reference!.relationTo, value.slug)
}

/** What the `link()` field stores, label and new-tab switch included. */
export type CMSLinkValue = CMSLinkData & { label?: string | null; newTab?: boolean | null }

/**
 * Resolves a `link()` field to a label and a plain href, so Client Components
 * receive a few strings instead of populated documents. `null` when it has no
 * label or its destination can't be resolved.
 */
export function cmsNavLink(link: CMSLinkValue | null | undefined): NavLink | null {
  const href = link && cmsLinkHref(link)
  return href && link.label ? { label: link.label, href, newTab: link.newTab ?? undefined } : null
}

/** Resolves a labeled `optionalLink()`: `null` while it is switched off or can't be rendered. */
export function cmsOptionalNavLink({ enableLink, link }: { enableLink?: boolean | null; link?: CMSLinkValue | null }) {
  return enableLink ? cmsNavLink(link) : null
}
