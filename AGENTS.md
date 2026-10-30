<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project skills

Skills live in `.agents/skills/` (linked from `.claude/skills/`):

- **`code-conventions`**: how code is organized and written. Apply it to
  any change under `src/`, and run the review checklists of the sub-docs a
  change touches.
- **`alejandromejia-brand`**: the brand's look, motion and voice. Apply it to
  any UI work; its research is in `BENCHMARK.md`.
- **`page-building`**: the workflow for any new page or section.
- **`seo-geo-audit`**: SEO and AI-search audits aimed at being found for
  design engineer, UX engineer and frontend developer roles. The
  `seo-expert` agent (`.claude/agents/`) runs it.
- **`commits`**: Conventional Commits, kept short; work on `dev`, release to
  `main`. Follow it whenever committing.
