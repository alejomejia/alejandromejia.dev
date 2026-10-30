import { ArrowUpRight } from 'lucide-react'

import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

import { LINKEDIN_RECOMMENDATIONS_URL } from './recommendations.mock'

type RecommendationsSourceProps = {
  className?: string
}

/**
 * Where the quotes come from, under every recommendation list: a note that
 * they are copied from LinkedIn and a link to them on the profile, so a
 * visitor can check that they are real. No count: LinkedIn gets new ones
 * and the site would fall behind.
 */
export async function RecommendationsSource({ className }: RecommendationsSourceProps) {
  const copy = COPY.recommendations

  return (
    <p className={cn('text-caption text-foreground/60', className)}>
      {copy.note}{' '}
      <TextLink href={LINKEDIN_RECOMMENDATIONS_URL} newTab variant="underline" icon={<ArrowUpRight strokeWidth={1.5} />}>
        {copy.link}
      </TextLink>
    </p>
  )
}
