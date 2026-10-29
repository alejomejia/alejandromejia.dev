---
name: seo-geo-audit
description: SEO + GEO (generative engine optimization) audit of alejandromejia.dev, Alejandro Mejía's design engineer portfolio, aimed at one goal - being found and cited when someone wants to hire a design engineer, UX engineer or frontend developer. It audits the codebase and, once it exists, the live site - crawlability, indexing, robots/sitemap, AI crawler access, llms.txt, meta/OG tags, semantic HTML, accessibility, the Person entity and structured data, Core Web Vitals, case-study and writing quality (E-E-A-T), hiring-intent coverage and off-site profiles. It produces a prioritized findings report with concrete fixes. Use when asked to audit SEO/GEO, improve rankings or AI visibility, check the site before or after launch, or make Alejandro easier to find for hiring.
argument-hint: "[production URL | none]"
---

# SEO + GEO Audit

Audit alejandromejia.dev so it ranks in search engines **and** gets cited by
AI answer engines (ChatGPT Search, Claude, Perplexity, Google AI
Overviews/AI Mode, Copilot) when people look for someone to hire.

**The site:** the English-only portfolio and blog of Alejandro Mejía, a
Senior Design Engineer in Navarra, Spain (design systems, React / Next.js /
TypeScript, motion, accessibility, performance). Visitors are hiring
managers, recruiters and design/engineering leads at product companies,
hiring remote or in the EU.

**The goal:** be found for three roles, in this order: **design engineer**,
**UX engineer**, **frontend developer**. Every finding is judged by whether
it helps one of those people find, trust or contact Alejandro.

Reference files (read them as each step needs them):
- [checklist.md](./checklist.md): the full checklist, severity scale and status codes. **This is the source of truth for what "set up correctly" means.**
- [hiring-playbook.md](./hiring-playbook.md): target queries, page roles, the Person entity, GEO and off-site work for a hire-me portfolio.
- [codebase-audit.md](./codebase-audit.md): where everything lives in this repo and how to audit the code.
- [production-audit.md](./production-audit.md): commands for auditing the live site.

## Step 1: Establish scope (production URL)

Resolve the production URL in this order:
1. A URL given in the request or `$ARGUMENTS`.
2. Non-local values in the repo: `NEXT_PUBLIC_SERVER_URL` in `.env.production` or
   deployment config (`docker-compose.prod.yml`, CI files), `README.md`.
   Ignore `localhost`. Never print secrets from `.env*` files; read only the
   URL variable.
3. Otherwise **ask**:
   - Interactive session: ask the user directly (AskUserQuestion): "What's the production URL? (or: not launched yet / staging URL only)".
   - Running as a subagent (no way to ask the user): **stop before auditing** and return only a short `NEEDS INPUT` message. It should name the missing production URL, list where you looked, and say you'll run a codebase-only audit if there's no production site. The parent agent asks the user and resumes you with the answer.

Then pick a mode:
- **Full mode:** production URL known. Audit codebase and live site, and cross-check them (the deployed site may lag the repo, run a different branch, or be altered by the CDN).
- **Pre-launch mode:** no production site yet. Audit the codebase (and `localhost` if the app runs). Mark every `[prod]` item N/A (pre-launch) and add a **launch checklist** section to the report.
- A staging URL is not production. Audit it for rendering/HTML only, and expect `noindex` there (it's correct on staging).

## Step 2: Load the facts

Read the facts the site must state consistently: the Profile global
(headline, intro, availability, location, experience, skills; seeded from
`scripts/seed/`), `SITE` in `src/lib/seo/seo.const.ts`, the Site Settings
social links, `CONTENT-IDEAS.md` (positioning) and the brand skill's identity
section. Note every place where they disagree; entity consistency is a core
GEO signal. Never invent facts (clients, metrics, titles): list missing ones
under "Needs from you".

## Step 3: Audit

1. **Codebase:** follow codebase-audit.md and apply every `[code]`/`[both]` item of the checklist.
2. **Production (full mode):** follow production-audit.md and apply every `[prod]`/`[both]` item. Always check AI bot access through the CDN/WAF, and whether content exists in the raw HTML.
3. **Hiring layer:** apply hiring-playbook.md: query coverage, page roles, the Person entity, GEO answers and off-site profiles.
4. **Search check (full mode, or pre-launch for the competitive picture):** WebSearch the target queries from the playbook and the name queries. Note who ranks, what formats win, and whether the site or its profiles appear.

Rules:
- Evidence for every finding: file:line, URL + command output, or header/HTML snippet. No evidence means UNVERIFIED, not FAIL.
- Verify before claiming. Re-check anything surprising, such as a noindex, a 403, or a canonical mismatch.
- Distinguish code problems from content problems (fixed in the Payload admin) and off-site problems (LinkedIn, GitHub, communities).
- Honest only: never recommend a title, skill, client or metric Alejandro can't back up, fake reviews, hidden text, doorway pages or keyword stuffing.
- Respect confidentiality: client and employer names, logos and material appear only with permission (CLAUDE.md rule). Recommend anonymized wording where needed.
- Stay current: search guidelines and AI-crawler names change. When unsure whether a practice still holds, check official docs (Google Search Central, Bing Webmaster, OpenAI/Anthropic/Perplexity crawler docs) with WebSearch/WebFetch.
- Don't modify code unless the request explicitly asks you to apply fixes. When applying fixes, follow the `code-conventions` skill (and `alejandromejia-brand` for anything visible), keep changes minimal, ship a migration with any Payload schema change, and run `pnpm exec tsc --noEmit` and `pnpm lint` afterwards.

## Step 4: Report

Use this structure:

```markdown
# SEO + GEO Audit — alejandromejia.dev (<date>)

**Mode:** Full (<url>) | Pre-launch (codebase only)

## Summary
<3–5 sentences: overall state, biggest risks, biggest opportunities for being found by people hiring.>
Scorecard: P0 <n> · P1 <n> · P2 <n> · P3 <n> · Passed <n> · N/A <n> · Unverified <n>

## Critical & high-priority findings
### [P0] <title>
- **Where:** <file:line | URL>
- **Evidence:** <snippet/output>
- **Impact:** <why it matters for ranking / AI citation / a recruiter's decision>
- **Fix:** <concrete change, with code or exact admin steps>
- **Owner:** code | content (Payload) | off-site | hosting/CDN

## Medium & low findings
<same format, can be condensed into a table>

## Hiring visibility
<query map: each target query → the page meant to rank, current status, gap and next step; the Person entity; GEO answers; off-site profile actions>

## Checklist results
<section-by-section table: item → PASS/FAIL/WARN/N/A/UNVERIFIED (+ short note)>

## Launch checklist   ← pre-launch mode only
<ordered list: env vars, Search Console/Bing verification, sitemap submission, WAF bot settings, IndexNow, PSI run, profile links updated to the new domain…>

## Needs from you
<data/access needed (Search Console export, profile URLs, permissions for client names, metrics) and what each unlocks>
```

Order findings by severity, then effort (quick wins first within a severity).
Keep it actionable. Every FAIL/WARN has a specific fix.
