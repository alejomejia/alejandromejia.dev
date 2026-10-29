# Codebase Audit Guide

How to audit this repo (Next.js App Router + Payload). If a file below has
moved, find its equivalent first. Read
`node_modules/next/dist/docs/` for the installed Next.js version before judging
metadata APIs; they change between majors.

## Map of the SEO system

| Concern | Where |
| --- | --- |
| Site identity / defaults | `src/lib/seo/seo.const.ts` |
| Person facts (headline, intro, availability, location, experience, skills) | Profile global: `src/payload/globals/profile/`, `src/lib/cms/profile.server.ts`, seed in `scripts/seed/profile.ts` |
| Social profiles (`sameAs`) | Site Settings global `socialLinks` (`src/lib/cms/site-settings.server.ts`) |
| Layout + route metadata builders | `src/lib/seo/metadata.ts` (`siteMetadata`, `buildMetadata`, `generateMeta`) |
| JSON-LD builders / renderer | `src/lib/seo/json-ld.ts`, `src/components/seo/json-ld.tsx` |
| Indexability switch | `src/lib/seo/seo.utils.ts` (`isIndexable`) |
| Published content index + Markdown | `src/lib/seo/site-index.server.ts`, `src/lib/seo/markdown.server.ts` |
| IndexNow | `src/lib/seo/indexnow.ts`, `src/app/indexnow-key.txt/route.ts` |
| robots / sitemap / manifest | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/manifest.ts` |
| llms files | `src/app/llms.txt/route.ts`, `src/app/llms-full.txt/route.ts` |
| Icons | `src/app/favicon.ico`, `src/app/(frontend)/icon.svg`, `src/app/(frontend)/apple-icon.png`, `public/icon-*.png`, `scripts/generate-icons.mjs` |
| Default share image | `public/og-image.png` |
| Root layout (lang, JSON-LD, viewport) | `src/app/(frontend)/layout.tsx` |
| Routes | `src/app/(frontend)/**/page.tsx` (each route's `_components/` holds its sections and `*.mock.ts` data) |
| Story blocks of case studies and articles | `src/components/story/**`, fields in `src/payload/fields/story-content.ts` |
| Page block renderers (headings, semantics) | `src/components/cms/blocks/**`, `src/components/cms/render-blocks.tsx` |
| CMS SEO fields | `@payloadcms/plugin-seo` in `src/payload/plugins/index.ts` |
| Revalidation (cache + sitemap + IndexNow) | `src/payload/hooks/revalidate.ts` |
| Env | `.env.example` (never read secrets from `.env` into the report) |
| System docs | `src/lib/seo/README.md` |

## Procedure

1. **Inventory routes.** List every `page.tsx` / `route.ts` under `src/app`.
   For each public route, confirm it:
   - exports `metadata` or `generateMetadata`, built via `buildMetadata` or
     `generateMeta` (so OG/Twitter/canonical are complete);
   - is in the sitemap, as a CMS document or in `staticRoutes`;
   - renders exactly one `<h1>` and no `<main>` of its own (the layout's
     `PageTransition` provides `<main>`);
   - renders JSON-LD appropriate to its type.
2. **Site setup.** Run §0 of the checklist. Useful greps:
   ```bash
   grep -rn "Lorem\|placeholder\|PLACEHOLDER\|example\.com" src scripts public --include=*.{ts,tsx,svg,json,md} | grep -v payload-types
   find src -name "*.mock.ts"   # pages still on mock data
   ls public
   ```
3. **Semantic HTML.** Read every component in `src/components/**` that renders
   public markup. Look for:
   - `<div onClick>` / `<span onClick>` used as links or buttons;
   - `<a>` without `href`, or navigation done in JS;
   - headings chosen for size rather than hierarchy (h3 before any h2, multiple h1);
   - lists built from divs, dates without `<time dateTime>`, images without
     `alt` or with `alt` hard-coded to generic text;
   - `next/image` without `sizes` on responsive images, and the LCP image
     without `priority`;
   - interactive elements without accessible names (icon buttons need
     `aria-label`);
   - multiple `<nav>`s without `aria-label`;
   - content rendered only on the client (`'use client'` components that
     fetch or hide copy until mounted, `dynamic(..., { ssr: false })` around
     real content). Animation components must start from SSR'd content.
4. **Block coverage.** For each Payload block (`src/payload/blocks/*`) and story block, check
   the renderer's heading levels and whether the block's text reaches
   `markdown.server.ts` (it walks `heading` strings and rich-text fields; custom field
   names like `title` or `question` won't be picked up, so flag them). Also
   check that any FAQ on the site emits `FAQPage` and that clips can emit
   `VideoObject`.
5. **CMS field hygiene.** Confirm Media `alt` is required. Check whether the
   SEO plugin's title/description have length guidance, whether `publishedAt`
   is set on Work and Writing, and whether the Profile holds every fact the
   Person entity needs (headline, bio, location, profiles).
6. **Entity and hiring layer.** Read `src/lib/seo/json-ld.ts` and every
   route's JSON-LD against checklist §5 and hiring-playbook.md: one Person
   `@id`, `WebSite.publisher` and every `author` pointing to it, `ProfilePage`
   on Home or CV. Compare the Home title, first paragraph, `SITE.description`,
   `llmsDetails` and the Profile headline word for word.
7. **Performance.** Check fonts (`next/font`, `display`), images (formats in
   `next.config.ts`, `sizes`, `priority`), client bundle (`'use client'`
   surface, heavy deps in `package.json`), third-party scripts (`next/script`
   strategy), and continuous effects pausing off-screen (`useInViewport`).
   Run `pnpm build` if a DB is available and read the route size table.
8. **Static checks.** Run `pnpm exec tsc --noEmit` and `pnpm lint`. If the app can run
   (`pnpm dev` with Postgres up), curl `localhost:3000` routes and apply the
   production playbook's HTML checks locally.

## Common fixes (and where they go)

| Finding | Fix |
| --- | --- |
| Route missing complete metadata | `export const metadata = buildMetadata({ title, description, path })` |
| New public collection | Path helper in `seo.utils.ts` → `site-index.server.ts` → revalidate hooks → SEO plugin `collections` → JSON-LD builder |
| Schema type missing | Add a builder in `json-ld.ts`, render `<JsonLd data={…} />` in the route, and source the data from CMS fields that are also visible |
| FAQ content | Add an FAQ block (question/answer fields), render `<details>`/`<dl>` or h3+p, and emit `FAQPage` JSON-LD from the same data |
| Site marked up as an `Organization` | Make `siteJsonLd()` emit a `Person` (with `@id`) built from the Profile global and Site Settings `socialLinks`, point `WebSite.publisher` and every `author` to it, and add a `ProfilePage` on Home or CV |
| Empty or generic bio | Write `SITE.description`, `llmsDetails` and the Profile intro from the same one-sentence bio (content owner: Alejandro) |
| Case study without text | Add the write-up as story content in Payload: problem, role, decisions, outcome with numbers, stack |
| Wrong/duplicate titles | Fix in the CMS SEO tab (content) or `buildMetadata` (code). Never hard-code the brand into titles |

Follow the house conventions (`code-conventions` skill) for any code you write.
