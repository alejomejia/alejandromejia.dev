import { SectionLabel } from '@/components/ui/section-label'
import type { Copy } from '@/lib/constants/copy'

import { RecommendationsList } from './recommendations-list'
import type { Recommendation } from './recommendations.types'

type HomeRecommendationsProps = {
  entries: Recommendation[]
  copy: Copy['home']
  enterFrom: number
}

/** The featured LinkedIn recommendations, last on the home page. The label enters at `enterFrom`, then each quote. */
export function HomeRecommendations({ entries, copy, enterFrom }: HomeRecommendationsProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel enterStep={enterFrom}>{copy.recommendations}</SectionLabel>
      <div className="mt-pad-s">
        <RecommendationsList entries={entries} enterFrom={enterFrom + 1} />
      </div>
    </section>
  )
}
