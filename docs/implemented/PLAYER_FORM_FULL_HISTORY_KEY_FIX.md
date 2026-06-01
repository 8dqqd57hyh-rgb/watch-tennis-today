# Player Form full-history key fix

## Problem
Player pages still showed partial feed rows for players such as Alexander Zverev. The player-form source could not reliably resolve `player_key` when API-Tennis returned player names in reversed formats such as `Zverev A.` or `Zverev Alexander`.

Without a resolved `player_key`, the route fell back to a broad fixture scan and only found sparse French Open / United Cup rows, missing Rome, Madrid and other season matches.

## Fix
- Improved `getPlayerNameScore()` in `app/api/matches/route.ts` to score reversed full-name and reversed initial formats.
- Improved API-side `apiNameMatchesPlayer()` for `Zverev Alexander` as well as `Zverev A.`.
- Improved player-page `doPlayerNamesMatch()` with the same reversed-name support.

## Expected result
`/api/matches?playerName=Alexander%20Zverev&formHistory=1&includeFinished=1&daysBack=365` should resolve the proper API-Tennis player key and return a richer player-specific history instead of only sparse global-feed rows.

## Validation note
`tsc` cannot run in this archive because `node_modules` / React / Next types are not included.
