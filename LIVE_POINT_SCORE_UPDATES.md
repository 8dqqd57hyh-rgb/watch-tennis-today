# Live point score updates

Added current-game tennis point score support to match pages.

## What changed

- `/api/matches` now maps a `pointScore` field from API-Tennis live point/game score fields.
- `/api/matches?matchId=...` uses the API-Tennis `match_key` parameter for a more targeted live refresh.
- `/watch/[slug]/LiveMatchScore.tsx` now displays:
  - set/game score, for example `6-4, 2-3`
  - current game point score, for example `15-30`, `40-ADV`, `Deuce`
- The point score updates through the existing 30-second polling without page reload.

## Notes

The current-game block only shows real 0/15/30/40/ADV-style values when the external API provides them. If API-Tennis does not return a point score for a live match, the UI shows `Point score pending` instead of inventing a fake value.
