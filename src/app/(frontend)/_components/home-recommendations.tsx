import { SectionLabel } from '@/components/ui/section-label'
import type { Copy } from '@/lib/constants/copy'

import { RecommendationsList } from './recommendations-list'
import type { Recommendation } from './recommendations.types'

type HomeRecommendationsProps = {
  entries: Recommendation[]
  copy: Copy['home']
}

/**
 * The featured LinkedIn recommendations. The last section on the home page,
 * so it has no entrance (it would play off screen), like Writing and Craft.
 */
export function HomeRecommendations({ entries, copy }: HomeRecommendationsProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel>{copy.recommendations}</SectionLabel>
      <div className="mt-pad-s">
        <RecommendationsList entries={entries} />
      </div>
    </section>
  )
}
