import type { StepsProps } from './story.types'

/** Numbered steps for "how we got there": the number in mono, the title, an optional sentence. */
export function Steps({ items }: StepsProps) {
  return (
    <ol className="flex flex-col">
      {items.map((step, index) => (
        <li key={step.title} className="flex items-baseline gap-4 border-t border-foreground/10 py-pad-s last:border-b">
          <span className="font-mono text-micro text-subtle">{String(index + 1).padStart(2, '0')}</span>
          <span className="flex flex-col gap-1">
            <span>{step.title}</span>
            {step.text && <span className="text-caption text-pretty text-muted">{step.text}</span>}
          </span>
        </li>
      ))}
    </ol>
  )
}
