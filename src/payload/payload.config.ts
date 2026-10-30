import { postgresAdapter } from '@payloadcms/db-postgres'
import os from 'os'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Craft } from './collections/craft'
import { Documents } from './collections/documents'
import { Media } from './collections/media'
import { Recommendations } from './collections/recommendations'
import { Topics } from './collections/topics'
import { Users } from './collections/users'
import { Work } from './collections/work'
import { Writing } from './collections/writing'
import { Footer } from './globals/footer/footer.config'
import { Header } from './globals/header/header.config'
import { Profile } from './globals/profile/profile.config'
import { SiteSettings } from './globals/site-settings/site-settings.config'
import { defaultLexical } from './fields/default-lexical'
import { MEDIA_LIMITS } from './hooks/process-media-upload'
import { plugins } from './plugins'
import { getServerSideURL } from '@/lib/utils'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    // Resolve admin component paths (@/…) and the generated import map from src/.
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // Keep generated migrations alongside the rest of the CMS config, under
    // src/payload/migrations. Resolved from this config (not Payload's default
    // src/migrations) so the CLI and the runtime agree regardless of the working
    // directory (host, Docker build, or standalone runner).
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  collections: [Work, Writing, Craft, Recommendations, Topics, Media, Documents, Users],
  globals: [Profile, SiteSettings, Header, Footer],
  plugins,
  cors: [getServerSideURL()].filter(Boolean),
  // Nothing here uses GraphQL, and it would hand anyone every published document in one query.
  graphQL: { disable: true },
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  upload: {
    // Uploads stream to disk instead of memory, which matters for videos.
    // Media's cleanUpMediaUpload hook deletes the temp files afterwards.
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
    // Payload's defaults (20 MB a file, 50 MB a request) are below the video
    // limit. The Media upload hook enforces the smaller image limit.
    limits: { fileSize: MEDIA_LIMITS.videoBytes },
    // Room for the form fields sent along with the file.
    requestSizeLimit: MEDIA_LIMITS.videoBytes + 2 * 1024 * 1024,
    responseOnLimit: `Videos can be up to ${MEDIA_LIMITS.videoBytes / 1024 / 1024} MB and images up to ${MEDIA_LIMITS.imageBytes / 1024 / 1024} MB.`,
  },
  typescript: {
    // Emit types to src/payload-types.ts so `@/payload-types` resolves.
    outputFile: path.resolve(dirname, '../payload-types.ts'),
  },
})
