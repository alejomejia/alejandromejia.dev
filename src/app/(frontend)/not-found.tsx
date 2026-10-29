import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/constants/copy'

export async function generateMetadata(): Promise<Metadata> {
  return { title: COPY.notFound.title }
}

/**
 * 404 page for the public site. Rendered by Next whenever a route is missing or
 * a page calls `notFound()` (e.g. `PayloadRedirects` for an unknown URL). Sits
 * inside the frontend layout, so the Header and Footer still wrap it.
 */
export default async function NotFound() {

  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-foreground/60">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">{COPY.notFound.title}</h1>
      <p className="max-w-md text-base text-foreground/70">
        {COPY.notFound.text}
      </p>
      <Button href="/" variant="solid">
        {COPY.notFound.back}
      </Button>
    </section>
  )
}
