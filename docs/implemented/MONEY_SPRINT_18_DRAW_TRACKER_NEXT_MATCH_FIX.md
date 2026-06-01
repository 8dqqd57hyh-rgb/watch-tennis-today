# Money Sprint 18 — Draw Tracker Next Match Fix

Fixed the French Open Draw Tracker logic so old fixtures are not shown as `Next / upcoming`.

## Changes

- Past fixtures with missing/unclear API status are now normalized as `Finished`.
- `Next / upcoming` now only comes from live or future matches.
- The active player picker is now built from live/future main-draw fixtures only.
- Junior, boys, girls, doubles, mixed doubles and qualifying fixtures are excluded from the main draw tracker.
- Winner inference was improved for completed matches where API status/winner is missing but a final score exists.
- Tour detection now uses tournament name + event type, not only event type.

## Why

API-Tennis may return old fixtures without a final status. Before this fix, those old matches could still be treated as scheduled and appear as the player's next match.
