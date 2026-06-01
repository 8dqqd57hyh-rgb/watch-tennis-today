# Money Sprint 27 — Roland Garros Pick’em Challenge

Implemented a new retention-focused Pick’em feature for Roland Garros.

## Added

- New route: `/roland-garros-predictions`
- New client component: `RolandGarrosPickemChallenge`
- Compact Pick’em block on `/french-open-today`
- Compact Pick’em block on the homepage heavy French Open section
- Sitemap entries for `/roland-garros-predictions`

## How it works

- Loads today’s Roland Garros matches from `/api/french-open-today`
- Lets users pick a winner for each match
- Stores picks in `localStorage`
- Shows a personal score
- Awards:
  - `+1` for a correct favorite pick
  - `+3` for a correct upset pick
- Settles picks when the feed returns a finished match with a winner

## Why it helps monetization

This creates a daily return loop:

1. User makes picks before matches
2. User follows live matches
3. User comes back to check results
4. User returns tomorrow for new picks

That can improve repeat visits, page depth, ad impressions, and affiliate exposure.

## Validation

- `npx eslint app/components/RolandGarrosPickemChallenge.tsx app/roland-garros-predictions/page.tsx app/french-open-today/page.tsx app/page.tsx app/sitemap.ts`
  - Passed for new files/changes; only existing warnings in `app/page.tsx` remain.
- `npx tsc --noEmit`
  - Passed.
- `npm run build`
  - Compile and TypeScript passed, but the container killed Next.js during “Collecting page data” with `SIGTERM`. This appears resource/environment-related; no TypeScript errors were reported.
