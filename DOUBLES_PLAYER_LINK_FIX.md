# Doubles Player Link Fix

Fixed the bad nested player URLs caused by doubles team names such as `Matushkina / Uchijima`.

## What changed

- `app/components/RelatedMoneyLinks.tsx`
  - Uses the shared `playerUrl()` helper instead of manual slug generation.
  - Skips `/player/...` links for doubles teams containing `/`, `&`, or `+`.

- `data/playerSlugs.ts`
  - Added `isDoublesTeam()` helper.

- `app/watch/[slug]/page.tsx`
  - No longer links doubles teams to player pages.
  - Shows doubles team names as plain text/cards instead.
  - Passes both players/teams into `RelatedMoneyLinks` safely.

- `middleware.ts`
  - Redirects old malformed nested URLs like `/player/matushkina/-uchijima` to `/player/matushkina-uchijima` with 308.

## Validation

`npm ci` completed successfully.

`npm run build` was attempted, but local build could not finish because the sandbox cannot fetch Google Fonts (`Geist`, `Geist Mono`) from `fonts.googleapis.com`. The failure is unrelated to this code change.
