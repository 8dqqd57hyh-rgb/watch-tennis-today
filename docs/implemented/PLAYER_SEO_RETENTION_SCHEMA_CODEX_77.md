# Money Sprint 11 — Player SEO + Retention Schema (Codex 77)

## Goal
Improve existing player pages without creating duplicate URLs or adding annoying monetization UI.

## What changed
- Added canonical URLs to `/player/[slug]` metadata.
- Fixed the player breadcrumb link to point to `/players` instead of `/live-tennis`.
- Added `Person` structured data for player pages.
- Added `FAQPage` structured data for player-intent questions:
  - when the player is playing next;
  - where to watch the player legally;
  - which related players to explore next.
- Kept the previous non-intrusive UX: no popups, no sticky signup, no duplicate new pages.

## Why this helps monetization
- Better search clarity for player pages.
- More reliable canonical signals.
- Higher chance of rich-result eligibility from FAQ-style intent.
- Cleaner internal linking from player pages into the real player hub.

## Pages to check
- `/player/jannik-sinner`
- `/player/carlos-alcaraz`
- `/player/novak-djokovic`
- `/players`
