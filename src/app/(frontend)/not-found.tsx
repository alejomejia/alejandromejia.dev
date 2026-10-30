import type { Metadata } from 'next'

import { CommandMenuLink } from '@/components/layout/command-menu'
import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { enter } from '@/lib/utils'

import { SectionLinks } from './_components/section-links'

export async function generateMetadata(): Promise<Metadata> {
  return { title: COPY.notFound.title }
}

/**
 * 404 page for the public site. Rendered by Next whenever a route is missing or
 * a page calls `notFound()` (e.g. `PayloadRedirects` for an unknown URL). Sits
 * inside the frontend layout, so the sidebar still frames it. Laid out like
 * any inner page: a mono "404", the `<h1>` and one sentence with the way out
 * (the home page, or the ⌘K search), then the four sections as rows.
 */
export default async function NotFound() {
  const copy = COPY.notFound

  return (
    <div className="flex flex-col gap-pad-2xl">
      <header className="flex flex-col gap-pad-xs">
        <p {...enter(0, 'font-mono text-micro text-foreground/40')}>{copy.label}</p>
        <h1 {...enter(1, 'text-display-s font-medium tracking-tight text-balance')}>{copy.title}</h1>
        <p {...enter(2, 'text-pretty text-foreground/60')}>
          {copy.text} {copy.back}{' '}
          <TextLink href={SITE_ROUTES.home} variant="underline">
            {copy.home}
          </TextLink>
          , {copy.or} <CommandMenuLink variant="underline">{copy.search}</CommandMenuLink>.
        </p>
      </header>
      <SectionLinks label={copy.sections} enterStep={3} />
    </div>
  )
}
