import type { CvEntry as CvEntryData } from './cv.types'
import { CvEntry } from './cv-entry'

/** Roles or projects between hairlines. */
export function CvEntries({ entries }: { entries: CvEntryData[] }) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => (
        <li key={entry.id} className="border-t border-foreground/10 py-pad-m first:border-t-0 first:pt-0 last:pb-0">
          <CvEntry entry={entry} />
        </li>
      ))}
    </ul>
  )
}
