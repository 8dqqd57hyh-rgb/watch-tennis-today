# Spoiler-free route fix

Fixed the 404 at `/watch/tennis-spoiler-free-scores`.

## What changed
- Added a static App Router alias route:
  - `/watch/tennis-spoiler-free-scores`
- The alias reuses the existing spoiler-free SEO page from:
  - `/tennis-spoiler-free-scores`
- The canonical URL remains `/tennis-spoiler-free-scores`, so SEO is not split between two duplicated pages.

## Why
The user opened `/watch/tennis-spoiler-free-scores`, but only `/tennis-spoiler-free-scores` existed. Because `/watch/[slug]` handled the path as a dynamic match page slug, it returned 404.
