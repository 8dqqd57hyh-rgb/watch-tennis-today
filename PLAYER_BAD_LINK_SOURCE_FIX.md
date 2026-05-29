# Player Bad Link Source Fix

## Problem
Some UI blocks were still creating player URLs by slugifying arbitrary names from the live match feed.

That produced invalid URLs such as:

- `/player/kasatkina-osorio`
- `/player/bass-clarke`
- `/player/kumar-poling`
- `/player/bennani-lopez-morillo`

These are matchups, not canonical player pages.

## Fix
- Replaced homepage local `/player/${slugify(name)}` generation with canonical `safePlayerUrl()`.
- Replaced Best Matches Today Engine player hub links with canonical `safePlayerUrl()`.
- Unknown/non-canonical feed names now render as plain text instead of links.
- Match cards no longer create `/player/...` links for unvalidated player strings.

## Validation
- `npx tsc --noEmit` passes.
- `npm run build` compiles and passes TypeScript; sandbox timed out during Next page-data collection, not during compile/typecheck.
