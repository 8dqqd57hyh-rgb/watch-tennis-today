# Money Sprint 22 — French Open Survivors Board

## What was added

Added a new high-intent Roland Garros retention/SEO feature:

- New page: `/french-open-survivors`
- New client component: `app/components/FrenchOpenSurvivorsBoard.tsx`
- Homepage placement below the French Open daily hub cluster
- French Open hub placement before the full draw tracker
- New quick link in the French Open hub resources list
- Sitemap inclusion for `/french-open-survivors`

## Why this helps

The site already had live matches, recap, draw tracker, player following, country guides and streaming pages. The missing useful intent was a fast answer to:

- “Who is still in the French Open?”
- “Who is left at Roland Garros?”
- “Who plays next at French Open?”
- “Which ATP/WTA players are still active?”

This is a natural daily-return page during Grand Slams and can push users into match pages, draw pages, recap pages and email signup.

## How it works

The board reuses the existing `/api/french-open-draw-tracker` endpoint and shows:

- Active player count
- ATP active count
- WTA active count
- Live/scheduled count
- Search by player/opponent
- ATP/WTA filters
- Next opponent and next match time/status
- Link to the canonical player page when available

## Files changed

- `app/components/FrenchOpenSurvivorsBoard.tsx`
- `app/french-open-survivors/page.tsx`
- `app/french-open/page.tsx`
- `app/page.tsx`
- `app/sitemap.ts`

## Verification note

`npm run lint` could not complete in this sandbox because dependencies were not installed and `eslint` was unavailable. `npm install` was attempted but timed out in the environment.
