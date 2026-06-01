# Money Sprint 19 — French Open next match strip

## What changed

- Added `FrenchOpenNextMatchesStrip`, a reusable client component that reads `/api/french-open-draw-tracker`.
- The component deduplicates player/opponent pairs so the same fixture is not shown twice.
- Live matches are prioritised first, then upcoming matches by date/time.
- Completed matches are not shown as next fixtures because the source API already normalises old scheduled fixtures as finished.
- Added the strip to `/french-open` and `/french-open-draw`.

## Why it matters

The draw tracker now has a simpler high-intent entry point: fans can immediately see which active French Open matches are worth following next, then continue into the draw tracker, live page, today page, and monetised where-to-watch pages.
