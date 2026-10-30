import type { CollectionConfig } from 'payload'

import path from 'path'
import { fileURLToPath } from 'url'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, anyone, authenticated } from '@/payload/access'
import { siteRevalidateHooks } from '@/payload/hooks/revalidate'
import { mediaPrefixField } from '@/payload/plugins/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * PDFs visitors can download, such as the CV. Media takes images and videos
 * only (Payload sets file types per collection), so documents live here.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Document', plural: 'Documents' },
  // `Document` would shadow the DOM type wherever it's imported.
  typescript: { interface: 'DocumentFile' },
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: anyone,
  },
  admin: {
    group: ADMIN_GROUPS.media,
    description: 'PDFs, such as the CV. Leave personal details you don’t want public (like a phone number) out of the file.',
  },
  fields: [mediaPrefixField],
  upload: {
    // `dirname` is src/payload/collections, so climb three levels to reach public/documents.
    staticDir: path.resolve(dirname, '../../../public/documents'),
    mimeTypes: ['application/pdf'],
  },
  hooks: siteRevalidateHooks,
}
