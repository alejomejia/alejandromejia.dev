import { ArrowUpRight } from 'lucide-react'

import { TextLink } from '@/components/ui/text-link'
import type { Copy } from '@/lib/constants/copy'
import { formatMonth } from '@/lib/utils'

import type { WorkEntry } from '@/app/(frontend)/work/_components/work.types'

type WorkFactsProps = {
  work: WorkEntry
  copy: Copy['work']
}

/**
 * The case study's facts under a hairline: role, client (left out when the
 * project is confidential), timeline and stack, then team and the live link
 * when there are any. Labels in mono at `/40`, values in caption text.
 */
export function WorkFacts({ work, copy }: WorkFactsProps) {
  const timeline = `${formatMonth(work.startDate)} – ${work.endDate ? formatMonth(work.endDate) : copy.present}`
  const facts = [
    { label: copy.role, value: work.role },
    { label: copy.client, value: work.confidential ? undefined : work.client },
    { label: copy.timeline, value: timeline },
    { label: copy.stack, value: work.stack.join(', ') },
    { label: copy.team, value: work.team },
    {
      label: copy.live,
      value: work.liveUrl && (
        <TextLink href={work.liveUrl} newTab className="inline-flex items-center gap-1">
          {new URL(work.liveUrl).hostname}
          <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5" />
        </TextLink>
      ),
    },
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
