import type { Field, Plugin } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { ADMIN_GROUPS, adminNavOrderPlugin } from '@/payload/admin-nav'
import { siteRevalidateHooks } from '@/payload/hooks/revalidate'
import { storagePlugin } from '@/payload/plugins/storage'
import { getServerSideURL } from '@/lib/utils'
import { absoluteURL, documentPath, ROUTABLE_COLLECTIONS, type RoutableCollection } from '@/lib/seo/seo.utils'
import type { Craft, Work, Writing } from '@/payload-types'

type RoutableDoc = Writing | Work | Craft

// Bare title on purpose: the frontend layout's title template appends the site
// name, so baking it in here would brand the <title> twice.
const generateTitle: GenerateTitle<RoutableDoc> = function generateTitle({ doc }) {
  return doc?.title ?? ''
}

// Powers the search-result preview in the SEO tab, so it must mirror the real routes.
const generateURL: GenerateURL<RoutableDoc> = function generateURL({ doc, collectionSlug }) {
  if (!doc?.slug) return getServerSideURL()
  return absoluteURL(documentPath(collectionSlug as RoutableCollection, doc.slug))
}

/**
 * Swaps the SEO tab's preview for our own (`SeoPreview`): the plugin's posts
 * the whole form state to its URL endpoint and crashes on documents with
 * labelled arrays, as it can't serialize their rendered row labels.
 */
function withSafePreview(field: Field): Field {
  if (!('name' in field) || field.name !== 'preview' || field.type !== 'ui') return field
  return { ...field, admin: { ...field.admin, components: { Field: '@/payload/components/seo-preview#SeoPreview' } } }
}

/**
 * Shared Payload plugins. SEO adds a meta tab (title/description/OG image) to
 * every collection with its own page; Redirects lets editors manage 301s in the admin; Storage
 * ships Media uploads to Cloudflare R2 when configured. The admin nav plugin
 * runs last so it can order the collections the others added.
 */
export const plugins: Plugin[] = [
  storagePlugin,
  seoPlugin({
    collections: ROUTABLE_COLLECTIONS,
    uploadsCollection: 'media',
    tabbedUI: true,
    generateTitle,
    generateURL,
    fields: ({ defaultFields }) => defaultFields.map(withSafePreview),
  }),
  redirectsPlugin({
    collections: ROUTABLE_COLLECTIONS,
    overrides: {
      admin: { group: ADMIN_GROUPS.site },
      // Every page render resolves redirects, so a rule change refreshes the site.
      hooks: siteRevalidateHooks,
    },
  }),
  adminNavOrderPlugin,
]
