# Hiring Playbook

What "visible" means for a hire-me portfolio, applied on top of the universal
checklist. The site wins when someone hiring a **design engineer**, **UX
engineer** or **frontend developer** finds Alejandro, trusts what they read,
and gets in touch.

Be realistic in the report: broad queries ("hire a frontend developer") are
owned by job boards, marketplaces and agencies. A personal site wins by
owning its **name**, ranking for **long-tail role + specialty + location**
queries, earning **AI citations** through a clear, consistent entity, and
being linked from the **profiles recruiters already search** (LinkedIn,
GitHub).

---

## Target queries

Group them by intent and map each group to one page, so pages don't compete
with each other.

| Intent | Example queries | Page meant to rank |
| --- | --- | --- |
| **Name** (must own the whole first page) | "Alejandro Mejía", "Alejandro Mejia design engineer", "Alejandro Mejía frontend" | Home, then CV, LinkedIn, GitHub |
| **Role + location / work mode** | "design engineer Spain", "senior design engineer remote Europe", "UX engineer Spain", "frontend developer Navarra / Pamplona", "React developer remote EU" | Home, CV |
| **Role + specialty** | "design systems engineer", "design system developer React", "Storybook design system", "design tokens engineer", "motion / interaction engineer", "accessible React components" | Work case studies, CV |
| **Proof of skill** (research before hiring) | "design system case study", "design system migration case study", "<technique> demo" | Work case studies, Craft pieces |
| **Expertise** (topical authority, AI citations) | "how to version a design system", "design tokens in Tailwind v4", "view transitions in Next.js", "GSAP performance in React" | Writing articles, notes and snippets |

Use the three role names **naturally and truthfully**: the headline is
"Senior Design Engineer"; the bio can say once that this work is also called
UX engineering or design technology, and that it sits on deep frontend
development (React / Next.js / TypeScript). Never stuff the terms into
titles, alt text or hidden text. Write "Mejía" with the accent, and make sure
the unaccented "Mejia" also appears where people type it (`alternateName`,
profile URLs).

## Page roles

- **Home:** the entity page. The `<title>` and `<h1>` area say who and what
  ("Alejandro Mejía — Senior Design Engineer"). The first paragraph is
  quotable on its own: role, specialties, years, location, work mode and
  availability. Links to the CV, featured work and contact are plain
  `<a href>`. There is no About page by design, so Home and CV carry that job.
- **CV (`/cv`):** the full CV as **HTML text** (the PDF is a download, not the
  only copy): roles, companies, dates, highlights with numbers, stack,
  education, certifications, languages. It's the page recruiters and AI
  engines quote for "experience with X".
- **Work case studies:** one URL per project (and per chapter), with a text
  write-up, not only media: problem, role, team, constraints, decisions,
  outcome with numbers, stack. Recordings carry captions or nearby text that
  says what they show. Client names only with permission; otherwise
  anonymize ("a European fashion retailer").
- **Writing:** articles, notes and snippets with clear dates, the Person as
  author, and topic hubs (the Topics collection) that link related pieces.
  Answer-first openings: the first 1–2 sentences answer the title's question.
- **Craft:** each live demo has a written explanation in the HTML (what it is,
  how it works, what to notice), so crawlers see more than a canvas.
- **Source:** the public repository, linked from the footer; its README and
  history are a quiet expertise signal.
- **Contact and availability:** an email as text, the availability line from
  the Profile ("Open to senior design engineer roles, remote or EU"), and
  links out to LinkedIn and GitHub, reachable from every page (sidebar).

## The Person entity

One `Person` node, referenced everywhere by a stable `@id`
(`<origin>/#person`), built from the Profile global so the site and the
markup never disagree:

- `name`, `alternateName` ("Alejandro Mejia"), `jobTitle` ("Senior Design
  Engineer"), `description` (the one-sentence bio), `url`, `image` (a real
  headshot, once one exists), `email` if shown on the page.
