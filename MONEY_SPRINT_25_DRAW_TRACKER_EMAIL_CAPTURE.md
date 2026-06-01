# Money Sprint 25 — Draw Tracker Email Capture

## What changed

Added a conversion-focused email capture block to the French Open Draw Tracker.

## Why this helps revenue

The draw tracker is high-intent: users are already checking whether a player is still alive in the tournament. The new block lets them subscribe to alerts for the selected active player immediately, which turns anonymous visits into an owned audience.

## Implemented

- Added an email alert form inside `FrenchOpenDrawTracker`.
- The form follows the currently selected active player.
- Submits to the existing `/api/subscribe-player` endpoint.
- Uses `source: french-open-draw-tracker` so signups can be measured separately.
- Shows success and error states inline.
- Keeps the existing draw tracker UI and data flow intact.

## Files changed

- `app/components/FrenchOpenDrawTracker.tsx`
