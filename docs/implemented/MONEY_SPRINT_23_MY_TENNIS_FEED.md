# Money Sprint 23 — My Tennis Feed

## What was checked

The project already had:

- `/my-players` for followed players
- `/my-dashboard` for a player-focused dashboard
- `/my-tournament` for saved-player tournament context
- `TennisWatchlistHub` for smart public watch picks

The missing retention feature was a single private feed that combines saved matches, saved tournaments and saved players.

## Implemented

### New page

- Added `/my-feed`
- Aggregates followed players, followed matches and followed tournaments from localStorage
- Shows:
  - live now
  - next matches
  - recent results
  - saved tournaments
  - saved matches

### New client components

- `LocalMatchFollowButton`
  - Saves/un-saves individual matches
  - Stores data in `watchTennisToday.followedMatches`
  - Links directly to `/my-feed`

- `LocalTournamentFollowButton`
  - Saves/un-saves tournaments
  - Stores data in `watchTennisToday.followedTournaments`
  - Links directly to `/my-feed`

### Match page update

- Added `Follow match` action to `/watch/[slug]`
- Saved matches become visible in `/my-feed`

### Tournament page update

- Added `Follow tournament` action to `/tournament/[slug]`
- Tournament matches become visible in `/my-feed`

### Navigation update

- Added `My Feed` to primary navigation
- Added `My Tennis Feed` to footer

## Why this helps monetization

This creates a return-visit loop:

1. User lands from SEO on a match/player/tournament page.
2. User saves the item.
3. User returns to `/my-feed` instead of leaving forever.
4. More sessions and more pageviews improve ad and affiliate earning potential.

## Validation note

I attempted to run a production build, but dependency installation in the sandbox timed out before `next` was available. The implementation was checked by direct source inspection and kept within existing project conventions.
