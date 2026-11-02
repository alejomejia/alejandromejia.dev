import { SectionLabel } from '@/components/ui/section-label'

import { RecommendationQuote } from '@/app/(frontend)/_components/recommendation-quote'
import { RecommendationsSource } from '@/app/(frontend)/_components/recommendations-source'
import { findRecommendation } from '@/app/(frontend)/_components/recommendations.mock'

type WorkRecommendationProps = {
  /** The recommendation's id; an unknown one renders nothing. */
  id: string
  label: string
}

// Longer than this (about three sentences), a quote stays at body size.
const LEAD_MAX_LENGTH = 400

/**
 * One recommendation from someone on the project, in full: a step larger
 * than body text when it is short. Then where it comes from.
 */
export function WorkRecommendation({ id, label }: WorkRecommendationProps) {
  const recommendation = findRecommendation(id)
  if (!recommendation) return null

  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <RecommendationQuote
        recommendation={recommendation}

        size={recommendation.quote.length > LEAD_MAX_LENGTH ? 'body' : 'lead'}
        className="mt-pad-s"
      />
      <RecommendationsSource className="mt-pad-s" />
    </section>
  )
}
