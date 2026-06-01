# Tournament Records - Codex 76

Implemented a non-duplicative Roland Garros records board focused on completed-match signals rather than another recap/storyline block.

## Added
- `app/components/FrenchOpenTournamentRecords.tsx`
  - Fetches `/api/french-open-results` and `/api/french-open-upsets`.
  - Builds records only from available feed data.
  - Hides itself when there is not enough completed-match data.
  - Avoids unsupported stats such as duration, aces and true fastest match unless the feed exposes them.

## Records shown when available
- Biggest seeded shock
- Longest scoreline by set count and total games
- Cleanest straight-set win by games conceded
- Best deciding-set candidate
- Latest completed result

## Integrated on
- `/french-open`
- `/french-open-results`

## Notes
- This is intentionally different from Storylines Today, Must-watch Matches and Daily Recap.
- It is a compact SEO/product block for tournament context and internal links to match pages.
