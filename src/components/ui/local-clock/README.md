# LocalClock

The current time in a time zone, `HH:mm` plus the zone's short name
(`14:32 CET`), updated at the start of every minute.

## What it does

- Renders only in the browser: pages are cached, so a server-rendered time
  would be stale. The server renders an invisible `00:00` with tabular
  figures, the same width as the real time, so nothing shifts when it fills
  in.
- One timer per minute, aligned to the minute boundary, and a refresh when
  the tab becomes visible again (hidden tabs throttle timers).
- An unknown time zone renders the placeholder instead of throwing.

## Setup

None.

## Usage

```tsx
import { LocalClock } from '@/components/ui/local-clock'

<LocalClock timeZone="Europe/Madrid" />
<LocalClock timeZone="America/Bogota" showZone={false} />
```

## Configuration

| Prop        | Type      | Default | Description                                  |
| ----------- | --------- | ------- | -------------------------------------------- |
| `timeZone`  | `string`  | -       | IANA time zone, e.g. `Europe/Madrid`.        |
| `showZone`  | `boolean` | `true`  | Shows the zone's short name after the time.  |
| `className` | `string`  | -       | Classes for the wrapping `<span>`.           |

## Where to use it

The footer, next to the location (the site reads it from the Profile
global's time zone). Inline in text; it inherits the font and color.

## Dependencies

- `@/lib/utils` (`cn`). The minute subscription and formatting are in
  `local-clock.utils.ts`.

## Porting to another project

Copy the folder; repoint `cn` or drop it.

## Gotchas

- The zone name comes from `Intl` with the `en-GB` locale, which prints
  `CET` / `CEST` for Spain; other zones may print an offset (`GMT-5`).
- It renders a `<time>` element whose `dateTime` is the `HH:mm` value.
