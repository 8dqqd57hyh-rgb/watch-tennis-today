# Money Sprint 25 — My Tournament Dashboard Fix

## What changed

- Fixed `/my-tournament` so it now reads `watchTennisToday.followedTournaments` instead of the followed-player storage key.
- Reworked the dashboard around tournaments, not players.
- Added starter tournament buttons for fast onboarding.
- Added tournament chips with remove actions.
- Filtered live/upcoming/recent matches by saved tournament names.
- Reduced API pressure by fetching `/api/matches` once every 120 seconds.

## Why it matters

The existing Follow Tournament button saved tournaments locally, but `/my-tournament` was still reading followed players. That made the tournament funnel feel broken and reduced retention.

Now users can save Roland Garros, Wimbledon, US Open, etc. and come back to one personal tournament board.
