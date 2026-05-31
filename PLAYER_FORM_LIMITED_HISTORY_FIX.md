# Player Form limited-history fix

The player form block no longer presents a small single-tournament sample as "Last 10 matches".

## Changed

- Added a meaningful-history guard for Player Form.
- Requires either 8+ usable completed matches, or 6+ usable completed matches across at least 2 tournaments.
- If the feed only returns the current tournament, the page hides win rate/streak stats instead of showing misleading form.
- The badge changes from "Last 10 matches" to "Limited history" when the sample is too narrow.
- Match Center remains unchanged and can still show the current tournament result.

This prevents cases like Andrey Rublev showing only Roland Garros results as if they were overall recent form.
