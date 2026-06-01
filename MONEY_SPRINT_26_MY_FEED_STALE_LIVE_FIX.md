# Money Sprint 26 — My Feed stale LIVE match fix

## Problem
`/my-feed` could show yesterday's completed or stale API-Tennis rows as `LIVE`, especially for saved matches/tournaments where localStorage kept an old live status or API-Tennis returned a stale live payload.

Example reported: Ruud vs Fonseca appeared as LIVE even though the match had already finished.

## Fix
- Added defensive stale-live detection in `/api/matches`.
- If API-Tennis marks an old fixture as LIVE after a generous tennis window, the API demotes it to:
  - `FINISHED` when a score exists
  - `EXPIRED` when no score exists
- Added the same safety guard in `/my-feed` so old saved localStorage rows cannot keep poisoning the page as LIVE.
- `EXPIRED` rows are hidden from feed cards.
- Stale scored matches move out of Live/Need Attention and into Recent results.

## Files changed
- `app/api/matches/route.ts`
- `app/my-feed/MyFeedClient.tsx`
