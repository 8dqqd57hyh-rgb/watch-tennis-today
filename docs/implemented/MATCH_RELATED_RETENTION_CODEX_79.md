# Match Related Retention Cleanup — Codex 79

## Goal
Improve existing match pages without creating duplicate URLs or adding annoying UX.

## What changed
- Kept the existing dynamic `Related matches` section on `/watch/[slug]`.
- Improved related match ranking so it prioritizes:
  - live matches,
  - suspended matches,
  - upcoming matches soon,
  - same tournament,
  - same ATP/WTA category,
  - matches involving the same players.
- Added start-time context to related match cards.
- Added small player-profile links inside related match cards when the player is safe to link.

## What was intentionally not changed
- No new pages.
- No popups.
- No sticky banners.
- No duplicate hubs.

## Pages to verify
- `/watch/[slug]` for any valid live/upcoming match.
- `/player/jannik-sinner`
- `/player/carlos-alcaraz`
- `/sitemap.xml`
