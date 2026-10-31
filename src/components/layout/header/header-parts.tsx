import { AvailabilityDot } from '@/components/layout/availability-dot'
import { CommandMenuTrigger } from '@/components/layout/command-menu'
import { Link } from '@/components/ui/link'
import { LocalClock } from '@/components/ui/local-clock'
import { Logo } from '@/components/ui/logo'
import type { ProfileIntro } from '@/lib/cms/profile.server'
import { COPY } from '@/lib/constants/copy'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { cn, formatMessage } from '@/lib/utils'

/** The wordmark (linking home) and the headline, with the ⌘K trigger beside them on phones. */
export function HeaderIdentity({ profile, className }: { profile: ProfileIntro; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-6', className)}>
      <div>
        <Link href={SITE_ROUTES.home} prefetch="viewport">
          <Logo />
        </Link>
        <p className="text-subtle">{profile.headline}</p>
      </div>
      <CommandMenuTrigger className="lg:hidden" />
    </div>
  )
}

/**
 * The status in mono: one line with the dot and "Open to work" (while it is
 * on), the town (the first part of the location) and the time there; then
 * the Profile's availability lines under it, lined up with the text after
 * the dot: one role per line, written in full ("Design Engineer", so it never
 * reads as a design job), then where on the last. The clock's tooltip says
 * whose time it is.
 */
export function HeaderByline({ profile, className }: { profile: ProfileIntro; className?: string }) {
  const copy = COPY.header
  const town = profile.location?.split(',')[0]
  const parts = [
    town,
    profile.timezone && (
      <span title={profile.location ? formatMessage(copy.localTime, { place: profile.location }) : undefined}>
        <LocalClock timeZone={profile.timezone} />
      </span>
    ),
  ].filter(Boolean)
  const lines = profile.available ? (profile.availability ?? '').split('\n').map((line) => line.trim()).filter(Boolean) : []

  return (
    <div className={cn('flex flex-col gap-pad-xs font-mono text-micro text-subtle', className)}>
      <p className="flex items-center gap-x-2 whitespace-nowrap">
        {profile.available && (
          <>
            <AvailabilityDot />
            <span className="text-muted">{copy.available}</span>
          </>
        )}
        {parts.map((part, index) => (
          <span key={index} className="flex items-center gap-x-2">
            {(profile.available || index > 0) && <span aria-hidden>·</span>}
            {part}
          </span>
        ))}
      </p>
      {lines.length > 0 && (
        // Indented past the dot and its gap, under "Open to work".
        <p className="flex flex-col pl-4 text-muted">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      )}
    </div>
  )
}
