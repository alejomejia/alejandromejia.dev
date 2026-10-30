import { ArrowUpRight } from 'lucide-react'

import { TextLink } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { formatMessage } from '@/lib/utils'

import type { CvEntry as CvEntryData } from './cv.types'
import { skillKey } from './cv.utils'
import { CvSkill, CvTraceItem } from './cv-trace'

// The "Contract" and "Remote" labels: filled, so they never read as the stack's (clickable) tags.
const LABEL_CLASSNAME = 'inline-flex h-5 items-center rounded-full bg-foreground/5 px-2 font-mono text-micro text-foreground'

/**
 * A role or side project, in one column: the title with the period on the
 * same line (it never wraps, and drops below the title on phones), the
 * company with where it is based and the agency, "Contract" and "Remote"
 * labels with where Alejandro worked from, then the context, what was
 * achieved, the stack (traceable tags) and the case study when there is one.
 */
export function CvEntry({ entry }: { entry: CvEntryData }) {
  const { title, titleHref, organization, period, note, remote, contract, summary, highlights, stack, caseStudy } = entry
  const copy = COPY.cv

  return (
    <CvTraceItem traceKeys={stack.map(skillKey)} className="flex break-inside-avoid flex-col gap-pad-xs">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          <h3 className="font-medium text-balance">
            {titleHref ? (
              <TextLink href={titleHref} newTab variant="underline">
                {title}
              </TextLink>
            ) : (
              title
            )}
          </h3>
          {period && (
            <p className="font-mono text-micro whitespace-nowrap text-foreground/40">
              {period.label} · {period.duration}
            </p>
          )}
        </div>
        {organization && (
          <p className="text-pretty text-foreground/60">
            {organization.href ? (
              <TextLink href={organization.href} newTab variant="underline">
                {organization.name}
              </TextLink>
            ) : (
              organization.name
            )}
            {organization.location && `, ${organization.location}`}
            {organization.via && <span className="text-foreground/40"> · {formatMessage(copy.via, { agency: organization.via })}</span>}
          </p>
        )}
        {(contract || remote || note) && (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-foreground/40">
            {contract && <span className={LABEL_CLASSNAME}>{copy.contract}</span>}
            {remote && <span className={LABEL_CLASSNAME}>{copy.remote}</span>}
            {note && (remote ? formatMessage(copy.remoteFrom, { place: note }) : note)}
          </p>
        )}
      </div>
      {summary && <p className="text-pretty text-foreground/80">{summary}</p>}
      {highlights.length > 0 && (
        <ul className="flex flex-col gap-1 text-pretty text-foreground/80">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span aria-hidden className="text-foreground/40">
                –
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
      {stack.length > 0 && (
        <ul className="mt-1 flex flex-wrap gap-1">
          {stack.map((skill) => (
            <li key={skill}>
              <CvSkill name={skill} traceKey={skillKey(skill)} />
            </li>
          ))}
        </ul>
      )}
      {caseStudy && (
        <TextLink href={caseStudy} icon={<ArrowUpRight strokeWidth={1.5} />} className="text-caption text-foreground/60 print:hidden">
          {copy.caseStudy}
        </TextLink>
      )}
    </CvTraceItem>
  )
}
