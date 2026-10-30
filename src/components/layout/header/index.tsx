import { CommandMenu } from '@/components/layout/command-menu'
import { queryHeader } from '@/lib/cms/header.server'
import type { NavLink } from '@/lib/cms/links'
import { queryProfileIntro } from '@/lib/cms/profile.server'
import { SITE_ROUTES } from '@/lib/constants/routes'
import { COPY } from '@/lib/constants/copy'
import { cn } from '@/lib/utils'

import { HeaderNav } from './header-nav'
import { HeaderByline, HeaderIdentity } from './header-parts'

/**
 * The top of the sidebar (see `Sidebar`): who Alejandro is and the menu,
 * always in view and close together. The wordmark and headline, the status
 * in mono (open to work, the town and the time there, then the roles and
 * where), then the menu: Home, the Header global's links and CV. The intro sits at the
 * bottom of the sidebar (`SidebarIntro`). On phones it stacks above the page
 * with the menu as a row, and the command menu's trigger ("Menu") sits
 * beside the wordmark. Mounts the command menu once for the whole site.
 */
export async function Header({ className }: { className?: string }) {
  const [{ navItems }, profile] = await Promise.all([queryHeader(), queryProfileIntro()])
  const copy = COPY.header
  const menu: NavLink[] = [
    { label: copy.home, href: SITE_ROUTES.home },
    ...navItems,
    { label: copy.cv, href: SITE_ROUTES.cv },
  ]

  return (
    <header className={cn('flex flex-col gap-pad-l', className)}>
      <div className="flex flex-col gap-pad-xs">
        <HeaderIdentity profile={profile} />
        <HeaderByline profile={profile} />
      </div>
      <HeaderNav navItems={menu} label={copy.nav} />
      <CommandMenu navItems={navItems} />
    </header>
  )
}
