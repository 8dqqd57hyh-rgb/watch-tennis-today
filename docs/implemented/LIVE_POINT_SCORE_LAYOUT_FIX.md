# Live point score + score layout fix

## Changed
- Match score on `/watch/[slug]` is now rendered as compact set chips instead of one oversized wrapped string.
- Current game score now reads point-by-point data from API-Tennis `pointbypoint[].points[].score` first, then falls back to root live score fields.
- `40 - 40` is normalized to `Deuce`; `A`, `AD`, `ADV`, `Advantage` are normalized to `ADV`.
- The current game block is full-width and mobile-safe, so long fallback text no longer breaks the card layout.

## Files changed
- `app/api/matches/route.ts`
- `app/watch/[slug]/LiveMatchScore.tsx`
