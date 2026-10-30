import { AvailabilityDot } from '@/components/layout/availability-dot'
import { TextLink } from '@/components/ui/text-link'
import type { NavLink } from '@/lib/cms/links'
import { COPY } from '@/lib/constants/copy'
import { cn, displayURL, enter, formatMessage } from '@/lib/utils'

import { type PageFact, PageFacts } from '@/app/(frontend)/_components/page-facts'
import type { CvData } from './cv.types'

type CvHeaderProps = {
  name: string
  headline: string
  available: boolean
  availability: string | null
  location: string | null
  email: string | null
  links: NavLink[]
  summary: string[]
  remote: CvData['remote']
  className?: string
}

/**
 * The CV's top: the `<h1>` and the summary, then where Alejandro is, how
 * long he has worked remotely, and how to reach him. On paper the sidebar is gone, so a print-only block puts the
 * name, headline and availability first, and links print as addresses.
 */
export function CvHeader({ name, headline, available, availability, location, email, links, summary, remote, className }: CvHeaderProps) {
  const copy = COPY.cv

  const facts: PageFact[] = [
    { label: copy.location, value: location },
    { label: copy.remote, value: remote && formatMessage(copy.remoteTotal, { duration: remote.duration, count: remote.countries }) },
    {
      label: copy.email,
      value: email && (
        <TextLink href={`mailto:${email}`} variant="underline" className="wrap-anywhere">
          {email}
        </TextLink>
      ),
    },
    {
      label: copy.links,
      value: links.length > 0 && (
        <span className="flex flex-wrap gap-x-2 print:flex-col">
          {links.map(({ label, href }) => (
            <TextLink key={href} href={href} newTab variant="underline">
              <span className="print:hidden">{label}</span>
              <span className="hidden print:inline">{displayURL(href)}</span>
            </TextLink>
          ))}
        </span>
      ),
    },
  ]

  return (
    <header className={cn('flex flex-col gap-pad-l', className)}>
      <div className="flex flex-col gap-pad-xs">
        {/* On screen the sidebar already says this; paper has no sidebar. */}
        <div className="hidden flex-col gap-1 print:flex">
          <p className="text-display-s font-medium tracking-tight">{name}</p>
          <p className="text-foreground/60">{headline}</p>
          {available && availability && (
            <p className="flex items-center gap-2 text-caption text-foreground/60">
              <AvailabilityDot />
              {/* The sidebar's lines (the roles, then where), as one line on paper. */}
              {availability.split('\n').filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <h1 {...enter(0, 'text-display-s font-medium tracking-tight print:hidden')}>{copy.title}</h1>
        <div {...enter(1, 'flex flex-col gap-pad-xs text-pretty text-foreground/60')}>
          {summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div {...enter(2)}>
        <PageFacts facts={facts} columns={3} />
      </div>
    </header>
  )
}
