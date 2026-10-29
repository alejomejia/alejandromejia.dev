# SEO + GEO Audit Checklist

Work through every section. Mark each item **PASS**, **FAIL**, **WARN** (works
but suboptimal), **N/A** (not applicable to this site), or **UNVERIFIED**
(could not check, and say why). Items tagged `[prod]` need the live site.
`[code]` items are checked in the repo. `[both]` items are checked in both
when production exists.

Severity for FAIL/WARN:
- **P0 (critical):** blocks indexing, AI citation or rich results site-wide.
  Examples: noindex in production, robots `Disallow: /`, WAF blocking bots,
  broken canonicals.
- **P1 (high):** hurts rankings or CTR on important pages. Examples: missing
  or duplicate titles, no structured data, poor Core Web Vitals, thin case studies, a weak Home or CV.
- **P2 (medium):** best practice gaps with measurable but moderate impact.
- **P3 (low):** polish.

---

## 0. Site setup `[code]`

The site started from a template; these items make sure every default became
Alejandro's real data. Most failures here are P0/P1.

- [ ] `src/lib/seo/seo.const.ts`: `name`, `shortName`, `description`, `lang`, `locale`, `themeColor` are real values; no template copy is left in its comments or values.
- [ ] `SITE.description` (which `COPY.site.description` reuses) is the one-sentence bio (≤160 chars) with the role, specialty and location, identical to the Profile headline and LinkedIn wording.
- [ ] Site Settings `socialLinks` list every real profile (LinkedIn, GitHub, X/Bluesky, Dribbble, CodePen…); they feed `sameAs`.
- [ ] `SITE.twitterHandle` is set if there is an X account.
- [ ] `SITE.llmsDetails` is the hand-written paragraph described in hiring-playbook.md (empty is P1).
- [ ] `SITE.aiCrawlers.search` is `true` (blocking search bots removes the site from AI answers).
- [ ] `src/app/(frontend)/icon.svg` is the real mark and `pnpm generate:icons` was re-run: `favicon.ico`, `apple-icon.png`, `public/icon-*.png` are regenerated and every icon is square.
- [ ] `public/og-image.png` is a real share image (1200×630, name and role legible at small size), not the template placeholder.
- [ ] Unused starter assets are removed from `public/`.
- [ ] Grep for leftover placeholders: `Template`, `Lorem`, `placeholder`, `PLACEHOLDER`, `example.com`, in code, mocks (`*.mock.ts`) and seed data. Mock content on a public page is P1.
- [ ] Unused template surfaces (business contact fields such as `hours`, `phone`, `mapUrl`, `whatsappUrl`) are either filled for real or not rendered and not marked up.
- [ ] Production env: `NEXT_PUBLIC_SERVER_URL` is the canonical origin (https, chosen www/non-www, no trailing slash). It is set at **build** time.
- [ ] The live site is indexable: production pages serve `index, follow` and `robots.txt` allows crawlers (`isIndexable()`).
- [ ] `INDEXNOW_KEY` is set in production, and the domain is verified in Search Console and Bing Webmaster Tools by DNS TXT record.
- [ ] Every published document (Pages, Work, Writing, Craft) has its SEO tab filled: unique meta title, hand-written description, share image where relevant.
- [ ] Code-defined routes that aren't CMS documents (`/writing`, `/work`, `/cv`, `/craft`…) are in `staticRoutes` in `src/app/sitemap.ts` and use `buildMetadata()`.
- [ ] Every collection with public URLs (Work, Writing, Craft, Topics if they get pages) is wired into `seo.utils.ts` path helpers, `site-index.server.ts`, the sitemap, the revalidate hooks and the SEO plugin `collections`.
- [ ] `<html lang="en">` everywhere; the site is English only, so no `hreflang` alternates and no locale prefixes in canonical URLs.

## 1. Crawlability & indexing

