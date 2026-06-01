# Money Sprint 18 — Dynamic French Open Draw Active Players

## Problem
The draw tracker used manual featured-player statuses. That made the active picker wrong when the real Roland Garros draw changed.

## Fix
- Added `/api/french-open-draw-tracker`.
- The API pulls French Open fixtures from API-Tennis across a rolling tournament window.
- Active players are now derived from live and scheduled French Open matches.
- Eliminated players are hidden when they no longer appear in remaining fixtures.
- The UI shows active count, eliminated hidden count and number of source matches checked.
- The tracker now falls back only if the API is unavailable or returns no active fixtures.

## Why this matters
Users can follow the actual remaining draw instead of a hand-maintained list. This makes the feature more trustworthy and better for repeat visits during the tournament.
