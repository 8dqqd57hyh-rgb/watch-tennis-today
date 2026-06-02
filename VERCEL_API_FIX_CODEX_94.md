# Vercel API warning + stale watch URL fix

## What changed

### `/api/matches`
- Reduced noisy Vercel warnings when API-Tennis returns temporary `500` responses for `get_fixtures`.
- Added limited-concurrency fixture fetching so long player-form requests do not fan out into many simultaneous external calls.
- Kept the endpoint resilient: failed API chunks are skipped and the route can still return live/archive data with HTTP 200.
- Kept API provider debugging available behind `DEBUG_API_TENNIS=1`.

### `/watch/[slug]`
- Googlebot/crawlers no longer trigger a temporary `307` redirect for stale match URLs when the slug still contains player names and a match id.
- Instead, stale bot requests get a lightweight archived-style match page, avoiding redirect noise and unnecessary live feed loading.

## Validation
- `npx tsc --noEmit --pretty false` passed.
- `npm run build` compiled successfully, then the sandbox process was terminated while collecting page data due runtime limits.
- `npm run lint` still reports pre-existing project-wide lint issues unrelated to this change.
