import { storyReadingMinutes } from '@/components/story/story.utils'
import type { Copy } from '@/lib/constants/copy'
import { formatDate, formatMessage } from '@/lib/utils'

import { type PageFact, PageFacts } from '@/app/(frontend)/_components/page-facts'
import type { WritingEntry } from '@/app/(frontend)/writing/_components/writing.types'

type WritingFactsProps = {
  entry: WritingEntry
  copy: Copy['writing']
}

/**
 * The article's facts under a hairline, laid out like a case study's:
 * published, updated (once it falls on a different day), reading time and
 * topics. Labels in mono at `text-subtle`, values in caption text.
 */
export function WritingFacts({ entry, copy }: WritingFactsProps) {
  const published = formatDate(entry.publishedAt)
  const updated = entry.updatedAt && formatDate(entry.updatedAt)

  const facts: PageFact[] = [
    { label: copy.published, value: <time dateTime={entry.publishedAt}>{published}</time> },
    // A visible "updated" date backs up JSON-LD `dateModified`; search and AI
    // engines favor content that is demonstrably fresh.
    {
      label: copy.updated,
      value: updated && updated !== published && <time dateTime={entry.updatedAt}>{updated}</time>,
    },
    { label: copy.readingTime, value: formatMessage(copy.minutes, { minutes: storyReadingMinutes(entry.content) }) },
    { label: copy.topics, value: entry.topics.join(', ') },
  ]

  return <PageFacts facts={facts} />
}
