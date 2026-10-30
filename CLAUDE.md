@AGENTS.md

# alejandromejia.dev

Alejandro Mejía's personal site: portfolio and blog of a **design engineer**,
built to land a senior role. Case studies, essays, notes, snippets and live UI
experiments, all edited in Payload. Minimal surfaces, expressive details: the
interactions are the proof of skill.

A Next.js + Payload site. Read before working (private planning docs, kept
out of the repo):

- [`PROJECT-PLAN.md`](./PROJECT-PLAN.md): stack, content model, visual
  direction, build phases, open questions. Work one phase at a time.
- [`CONTENT-IDEAS.md`](./CONTENT-IDEAS.md): the content backlog and positioning.
- [`CONTENT-MODEL.md`](./CONTENT-MODEL.md): every content type, what goes in it,
  and its fields.

## Rules

- Follow `code-conventions` for all code in `src/`, and
  `page-building` for every page or large section.
- Follow `alejandromejia-brand` for every UI change (research behind it:
  [`BENCHMARK.md`](./BENCHMARK.md)).
- Every Payload schema change ships its migration in the same change
  (`pnpm migrate:create <name>`); dev mode's auto-push proves nothing.
- English only, in the site and in the codebase.
- Commits follow the `commits` skill: Conventional Commits, short messages,
  no AI attribution. All work goes to `dev`; `main` is production and only
  moves when the user asks to release. Commit only when asked.
- Never publish a client's or employer's brand assets (logos, licensed fonts)
  or confidential material without the owner's permission.

## Local ports

Postgres runs on host port **5441** (`POSTGRES_HOST_PORT` in `.env`). If :3000
is taken, run `PORT=3003 NEXT_PUBLIC_SERVER_URL=http://localhost:3003 pnpm dev`.
