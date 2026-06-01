# Money Sprint 17 — Smart Draw Active Players

## What changed

The French Open Draw Tracker now filters the player selector to show only players who are still active in the draw. Eliminated players are hidden from the clickable picker, which makes the tracker feel fresher and avoids dead-end clicks.

## Files changed

- `app/components/FrenchOpenDrawTracker.tsx`
- `app/french-open-draw/page.tsx`

## Why this helps

- Better UX: users do not choose eliminated players by mistake.
- Better retention: the draw tracker feels like a live daily tool.
- Better conversion flow: active player paths push users toward live, schedule, result, and where-to-watch pages.

## Next improvement

Connect `currentStatus` and match path data to real API draw/results data when reliable tournament draw data is available.
