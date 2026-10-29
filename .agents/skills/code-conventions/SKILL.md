---
name: code-conventions
description: House conventions for this Next.js + Payload project — file/folder naming, component file pattern, barrel policy, JSDoc style, the src/ project structure (components vs lib vs payload), styling rules (8px grid in rem, no Tailwind bracket values when a bare class exists), performance rules (pause off-screen work, compositor-only animation), the pitfalls already hit (images, GSAP, Lenis, hidden tabs), the Payload admin UX rules (content in the main column, settings in the sidebar, tabs/rows/collapsibles, labels and hints, row labels, menu groups; apply on every change to collections, globals, blocks or fields), and the rule for adding new dependencies. Apply when writing or reviewing any code in src/, including any Tailwind class names, CSS or inline styles.
user-invocable: false
---

# Code conventions

How code is organized, named, and written across this project. Apply
these rules to any code under `src/`. They are deliberately concise and grow
over time — when a new rule proves useful, add a sub-doc and link it here.

These override generic habits (e.g. arrow-function components, `index.ts`
barrels everywhere). When in doubt, follow the sub-doc; if a sub-doc is silent,
prefer the choice that keeps IDE fuzzy-search (`Cmd-P`) deterministic.

Sub-docs with mechanical rules end in a **Review checklist** of `rg`
commands. Before finishing any change, run the checklists of the sub-docs it
touches ([barrels.md](./barrels.md), [server-code.md](./server-code.md),
[imports.md](./imports.md), [styling.md](./styling.md),
[payload-admin-ux.md](./payload-admin-ux.md)) and fix
anything they print.

## Naming & Files

Everything is **kebab-case** — folders and files, including components. A
component is a folder with `index.tsx` plus prefixed siblings; its own hooks,
constants, types, and helpers go in dot-suffixed files (`header.hooks.ts`,
`header.const.ts`). Small components stay a single file; split only when they
grow.

See [file-naming.md](./file-naming.md).

## Component Pattern

`index.tsx` is the root; sub-components are `<name>-<sub>.tsx` siblings.
**Function declarations, never arrow functions** for anything named
(components, hooks, helpers, handlers) — inline callbacks may stay arrows.
Compound components export via `Object.assign(Root, { Sub })`.

See [component-pattern.md](./component-pattern.md).

## Styling (Tailwind & CSS)

Every pixel value sits on the **8px grid** (multiples of 8, plus only 1, 2, 4
and 12; 30px becomes 32px) and is written in **`rem`**, never `px`. Font
sizes are the exception: off the grid, but only through `text-*` tokens. On
Tailwind's spacing scale the class number is px ÷ 4 (32px → `w-8`). **Square
brackets are a last resort.** Tailwind v4 takes most values bare (`aspect-2/3`,
`z-60`, `max-w-112`, `duration-350`), and CSS variables use the `(--var)`
shorthand. Use brackets only when no token, bare value or shorthand exists, and
the value inside still follows the grid in rem. In `.css` files, end every line
that uses rem with its px value in a comment: `0.25rem; /* 4px */`.
**No raw inline CSS.** Never put CSS properties in a `style` prop: static
values are classes (initial animation states too, e.g. `opacity-0`), and
runtime values go through `toCSSVars` from `@/lib/utils` and are read with the
`(--var)` shorthand: `className="bg-(--overlay)" style={toCSSVars({ overlay: hex })}`.

See [styling.md](./styling.md).

## Icons

Generic UI glyphs (arrows, chevrons, close, menu, play, external link) come
from **`lucide-react`** with named imports (`import { ArrowUpRight } from
'lucide-react'`): Next optimizes the package, so each import ships only that
icon, and an npm import keeps reusable components self-contained.
**Bespoke** glyphs (brand marks, which Lucide doesn't ship, and icons drawn
for a specific design) are inline SVG in the component that uses them, as in
`src/components/ui/logo/`. Never wrap the set
in a string-keyed `<Icon name="…">` (Lucide's `DynamicIcon` or `icons` map
pull every icon into the bundle); if the CMS must pick icons by name, use a
small explicit map of the allowed ones.

## Hooks & Effects

**Never suppress `react-hooks/exhaustive-deps`.** When an effect must call
logic that reads the latest props/state without re-running (callbacks passed
in, values read inside observer/listener/timer callbacks), wrap it in React's
`useEffectEvent` instead of a "latest ref" or a trimmed dependency array. Call
Effect Events only from inside effects; never pass them down or list them as
deps.

## Self-Contained Components

Reusable components are **plug-and-play with clean removal**. A component owns
everything it needs and must not scatter required code into shared files: no
`globals.css` entries (inject global styles at runtime and remove them on
cleanup), no additions to the shared GSAP register (register plugins/eases in a
local module behind a `typeof window` check — no once-guard, registration is
idempotent), no private constants living elsewhere. The only allowed
coupling is a single mount point and genuinely shared utilities (`cn`, shared
hooks, `@/payload-types`). Test: *delete the folder + its mount line — is any of
its code still in a file it doesn't own?*

See [self-contained-components.md](./self-contained-components.md).

## Shared Utilities

**If a function knows nothing about the component it sits in, it belongs in
`src/lib/utils/`**, not in `<name>.utils.ts`. Examples are timing/promise
helpers, class/style helpers, math, formatting and object utilities. Check
`@/lib/utils` before writing a helper. When you spot a generic one inside a
component, move it in the same change. Don't wait for a second caller. Utils
files are grouped by topic (`async.ts`, `styles.ts`, `objects.ts`, `url.ts`).
Never use a catch-all `helpers.ts`.

