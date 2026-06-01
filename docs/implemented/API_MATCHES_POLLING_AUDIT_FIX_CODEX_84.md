# API matches polling audit fix

## Problem
Vercel logs still showed `/api/matches` being requested roughly every 30-35 seconds.

## Changes
- Increased smart live polling from 30 seconds to 60 seconds.
- Increased idle polling from 5 minutes to 10 minutes.
- Added a global client-side minimum polling gap so multiple mounted widgets cannot trigger separate `/api/matches` refreshes at the same time.
- Reused the shared client match cache in My Feed, My Dashboard, My Players, and My Tournament instead of direct `cache: no-store` fetches.
- Removed the cache-busting timestamp from the live match score refresh URL.
- Slowed live match score refresh from 30 seconds to 60 seconds.

## Verification
- `npx tsc --noEmit`
- `npx eslint app/lib/clientMatchFetch.ts app/lib/smartMatchPolling.ts app/watch/[slug]/LiveMatchScore.tsx app/my-feed/MyFeedClient.tsx app/my-dashboard/MyDashboardClient.tsx app/my-players/MyPlayersClient.tsx app/my-tournament/MyTournamentClient.tsx`
