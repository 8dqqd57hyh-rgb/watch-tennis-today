# Live current game point score fix

## Problem
The match page could show a stale point score such as `40-15` while the real current game was `0-40`.

## Cause
The API-Tennis REST `pointbypoint` array contains game history. The previous implementation used the latest available point from the array, even when that game was already completed and no longer matched the current set/game score.

## Fix
The `/api/matches` mapper now calculates the expected current game from the live set score:

- current set score `5-5` means current game `11`
- current set score `4-5` means current game `10`
- current set score `6-6` means current game `13`

The page only displays `15/30/40/ADV` if `pointbypoint.set_number` and `pointbypoint.number_game` match the expected current game.

If the REST feed does not expose the current game yet, the UI shows `Waiting for next point` instead of showing stale data.
