# Money Sprint 21 — My Players match visibility fix

## Problem
`/my-players` could show followed players but zero matches because the dashboard only loaded the generic `/api/matches` list and matched player names too strictly. API-Tennis often abbreviates names such as `A. Rublev`, while the local player directory stores `Andrey Rublev`.

## Fix
- My Players now fetches matches per followed player with `playerName`.
- `/api/matches` supports `includeFinished=1`, `daysBack`, and `daysForward` for personalized dashboards.
- Name matching now supports full name and surname + initial matching.
- Dashboard can show live matches, upcoming matches, and recent results instead of looking empty.
- Empty-state copy now explains matches/results, not only live/upcoming fixtures.

## Files changed
- `app/my-players/MyPlayersClient.tsx`
- `app/api/matches/route.ts`
