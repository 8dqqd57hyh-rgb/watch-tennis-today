# Match Edge Predictor Cleanup — Codex 93

## What changed
- Reworked the previous feed-score UI into a cleaner **Player Comparison Snapshot**.
- Removed weak/technical labels like `50% feed score`, `listed in feed`, `from current schedule` and `not career history` from the main cards.
- Added a comparison table with useful match-preview rows:
  - Current match
  - Tournament
  - Round
  - Recent form
  - Schedule signal
  - Score signal
- The block now explains edge only when the feed gives a real signal, otherwise it shows **Balanced from feed**.

## Data honesty
The component still avoids fake career stats, fake rankings, fake H2H and fake betting odds. It only uses fields already available from `/api/matches`: match status, tournament, round, score, start time, winner and recent feed results.
