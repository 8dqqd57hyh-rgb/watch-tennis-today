# Player Generation Global Verified Cleanup — Codex 66

## Fixed

- Added shared verified player helpers in `data/playerSlugs.ts`.
- Homepage player lists now use only verified canonical singles players.
- Sitemap dynamic player URLs now use verified canonical singles players only.
- `/players/live-now` no longer renders arbitrary API fragments such as initials, one-word junk, doubles teams or unverified hyphen chains as player cards/links.

## Goal

Stop generating bad `/player/...` URLs from live match feed strings such as:

- `G. Campana Lee` → `/player/g-campana-lee`
- `Kumar/Poling` → `/player/kumar-poling`
- `Bennani/Lopez Morillo` → `/player/bennani-lopez-morillo`

Only canonical player URLs should now be emitted by the player-list pipelines.
