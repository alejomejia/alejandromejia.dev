# CommandMenu

The ⌘K menu: search over the site's pages and content, a few actions and the
links out.
On phones it is the navigation (the header's trigger reads "Menu").

## What it does

- **⌘K / Ctrl+K** opens and closes it anywhere; `CommandMenuTrigger` opens it
  from a button (⌘K or Ctrl K from `sm` up, "Menu" below).
- **Rows:** Pages (Home, the Header global's links, CV), Actions
  (copy the email, copy this page's link, Theme: Light / Dark / System) and
  Links (email, the Site settings profiles, RSS, the source code). Rows without data, like a
  missing email, are left out. The current page and theme have a check.
- **Search** ranks label prefix, then word prefix, then substring and
  keywords, then the letters in order (`wrt` finds Writing).
- **Content search:** typing also finds every published page, case study,
  chapter and writing entry, under Pages, Work and Writing (at most five rows
  each in Work and Writing; a chapter shows its case study after the title).
  They come from `/search.json` (`src/app/search.json/route.ts`), a small
  JSON list read from a cached CMS query. The menu fetches it once per visit,
  when it first opens or its trigger is hovered or focused, keeps it in
  memory for every later opening, and browsers reuse it for five minutes.
  Filtering runs in memory on a deferred query (`useDeferredValue`), so typing
  never waits for the list. If the fetch fails, the menu keeps its own rows
  and tries again on the next opening.
- **Keyboard:** the input is an ARIA combobox over a listbox; ↑↓ move (and
  wrap), Enter opens, Esc closes. The pointer highlights the row under it.
- **Native modal `<dialog>`:** the browser traps focus, handles Esc and
  places it above everything. On touch screens the dialog takes focus
  instead of the input, so the keyboard doesn't cover the list.
- **Motion:** scales from 0.96 and fades (250ms `ease-out-quint`) with
  `@starting-style`; closes instantly when it navigates, so it never shows in
  the page transition. Reduced motion: no transition.
- Copy actions show "Copied" on the row, then close. Lenis stops while it is
  open.

## Setup

Mount `CommandMenu` once, under the Site settings provider and the
root Lenis. The site header does it with its own links:

```tsx
<CommandMenu navItems={navItems} />
```

## Usage

```tsx
import { CommandMenu, CommandMenuTrigger } from '@/components/layout/command-menu'

<CommandMenuTrigger />
```

Use the named `CommandMenuTrigger` export, never a `CommandMenu.Trigger`
property: Server Components only see a Client Component's own exports.

Rows are built in `useCommandItems` (`command-menu.hooks.ts`). Add a row
there with a `group`, a `label`, optional `keywords` and `detail`, and an
`href` or a `run`. A `run` that returns `'keep-open'` shows "Copied" before
closing. Content search rows come from `useSearchItems`; to search a new
collection, add it to `src/lib/cms/search.server.ts`.

## Configuration

| Prop       | Type        | Default | Description                                      |
| ---------- | ----------- | ------- | ------------------------------------------------ |
| `navItems` | `NavLink[]` | -       | The main links; Home and CV are added. |

`CommandMenuTrigger` takes `className`.

## Dependencies

- `lenis/react` (`useLenis`), `lucide-react` (`ArrowUpRight`, `Check`).
- `@/lib/cms/site-settings-provider` (email and profiles), `@/lib/styles/theme-preference` and
  `useThemePreference` (`@/lib/hooks`), `@/lib/constants/copy` (`COPY.commandMenu`,
  plus `header`, `footer`, `theme`), `SITE_ROUTES`.
- `@/lib/cms/search` (`SEARCH_INDEX_PATH`, `SearchEntry`) and the
  `/search.json` route.

## Porting to another project

1. Copy the folder.
2. Rewrite `useCommandItems` for that site's routes, settings and actions.
3. Serve a `SearchEntry[]` JSON at `SEARCH_INDEX_PATH`, or leave it out: a
   failed fetch only hides the content rows.
4. Without Lenis, drop `useLenis` and the `stop()` / `start()` calls.
4. Replace `COPY` with that project's copy.

## Gotchas

- Open state lives in a module store (`command-menu.store.ts`), not context,
  so triggers work anywhere without a provider. Each opening bumps a session
  number that remounts the panel, so the search starts empty while the old
  contents stay visible during the fade-out.
- `data-lenis-prevent` on the dialog lets the list scroll natively while
  Lenis is stopped.
- Feed and `mailto:` rows load as documents (`location.assign`); only pages
  go through the router and the page transition.
