import { s3Storage } from '@payloadcms/storage-s3'
import type { Field, Plugin } from 'payload'

import { withProtocol } from '@/lib/utils'

/**
 * True when every Cloudflare R2 credential is present. When false the plugin
 * stays disabled and Media falls back to local disk (`public/media`), so a fresh
 * clone runs with `pnpm dev` without any storage setup.
 */
export const isR2Configured = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY,
)

// Files live under this key prefix inside the bucket. The bucket is shared, so
// each environment gets its own folder via `R2_MEDIA_PREFIX`. The fallback is
// the local folder, so a machine missing the var can never write into prod's.
// Surrounding slashes are trimmed: R2 would treat them as empty path segments.
export const MEDIA_PREFIX = (process.env.R2_MEDIA_PREFIX || 'website/cms/local').replace(/^\/+|\/+$/g, '')

/**
 * The Media `prefix` field, declared up front so its default (this
 * environment's folder) is a function. Left to the plugin, it gets a static
 * default, which Postgres stores as the column default: every environment
 * would then generate migrations with its own folder baked in. Function
 * defaults stay out of the schema. The plugin merges its hooks into this field.
 */
export const mediaPrefixField: Field = {
  name: 'prefix',
  type: 'text',
  defaultValue: () => MEDIA_PREFIX,
  admin: {
    hidden: true,
    readOnly: true,
  },
}

/**
 * Cloudflare R2 storage for the Media collection. R2 speaks the S3 API, so the
 * official S3 adapter drives it with `region: 'auto'` and an R2 endpoint.
 *
 * Set `R2_PUBLIC_URL` to serve files straight from a public R2 domain (r2.dev or
 * a custom domain); otherwise Payload proxies them through its own route.
 *
 * `alwaysInsertFields` keeps the DB schema identical whether or not R2 is
 * configured, so Postgres migrations match across local, CI, and production.
 */
const r2Collection = {
  prefix: MEDIA_PREFIX,
  // With a public bucket, hand out direct URLs and skip Payload's proxy.
  ...(process.env.R2_PUBLIC_URL
    ? {
        disablePayloadAccessControl: true as const,
        generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) => {
          // Without a protocol the browser would read the domain as a relative path.
          const base = withProtocol(process.env.R2_PUBLIC_URL!).replace(/\/$/, '')
          return [base, prefix, filename].filter(Boolean).join('/')
        },
      }
    : {}),
}

export const storagePlugin: Plugin = s3Storage({
  enabled: isR2Configured,
  alwaysInsertFields: true,
  // Documents (the CV PDF) share Media's folder and settings.
  collections: { media: r2Collection, documents: r2Collection },
  bucket: process.env.R2_BUCKET || '',
  config: {
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
    // R2 requires path-style addressing (bucket in the path, not the host).
    forcePathStyle: true,
  },
})
