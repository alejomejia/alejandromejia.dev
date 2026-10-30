import { cn, formatMonth } from '@/lib/utils'

import type { Recommendation } from './recommendations.types'

type RecommendationQuoteProps = {
  recommendation: Recommendation
  /** `excerpt` (compact places such as the home page) or the whole quote. */
  length?: 'excerpt' | 'full'
  /** `lead` sets the quote one step larger, for a single one at the end of a case study. */
  size?: 'body' | 'lead'
  className?: string
}

/**
 * A LinkedIn recommendation, word for word: the quote, then who wrote it:
 * their name, their role and company, and how we worked together with the
 * date, in mono.
 */
export function RecommendationQuote({
  recommendation,
  length = 'full',
  size = 'body',
  className,
}: RecommendationQuoteProps) {
  const text = length === 'excerpt' && recommendation.excerpt ? recommendation.excerpt : recommendation.quote
  const meta = [recommendation.relationship, formatMonth(recommendation.date)].filter(Boolean).join(' · ')

  return (
    <figure className={cn('flex flex-col gap-pad-s', className)}>
      <blockquote className={cn('flex flex-col gap-pad-xs text-pretty', size === 'lead' ? 'text-lead' : 'text-foreground/80')}>
        {text.split('\n\n').map((paragraph, index, paragraphs) => (
          <p key={index}>
            {index === 0 && '“'}
            {paragraph}
            {index === paragraphs.length - 1 && '”'}
          </p>
        ))}
      </blockquote>
      <figcaption className="flex gap-4 text-caption">
        <span className="flex min-w-0 flex-col">
          <span>{recommendation.name}</span>
          <span className="text-foreground/60">
            {recommendation.role}
            {recommendation.company && `, ${recommendation.company}`}
          </span>
        </span>
        <span className="ml-auto self-start font-mono text-micro whitespace-nowrap text-foreground/40 max-sm:hidden">{meta}</span>
      </figcaption>
      <p className="font-mono text-micro text-foreground/40 sm:hidden">{meta}</p>
    </figure>
  )
}
