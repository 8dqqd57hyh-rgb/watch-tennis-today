# Live point score reality fix

## Problem
The match page showed values like `30-40` or `40-ADV` from `pointbypoint[].points[]`, but those values can be stale completed-point history instead of the real current in-game score.

## Fix
- Removed fallback to the latest completed point-by-point history item.
- Only exposes `pointScore` when the latest point-by-point game appears to be still in progress.
- If the REST feed does not provide a reliable current 15/30/40 value, the UI now shows `Point score unavailable` instead of a fake live value.
- Added a small `Feed limited` badge and explanatory text for live matches when in-game points are not reliably available from REST.

## Validation
- `npx tsc --noEmit` passes after installing dependencies.
- `npm run lint` still fails due to pre-existing project-wide lint issues unrelated to this fix, mostly `<a>` vs `next/link` and `no-explicit-any` warnings/errors.
