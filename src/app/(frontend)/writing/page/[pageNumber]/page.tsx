import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WritingArchive } from '@/app/(frontend)/writing/_components/writing-archive'
import { COPY } from '@/lib/constants/copy'
import { buildMetadata } from '@/lib/seo/metadata'
import { formatMessage } from '@/lib/utils'

// Archive pages 2..N (page 1 lives at /writing), rendered per request like
// /writing: every publish shifts entries between pages.
export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ pageNumber?: string }>
}

export default async function WritingArchivePage({ params }: Args) {
  const { pageNumber } = await params
  const page = Number(pageNumber)

  if (!Number.isInteger(page) || page < 1) notFound()

  return <WritingArchive page={page} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { pageNumber } = await params
  // Each archive page is its own canonical (Google no longer uses rel=prev/next).
  return buildMetadata({
    title: formatMessage(COPY.writing.pageTitle, { page: pageNumber ?? '' }),
    path: `/writing/page/${pageNumber}`,
  })
}
