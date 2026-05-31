# Player Form result parsing fix

Fixed the Player Form block so unclear/incomplete results are excluded instead of shown as `?`.

## Changes

- Added winner metadata from `/api/matches` response (`winner`, `winnerId`).
- Player Form now uses a match only when the winner can be determined from:
  - explicit winner field
  - winner id/side field
  - clearly completed set score
- Incomplete scores like `6-3, 7-6, 4-6, 2-6, 5-3` are excluded from form/streak calculations.
- Removed `?` form chips and `Result unclear` rows.
- Streak is calculated from valid completed results only.
- If no valid completed results remain, stats cards are hidden and the block shows: `Recent completed matches are not available yet.`
- Added development-only debug output with:
  - `playerName`
  - `totalMatchesFound`
  - `validMatchesUsed`
  - `excludedMatches`
