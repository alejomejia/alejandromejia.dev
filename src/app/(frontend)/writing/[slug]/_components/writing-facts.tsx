import { storyReadingMinutes } from '@/components/story/story.utils'
import type { Copy } from '@/lib/constants/copy'
import { formatDate, formatMessage } from '@/lib/utils'

import type { WritingEntry } from '@/app/(frontend)/writing/_components/writing.types'

type WritingFactsProps = {
  entry: WritingEntry
  copy: Copy['writing']
}

/**
 * The article's facts under a hairline, laid out like a case study's:
 * published, updated (once it falls on a different day), reading time and
 * topics. Labels in mono at `/40`, values in caption text.
 */
export function WritingFacts({ entry, copy }: WritingFactsProps) {
  const published = formatDate(entry.publishedAt)
  const updated = entry.updatedAt && formatDate(entry.updatedAt)

  const facts = [
    { label: copy.published, value: <time dateTime={entry.publishedAt}>{published}</time> },
    // A visible "updated" date backs up JSON-LD `dateModified`; search and AI
    // engines favor content that is demonstrably fresh.
    {
      label: copy.updated,
      value: updated && updated !== published && <time dateTime={entry.updatedAt}>{updated}</time>,
    },
    { label: copy.readingTime, value: formatMessage(copy.minutes, { minutes: storyReadingMinutes(entry.content) }) },
    { label: copy.topics, value: entry.topics.join(', ') },
  ].filter((fact) => fact.value)

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-pad-s border-t border-foreground/10 pt-pad-s sm:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label} className="flex flex-col gap-1">
          <dt className="font-mono text-micro text-foreground/40">{fact.label}</dt>
          <dd className="text-caption text-pretty">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}
