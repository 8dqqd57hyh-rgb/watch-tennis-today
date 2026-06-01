# Money Sprint 22 — Pick’em Share Loop

## Goal
Turn the Roland Garros Pick’em Challenge into a small viral/retention loop instead of a private-only widget.

## Changes
- Added a share/copy flow to the Pick’em board.
- Share text includes:
  - current score
  - max possible score
  - settled and pending pick counts
  - up to six selected picks
  - direct link to `/roland-garros-predictions`
- Added pending pick count in the score card.
- Replaced the generic “Best reward” stat with “Max possible” so users see what they can still score.
- Reset now also clears the share status.

## Why this helps monetization
- Users can share their picks with friends.
- Shared links drive new traffic to the Pick’em page.
- The page creates a return loop: pick → watch → check score → share.
- More returning sessions and pageviews can help ads and affiliate conversion opportunities.

## Validation
- `npx eslint app/components/RolandGarrosPickemChallenge.tsx`
- `npx tsc --noEmit`
