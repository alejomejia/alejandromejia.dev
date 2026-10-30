/* eslint-disable @next/next/no-html-link-for-pages --
 * `global-not-found.tsx` bypasses the router and renders its own document;
 * `next/link` fails to instantiate here, so plain anchors (full navigation)
 * are both required and correct. */
import type { Metadata, Viewport } from 'next'

import { Logo } from '@/components/ui/logo'
import { textLinkClassName, textLinkLabelClassName } from '@/components/ui/text-link'
import { COPY } from '@/lib/constants/copy'
import { SITE } from '@/lib/seo/seo.const'
import { fontVariables } from '@/lib/styles/fonts'

// This file bypasses the app's layouts, so it must pull in global styles and
// fonts itself; nothing from `(frontend)/layout.tsx` applies here.
import '@/lib/styles/globals.css'

export const metadata: Metadata = {
  title: `${COPY.notFound.title} | ${SITE.name}`,
}

// Same as the frontend layout's, which doesn't apply here.
export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  colorScheme: 'dark',
}

/**
 * App-wide 404 for URLs that match no route at all. Required because the app
 * has multiple root layouts ((frontend) + (payload)), so Next can't compose a
 * global 404 from a single layout. It renders its own `<html>`/`<body>` and
 * therefore has no sidebar; `notFound()` within a route segment still uses
 * the framed `(frontend)/not-found.tsx` instead. Same look as that page, in
 * the content column's width: the wordmark, a mono "404", the `<h1>` and the
 * way home. Uses plain anchors (not `next/link`): this page bypasses the
 * router, so a full navigation is both correct and required for it to render.
 */
export default function GlobalNotFound() {
  const copy = COPY.notFound

  return (
    <html lang={SITE.lang} className={`${fontVariables} antialiased`}>
      <body className="min-h-svh">
        <main className="mx-auto flex min-h-svh w-full max-w-(--shell-width) flex-col justify-center gap-pad-2xl px-6 py-pad-3xl">
          <a href="/" className="w-fit">
            <Logo />
          </a>
          <div className="flex flex-col gap-pad-xs">
            <p className="font-mono text-micro text-foreground/40">{copy.label}</p>
            <h1 className="text-display-s font-medium tracking-tight text-balance">{copy.title}</h1>
            <p className="text-pretty text-foreground/60">
              {copy.text} {copy.back}{' '}
              <a href="/" className={textLinkClassName({ variant: 'underline' })}>
                <span className={textLinkLabelClassName({ variant: 'underline' })}>{copy.home}</span>
              </a>
              .
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
