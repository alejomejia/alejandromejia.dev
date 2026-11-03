---
name: commits
description: How to commit in this repo. Conventional Commits 1.0.0 with short messages, the dev/main branch model, grouping changes into clean logical commits that showcase seniority to anyone reading the history, the checks to run first, and what must never be committed or added to a message (AI attribution, secrets, private files). Use whenever the user asks to commit, push, merge, release or name a commit.
---

# Commits

Every commit follows [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/),
kept short. Commit only when the user asks; never push unless they ask too.

## The history is part of the portfolio

Recruiters and tech leads will read this history the way they read the
code, so every commit should look like a senior engineer's work:

- **One concern per commit**, in an order that tells the story (a feature
  lands with its migration, not three commits later as a fix).
- **Vendored code apart from authored code**: third-party skills, generated
  files and dependency bumps never share a commit with your own work.
- **Short messages**: the subject line says it all. Seniority shows in the
  grouping and the wording, not in long bodies.
- **Propose the grouping first** when it isn't obvious, before committing.
- **Unpushed history can be reshaped** (reset, split, reword) to read
  cleanly; say so when a rewrite would help. Pushed history is never
  rewritten.

## Branches

- **`dev`**: all work lands here. Commit on `dev` unless told otherwise.
- **`main`**: the production, public version. Never commit to it directly.
  When the user asks to release, fast-forward it from `dev`
  (`git switch main && git merge --ff-only dev`, then back to `dev`). The
  first time, create it from `dev` (`git branch main dev`).
- Never use git worktrees, and don't create other branches unless asked.

## Message format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

- **Description:** imperative, starts lowercase, no period, English. Aim for 50
  characters, never more than 72 for the whole first line. Say what changed,
  not how ("add recommendations block to home", not "updated some files").
- **Body:** none by default. Add one only for a breaking change or when a
  reviewer truly couldn't guess the reason; then one short line, after a
  blank line.
- **Breaking changes:** `!` before the colon (`feat(work)!: …`) plus a
  `BREAKING CHANGE: <what breaks>` footer. Here that means a public URL
  changes or a migration drops data.
- No em dashes, no emojis, no ticket noise.

### Types

| Type | Use for |
|---|---|
| `feat` | Something new a visitor or editor can see or use |
| `fix` | A bug fix |
| `refactor` | Code change with no behavior change |
| `perf` | Faster or lighter, same behavior |
| `style` | Formatting only (Prettier, whitespace). **Not** CSS or design changes: those are `feat` or `fix` |
| `docs` | READMEs, CLAUDE.md, AGENTS.md, planning docs, skills |
| `test` | Tests only |
| `build` | Dependencies, Next/Payload/Tailwind config, Docker |
| `ci` | CI workflows |
| `chore` | Anything else that ships nothing (gitignore, scripts, seed tweaks) |
| `revert` | Reverting a commit (`revert: <original description>`, footer `Refs: <sha>`) |

### Scopes

Optional, lowercase, one word: the area touched. Prefer these:
`home`, `work`, `writing`, `craft`, `cv`, `recommendations`,
`layout`, `ui`, `effects`, `cms`, `seed`, `migrations`, `seo`,
`icons`, `docker`, `deps`, `skills`. Leave the scope out when a change spans
many areas.

### Examples

```
feat(home): move recommendations to the end
fix(recommendations): match link hover to footer links
feat(icons): switch favicon letter to A
refactor(effects): share halftone render loop
build(deps): bump next to 16.1.2
docs(skills): add commits skill
feat(cms)!: rename work slug field

BREAKING CHANGE: case study urls change from /work/<id> to /work/<slug>
```

Too long or vague, don't:

```
feat: Updated the home page and also fixed some bugs in recommendations and changed icons.
fix: stuff
```

## Never

- No `Co-Authored-By` trailer, "Generated with Claude Code" line, session
  link or any other AI attribution, in commits or pull requests.
- Never commit secrets or private files: `.env*` (except `.env.example`),
  `cv.pdf` (has a phone number), database dumps, media uploads, or a client's
  or employer's brand assets and confidential material (see CLAUDE.md).
- Never `git add -A` or `git add .` blindly, never `--no-verify`, never
  rewrite pushed history, never force-push `main`.

## Workflow, when asked to commit

1. **Look:** `git status` and `git diff` (plus `git diff --staged`). Know
   every changed file before staging any.
2. **Check:** if code changed, run `pnpm typecheck`, `pnpm lint` and `pnpm test`
   (and `pnpm test:e2e` when a change touches pages, layout or interactions).
   If any fails, stop and report; don't commit broken code unless the user
   says so.
3. **Group:** split the changes into logical commits, one concern each (a
   feature, a fix, a docs update). A Payload schema change and its migration
   go in the same commit. Unrelated edits in one file: commit the file with
   its main concern and mention it only if it matters.
4. **Stage by path:** `git add <paths>` per group, then
   `git diff --staged --stat` to confirm the group is exactly right.
5. **Commit:** `git commit -m "<type>(<scope>): <description>"`, adding
   `-m "<body>"` only when needed.
6. **Report:** list the new commits (`git log --oneline <base>..HEAD`) and
   anything left uncommitted on purpose.
