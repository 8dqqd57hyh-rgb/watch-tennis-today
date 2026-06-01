# Player email alerts fix

## Problem
Player alert emails could show an unrelated match when the player-specific match lookup returned nothing and `/api/matches` fell back to the global match archive.

Example: a Jannik Sinner alert could render `D. Stricker vs A. Oetzbach`.

## Fixes
- Prevented `/api/matches?playerName=...` from falling back to all archived matches.
- Added a second safety check in `/api/send-player-alerts` so alerts are sent only when the match includes the subscribed player.
- Improved email subjects to include the real opponent when available.
- Improved email template copy and start time formatting.
- Escaped dynamic email HTML values.

## Validation
- `npx tsc --noEmit` passes.
