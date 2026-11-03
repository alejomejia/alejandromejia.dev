import { SectionLabel } from '@/components/ui/section-label'
import { TextLink } from '@/components/ui/text-link'

import { LabelRow } from '@/app/(frontend)/_components/label-row'
import type { HowItsBuiltSectionData, HowItsBuiltText } from './how-its-built.types'
import { HowItsBuiltInspect } from './how-its-built-inspect'

type HowItsBuiltSectionProps = HowItsBuiltSectionData & {}

/** A section of How it's built: its mono label, then one row per fact. */
export function HowItsBuiltSection({ label, rows }: HowItsBuiltSectionProps) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-pad-s flex flex-col gap-pad-s">
        {rows.map((row) => (
          <li key={row.label}>
            <LabelRow label={row.label}>
              <p className="text-pretty text-foreground/80">{row.text.map(renderText)}</p>
            </LabelRow>
          </li>
        ))}
      </ul>
    </section>
  )
}

function renderText(part: HowItsBuiltText, index: number) {
  if (typeof part === 'string') return part
  if ('toggle' in part) return <HowItsBuiltInspect key={index} label={part.text} />
  return (
    <TextLink key={index} href={part.href} variant="underline">
      {part.text}
    </TextLink>
  )
}
