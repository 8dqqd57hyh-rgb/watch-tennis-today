# Money Sprint 11 — Player Page Retention Upgrade (Codex 76)

## Goal
Improve monetization potential without creating duplicate URLs or intrusive UX.

## What changed
- Did **not** add a new page.
- Improved existing `/player/[slug]` pages.
- Sorted player matches by user intent:
  1. LIVE
  2. SUSPENDED
  3. UPCOMING
  4. everything else
- Limited displayed player matches to the first 8 strongest items to avoid long noisy pages.
- Replaced the weak "Other popular tennis players" block with smarter related-player recommendations.
- Related players now prioritize:
  - current match opponents when they are verified players;
  - same-tour popular players;
  - same-tour fallback players;
  - a small popular cross-tour fallback.
- Added clearer copy explaining why these links are useful.

## Why this helps revenue
Better internal linking can increase:
- pages per session;
- ad impressions;
- affiliate CTA exposure;
- player page discovery;
- crawl paths for Google.

## UX policy
No popups, no sticky banners, no forced signup, no duplicate content pages.

## Files changed
- `app/player/[slug]/page.tsx`
