# API matches smart polling fix

## Problem
The UI could call `/api/matches` every 30-60 seconds even when there were no live matches or when the browser tab was hidden.

## Fix
Added shared smart polling in `app/lib/smartMatchPolling.ts`:

- 30 seconds only when live-like matches are present.
- 5 minutes when there are no live matches.
- Pauses completely while the browser tab is hidden.
- Refreshes once when the tab becomes visible again.

## Updated clients

- `app/my-feed/MyFeedClient.tsx`
- `app/my-players/MyPlayersClient.tsx`
- `app/my-dashboard/MyDashboardClient.tsx`
- `app/my-tournament/MyTournamentClient.tsx`
- `app/components/FrenchOpenLiveSnapshot.tsx`
- `app/watch/[slug]/LiveMatchScore.tsx`

## Verification

- `npx eslint` on changed files passed.
- `npx tsc --noEmit` passed.
- `npm run build` compiled successfully and reached TypeScript; the container timed out during the longer build phase.