- [ ] `[prod]` `/robots.txt` returns 200 with `text/plain`. It doesn't disallow important paths, and it references the absolute sitemap URL.
- [ ] `[prod]` `/robots.txt` on staging/preview hosts returns `Disallow: /`.
- [ ] `[prod]` `/sitemap.xml` returns 200 and is valid XML. It lists only canonical, indexable, 200-status URLs on the production origin, with accurate `lastmod`. It has no admin/api/draft/redirected URLs and ≤50k URLs (else a sitemap index).
- [ ] `[prod]` Sample every sitemap URL (or up to 100) and confirm: 200 status, no `noindex`, self-referencing canonical.
- [ ] `[both]` No `noindex` meta or `X-Robots-Tag: noindex` header on production pages meant to rank.
- [ ] `[prod]` Unknown URLs return a real **404** status (not a 200 "soft 404"). The 404 page is helpful and links home and to key sections.
- [ ] `[prod]` One canonical host. `http→https`, `www↔non-www`, and trailing-slash variants 301/308 to the canonical in **one hop**.
- [ ] `[prod]` No redirect chains or loops. CMS redirects (Redirects collection) point straight to final URLs.
- [ ] `[both]` Canonical tags are absolute, self-referencing on canonical pages, and never point to redirected, 404 or noindexed URLs.
- [ ] `[both]` Paginated archives (`/writing/page/N`) self-canonicalize (they must not all point to page 1) and are crawlable via plain `<a href>` links.
- [ ] `[both]` Query-parameter duplicates (utm, sort, filter) canonicalize to the clean URL.
- [ ] `[both]` Every indexable page is reachable through internal `<a href>` links (no orphans) within ~3 clicks of home.
- [ ] `[both]` `/admin`, `/api`, preview routes are disallowed and are not in the sitemap.
- [ ] `[prod]` Google Search Console and Bing Webmaster Tools are verified, the sitemap is submitted, and there are no coverage errors (ask the user for access/exports if needed).
- [ ] `[prod]` `/indexnow-key.txt` returns the key (if IndexNow is configured).

## 2. AI crawler access & GEO foundations

- [ ] `[prod]` `robots.txt` has explicit groups for AI search bots (`OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`) and training bots (`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`…), matching the intended policy.
- [ ] `[prod]` **CDN/WAF is not blocking them.** Fetch key pages with AI bot user agents (see production-audit.md). A 403/challenge page means Cloudflare "Block AI bots", Bot Fight Mode, AI Crawl Control or a similar setting overrides robots.txt. This is P0 for GEO.
- [ ] `[prod]` The primary content of every key page is present in the **raw HTML** (curl, no JS). The bio, headings, case-study and CV copy, and contact info must not be client-rendered only (watch split-text and entrance animations).
- [ ] `[both]` Content in tabs, accordions and carousels is in the DOM at load (hidden visually is fine, not fetched on click).
- [ ] `[prod]` `/llms.txt` returns 200 `text/plain`. It has an H1 site name, a `>` summary, a real `llmsDetails` paragraph, and links matching current published content.
- [ ] `[prod]` `/llms-full.txt` returns 200 with readable Markdown of every page and post, with no empty sections and no template text.
- [ ] `[both]` Entity consistency: name, headline, bio, location and profile URLs are identical across the site, JSON-LD, `llms.txt`, LinkedIn, GitHub and other profiles.
- [ ] `[code]` Key pages open with a direct, self-contained answer or summary (the first 1–2 sentences under each heading can be quoted on their own).
- [ ] `[code]` Pages include specific, verifiable facts (years, roles, dates, metrics, stack, credentials). AI engines prefer citable specifics over marketing language.
- [ ] `[both]` Who Alejandro is, what he does and how to reach him are clear from Home and the CV (there is no About page by design), and that information is machine-readable (Person JSON-LD).

## 3. Titles, meta & social tags

- [ ] `[both]` Every indexable page has a unique `<title>`. Aim for ~50–60 chars (~600px), primary topic first, brand last via template, and no double branding ("X | Brand | Brand").
- [ ] `[both]` Every indexable page has a unique, hand-written `meta description`. Aim for ~120–160 chars, matching intent, with a reason to click.
- [ ] `[both]` Home title leads with the name and the role ("Alejandro Mejía — Senior Design Engineer"), not the name alone.
- [ ] `[both]` `meta viewport` is `width=device-width, initial-scale=1` and zoom is not disabled. `charset` is utf-8.
- [ ] `[both]` Open Graph on every page: `og:title`, `og:description`, `og:image` (absolute, 1200×630, <5 MB, reachable without auth), `og:url` (canonical), `og:type` (`profile` for Home, `article` for writing and case studies), `og:site_name`, `og:locale`.
- [ ] `[both]` Twitter card: `summary_large_image`, with title/description/image present.
- [ ] `[prod]` Share previews render correctly (fetch the OG image URL, and confirm 200 and the right dimensions).
- [ ] `[both]` Icons: `favicon.ico`, SVG icon, `apple-touch-icon` (180, opaque, square), manifest with 192/512 and a maskable icon. `theme-color` is set.
- [ ] `[both]` Google shows the favicon in results: it's reachable, square, ≥48px multiple, and not blocked by robots.

