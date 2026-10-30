import { cn } from '@/lib/utils'

/**
 * The "open to work" dot: the site's one color, a status signal (see the
 * brand skill). It pulses slowly to read as live, and stays still under
 * reduced motion. With a `label` it is an image that screen readers and the
 * hover tooltip name; without one it is decoration next to text that already
 * says it.
 */
export function AvailabilityDot({ label, className }: { label?: string; className?: string }) {
  return (
    <span
      {...(label ? { role: 'img', 'aria-label': label, title: label } : { 'aria-hidden': true })}
      className={cn('size-2 shrink-0 rounded-full bg-positive motion-safe:animate-status-pulse', className)}
    />
  )
}
