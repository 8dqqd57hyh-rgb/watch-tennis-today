# Match Importance Hub

Implemented a fan-first match intelligence layer.

## Added
- `app/components/MatchImportanceHub.tsx`
- Homepage placement after Pick'em Challenge
- French Open Today placement after Pick'em Challenge

## What it does
- Ranks matches by importance from 0-100
- Uses existing match data only
- Prioritizes:
  - Grand Slam context
  - late rounds
  - live matches
  - star players
  - known rivalries
  - ATP/WTA singles
- Adds a `Why watch` explanation for the top match and ranked secondary matches

## Validation
- ESLint changed files passed
- `tsc --noEmit` passed
- `next build` compiled successfully, then timed out while collecting page data in the container
