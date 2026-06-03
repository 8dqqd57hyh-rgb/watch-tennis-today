# Cleanup: low-value / unreliable blocks and pages

Removed weak prediction/tracker experiences from promoted site paths because they depended on incomplete public feed data and could show empty, stale or low-value UI.

## Removed from homepage / hubs
- Removed Roland Garros Pick'em / prediction block from homepage.
- Removed French Open survivors block from homepage.
- Removed unreliable draw/survivors/storylines blocks from the French Open hub.
- Removed prediction/storyline blocks from French Open Today.

## Redirected low-value pages
These routes now redirect to stronger, useful pages and are marked `noindex`:
- `/roland-garros-predictions` → `/french-open-today`
- `/roland-garros-pulse` → `/french-open`
- `/french-open-draw` → `/french-open-schedule`
- `/french-open-upsets` → `/french-open-results`
- `/french-open-survivors` → `/french-open-results`

## SEO cleanup
- Removed the low-value pages from `app/sitemap.ts`.
- Replaced internal links to removed pages with schedule/results/French Open hub links.
- Updated French Open hub copy so it no longer promises brittle draw/prediction coverage.

## Kept
- Useful daily match pages.
- Schedule/results/live pages.
- Tournament hub.
- Match reminder conversion block.
- Rivalry and player pages.
