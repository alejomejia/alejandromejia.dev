import type { CollectionConfig, ImageUploadFormatOptions } from 'payload'

import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { ADMIN_GROUPS } from '@/payload/admin-nav'
import { admins, anyone, authenticated } from '@/payload/access'
import { clearMediaUsageAfterDelete, guardMediaDelete } from '@/payload/hooks/guard-media-delete'
import { MEDIA_LIMITS, cleanUpMediaUpload, processMediaUpload } from '@/payload/hooks/process-media-upload'
import { siteRevalidateHooks } from '@/payload/hooks/revalidate'
import { mediaPrefixField } from '@/payload/plugins/storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Image sizes are served as is (posters, admin thumbnails), so they get a
// regular web quality. Each size sets its own format, or it keeps the uploaded one.
const WEBP_SIZE = { format: 'webp', options: { quality: 85 } } satisfies ImageUploadFormatOptions

/**
 * Media library. Uploads land in `public/media` so they are served statically
 * by Next.js. Image sizes cover the common responsive + Open Graph needs.
 *
 * Images are stored as WebP (`resizeOptions` and `formatOptions` below) and
 * videos as silent H.264 MP4 ({@link processMediaUpload}), both capped to the
 * largest size the site can use.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: authenticated,
    update: authenticated,
    delete: admins,
    read: anyone,
  },
  admin: {
    group: ADMIN_GROUPS.media,
    // Replacing keeps the document (its id, alt text and caption), so every
    // page using it shows the new file once Payload saves it and the
    // revalidate hooks below refresh the site. The old file and its sizes are deleted.
    components: {
      // How many files nothing uses, with a link that filters the list to them.
      beforeListTable: ['@/payload/components/unused-media-banner#UnusedMediaBanner'],
    },
    description: `Images up to ${MEDIA_LIMITS.imageBytes / 1024 / 1024} MB, saved as WebP. Videos up to ${MEDIA_LIMITS.videoSeconds} seconds and ${MEDIA_LIMITS.videoBytes / 1024 / 1024} MB, saved as MP4 without sound. To replace a file everywhere it is used, open it, click × on the current file, drop the new one and save: alt text and caption stay.`,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text',
      admin: {
        description:
          'Describes the image for screen readers and search engines. Leave it empty only for decorative images.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        // Videos only; their mime type is known once the file is saved.
        condition: (data) => Boolean(data?.mimeType?.startsWith('video/')),
        description:
          "Generated automatically from the video's first frame when it uploads. Upload or pick another image to replace it. Shown while the video loads and to visitors who turn off motion.",
      },
    },
    {
      name: 'caption',
      type: 'richText',
      admin: {
        description: 'Optional. Shown under the image where the design displays captions.',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()],
      }),
    },
    {
      name: 'usage',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '@/payload/components/media-usage-field#MediaUsageField' },
      },
    },
    mediaPrefixField,
    // Payload's own field, merged by name: only its list cell changes, from raw bytes to KB/MB.
    {
      name: 'filesize',
      type: 'number',
      admin: {
        components: { Cell: '@/payload/components/file-size-cell#FileSizeCell' },
      },
    },
  ],
  upload: {
    // `dirname` is src/payload/collections, so climb three levels to reach public/media.
    staticDir: path.resolve(dirname, '../../../public/media'),
    // The `thumbnail` size's own URL. Given the size name instead, Payload builds
    // a `/api/media/file/…` URL, which fails with R2 public URLs (that route is
    // off), so the list showed a file icon. Videos have no sizes: they keep it.
    adminThumbnail: ({ doc }) => {
      const sizes = doc.sizes as { thumbnail?: { url?: string | null } } | undefined
      return sizes?.thumbnail?.url || null
    },
    // Images and videos only: the file dialog and drop zone hide everything
    // else, and the server rejects it. Payload has no per-field file types, so
    // this is collection-wide; documents such as PDFs would need their own
    // upload collection.
    mimeTypes: ['image/*', 'video/*'],
    focalPoint: true,
    // Payload's crop tool crops the raw upload, skipping the WebP conversion and
    // the size cap. The focal point covers framing.
    crop: false,
    // The original fits in 3840px (full-bleed heroes on 4K and retina screens)
    // and is never upscaled. It is the master next/image re-encodes for each
    // visitor, so quality 90 leaves headroom for that second compression.
    resizeOptions: { width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 90 } },
    imageSizes: [
      { name: 'thumbnail', width: 300, formatOptions: WEBP_SIZE },
      { name: 'square', width: 500, height: 500, formatOptions: WEBP_SIZE },
      { name: 'small', width: 600, formatOptions: WEBP_SIZE },
      { name: 'medium', width: 900, formatOptions: WEBP_SIZE },
      { name: 'large', width: 1400, formatOptions: WEBP_SIZE },
      { name: 'xlarge', width: 1920, formatOptions: WEBP_SIZE },
      // JPEG: link-preview scrapers support it everywhere, WebP not yet.
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: { format: 'jpeg', options: { quality: 85, mozjpeg: true } },
      },
    ],
  },
  hooks: {
    // Cached pages embed image URLs and alt text; a replaced file would otherwise
    // leave them pointing at a deleted object.
    ...siteRevalidateHooks,
    // A file still shown somewhere can't be deleted; see guardMediaDelete.
    beforeDelete: [guardMediaDelete],
    afterDelete: [...siteRevalidateHooks.afterDelete, clearMediaUsageAfterDelete],
    beforeOperation: [processMediaUpload],
    afterOperation: [cleanUpMediaUpload],
  },
}
