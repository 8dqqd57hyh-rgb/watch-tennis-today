# Money Sprint 16 — French Open Draw Tracker

Added a player-focused Roland Garros draw tracker.

## What changed

- Added `app/components/FrenchOpenDrawTracker.tsx`
  - client-side player selector
  - ATP/WTA filter
  - status badges for advanced, upcoming, potential matchups
  - deep links into live, today, results and where-to-watch pages

- Rebuilt `app/french-open-draw/page.tsx`
  - stronger title/metadata for “draw tracker” intent
  - JSON-LD CollectionPage and FAQPage
  - player-path UX instead of static hub only
  - added affiliate/streaming decision block

- Added draw tracker block to `app/french-open/page.tsx`
  - central hub now pushes users into the bracket tracker

## Why this helps

The page is now useful for fans who search for player-specific bracket paths, such as:

- Alcaraz French Open draw
- Sinner Roland Garros path
- Djokovic next opponent French Open
- Swiatek French Open draw
- Sabalenka Roland Garros path

This should improve retention and internal clicks into monetizable streaming/VPN pages.
