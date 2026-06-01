# Upset Tracker Real Source Fix

The French Open upset tracker was returning zeros because the page had a visible fallback, but the API route still did not reliably derive upsets from the match data already available in the app.

## Changed

- `/api/french-open-upsets` now checks three real sources:
  - API-Tennis `get_fixtures`
  - the existing normalized `/api/matches?includeFinished=1` feed
  - Supabase `match_archive`
- Removed hardcoded/fake curated upset rows from the API route.
- Improved winner detection from tennis set scores like `6-4, 3-6, 7-5`.
- Added source counters to the empty state so it is obvious whether the route received fixtures/matches/archive rows.
- Improved production URL resolution for the server-side page fetch using `VERCEL_URL` when `NEXT_PUBLIC_SITE_URL` is missing.

## How to verify

Open:

- `/api/french-open-upsets`
- `/french-open-upsets`

In the API JSON, check:

- `apiFixtureCount`
- `normalizedMatchCount`
- `archiveFixtureCount`
- `liveUpsetCount`
- `upsets`

If `normalizedMatchCount` is greater than 0 but `liveUpsetCount` is 0, the issue is seed/name matching for the specific real rows returned by API-Tennis.
