import { enter } from '@/lib/utils'

import { RecommendationQuote } from './recommendation-quote'
import { RecommendationsSource } from './recommendations-source'
import type { Recommendation } from './recommendations.types'

/**
 * Recommendations as excerpts between hairlines, then where they come from
 * (with the link to all of them on LinkedIn). The home page and the CV show
 * the same featured few. With `enterFrom`, each quote enters in turn, then the source.
 */
export function RecommendationsList({ entries, enterFrom }: { entries: Recommendation[]; enterFrom?: number }) {
  // Without a step (below the fold, as on the CV), the items get only their classes.
  function props(step: number, className: string) {
    return enterFrom === undefined ? { className } : enter(enterFrom + step, className)
  }

  return (
    <>
      <ul className="flex flex-col">
        {entries.map((recommendation, index) => (
          <li
            key={recommendation.id}
            {...props(index, 'border-t border-foreground/10 py-pad-m first:border-t-0 first:pt-0 last:pb-0')}
          >
            <RecommendationQuote recommendation={recommendation} length="excerpt" />
          </li>
        ))}
      </ul>
      <div {...props(entries.length, 'mt-pad-m border-t border-foreground/10 pt-pad-s')}>
        <RecommendationsSource />
      </div>
    </>
  )
}
