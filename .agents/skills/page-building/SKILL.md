---
name: page-building
description: The playbook for designing and building a new page or large section of alejandromejia.dev — load the rules, read the brief, study the existing site, ask first, plan the page, build in code with mock data, verify in the browser at desktop and phone width, hand off, and only then sync to Payload. Includes the definition of done. Use whenever building or redesigning any page or section (home, Work, a case study, Writing, Craft, CV…), even if the user just says "make the X page".
---

# Building a page

The workflow for any new page or large section. Skip a step only when it
clearly doesn't apply. It layers on `code-conventions` (code),
`alejandromejia-brand` (look, motion and voice) and `seo-geo-audit` (search).

## 1. Load the rules

- `code-conventions` (naming, structure, styling grid, performance,
  pitfalls) and `alejandromejia-brand`. Run their review checklists before
  finishing. When the two disagree on a visual matter, the brand wins.
- `AGENTS.md`: this Next.js version differs from training data; read the
  relevant guide in `node_modules/next/dist/docs/` before using an API.
- `CONTENT-MODEL.md` for the fields the page's content will come from.

## 2. Understand the brief

Unless the user says otherwise, a page has:

- **A header**: `PageHeader` with the page's single `<h1>` and a one-line
  description, plus whatever adds value (a back link, a count, a row of facts).
- **The content** the page exists for (a list of work, a case study, an
  article, the CV), designed to be its most memorable moment.
- **A link onward** (the next chapter, related work, the CV), so the page
  never dead-ends.

Keep it quiet: the brand picks less text and fewer elements when in doubt.

## 3. Study the existing site

Read, in order: the home route (`src/app/(frontend)/page.tsx`) and its
`_components/` → the interior pages already built (each route's
`_components/`) → `src/components/story/*` → `src/components/ui/*` →
`src/lib/styles/tokens.css` and `theme.css`. Note what each section does, how
it moves, its spacing and its type sizes: together with the brand's page
vocabulary, that is what to build with.

## 4. Ask before starting

Batch every question that would change the result into one message, each
with a recommended option. Typical ones:

- **Content reference**: if the user mentions a site but no link came
  through, ask for it.
- **Media**: which recordings or screenshots of real work exist for the page.
  Never stock photos (brand rule); where media is missing, `MediaFrame` shows
  its halftone placeholder.
- **Confidentiality**: whether client or employer material on the page is
  cleared for publishing.
- **URL slug**: the header menu comes from the Header global, so mention
  when its links won't reach the page.

Anything with a conventional default, decide it yourself and mention it.

## 5. Research content

- Use a reference site for **information architecture and ideas**, never for
  copy. Write original placeholder copy in the brand's voice.
- Real facts (roles, dates, metrics) come from the Profile global, the CV and
  `CONTENT-IDEAS.md`. Never invent numbers or clients.

## 6. Plan the page

Write the section list before coding. For each section, note why a visitor
cares, where it comes from (an existing section or story block, a reference
section, or new) and how it enters. Then check:

- One column, generous spacing, consistent rhythm between sections.
- Motion from the brand's vocabulary only (page transition, staggered
  entrance, list hovers). Template effects belong only in Craft pieces.
- At least one detail the page is remembered for.

## 7. Build

- **Route**: a static segment under `src/app/(frontend)/` wins over the
  `[...path]` catch-all (managed redirects, then the 404). Sections two pages share sit in the closest common
  `_components/`; a page's own ones in its route's `_components/` (see
  `project-structure.md`). A dynamic child returns `[]` from
  `generateStaticParams` and calls `notFound()` for an unknown slug.
- **Mock data** lives in `_components/<page>.mock.ts` with a PLACEHOLDER
  comment, typed with the sections' exported `Props` types.
- **Sections take plain, serializable props** (`MediaSource` from
  `@/lib/cms/media`, strings, arrays), so each one maps 1:1 to a future CMS
  field or block. Put `'use client'` only on the leaves that need it.
- **Reuse before creating**: the brand's page vocabulary (`PageHeader`,
  `SectionLabel`, list rows, `MediaFrame`, the story blocks) and the UI
  (`Link`, `TextLink`, `Image`, `AutoplayVideo`, the buttons). A new reusable
  component gets its README.
- **UI copy** (labels, buttons) goes in `COPY` (`src/lib/constants/copy.ts`);
  content stays in the mock.
- **The page file** exports its metadata (`buildMetadata`) and renders JSON-LD (`breadcrumbJsonLd`, plus
  `collectionPageJsonLd` where it fits).
- **Values tuned by eye** go in `<prefix>.const.ts`.

## 8. Verify

- `pnpm exec tsc --noEmit`, `pnpm lint`, and the checklists of
  `code-conventions` and the brand skill.
- Load the page on the dev server: no console errors, scroll the whole page
  at desktop width, hover rows and links, use every toggle (theme, inspect
  mode with `I`).
- Phone width: if the window can't be resized, inject a 390px iframe:
  `document.documentElement.innerHTML = '<body style="margin:0"><iframe src="/<path>" style="width:390px;height:780px;border:0"></iframe></body>'`,
  and check `scrollWidth === clientWidth` (no horizontal overflow).
- Frozen animations? Check `document.visibilityState`: a hidden tab pauses
  `requestAnimationFrame`. That comes from the browser, not a bug.

## 9. Hand off

Summarize what was built per page, which shared files changed, and what is
mocked. Flag known gaps (links that 404, menu links, sitemap, missing media)
and **what you could not verify**. Don't commit unless asked.

## 10. Later: sync to Payload (only when asked)

Mock data moves to the collection or global that `CONTENT-MODEL.md` names
for it. New fields follow `payload-admin-ux.md`. Page layouts stay in code:
the CMS holds content (collections, globals), never page sections. Add seed
content in `scripts/seed/` and a migration (`pnpm migrate:create <name>`).
Keep field names stable.

## Definition of done

- [ ] One `<h1>`; every section has a clear job and a consistent rhythm.
- [ ] Built from the brand's page vocabulary, with at least one memorable detail.
- [ ] Reduced motion leaves complete, readable content; continuous effects
      pause off screen; only transform/opacity animate.
- [ ] No hydration flash, no image pop-in (see `code-conventions/pitfalls.md`).
- [ ] Brand rules followed; tokens only; 8px grid in rem.
- [ ] UI copy in `COPY`; metadata and JSON-LD present.
- [ ] Types, lint and checklists clean; checked in the browser at both widths.
