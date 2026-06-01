# Live Players Parsing Fix

## Problem
`/players/live-now` was splitting API player names by commas and other generic separators. That turned valid feed values like `Michelsen, A.` into broken cards such as `Michelsen` and `a`, and also allowed non-player fragments like `ako`, `ano`, `E.` and service words into the live player list.

## Fix
- Stop deriving live players by splitting names on commas, `vs`, or slug fragments.
- Read only `match.player1` and `match.player2` directly from `/api/matches`.
- Normalize `Surname, A.` into `A. Surname` as one display name.
- Exclude doubles teams from the singles player pipeline.
- Exclude one-letter, tiny, service-word and arbitrary one-word non-canonical fragments.
- Use canonical player URLs only when available; otherwise render plausible names as text, not bad `/player/...` links.

## Result
The page should no longer show cards like `a`, `ako`, `ano`, `asile`, or `E.` and should stop generating bad player links from parsed fragments.