## 4. Semantic HTML & accessibility (a11y overlaps with SEO)

- [ ] `[both]` Exactly one `<h1>` per page, describing the page topic (not the logo, not "Welcome").
- [ ] `[both]` Heading levels are hierarchical (h2 → h3, no skipped levels for styling). Headings describe the content below them, and question-style headings are used where users ask questions.
- [ ] `[both]` Landmarks: one `<header>`, `<nav>` (with `aria-label` if more than one), exactly one `<main>`, and a `<footer>`. `<aside>` is used for tangential content.
- [ ] `[both]` `<article>` for writing entries and cards, `<section>` with a heading for thematic groups, `<time datetime>` for dates, `<figure>`/`<figcaption>` for captioned media, `<address>` for contact info, and real `<ul>/<ol>` for lists. Data tables use `<table>` with `<th scope>`.
- [ ] `[both]` Links are `<a href>` (never `onClick` navigation on divs). Buttons are `<button>`. Anchor text is descriptive (no "click here" or "read more" without context, e.g. via `aria-label`).
- [ ] `[both]` Every meaningful image and recording has descriptive `alt` or a caption (not the filename, not keyword stuffing). Decorative images have `alt=""`. The CMS Media `alt` field is filled for all uploads.
- [ ] `[both]` A skip link to `<main>` exists. Focus is visible. Interactive elements are keyboard reachable.
- [ ] `[both]` Color contrast is WCAG AA. Tap targets are ≥24px (48px recommended) on mobile.
- [ ] `[prod]` No horizontal scroll on mobile widths (320–414px).
- [ ] `[both]` Smooth scroll, the page transition and animation effects respect `prefers-reduced-motion`, and content isn't hidden until an animation runs.

## 5. Structured data (JSON-LD)

- [ ] `[both]` All JSON-LD parses as valid JSON with no errors in the Rich Results Test / Schema.org validator (ask the user to run these, or validate structure yourself).
- [ ] `[both]` One `Person` node with a stable `@id`, built from the Profile global: `name`, `alternateName`, `jobTitle`, `description`, `url`, `image`, `sameAs`, `knowsAbout`, `address` (region + country only), `knowsLanguage` (see hiring-playbook.md). An `Organization` node for the site is a FAIL (P1): this is a person's site.
- [ ] `[both]` `WebSite` with `name`, `url`, `inLanguage: "en"`, and `publisher` → the Person `@id`. `SearchAction` only if site search exists.
- [ ] `[both]` Home (or CV) is a `ProfilePage` with `mainEntity` → the Person, plus `dateCreated` / `dateModified`.
- [ ] `[both]` Writing: `BlogPosting` (or `TechArticle`) with `headline`, `datePublished`, `dateModified`, `image`, and `author` → the Person `@id` (not an inline name-only Person).
- [ ] `[both]` Case studies: `CreativeWork` or `Article` with `author` → the Person, `datePublished`, `about`, `image`; clips as `VideoObject` with `thumbnailUrl`, `uploadDate`, `duration`. Snippets may use `SoftwareSourceCode`.
- [ ] `[both]` `BreadcrumbList` on every non-home page, matching the visible/URL hierarchy. `CollectionPage` + `ItemList` on Work and Writing lists.
- [ ] `[both]` `FAQPage` only where a visible FAQ exists.
- [ ] `[both]` No `Review` / `AggregateRating` about Alejandro: recommendations stay visible quotes only.
- [ ] `[both]` Every marked-up fact is **visible on the page** and true; no client name in markup that the page doesn't show with permission.
- [ ] `[both]` Entities are linked via stable `@id`s instead of duplicated.

## 6. Performance & Core Web Vitals

