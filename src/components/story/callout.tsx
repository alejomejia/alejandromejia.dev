import type { CalloutData } from './story.types'

/** A note, lesson or trade-off set apart from the story: its kind in mono, then the text. */
export function Callout({ text, label }: Pick<CalloutData, 'text'> & { label: string }) {
  return (
    <aside className="flex flex-col gap-1 rounded-xl bg-foreground/3 px-pad-m py-pad-s">
      <p className="font-mono text-micro text-foreground/40">{label}</p>
      <p className="text-pretty">{text}</p>
    </aside>
  )
}
