---
name: alejandromejia-brand
description: The brand rules of alejandromejia.dev (Alejandro Mejía's design engineer portfolio): identity and voice, the monochrome, dark-only palette, Geist + Geist Mono with a sans wordmark (no serif), the small type scale, the one-column layout, corners and hairlines, the motion vocabulary (blur page transition, staggered entrances, the single halftone-shape loop), imagery for private work, and the page vocabulary; layered on code-conventions. Use for any UI work in src/ (pages, sections, components, Tailwind classes, CSS, motion, copy), even if the user doesn't mention the brand.
---

# alejandromejia.dev brand

Two jobs: the **brand rules** every UI change follows, and the **page
vocabulary** new pages build with. Both layer on `code-conventions`
(code, generic styling, performance) and the `page-building`
workflow, and win over the template's defaults when the two disagree.
Research behind these decisions: `BENCHMARK.md` at the repo root.

**The one-line brief:** *a business card that turns out to be a craft
object.* Minimal, quiet, very little text; the precision of the details and
one living loop show the skill.

When a choice is unclear, pick the **quieter** option: less text, fewer
elements, smaller motion, one gray instead of two.

## Identity and voice

- **Who:** Alejandro Mejía, Senior Design Engineer in Navarra, Spain. 13+
  years on the web, 8+ in React / Next.js / TypeScript. Design systems,
  component architecture, motion, accessibility, Core Web Vitals.
- **For whom:** hiring managers and design/engineering leads at product
  companies (remote EU/UK/US).
- **The feeling:** calm, precise, confident. A senior person who doesn't need
  to shout.
- **Copy:** first person ("I build…"), plain English, short sentences,
  specific nouns over adjectives. Say what was built and why. No hype words
  ("passionate", "rockstar", "cutting-edge", "pixel-perfect"), no emoji, no
  exclamation marks.
- **No em dashes** anywhere: copy, code, comments, docs. Use a comma,
  colon, semicolon, parentheses or a new sentence; an en dash only for
  ranges ("2021–23"), a middle dot as a separator ("Writing · Page 2").
- **Headline:** "Senior Design Engineer" plus one line, e.g. "I build design
  systems and the interfaces that use them." Same wording as LinkedIn and
  the CV.

Applies to placeholder copy, `SITE.description` and `SITE.llmsDetails` in
`src/lib/seo/seo.const.ts`, and the UI copy (`src/lib/constants/copy.ts`).

## Colors

**Monochrome and dark only.** Two tokens drive everything; grays are the
foreground at an opacity.

| Token | Value |
| --- | --- |
| `--background` | `#0f0f0f` |
| `--foreground` | `#ededed` |
| `--accent` | = foreground |
| `--accent-foreground` | = background |

Grays, by role (use these steps only):

- `text-foreground`: titles, body.
- `text-muted` (the foreground at 60%): secondary text (descriptions, meta).
- `text-subtle` (52%): tertiary (dates, labels, captions).
- `border-foreground/10`: hairlines and dividers.
- `bg-foreground/3`: surfaces (media frames, code blocks, hover rows).
- Text selection: a `foreground/10` background.

**Text meets WCAG AA (4.5:1), always.** The two text grays are tokens
(`--muted`, `--subtle` in `tokens.css`) tuned to clear it on the page and
on the `/3` and `/5` surfaces; never set text below `text-subtle` with an
opacity (`text-foreground/40` fails at 3.4:1). Fainter steps (`/10`–`/25`)
are for decoration only (dot textures, hairlines), marked `aria-hidden`.

**Two exceptions:**

- `bg-positive` (`#4ade80`), used only for the "open to work" dot
  (`AvailabilityDot`). A status signal, never decoration. It pulses slowly
  (see Motion) and shows only while "Open to work" is on in the Profile
  global's sidebar.
- **Syntax colors inside code blocks**, so code is easy to read: Shiki's
  Dracula on screen (Alejandro's editor theme) and Vitesse light on paper, highlighted on the
  server (`src/lib/code/highlight.server.ts`). Every token color is nudged
  to 4.5:1 against the darkest surface it sits on. Nowhere else.

**Dark only:** no light theme, no theme toggle, and no `dark:` variants
(there is nothing to switch). `color-scheme: dark` keeps native controls and
scrollbars dark. Print is the one exception: on paper the tokens swap to dark
ink on white (`@media print` in `tokens.css`). No colored accent: focus rings
and active states use the foreground.

**Focus rings** (`base.css`): a 1px ink outline, 2px out, that follows the
element's corners. Anything without a shape of its own gets a 4px radius, so
every ring has soft corners, concentric with what it traces: 6px around a
text link, 10px around an 8px row or button, a pill around a pill. Keep it
that way:

- The focusable box is the visible box. If a control draws its shape on a
  child (a `kbd`, an icon frame), move the border and radius onto the
  control itself, or the ring traces an invisible box.
- A card link whose top is a media frame gets the frame's radius
  (`rounded-xl`), so the ring follows the frame.
- Where a scroll container or `overflow-hidden` frame would clip the ring
  (code tabs, scrolling code), draw it inside: `focus-visible:-outline-offset-2`
  on an element with `rounded-lg` (still a 6px ring).
- Never `outline-none` without a replacement. The one exception is a
  script-only focus target (`<main>`, the skip link's target), which isn't a
  control.
- The skip link (frontend layout) is the first stop on every page: hidden
  until focused, then a hairline 8px-radius box in the top-left corner.

Where it lives: `src/lib/styles/tokens.css` and `SITE.themeColor` (kept equal
to `--background`). Components use the tokens, never raw hex or Tailwind's
palettes.

## Typography

- **Geist** (sans, 400 and 500) for everything. **No bold:** 500 is the
  heaviest weight.
- **Geist Mono** (400) for meta: dates, labels, tags, numbers in tables,
  code. Labels in mono are sentence case, never uppercase-tracked.
- **No serif**, not even for the wordmark (dropped on 2026-10-28). Emphasis
  comes from weight (500), size and ink against the grays, never from a
  second typeface or italics.

Type scale (`--fs-*` in `tokens.css`, `text-*` utilities):

| Token | Size | Line height | Use |
| --- | --- | --- | --- |
| `text-micro` | 12px | 1.4 | Mono labels, tags |
| `text-caption` | 13px | 1.5 | Captions, dates, footnotes |
| `text-body` | 15px | 1.6 | Body, lists, nav |
| `text-lead` | 18px | 1.5 | Intro paragraph, post subtitle |
| `text-display-s` | 24px | 1.25 | Page titles |
| `text-display-m` | 32px | 1.15 | Case study titles |
| `text-display-l` | 48px | 1.05 | Rare: one statement per page at most |
| `text-display-xl` | 72px | 1 | Not used by default |

Headings are `font-medium` with `tracking-tight` from 24px up. Body text
uses `text-pretty`, headings `text-balance`. The root font-size is left to
the browser (16px by default), so a visitor's larger font setting scales the
whole site; never set it, and never scale it with the viewport (this is a
reading site).

Where it lives: `src/lib/styles/fonts.ts`, `tokens.css`, `theme.css`, and
the `extendTailwindMerge` list in `src/lib/utils/styles.ts`.

## Shapes and spacing

- **Layout:** a sidebar and a content column. From `lg` up, the sidebar
  (`--sidebar-width`, 272px) is fixed on the left at the viewport's height,
  96px (`--sidebar-gap`) from the content column (`--shell-width`, 640px);
  the pair is centered. Below `lg` they stack: the header opens the page,
  the footer closes it. Side gutter 24px on phones, 48px from `lg`. Pages
  fill the content column; they never set their own width or gutter.
- **Vertical rhythm:** 48px (`pad-xl`) between sections on the home page,
  96px (`pad-3xl`) at the top of a page, 16–24px inside a section.
- **Corners:** 12px (`rounded-xl`) for media frames and code blocks, 8px
  (`rounded-lg`) for small controls, `rounded-full` for tags. No pill buttons.
- **Borders:** 1px hairlines at `foreground/10`. **No shadows**, ever.
- **Buttons:** rare. Prefer text links with an underline on hover; a
  button, when needed, is a hairline-bordered, 8px-radius box.

## Motion

Personality: **calm and precise**. Small distances, a normal pace (never
snappy, never slow), no bounce. Motion explains (something arrived, something changed) or delights
once; it never decorates continuously, except the one signature loop and
the availability dot's status pulse.

| Moment | Motion | Timing |
| --- | --- | --- |
| Page transition | Content (`<main>`) blurs to 4px and fades out; new content fades in from 4px blur with an 8px rise. The home page only fades in, fast, and its entrances stagger in once the transition ends. The sidebar stays still | Out 300ms, in 600ms starting at 200ms (home: 200ms at 100ms) |
| Entrance (home page only) | The halftone, then each section's label and its rows fade in with an 8px rise and 4px blur, one after another in reading order. Inner pages have none: people come to read, and the page transition already says they arrived | 700ms `ease-out-quint`, 50ms stagger, capped at step 12 (`enter()`) |
| Hover (links, rows) | Color/opacity, underline appears | 250ms ease |
| Popover / menu | Scale from 0.96 + fade | 250ms `ease-out-quint` |
| Signature loop | `HalftoneShape`: a cube rounding into a sphere and back, on the home page only | Continuous, paused off-screen |
| Status pulse | The "open to work" dot fades to 40% and back (`animate-status-pulse`) | 3s ease-in-out, continuous |

Eases (`theme.css`): `ease-out-quint` for things arriving, `ease-in-quart`
for things leaving. Under `prefers-reduced-motion`, page transitions are an
instant cut, entrances are skipped, the loop renders one still frame, the
status dot stays still, and the wheel scrolls natively (no Lenis smoothing).

Where it lives: `ease-*` tokens in `theme.css`, the page transition in
`src/lib/styles/view-transitions.css` and `src/components/ui/page-transition.tsx`,
the loop in `src/components/effects/halftone-shape/`. No preloader. Every rule
in `code-conventions/performance.md` still applies.

## Logo and icons

- **Wordmark:** "Alejandro Mejía" in Geist 500, `text-lead`,
  `tracking-tight`, foreground color (`Logo`); the `text-subtle` headline under it
  makes it stand out. No symbol, no logo mark.
- **Favicon:** TODO (an "am" monogram in Geist 500, or a single halftone
  dot).
- **Icons:** `lucide-react` at 16px with a 1.5 stroke, only where text can't
  do the job.

## Imagery

- **Real work only.** No stock photos, no illustrations, no 3D mockups.
- **Private work is shown as short muted recordings** (10–20s loops) and
  before/after comparisons, on a `bg-foreground/3` surface with a hairline
  border and 12px corners. Optional minimal browser chrome (three gray dots
  and a hairline), never device frames.
- Recordings are captured at 2× and cropped to the interesting part; no
  cursor-hunting, no long scrolls.
- **Never show a client's or employer's brand assets** (logos, licensed
  fonts such as Desigual's Founders Grotesk) or confidential data without
  permission. Desigual: Storybook UI and examples only.

## Components and page vocabulary

Filled as the site grows.

- **Effects:** `HalftoneShape` (`src/components/effects/halftone-shape/`), the
  home page's signature loop. Other UI experiments are Craft pieces only:
  they are showcased on `/craft`, never used in the site's own pages.
- **Page transition:** blur cross-fade of `<main>`, the sidebar anchored.
- **Shell:** `Sidebar` (`src/components/layout/sidebar/`) holds the header
  and the footer; the frontend layout puts it beside `<main>`.
- **Entrance (home only):** `enter(index)` from `@/lib/utils`
  (`motion-safe:animate-enter`, 50ms per item, capped at `ENTER_LAST_STEP`);
  `SectionLabel` takes an `enterStep`. Each list gives its label a step,
  then one per row. Don't add entrances to inner pages.
- **Section label:** `SectionLabel` (`src/components/ui/section-label/`),
  mono micro text in `text-subtle` with an optional link at the end.
- **Lists (home, Work):** whole-row links with a `bg-foreground/3` hover surface
  (`LIST_ROW_CLASSNAME`); meta (years, dates, formats) in mono micro `text-subtle`.
- **Page header:** `PageHeader` (`src/components/ui/page-header/`): an inner
  page's `<h1>` (`text-display-s`) and a `text-muted` description, entering first.
  Case studies use `text-display-m` with a back link, facts and outcomes.
- **Chapters** (a case study told in pages): the chapter list under the
  header; once it scrolls away, a sticky bar (`WorkChapterBar`) with the
  position, the title (opening every chapter in a popover) and arrows, which
  ← / → also reach; at the end, a pager with the previous and next page
  (the last chapter leads to the next case study).
- **Media frame:** `MediaFrame` (`src/components/story/media-frame.tsx`):
  the surface, hairline and 12px corners every piece of work sits in,
  optional browser chrome; a halftone dot texture stands in for missing media.
- **Story blocks** (`src/components/story/`), rendered by `StoryContent`
  from plain `StoryNode` data that mirrors the Payload blocks: h2s in
  `text-lead`, paragraphs at `/80`, then `Clip`, `BeforeAfter` (a drag and
  keyboard slider, or a toggle), `CodeBlock` (syntax colors, highlighted lines
  on a `foreground/5` band; several files get tab chips, the active one
  boxed with a hairline), `Callout`, `Steps` (mono numbers between
  hairlines) and `Metrics`.
- **Recommendations:** `RecommendationQuote` (`app/(frontend)/_components/`): the
  quote word for word (an excerpt on the home page, in full on a case
  study), then the name, role and company, and "At ChromaWay · Sep 2025" in
  mono. No company logos or initials (dropped: the logos are other
  companies' trademarks). Every list of them ends with
  `RecommendationsSource`: "Copied word for word from LinkedIn" and a link
  to all of them on the profile, so visitors can check they are real.
- **Inspect mode** (`src/components/effects/inspect-mode/`): on site-wide,
  toggled with `I`. Its Figma blue and red appear only while it is on.
  - **Header** (top of the sidebar): the wordmark and headline, the status
    as one mono byline ("● Open to work · Navarra · 22:15 CET"; the full
    availability sentence is its tooltip), then the menu right after (Home,
    the Header global's links, CV): a column from `lg`, a row on phones,
    where the ⌘K trigger ("Menu") sits beside the wordmark. Who and where to
    go stay together; chosen 2026-10-30 over four other layouts.
  - **Intro** (bottom of the sidebar, above the footer): the one-line intro
    in `text-caption`, `text-muted`.
  - **Footer** (bottom of the sidebar): three rows in `text-caption`: the
    links out; ⌘K and inspect; then ©, Source (the repository) and
    any links from the Footer global. On phones the intro and footer close
    the page below a hairline.
- **Links:** every link turns ink (`text-foreground`) on hover, fading in
  250ms. Which underline it gets depends on its kind; pick by where it sits:

  | Kind | Underline | Examples |
  | --- | --- | --- |
  | **Inline** (inside a sentence or a value, or beside a section label) | At rest, retracts on hover: `TextLink variant="underline"` | Closing lines ("…are in Writing."), email, company names, "See all on LinkedIn", live site, source, "All work" |
  | **Standalone** (menus, back links) | Drawn on hover: `TextLink` (default `underline-reveal`) | Header menu, footer, the CV's section menu, back links, "Read the case study" |
  | **Block** (a whole row or tile) | None; the surface fills and gray text turns ink | List rows (`LIST_ROW_CLASSNAME`), tiles, contents, chapters, onward and related links |

  An inline link's color matches the text around it, so only the line marks
  it as a link (also an accessibility rule). A section label's link ("All
  work") counts as inline: it shares the label's mono gray, so nothing else
  sets it apart. A standalone link is marked by its place in a menu, so a
  resting line would be noise. No underline, by
  design: buttons (boxed), the heading `#` anchor (a glyph shown on hover)
  and the wordmark. Icons go in `TextLink`'s `icon` prop: the underline
  skips them and they nudge toward where they lead. Rich text
  (`.rich-text a`) follows the inline rule.
- **Command menu:** a hairline-bordered 12px box, `bg-background`, over a
  `background/80` backdrop. Group labels are mono micro `text-subtle`, and
  the highlighted row is `bg-foreground/3`.

## TODO

- [ ] Favicon and OG image design.
- [ ] Page vocabulary: fill in as Home, Work, Writing, Craft and CV are built (no About page).