See [shared-utilities.md](./shared-utilities.md).

## Performance

This site targets **top-tier web-vitals** — fast loads, smooth runtime — and
that is a hard requirement. The headline rule: **any per-frame or continuous
effect (rAF/Tempus loops, scroll animation, GSAP timelines, video, canvas) must
pause while off-screen**, using the shared `useInViewport` hook (`@/lib/hooks`) —
mandatory, never an opt-in flag. Also: respect `prefers-reduced-motion`, animate
only `transform`/`opacity` (compositor), write per-frame transforms via refs not
state, tick on the single shared Tempus loop, and lazy-load heavy client-only
payloads.

See [performance.md](./performance.md).

## Pitfalls

Bugs already hit on sites built this way (lazy images under clipped wrappers,
hydration flashes, GSAP and Tailwind transforms stacking, Lenis not reaching
the footer, frozen hidden tabs, scroll-reactive headers that re-render), each
with its fix. Skim it before writing motion, image or layout code.

See [pitfalls.md](./pitfalls.md).

## Component READMEs

Every **new reusable component** (anything reusable under `src/components/` —
effects, UI primitives, layout pieces, block renderers) ships with a
`README.md` in its own folder, written in the **same change** that adds the
component. It is the hand-off doc: what it does, setup, usage, configuration,
where to use it, dependencies, how to port it to another project, and gotchas —
enough that another agent can drop it into any project from the README alone.

See [component-readmes.md](./component-readmes.md).

## Barrels

A barrel (an `index.ts` that only re-exports) is allowed **only** as a `lib/`
domain's public surface (`lib/utils`, `lib/hooks`). The cost of a barrel
depends on what sits behind it, so keep each one small, side-effect free and
single-runtime (never re-export server-only code). No mega-barrels, no barrels
over component internals, no cycles. Code outside the folder imports through
the barrel (`@/lib/utils`, never `@/lib/utils/url`). A component's
`index.tsx` is its implementation, not a barrel.

See [barrels.md](./barrels.md).

## Server-Only Code

A server-only module in `src/lib/` (Payload Local API, `next/headers`, cached
data loaders, secrets) is named `<name>.server.ts` **and** starts with
`import 'server-only'`. Never add that import to anything the Payload config
loads: the Payload CLI runs it outside Next, where the guard throws. Route
files and components need no marker.

See [server-code.md](./server-code.md).

## UI copy

The site is **English only**: no locales, no URL prefixes, no localized CMS
fields. **Never hard-code UI copy** (labels, buttons, messages) in a
component: add it to `COPY` in `src/lib/constants/copy.ts` and import it from
`@/lib/constants/copy`, in Server and Client Components alike. Fill `{name}`
placeholders with `formatMessage()` from `@/lib/utils`. CMS content stays in
the CMS.

## Imports

Use the configured path aliases — **never** traverse up with `../`. Same-folder
siblings use `./`; anything outside the current folder uses `@/…` (or
`@payload-config`). The only exception is the Payload-generated `(payload)`
route files.

See [imports.md](./imports.md).

## JSDoc & Comments

Every exported symbol carries a concise JSDoc: a one-line summary, and an
`@example` only when it genuinely clarifies usage. Do **not** document
TypeScript props/params unless the meaning is non-obvious. Always add inline
comments explaining *why* for any non-trivial logic. Keep it short — no walls
of comment text.

See [jsdoc.md](./jsdoc.md).

## Project Structure

`src/components/` renders UI to visitors · `src/lib/` is non-visual,
project-wide code (hooks, utils, integrations, constants) · `src/payload/`
owns everything CMS (config, collections, globals, blocks configs, access,
hooks, admin-only components). The one rule: *renders to the public site →
`components/`; CMS config or admin-panel UI → `payload/`; everything else →
`lib/`.*

`src/components/` is for **reusable** UI. Components that belong to one page
live next to that route in a `_components/` private folder
(`app/(frontend)/_components/`, `app/(frontend)/writing/_components/`). Keep
their prefixed filenames, but don't add a folder named after the page. Move them to `src/components/` once a second,
unrelated page needs them.

See [project-structure.md](./project-structure.md).

## Payload Admin UX

Every change under `src/payload/` also leaves the admin organized, unasked.
The **main column is content only**, in page order. **Document settings go in
the sidebar** (slug, publish date, topics, featured). Use tabs when a
document covers several topics (Content first, SEO last), rows for short
related fields, and closed collapsibles for optional settings. Every field
gets a clear English label plus a hint when it isn't obvious. Arrays show
their content in a row label. Every collection and global sets a menu group
from `ADMIN_GROUPS`. Arrange with **unnamed** tabs, rows and collapsibles
only, so a layout change never needs a migration. Gotcha: with the SEO
plugin's `tabbedUI`, `fields[0]` must be a `tabs` field or the sidebar stops
working.

See [payload-admin-ux.md](./payload-admin-ux.md).

## Adding Dependencies

**Mandatory:** before using any new library, check whether a skill exists for
it (GSAP, Zod, React Hook Form, etc.) and install it into `.agents/skills/`
before writing code with that library. Standardize on **pnpm** always.

See [adding-dependencies.md](./adding-dependencies.md).
