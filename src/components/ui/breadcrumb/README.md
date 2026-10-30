# Breadcrumb

A small caption trail at the top of an interior page: `Home / … / current
page`. Home comes first automatically; the last crumb is the current page and
renders as plain text with `aria-current="page"`.

## Setup

None. It is a client component and can be rendered from server components.

## Usage

```tsx
import { Breadcrumb } from '@/components/ui/breadcrumb'

<Breadcrumb crumbs={[{ label: COPY.writing.title, href: '/writing' }, { label: entry.title }]} />
```

Render the same trail as structured data with `breadcrumbJsonLd()` from
`@/lib/seo/json-ld`.

## Configuration

| Prop        | Type      | Default | Description |
| ----------- | --------- | ------- | ----------- |
| `crumbs`    | `Crumb[]` | -       | The trail after Home: `{ label, href? }`. |
| `className` | `string`  | -       | Extra classes on the `<nav>`. |

## Where to use it

Interior pages two or more levels deep (a writing entry, a case study chapter).
Not on the home page.

## Dependencies

`Link` from `@/components/ui/link`, `COPY` from `@/lib/constants/copy`
(`breadcrumb.label`, `breadcrumb.home`), `cn`.

## Porting to another project

Copy the folder, and replace `COPY.breadcrumb` with that project's labels.
