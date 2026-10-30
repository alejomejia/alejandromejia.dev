import { notFound, redirect } from 'next/navigation'

import { getCachedDocument, getCachedRedirects } from '@/lib/cms/redirects.server'
import { documentPath, type RoutableCollection } from '@/lib/seo/seo.utils'

type Props = {
  url: string
  /** When true, resolves redirects but renders nothing instead of a 404. */
  disableNotFound?: boolean
}

/**
 * SSR redirect resolver. Looks up a managed redirect for `url` and issues it;
 * otherwise renders nothing (or a 404 when `disableNotFound` is not set).
 * Render it on a page that may be a valid redirect source.
 */
export async function PayloadRedirects({ url, disableNotFound }: Props) {
  const redirects = await getCachedRedirects()()
  const item = redirects.find((entry) => entry.from === url)

  if (item) {
    if (item.to?.url) redirect(item.to.url)

    const reference = item.to?.reference
    if (reference) {
      const doc: { slug?: string | null } | null =
        typeof reference.value === 'object'
          ? reference.value
          : ((await getCachedDocument(reference.relationTo, reference.value)()) as { slug?: string | null })

      if (doc?.slug) {
        redirect(documentPath(reference.relationTo as RoutableCollection, doc.slug))
      }
    }
  }

  if (disableNotFound) return null

  notFound()
}
