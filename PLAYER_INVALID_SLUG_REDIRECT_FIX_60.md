# Player invalid slug redirect fix — upload 60

## Problem
Vercel logs still showed `/player/...` 404s for doubles-team and uncatalogued slugs, for example:

- `/player/detiuc-khromacheva`
- `/player/arribage-olivetti`

These URLs can come from old generated links, crawlers, stale sitemap entries, or doubles-team strings accidentally treated as singles players.

## Fix
Added a final safety net in `middleware.ts`:

- `/player/<known-canonical-player>` still works normally.
- `/player/<unknown-or-doubles-team-slug>` now redirects to `/players?from=invalid-player` instead of returning 404.
- Existing nested/broken player paths are still normalized first.

## Extra cleanup
Hardened player subscription APIs:

- `POST /api/subscribe-player` now accepts only canonical known players.
- `GET /api/send-player-alerts` skips old invalid player subscriptions instead of sending links to bad player pages.

## Validation
- `npx tsc --noEmit` passes.
- `next build` compiled and passed TypeScript; sandbox timed out during page-data collection, not during code/type checks.