- `sameAs`: every real profile (LinkedIn, GitHub, X/Bluesky, Dribbble,
  CodePen…), the same list the sidebar links to.
- `knowsAbout`: the specialties the site backs up (design engineering, UX
  engineering, frontend development, design systems, design tokens, React,
  Next.js, TypeScript, accessibility, motion, performance, Storybook).
- `address` as `PostalAddress` with `addressRegion` "Navarra" and
  `addressCountry` "ES" (no street), plus `knowsLanguage`.
- `worksFor` / `alumniOf` / `hasCredential` only with facts that are on the
  CV page and cleared for publishing.

Wiring:
- `WebSite.publisher` and `author` on every `BlogPosting` and case study
  point to the Person `@id`. A portfolio is not an `Organization`, so no
  `Organization` node for the site.
- Home (or CV) is a `ProfilePage` whose `mainEntity` is the Person, with
  `dateCreated` / `dateModified` (Google's profile page markup).
- Case studies: `CreativeWork` or `Article` with `author`, `datePublished`,
  `about`, `image`; clips as `VideoObject` (`thumbnailUrl`, `uploadDate`,
  `duration`). Snippets can use `SoftwareSourceCode`.
- **Recommendations are visible quotes, never markup.** No `Review` or
  `AggregateRating` about Alejandro: self-serving review markup is ignored
  by Google and can trigger a manual action.

## GEO: being the answer

AI engines answer questions like "who are good design engineers in Spain?",
"find a UX engineer who knows design systems" or "who is Alejandro Mejía?".
They cite pages that state facts plainly and consistently:

- **One bio, everywhere.** The same one-sentence bio and headline on Home,
  `SITE.description`, `llmsDetails`, the Person `description`, LinkedIn,
  GitHub and every talk or guest-post bio. Inconsistent titles split the
  entity.
- **`llmsDetails`** in `seo.const.ts` is a hand-written paragraph: name (both
  spellings), role, years of experience, specialties, notable work (cleared
  names only), stack, location and time zone, work mode, availability, and
  how to make contact.
- **Citable specifics** over adjectives: years, team sizes, component counts,
  performance numbers, adoption numbers.
- **Content in the raw HTML**: animated text, the CV and case-study copy are
  server-rendered (most AI crawlers don't run JavaScript).
- **AI crawlers allowed**: `SITE.aiCrawlers` keeps `search: true`. Keeping
  `training: true` too helps models know the entity; switching it off is the
  user's call, not a default.
- **Test the answers**: ask the target questions in ChatGPT, Perplexity,
  Claude and Gemini (or WebSearch them) and record whether the site or its
  profiles are cited, and what is cited instead.

## Off-site (recommendations, not code)

Most hiring searches start on LinkedIn and GitHub, and AI engines lean on
them. Report concrete actions:

- **LinkedIn:** headline with the exact role terms ("Senior Design Engineer ·
  Design Systems · React"), the site in the website field and in Featured
  (top case studies), "Open to work" visible to recruiters only if wanted,
  skills matching `knowsAbout`, and the recommendations the site quotes.
- **GitHub:** a profile README with the bio and a link to the site, pinned
  repos that back up the specialties, the site URL in the profile.
- **Cross-posting:** republish articles on platforms developers read
  (dev.to, Medium, Hashnode…) with a canonical link to the original.
- **Communities and directories:** design engineering communities, job
  boards and portfolio directories where companies look for this role.
  Verify each one is active (WebSearch) before recommending it.
- **Earned links:** talks, podcasts, open-source contributions, guest posts,
  former employers' or clients' credits pages.
- Don't create Wikipedia or Wikidata entries about yourself.

## Measurement

- Search Console: impressions and CTR for name queries and each role term;
  the pages that earn them.
- Umami events for the hiring conversions: CV download, email copied or
  clicked, LinkedIn/GitHub clicks, ⌘K "copy email".
- AI referral traffic segmented (`chatgpt.com`, `perplexity.ai`,
  `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`, and
  `utm_source=chatgpt.com`).
