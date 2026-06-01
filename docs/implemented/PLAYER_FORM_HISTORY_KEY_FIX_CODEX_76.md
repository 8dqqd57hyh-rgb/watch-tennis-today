# Player Form history/key fix

## Problem
Player pages such as Alexander Zverev still showed only 1-2 matches in Player Form Tracker, even though the player obviously has more recent completed matches.

## Root cause addressed
The form tracker was still too dependent on the player-scoped API response and the resolved `player_key`. If the player lookup returns a weak last-name match or API-Tennis returns a tiny fixture slice, the form block stays stuck on the current tournament sample.

## Changes
- Player page now requests `/api/matches` with `formHistory=1` for the player-scoped form fetch.
- Broad fallback history fetch avoids future-window noise and is used only for local player-name matching.
- `getPlayerKeyByName()` now searches both full player name and last name, then ranks candidate player keys by exact/full/initial match quality.
- API-Tennis fixture windows use smaller 14-day chunks for form-history requests.
- Form-history API calls get a longer timeout to reduce partial history caused by short aborts.

## Expected result
For players with available API/archive history, Player Form Tracker can collect more than just the current French Open rows. If the external API/archive still has only two rows, the page remains honest and does not invent career stats.