- [ ] `[prod]` Field data (CrUX via PageSpeed Insights) at p75: **LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1** on mobile and desktop. If there's no field data, use lab data and say so.
- [ ] `[prod]` Lighthouse mobile scores: Performance ≥ 90, SEO = 100, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] `[both]` The LCP image uses `priority`/`fetchpriority="high"`, is not lazy-loaded, has correct `sizes`, and is served as AVIF/WebP. Other images lazy-load.
- [ ] `[both]` All images/video/iframes have dimensions (no CLS). Fonts are self-hosted (`next/font` or local) with `display: swap`/`optional` and no layout shift. Late-injected banners reserve their space.
- [ ] `[both]` Minimal client JS: no heavy libraries on pages that don't need them, third-party scripts deferred (`next/script` `lazyOnload`/`afterInteractive`), and no render-blocking CSS/JS beyond critical.
- [ ] `[both]` Continuous effects pause off-screen, and animations use only transform/opacity (see code-conventions performance.md).
- [ ] `[prod]` TTFB < 800ms. Static/ISR pages are served from cache, with Brotli/gzip compression, HTTP/2 or HTTP/3, and long `Cache-Control` on hashed assets and media.

## 7. Content quality, intent & E-E-A-T

- [ ] `[both]` Each target query group from hiring-playbook.md maps to one page, and no two pages compete for the same query.
- [ ] `[both]` Home's first paragraph states role, specialties, years, location, work mode and availability in plain text that can be quoted on its own.
- [ ] `[both]` The CV exists as an HTML page with the full text (not only a PDF) and links from Home and the sidebar.
- [ ] `[both]` Each case study has its own URL and a real write-up: problem, role, team, decisions, outcome with numbers, stack. No media-only or modal-only case studies.
- [ ] `[both]` No thin pages: Craft pieces have a written explanation; topic or tag pages are useful hubs or are not indexed.
- [ ] `[both]` Experience and trust signals: real dates, roles, companies (when cleared), numbers, word-for-word recommendations with a link to their source, original recordings.
- [ ] `[both]` Contact path: an email as text and the availability line reachable from every page; LinkedIn and GitHub linked.
- [ ] `[both]` Internal linking: case studies link to related writing and back; writing links to the work it draws from and to the CV; topic hubs link their pieces; descriptive anchors.
- [ ] `[both]` Freshness: visible dates are accurate, the availability line and CV are current, stale posts are updated or consolidated.
- [ ] `[both]` Articles open answer-first and use question-style subheadings where readers ask questions (high GEO citation potential).

## 8. Security & technical hygiene

- [ ] `[prod]` HTTPS everywhere with HSTS and no mixed content.
- [ ] `[prod]` Security headers: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Content-Security-Policy` or at least `frame-ancestors`, and `Permissions-Policy`.
- [ ] `[prod]` No broken internal links (4xx) or broken images. External links to 404s are fixed.
- [ ] `[prod]` No 5xx on any sitemap URL. Error pages don't leak stack traces.
- [ ] `[prod]` Media URLs (R2/CDN) return 200 with correct content types and caching, and aren't blocked by robots.

## 9. Measurement

- [ ] `[prod]` Umami is installed and loaded without hurting INP/LCP.
- [ ] `[prod]` Hiring conversions are tracked as events: CV download, email copied or clicked, LinkedIn/GitHub clicks.
- [ ] `[prod]` AI referral traffic is segmented (referrers `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`, and `utm_source=chatgpt.com`).
- [ ] `[prod]` Search Console is reviewed for name and role queries: impressions, CTR and the page that earns them; high-impression, low-CTR queries are the quickest title/description wins.

## 10. Off-site & authority (report as recommendations, not code)

- [ ] LinkedIn headline, about and skills use the same role terms and bio as the site; the site is in the website field and in Featured.
- [ ] GitHub profile README and bio match, link to the site, and pinned repos back up the specialties.
- [ ] Articles cross-posted elsewhere carry a canonical link to the site.
- [ ] Presence where hiring and AI answers draw from: design engineering communities, job boards and portfolio directories (verified active), talks, podcasts, open source.
- [ ] Earned links from former employers', clients' and collaborators' pages where possible.
- [ ] Name queries ("Alejandro Mejía", "Alejandro Mejia design engineer") show the site and the profiles on the first page.
