# Adding Dependencies

## pnpm, always

Every install/add/remove goes through **pnpm**. Never `npm install` or `yarn`
in this project. A stray `package-lock.json` or `yarn.lock` is a bug —
delete it.

```bash
pnpm add <pkg>
pnpm add -D <pkg>
pnpm dlx <tool>        # instead of npx
```

## Check for a skill first — mandatory

Before writing code against any non-trivial new library, check whether a skill
exists for it and install it into `.agents/skills/` **before** writing that
code. This is required, not optional. Libraries that have skills we use:

- GSAP (`gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-react`, …)
- Payload (`payload`), plus framework skills (Next, React, Tailwind)

Workflow:

1. Search the skill registry (use the `find-skills` skill, or check an existing
   project's `.agents/skills/`).
2. If a skill exists, add it so it is tracked in `skills-lock.json` and
   symlinked into `.claude/skills/`.
3. Read the skill, then write the integration code following it.
4. If no skill exists for a library we will lean on heavily, consider authoring
   one — future projects reuse it.

## Version pinning

Pin plugin/companion packages to the **same major/minor** as their core so the
ecosystem stays in lockstep. In particular, every `@payloadcms/*` package must
match the installed `payload` version.
