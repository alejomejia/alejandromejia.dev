'use client'

import { useEffect } from 'react'

import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'

import { SectionLinks } from './_components/section-links'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary for the public site. Catches runtime errors thrown while
 * rendering a frontend route and offers a retry. The root layout (the
 * sidebar) stays mounted; catastrophic layout failures fall through to
 * `global-error.tsx` instead. Laid out like the 404: a mono label, the
 * `<h1>`, one sentence with the retry and the way home, then the sections.
 */
export default function FrontendError({ error, reset }: ErrorProps) {
  const copy = COPY.error

  useEffect(() => {
    // Surface the error in the server and browser logs; an error reporter would hook in here.
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col gap-pad-2xl">
      <header className="flex flex-col gap-pad-xs">
        <p className="font-mono text-micro text-subtle">{copy.label}</p>
        <h1 className="text-display-s font-medium tracking-tight text-balance">{copy.title}</h1>
        <p className="text-pretty text-muted">
          {copy.text}{' '}
          <TextLink onClick={reset} variant="underline">
            {copy.retry}
          </TextLink>
          , {copy.or}{' '}
          <TextLink href={SITE_ROUTES.home} variant="underline">
            {copy.home}
          </TextLink>
          .
        </p>
      </header>
      <SectionLinks label={COPY.notFound.sections} />
    </div>
  )
}
