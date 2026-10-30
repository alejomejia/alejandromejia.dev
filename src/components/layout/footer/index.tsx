import { InspectModeToggle } from '@/components/effects/inspect-mode'
import { CommandMenuTrigger } from '@/components/layout/command-menu'
import { TextLink } from '@/components/ui/text-link'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { queryFooter } from '@/lib/cms/footer.server'
import type { NavLink } from '@/lib/cms/links'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { SITE } from '@/lib/seo/seo.const'
import { cn } from '@/lib/utils'

const LIST = 'flex flex-wrap gap-x-4 gap-y-1'

/**
 * The bottom of the sidebar (see `Sidebar`), in three quiet rows of
 * `text-caption`: the links out (email and profiles from Site settings, RSS);
 * the controls (the ⌘K trigger, inspect mode, theme); then the copyright
 * with the link to the site's source code and the Footer global's links.
 * On phones it closes the page (under the intro, see `Sidebar`), and the ⌘K
 * trigger lives in the header instead. Empty values hide their part.
 */
export async function Footer({ className }: { className?: string }) {
  const footer = await queryFooter()
  const copy = COPY.footer
  const links: NavLink[] = [
    ...(footer.email ? [{ label: copy.email, href: `mailto:${footer.email}` }] : []),
    ...footer.socialLinks,
    { label: copy.rss, href: SITE_ROUTES.rss },
  ]
  const fineprint: NavLink[] = [{ label: copy.source, href: SITE.repository, newTab: true }, ...footer.links]

  return (
    <footer
      className={cn(
        'flex flex-col gap-pad-s text-caption text-foreground/60',
        className,
      )}
    >
      <nav aria-label={copy.nav}>
        <ul className={LIST}>
          {links.map(({ label, href, newTab }) => (
            <li key={href}>
              <TextLink href={href} newTab={newTab} prefetch="none">
                {label}
              </TextLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center">
        <div className="-ml-2 flex items-center">
          <CommandMenuTrigger className="mr-2 ml-2 max-lg:hidden" />
          <InspectModeToggle />
          <ThemeToggle />
        </div>
      </div>

      <div className={cn(LIST, 'text-foreground/40')}>
        <p>
          © {new Date().getFullYear()}
          {footer.copyright && ` ${footer.copyright}`}
        </p>
        <nav aria-label={copy.more}>
          <ul className={LIST}>
            {fineprint.map(({ label, href, newTab }) => (
              <li key={href}>
                <TextLink href={href} newTab={newTab} prefetch="none">
                  {label}
                </TextLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
