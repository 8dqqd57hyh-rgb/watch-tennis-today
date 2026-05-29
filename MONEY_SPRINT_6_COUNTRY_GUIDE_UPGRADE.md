# Money Sprint 6 — Country Guide Upgrade

## What changed

- Rebuilt `/watch-tennis-in/[country]` to use the shared `data/broadcastFinder.ts` source of truth.
- Added Spain and Italy to the broadcaster data used by Broadcast Finder and country guide pages.
- Improved country pages with:
  - ATP/WTA/Grand Slam broadcaster sections
  - official verification links
  - match-day checklist
  - travel-viewing affiliate bridge
  - FAQ schema
  - Article schema
  - stronger internal links to live tennis, best matches and Broadcast Finder

## Why this matters

Country pages are strong monetization pages because users often search with high intent:

- where to watch tennis in USA
- tennis TV channels UK
- watch ATP in Poland
- tennis streaming abroad

These pages now work better as a bridge from SEO traffic to official broadcaster checks and VPN/travel-viewing affiliate pages.

## Safety

- No fake streams were added.
- All external broadcaster links are framed as verification sources.
- Affiliate links are disclosed.
- Unknown country slugs return `notFound()` instead of thin generic content.
