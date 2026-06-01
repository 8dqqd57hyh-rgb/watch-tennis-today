# Player generation source cleanup — Codex 63

Fixed the remaining player-link generation issue that kept producing bad `/player/...` URLs for doubles teams and match fragments.

## Changes

- Hardened `data/playerSlugs.ts`:
  - added stricter detection for non-canonical hyphenated doubles/team slugs such as `shimizu-watanabe`, `kostyuk-ruse`, `muhammad-stollar`, `burel-paquet`;
  - kept real single-surname unknown players such as `ngounoue` available;
  - added `shouldShowAsPlayerLink()` helper;
  - documented that UI should use `safePlayerUrl()` and render plain text if no canonical player URL exists.

- Cleaned player-link rendering:
  - `app/players/live-now/page.tsx` now removes unverified hyphenated doubles/team names before creating cards;
  - `app/watch/[slug]/page.tsx` now uses `safePlayerUrl()` fallbacks instead of blindly creating player-specific links;
  - `app/vs/[slug]/page.tsx` uses safe player links;
  - `app/components/RelatedMoneyLinks.tsx` uses safe player links.

## Expected result

The UI should stop creating new bad links such as:

- `/player/shimizu-watanabe`
- `/player/schnaitter-wallner`
- `/player/kostyuk-ruse`
- `/player/muhammad-stollar`
- `/player/burel-paquet`

Old URLs may still appear briefly in logs due to cached pages, browser prefetch, bots, or previously crawled links, but the current UI should not generate them anymore.

## Validation

- `npx tsc --noEmit` passed.
- `next build` compiled and passed TypeScript. The sandbox timed out during page-data collection with `EPIPE`, not a TypeScript/code error.
