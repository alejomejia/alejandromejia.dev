import type { Metadata } from 'next'

import { WritingArchive } from './_components/writing-archive'
import { COPY } from '@/lib/constants/copy'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = buildMetadata({ title: COPY.writing.title, path: '/writing' })

// Rendered per request: a build-time copy would need the database during the
// Docker build, and no publish hook revalidates the archive.
export const dynamic = 'force-dynamic'

/** Writing archive: first page of published entries. */
export default function WritingPage() {
  return <WritingArchive page={1} />
}
