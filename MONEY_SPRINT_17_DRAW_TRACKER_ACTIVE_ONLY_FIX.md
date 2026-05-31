# Draw Tracker active-player fix

Updated the French Open Draw Tracker so the active-player picker reflects the current featured-player set.

## What changed

- Marked Carlos Alcaraz, Jannik Sinner, Novak Djokovic and Iga Swiatek as eliminated in the tracker seed data.
- The picker now shows only Aryna Sabalenka for the current featured set.
- The counter now says how many featured players are hidden after elimination.
- Updated the explanatory text so users understand why only one player appears.

## Why

The previous implementation treated all featured players as active placeholders, which made the UI misleading once players were out of the tournament.
