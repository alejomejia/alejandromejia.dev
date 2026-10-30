import { RecommendationQuote } from './recommendation-quote'
import { RecommendationsSource } from './recommendations-source'
import type { Recommendation } from './recommendations.types'

/**
 * Recommendations as excerpts between hairlines, then where they come from
 * (with the link to all of them on LinkedIn). The home page and the CV show
 * the same featured few.
 */
export function RecommendationsList({ entries }: { entries: Recommendation[] }) {
  return (
    <>
      <ul className="flex flex-col">
        {entries.map((recommendation) => (
          <li key={recommendation.id} className="border-t border-foreground/10 py-pad-m first:border-t-0 first:pt-0 last:pb-0">
            <RecommendationQuote recommendation={recommendation} length="excerpt" />
          </li>
        ))}
      </ul>
      <div className="mt-pad-m border-t border-foreground/10 pt-pad-s">
        <RecommendationsSource />
      </div>
    </>
  )
}
