# Player Canonical Validation Fix

## Problem

A generated URL like `/player/cristian-potapova` could render a fake player page. That name is not a real tennis player; it is a bad merge of Jaqueline Cristian and Anastasia Potapova from match/H2H data.

## Fixes

- Added strict canonical player validation via `data/players.ts` and `data/playerSlugs.ts`.
- `/player/[slug]` now 404s unknown or mixed/generated player slugs instead of rendering thin/fake pages.
- Player metadata now uses canonical player names and canonical URLs.
- Sitemap player URLs now include only canonical supported players, not arbitrary names parsed from live match data.
- Added canonical slug helpers:
  - `getCanonicalPlayerSlug`
  - `isKnownPlayerSlug`
  - `safePlayerUrl`
- Expanded canonical player database for existing directory links so popular player pages continue working.

## Result

`/player/cristian-potapova` now returns Not Found, protecting SEO quality, AdSense trust, and sports content accuracy.
