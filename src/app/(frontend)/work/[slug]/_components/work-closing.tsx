import { SectionLabel } from '@/components/ui/section-label'
import type { Copy } from '@/lib/constants/copy'

import type { WorkEntry } from '@/app/(frontend)/work/_components/work.types'
import { WorkRecommendation } from './work-recommendation'

/**
 * How a case study ends, on its last page (the overview, or the last
 * chapter): what I'd do differently, then a recommendation from the team.
 */
export function WorkClosing({ work, copy }: { work: WorkEntry; copy: Copy['work'] }) {
  return (
    <>
      {work.retrospective && (
        <section>
          <SectionLabel>{copy.retrospective}</SectionLabel>
          <p className="mt-pad-s text-pretty text-foreground/80">{work.retrospective}</p>
        </section>
      )}
      {work.recommendation && <WorkRecommendation id={work.recommendation} label={copy.recommendation} />}
    </>
  )
}
