# Project Structure

Three top-level homes under `src/`, with one rule that decides everything:

> **Renders to the public site → `components/`. CMS config or admin-panel UI →
> `payload/`. Everything else (non-visual, project-wide) → `lib/`.**

```
src/
  payload/            ← everything Payload / CMS
    payload.config.ts       @payload-config resolves here
    collections/            work.ts, writing.ts, craft.ts, recommendations.ts, topics.ts, media.ts, ...
    globals/                header/, footer/, profile/, site-settings/  (field configs)
    blocks/                 hero/hero.config.ts, ...  (field configs only)
    fields/                 reusable field builders (slug, link, default-lexical)
    access.ts               anyone, authenticated, authenticatedOrPublished
    admin-nav.ts            ADMIN_GROUPS menu groups + their ordering plugin (see payload-admin-ux.md)
    hooks/                  revalidate.ts, populate-published-at.ts, ...
    plugins/                index.ts  (seo, redirects, live-preview)
    components/             ADMIN-ONLY React (before-login, custom field UIs)
    utils/                  server utils (media-usage)

  app/
    (frontend)/       ← public site
      layout.tsx              the public site's root layout
      _components/            page-specific UI of the route at this level (see below)
      writing/_components/    page-specific UI of /writing
      next/                   draft-mode preview routes
    (payload)/        ← Payload-generated admin + api routes (do not hand-edit)

  instrumentation.ts  ← server start-up fixes (see its comments)

  components/         ← WEBSITE visual only
    ui/                     primitives: button, link, image, logo, page-header, ...
    layout/                 sidebar/, header/, footer/, command-menu/, lenis/
    cms/                    renderers of CMS content:
                              blocks/hero/, blocks/content/, ...
                              render-blocks.tsx (slug → renderer registry)
                              rich-text/, media/
    story/                  story blocks of case studies and articles (clip, before-after, metrics, ...)
    seo/                    JSON-LD renderer
    effects/                GSAP-driven visual components

  lib/                ← non-visual, project-wide
    utils/                  generic helpers by topic: async, styles, objects, url (see shared-utilities.md)
    cms/                    CMS data-access, server-only: home.server.ts, writing.server.ts, ... (see server-code.md)
    hooks/                  reusable React hooks (use-in-viewport, ...)
    integrations/           third-party clients (umami)
    seo/                    metadata, JSON-LD builders, llms.txt, IndexNow
    constants/              app-wide constants (routes, COPY: the site's UI copy, ...)
    styles/                 global CSS: globals.css entry + tokens, theme, base, rich-text, view-transitions; fonts.ts (next/font, shared by root layouts); theme-preference.ts (stored light/dark choice)
```

## Page-specific components live with their route

`src/components/` holds **reusable** UI only. A component that belongs to a
single page (or a single route subtree) is colocated with that route in a
`_components/` private folder, as Next.js suggests: the `_` prefix opts the
folder out of routing.

```
app/(frontend)/
  page.tsx                          imports './_components/home-work', ...
  _components/                      home page: home-work.tsx, home-writing.tsx, home-craft.tsx, ...
  writing/
    page.tsx                        imports './_components/writing-list'
    [slug]/page.tsx                 imports '@/app/(frontend)/writing/_components/writing.mock'
    _components/                    writing-list.tsx, writing.mock.ts, ...
```

- **Where:** in the `_components/` of the closest route segment that contains
  every route using it (`writing/_components/` serves `/writing` and
  `/writing/[slug]`; `(frontend)/_components/` holds what Work and Writing
  share, like `onward-link.tsx`).
- **Names:** same rules as `src/components/` (see
  [file-naming.md](./file-naming.md)). Keep the page prefix (`home-hero`,
  `writing-list`) so `Cmd-P` finds them. Don't add a folder named after the
  page (`_components/home/`): the route already says which page it is. Files
  sit directly in `_components/`, with an optional `index.tsx` as the page
  root.
- **Imports:** the route's own `page.tsx` uses `./_components` or `./_components/…`; anything
  else uses `@/app/…`.
- **Promote, don't reach across.** When a second, unrelated page needs it, move
  it to `src/components/` in that change. Never import another route's
  `_components/` from a sibling route or from `src/components/`.
- Page-specific components are not reusable components, so they need no
  README.

## Why two "payload/components" ideas are kept apart

- `src/payload/components/` = React rendered **inside the Payload admin panel**
  (BeforeLogin, custom field components). It is CMS chrome, never shipped to
  visitors.
- `src/components/cms/` = React rendered on the **public site** that displays
  CMS content (block renderers, rich-text renderer, media). It is website
  visual code that happens to be driven by CMS data.

Keeping these in separate trees (and *not* naming the frontend one
`components/payload`) removes the ambiguity of "which components folder does
this belong in?".

## Blocks are split by concern

Each CMS block lives in two places, by design:

- **Field config** (server, defines the editing UI) →
  `src/payload/blocks/<block>/<block>.config.ts`
- **Renderer** (visual, renders the saved data) →
  `src/components/cms/blocks/<block>/index.tsx`

A single registry — `src/components/cms/render-blocks.tsx` — maps each block
`slug` to its renderer. This honors the CMS/website separation strictly:
`components/` stays purely visual, `payload/` stays purely CMS config.

## `@` aliases

- `@/…` → `src/…`
- `@payload-config` → `src/payload/payload.config.ts`

Import CMS types from the generated file: `import type { Page } from
'@/payload-types'`.
