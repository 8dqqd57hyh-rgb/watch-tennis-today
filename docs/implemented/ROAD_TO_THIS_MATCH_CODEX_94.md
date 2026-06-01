# Road to This Match

## What changed

- Removed the weak Player Comparison Snapshot UI from `app/components/MatchEdgePredictor.tsx`.
- Replaced it with a compact **Road to This Match** section.
- The section shows how both players reached the current match using completed matches from the same tournament only.
- Opponents link to verified player pages when the player exists in the local player database.
- The entire section hides itself when a tournament path is unavailable for either player.

## Rules implemented

- Completed matches only.
- Current tournament only.
- Chronological order.
- No future rounds.
- No feed score logic.
- No Balanced from feed / Feed form TBC / Recent form / Schedule signal / Score signal copy.
- Compact mobile-friendly layout.

## Validation note

`npm run lint` could not be executed in this unpacked ZIP because `node_modules` is not included, so `eslint` is unavailable locally. The code change is limited to the existing component and uses existing project imports.
