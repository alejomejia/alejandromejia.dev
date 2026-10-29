# Naming & Files

Deterministic names so `Cmd-P` / fuzzy search always finds the right file.

## Kebab-case, always

Every folder and file name is lowercase with dashes — **including components**.

```
components/header/            not  components/Header/
header-mobile-menu.tsx        not  HeaderMobileMenu.tsx
use-breakpoint.ts             not  useBreakpoint.ts
```

The React component *inside* the file is still PascalCase (`function Header()`).
Only the file/folder name is kebab-case.

## Single file until it isn't

A component that is small stays one file. Split into a folder the moment it
grows sub-components, its own hooks, or a meaningful constants table.

```
# Small — one file
components/ui/badge.tsx

# Grown — a folder
components/layout/header/
├── index.tsx                 # the component root
├── header-menu.tsx           # sub-component
├── header-mobile-menu.tsx    # sub-component
├── header-lang-switcher.tsx  # sub-component
├── header.hooks.ts           # component-scoped hooks
├── header.const.ts           # component-scoped constants
├── header.utils.ts           # component-scoped helpers (generic ones → src/lib/utils)
└── header.types.ts           # component-scoped types
```

## Two suffix styles, on purpose

- **Sibling sub-components** repeat the prefix with a dash: `header-menu.tsx`.
  They are part of the component's rendered surface.
- **Non-component companions** use a dot suffix: `header.hooks.ts`,
  `header.const.ts`, `header.utils.ts`, `header.types.ts`. They hold logic,
  values, or types — not JSX.

Rule of thumb: **renders JSX → dash. Everything else → dot.** A `.context.ts`
holding only `createContext` is `.ts`; if it needs a provider with JSX, that
provider is a dashed `header-provider.tsx`.

## Prefix every sibling

Repeat the folder name on every file inside it (`header-*`, `header.*`). Never
leave bare files like `menu.tsx` or `const.ts` inside a component folder — the
prefix is what makes `Cmd-P "header"` surface the whole component and nothing
else.

## Where a name comes from

The folder name is the component/feature name in kebab-case. The `index` file
is the only unprefixed file in the folder, and it is the sole public entry.

## `.server.ts` marks server-only modules

A server-only module in `src/lib/` puts `.server` before the extension
(`lib/cms/writing.server.ts`, `lib/seo/site-index.server.ts`) and starts with
`import 'server-only'`. Components and route files never use it. See
[server-code.md](./server-code.md).
