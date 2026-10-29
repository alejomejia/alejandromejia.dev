# Payload Admin UX

Editors live in the Payload admin, so its layout is part of the product. Every
change under `src/payload/` (collections, globals, blocks, fields, plugins)
also leaves the admin organized by these rules, even when the request was only
"add a field". If a change would restructure an editor's screen beyond these
rules, propose it before building it.

Admin labels, hints and group names are in **English** unless the project's
own instructions say otherwise.

## The rules

1. **The main column is content only.** It holds what visitors see, in the
   order it appears on the page (title, hero, body, blocks).
2. **The sidebar holds document settings:** slug, publish date, topics,
   featured and order, roles, on/off switches. Set `admin: { position: 'sidebar' }`.
   `slugField()` already does.
3. **Tabs when a document covers more than one topic.** Content comes first
   and SEO last (the SEO plugin adds that tab).
4. **Group related fields.** Short related fields sit side by side in a `row`
   (`admin: { width: '50%' }`), e.g. label + URL. Optional or advanced
   settings go in a `collapsible` with `initCollapsed: true`.
5. **Every field reads clearly.** Give it a plain label (`label`, and
   `labels: { singular, plural }` on arrays and blocks), plus a one-line
   `admin.description` when it isn't obvious. The hint says where the value
   shows on the site ("Shown in the header and in the side menu").
6. **Lists are scannable.** Arrays get a `RowLabel` that shows the row's
   content ("01 — Projects", "Column 02 — Half"), never the generic "Row 01".
   They start collapsed (`initCollapsed: true`) and set `maxRows` where the
   design has a limit. Use `linkRowLabel('<Item name>')` from
   `@/payload/fields/link` for any array of `link()` rows. `linkGroup()`
   wires it already.
7. **The admin menu is grouped** with `ADMIN_GROUPS` from
   `@/payload/admin-nav`: Content (work, writing, craft, recommendations,
   topics, profile) · Media (media, documents) · Site (header, footer, site
   settings, redirects) · Admin (users). Plugin
   collections set theirs through the plugin's overrides
   (`overrides.admin.group`). A new collection or global always gets a group.
8. **Layout changes never touch stored data.** Use **unnamed** `tabs`, `row`
   and `collapsible`. They only arrange fields, so no migration is needed.
   Named tabs and groups nest the data and need a migration plus a data move.
   Decide that on purpose, never as a side effect of tidying up.

## Gotchas

- **The SEO plugin's `tabbedUI` breaks the sidebar.** With
  `seoPlugin({ tabbedUI: true })`, a collection whose `fields[0]` is not a
  `tabs` field gets **every** field wrapped into one tab. Payload ignores
  `position: 'sidebar'` inside tabs, so the slug and dates drop under the
  content. Make `fields[0]` an unnamed `tabs` field with a "Content" tab. The
  plugin then appends its SEO tab there and leaves the top-level sidebar
  fields alone.
- **Sidebar only works for top-level fields.** Inside a tab, group or
  collapsible, `position: 'sidebar'` does nothing.
- **Menu order follows the collections array.** Payload orders groups by
  their first collection, and plugins append theirs after ours.
  `adminNavOrderPlugin` sorts collections by `ADMIN_GROUPS`, so it must stay
  the last entry in `plugins`. Globals always list after collections.
- **New admin components need the import map.** After adding a `RowLabel` or
  any other admin component path, run `pnpm generate:importmap`. The dev
  server also regenerates it.
- **Defaults become column defaults.** A static `defaultValue` (including
  `link({ defaults })`) is written into the Postgres schema. When a new
  column gets one, existing rows take it. Pick a default that keeps current
  content working, e.g. `type: 'custom'` for a link that held a URL.

## Verify

A layout-only change must leave the data shape alone:

```sh
pnpm generate:types                # the payload-types.ts diff may only reorder or add comments
pnpm migrate:create --skip-empty   # must not write a migration file
```

Then look at the edit screen of every collection or global you touched, on
the create view and on an existing document.

## Review checklist

Run on every change under `src/payload/`. Every command should print nothing.

```sh
# A collection or global without a menu group
rg --files-without-match "group: ADMIN_GROUPS\." src/payload/collections/*.ts src/payload/globals/*/*.config.ts

# A link array wired to the row label by hand instead of linkRowLabel()
rg -n "RowLabel: '@/payload/components/link-row-label" src/payload
```

Then check by hand:

- Every SEO plugin collection starts with an unnamed `tabs` field.
- Every array lists a `RowLabel`: `rg -n "type: 'array'" src/payload`.
  Arrays hidden from the admin (`admin.disabled`) don't need one.
- No content field sits in the sidebar, and no setting sits in the main column.
