# Money Sprint 20 — My Players Dashboard

Added a retention feature that lets visitors follow tennis players locally and return to a personalized dashboard.

## What changed

- Added `/my-players` page.
- Added `MyPlayersClient` dashboard.
- Added `LocalPlayerFollowButton` component.
- Added local follow CTA to player pages.
- Added `/my-players` to sitemap.

## Why it matters

This turns one-off SEO visits into repeat usage:

1. A visitor lands on a player page from Google.
2. They tap “Follow player”.
3. They return to `/my-players` for only their favorite players’ live/upcoming matches.
4. The dashboard routes them into match pages and where-to-watch pages.

No login is required. Followed players are stored in `localStorage`.
