import { SectionLabel } from '@/components/ui/section-label'
import type { Copy } from '@/lib/constants/copy'

import { RecommendationQuote } from './recommendation-quote'
import { RecommendationsSource } from './recommendations-source'
import type { Recommendation } from './recommendations.types'

type HomeRecommendationsProps = {
  entries: Recommendation[]
  copy: Copy['home']
}

/**
 * The featured LinkedIn recommendations, as excerpts, between hairlines, then
 * where they come from. The last section on the home page, so it has no
 * entrance (it would play off screen), like Writing and Craft.
 */
export function HomeRecommendations({ entries, copy }: HomeRecommendationsProps) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionLabel>{copy.recommendations}</SectionLabel>
      <ul className="mt-pad-s flex flex-col">
        {entries.map((recommendation) => (
          <li key={recommendation.id} className="border-t border-foreground/10 py-pad-m first:border-t-0 first:pt-0 last:pb-0">
            <RecommendationQuote recommendation={recommendation} length="excerpt" />
          </li>
        ))}
      </ul>
      <div className="mt-pad-m border-t border-foreground/10 pt-pad-s">
        <RecommendationsSource />
      </div>
    </section>
  )
}
