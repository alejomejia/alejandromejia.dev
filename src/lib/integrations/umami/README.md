# Umami integration

[Umami Cloud](https://cloud.umami.is) measures the site for marketing: pageviews, sources,
UTM campaigns and the events below. It is **cookieless** (no cookies, no
local storage, no personal data), so it needs no consent banner.

## Turning it on

Tracking is opt-in and production-only. `getUmamiConfig()` (`umami.server.ts`)
returns a config, and the frontend layout mounts `<UmamiAnalytics>`, only when
all of these hold:

- `UMAMI_ENABLED=true`, set on the production deployment alone;
- `UMAMI_WEBSITE_ID` is set;
- the app is a production build (`next dev` never tracks).

`UMAMI_DOMAINS` (optional) also stops the script from reporting from any other
host. The values are read at build time too (static pages bake them in), so
after changing one, redeploy. See `.env.example`.

## Files

| File | What it does |
| --- | --- |
| `umami.const.ts` | `UMAMI_EVENTS`: every event name. |
| `umami.types.ts` | `UmamiEventData`: each event's properties, type-checked by `track`. |
| `umami.server.ts` | `getUmamiConfig()`: the env flag and settings. |
| `umami-analytics.tsx` | Loads the script and tracks links by destination. |
| `track.ts` | `track(event, data)`: send an event from any Client Component. Events sent before the script loads are queued. With tracking off it does nothing. |

## Events

Pageviews (with referrer, UTM tags, country, device) are tracked by the script,
client-side navigations included.

### Events

Tracked by `<UmamiAnalytics>` from the link's destination, wherever the link
sits (header, footer, the ⌘K menu, content).

| Event | When | Properties |
| --- | --- | --- |
| `contact_email` | A `mailto:` link | `page` |
| `outbound_link` | Any link to another site (LinkedIn, GitHub, the repository) | `page`, `host`, `url` |

A link that tracks its own event carries `data-track-ignore` so the link
tracker skips it.

## Suggested reports in Umami

- **Goals**: `contact_email`, and `outbound_link` to LinkedIn and GitHub.
- **UTM** and **Attribution**: which posts and profiles bring visitors.

## Adding an event

1. Add its name to `UMAMI_EVENTS` and its properties to `UmamiEventData`.
2. Call `track(UMAMI_EVENTS.name, { … })` where it happens.
3. List it in the tables above.
