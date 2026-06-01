# Player Form / Winning Streak update

Implemented on `app/player/[slug]/page.tsx`.

## What changed

- Player pages now request `/api/matches` with:
  - `includeFinished=1`
  - `daysBack=21`
  - `daysForward=45`
  - `playerName=<current player>`
- Added a Player Form section above the match center.
- Added last-10 form badges: `W`, `L`, or `?`.
- Added current streak summary.
- Added wins, losses, and win-rate cards.
- Added recent result rows linking to match pages.

## Notes

The result inference uses set scores from the API feed. If the score is missing or not complete enough to infer a winner, the form badge is shown as `?` instead of guessing.

## Validation

A TypeScript check could not complete in the container because project dependencies are not installed (`react`, `next`, JSX types missing). The modified file was reviewed for JSX/TypeScript syntax consistency.
