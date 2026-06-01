# Money Sprint 16 — French Open Live Snapshot

## What changed

Added a new reusable client component:

- `app/components/FrenchOpenLiveSnapshot.tsx`

Added it to:

- `app/french-open/page.tsx`

## Why this helps

The French Open hub now gives users an immediate daily decision point:

- live matches to follow now
- upcoming matches to watch next
- completed matches to catch up on
- links to schedule, live page, results and where-to-watch pages

This makes the hub more useful for returning visitors and pushes users toward high-intent pages instead of only browsing static links.

## Data source

The component fetches `/api/french-open-today` and refreshes every 60 seconds in the browser.

## Monetization angle

More hub clicks should flow into:

- live pages
- result pages
- country broadcaster guides
- VPN/streaming decision pages
