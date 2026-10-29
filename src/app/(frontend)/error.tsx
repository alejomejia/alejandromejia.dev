'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/constants/copy'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary for the public site. Catches runtime errors thrown while
 * rendering a frontend route and offers a retry. The root layout (Header,
 * Footer) stays mounted; catastrophic layout failures fall through to
 * `global-error.tsx` instead.
 */
export default function FrontendError({ error, reset }: ErrorProps) {
  const copy = COPY.error

  useEffect(() => {
    // Surface the error in the server and browser logs; an error reporter would hook in here.
    console.error(error)
  }, [error])

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-foreground/60">{copy.label}</p>
      <h1 className="text-3xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="max-w-md text-base text-foreground/70">
        {copy.text}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="solid" onClick={reset}>
          {copy.retry}
        </Button>
        <Button href="/">{copy.back}</Button>
      </div>
    </section>
  )
}
