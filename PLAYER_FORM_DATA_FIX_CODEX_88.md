# Player Form data fix

Fixed the Player Form block showing empty for players such as Andrey Rublev even when recent results should exist.

## Changes

- Increased player match lookback from 21 to 90 days.
- Increased `/api/matches` accepted `daysBack` limit from 30 to 120 days.
- Fixed status normalization for API-Tennis rows that have a completed score but no reliable `event_status`; past scored fixtures are now treated as `FINISHED`.
- Added `RETIRED` / `WALKOVER` to finished-like player results.
- Added a fallback on player pages: if the player-key API query returns no finished matches, the page fetches the broader match window and filters locally by player name.
- Removed noisy debug `console.log` calls from the matches API route.

## Files changed

- `app/api/matches/route.ts`
- `app/player/[slug]/page.tsx`
