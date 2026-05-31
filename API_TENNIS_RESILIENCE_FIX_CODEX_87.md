# API-Tennis resilience fix

Fixed noisy Vercel function errors caused by intermittent API-Tennis `get_fixtures` 500 responses.

## Changes

- Added a short timeout to external API-Tennis calls so `/api/matches` does not hang on slow upstream responses.
- Changed upstream API failures from `console.error` to `console.warn` because the route handles them and still returns `200`.
- Switched fixture fetching to `Promise.allSettled` so one failed date window does not affect the whole response.
- Added `match_archive` fallback when the external API returns no usable matches.
- Skipped archive upsert when there is nothing to save.
- Logged Supabase archive write failures as warnings without breaking the public route.

## Why

The screenshot showed Vercel logs with `API-Tennis request failed: get_fixtures (500)`. That was an upstream provider issue, not a broken user-facing route. The endpoint now degrades gracefully instead of surfacing scary function errors.
