# Player Form History Expansion Fix

## Problem
Player Form was technically consistent with Match Center, but the shared dataset was too narrow. If the player-scoped API response contained one finished match, the page returned early and never merged broader historical rows. That made Andrey Rublev show only the recent loss even though older completed wins could exist in the broader feed/archive.

## Changes
- Player pages now request a 120-day history window for form data.
- `getMatchesForPlayer()` always merges:
  - player-scoped API matches
  - broader match feed rows filtered locally by player name
- Removed the early return that stopped fallback loading after one finished match.
- Player page filtering now uses the same full-name / initial-name matcher as Player Form.
- `/api/matches` now merges archived player matches from `match_archive` when `includeFinished=1&playerName=...` is requested.
- Archived rows are deduped with fresh API rows by match id.

## Expected Result
If Match Center or the archive contains earlier completed wins, Player Form can now show them in the last-10 form guide instead of only showing the latest loss.
