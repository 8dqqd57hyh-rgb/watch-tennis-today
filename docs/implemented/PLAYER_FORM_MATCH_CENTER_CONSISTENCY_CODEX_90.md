# Player Form / Match Center consistency fix

Fixed the player page inconsistency where Match Center could show a completed score while Player Form said recent completed matches were unavailable.

## Changes

- Player Form and Match Center now use the same `playerMatches` dataset.
- Completed matches can be detected from the score when the feed status is stale.
- A full score such as `6-3, 7-6, 4-6, 2-6, 6-3` is treated as finished.
- A completed-score match no longer displays as `LIVE NOW`.
- The Match Center badge now shows `FINAL` for finished matches.
- Player Form now supports abbreviated API names such as `A. Rublev` matching the full page player name `Andrey Rublev`.
- Winning streak and W/L form now work from the same normalized matches shown in Match Center.
- Added dev-only debug output for:
  - `playerName`
  - `matchCenterMatches`
  - `formMatches`
  - `finishedMatches`
  - `liveMatches`

## Notes

Full build/typecheck was not completed in the container because project dependencies are not installed.
