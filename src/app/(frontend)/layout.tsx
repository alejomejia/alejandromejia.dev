import type { Metadata, Viewport } from 'next'
import '@/lib/styles/globals.css'

import { Lenis } from '@/components/layout/lenis'
import { Sidebar } from '@/components/layout/sidebar'
import { GSAPRuntime } from '@/components/effects/gsap'
import { InspectMode } from '@/components/effects/inspect-mode'
import { PageTransition } from '@/components/ui/page-transition'
import { HeadHold } from '@/components/seo/head-hold'
import { JsonLd } from '@/components/seo/json-ld'
import { SiteSettingsProvider } from '@/lib/cms/site-settings-provider'
import { queryProfile } from '@/lib/cms/profile.server'
import { querySiteSettings } from '@/lib/cms/site-settings.server'
import { UmamiAnalytics } from '@/lib/integrations/umami/umami-analytics'
import { getUmamiConfig } from '@/lib/integrations/umami/umami.server'
import { siteJsonLd } from '@/lib/seo/json-ld'
import { siteMetadata } from '@/lib/seo/metadata'
import { fontVariables } from '@/lib/styles/fonts'
import { THEME_COLORS, THEME_SCRIPT } from '@/lib/styles/theme-preference'

export const metadata: Metadata = siteMetadata()

// One color per scheme; the theme toggle overrides both when it stores a choice.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: THEME_COLORS.light },
    { media: '(prefers-color-scheme: dark)', color: THEME_COLORS.dark },
  ],
}

/**
 * Root layout for the public site. The Payload admin lives under the
 * `(payload)` route group with its own root layout, so this `<html>`/`<body>`
 * only wraps visitor-facing pages.
 */
export default async function FrontendLayout({ children }: LayoutProps<'/'>) {
  const [settings, profile] = await Promise.all([querySiteSettings(), queryProfile()])
  const umami = getUmamiConfig()

  return (
    <html
      lang="en"
      className={`${fontVariables} antialiased`}
      // Inline on purpose: React drops the root from a view transition unless
      // `<html>` names it in its style attribute. The root snapshot carries the
      // background through page transitions (see `PageTransition`).
      style={{ viewTransitionName: 'root' }}
      // `THEME_SCRIPT` sets `data-theme` before hydration when a theme is stored.
      suppressHydrationWarning
    >
      <head>
        {/* Before the first paint, so a stored theme never flashes the other one. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      {/* `<body>`, not `<html>`, takes the viewport height: Lenis re-measures the
          page when `<html>` resizes, which never happens while it is pinned. */}
      <body className="min-h-svh">
        <JsonLd data={siteJsonLd(settings, profile)} />
        <HeadHold />
        <SiteSettingsProvider settings={settings}>
          {/* Cookieless analytics, production only (see `getUmamiConfig`). */}
          {umami && <UmamiAnalytics {...umami} />}
          <Lenis root>
            {/* The shell: the sidebar beside the content column on large
                screens (sizes in `tokens.css`), stacked around it on phones. */}
            <div className="mx-auto flex min-h-svh w-full max-w-[calc(var(--sidebar-width)+var(--sidebar-gap)+var(--shell-width)+2*var(--spacing-pad-xl))] flex-col px-6 lg:grid lg:grid-cols-[var(--sidebar-width)_minmax(0,var(--shell-width))] lg:gap-x-(--sidebar-gap) lg:px-pad-xl">
              <Sidebar />
              <PageTransition className="order-2 pt-pad-xl lg:pb-pad-3xl">{children}</PageTransition>
            </div>
            <InspectMode />
          </Lenis>
        </SiteSettingsProvider>
        <GSAPRuntime />
      </body>
    </html>
  )
}
