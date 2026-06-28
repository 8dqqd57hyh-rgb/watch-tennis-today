# Wire Enrichment Engine into UI and SEO

## Summary

This sprint connects the Tennis Entity Enrichment Engine to the public UI and metadata layer. The goal is to make enrichment the reusable computed-data layer behind player, tournament, match, country, broadcaster, Can I Watch, and streaming comparison experiences without replacing existing data sources.

## Changed files

- `app/components/EnrichmentPanels.tsx`
- `app/player/[slug]/page.tsx`
- `app/tournament/[slug]/page.tsx`
- `app/match/[slug]/page.tsx`
- `app/watch-tennis-in/[country]/page.tsx`
- `app/broadcaster/[slug]/page.tsx`
- `app/can-i-watch/page.tsx`
- `app/tennis-streaming-services/page.tsx`
- `src/lib/enrichment/ui-seo-integration.smoke-test.ts`
- `WIRE_ENRICHMENT_ENGINE_UI_SEO_REPORT.md`

## UI integration

### Shared UI components

Created `EnrichmentPanels.tsx` with reusable components:

- `EnrichmentQuickFacts`
- `EnrichmentLinkGrid`
- `EnrichmentWatchSummary`

These components keep enrichment rendering consistent and avoid rebuilding the same cards independently on each page.

### Player page

Wired `getPlayerEnrichment()` into:

- metadata title/description/keywords
- quick facts
- watch availability summary
- related players
- related tournaments
- featured matches

The page still keeps its existing editorial and match sections. Enrichment now supplements those sections instead of replacing them.

### Tournament page

Wired `getTournamentEnrichment()` into:

- metadata title/description/keywords
- tour/surface/country/season quick facts
- Grand Slam/live-match flags
- broadcast country count
- streaming provider count
- related tournaments and featured players

Existing tournament guide, matches, known-data sections and schemas remain intact.

### Match page

Wired `getMatchEnrichment()` into:

- metadata title/description/keywords
- importance score
- live/today/upcoming flags
- watch country count
- streaming service count
- recommended viewing copy
- related matches and guides

Existing Match Center functionality remains the source for exact route behavior and match schema generation.

### Country watching page

Existing country enrichment rendering was preserved and metadata now also reads from `getCountryEnrichment()`.

### Broadcaster page

Existing broadcaster enrichment rendering was preserved and metadata now also reads from `getBroadcasterEnrichment()`.

### Can I Watch page

Added a finder-level enrichment coverage panel using `getCountryEnrichment()` across country options:

- country count
- broadcaster link count
- streaming link count
- data layer indicator

### Streaming services page

Added a streaming enrichment coverage panel using `getStreamingEnrichment()` across listed services:

- services compared
- countries in dataset
- tournament groups
- enrichment data source indicator

## SEO integration

Enrichment is now used for metadata on:

- player pages
- tournament pages
- match pages
- country watching pages
- broadcaster pages

Metadata now includes enrichment-driven keywords where supported by the existing page structure.

## Cache strategy

This sprint reuses the existing memoized enrichment getters:

- `getPlayerEnrichment()`
- `getTournamentEnrichment()`
- `getMatchEnrichment()`
- `getCountryEnrichment()`
- `getBroadcasterEnrichment()`
- `getStreamingEnrichment()`

The UI calls getter functions instead of calling raw enrichment functions directly, so repeated page-level computations can share cached results.

## Replaced duplicated logic

This sprint does not remove all legacy duplicated logic yet. It begins the migration by moving new UI/SEO cards to enrichment outputs while preserving older editorial, schedule and match rendering logic.

The safest next cleanup is to replace older manually assembled related-link sections with `EnrichmentLinkGrid` where the same relationships are already available from enrichment.

## Tests added

Added `src/lib/enrichment/ui-seo-integration.smoke-test.ts` covering:

- player enrichment UI fields
- player SEO fields
- tournament classification
- match importance and FAQ SEO output
- country coverage summary
- broadcaster confidence summary
- cache population

## Quality checks

Commands attempted:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

Results:

- `npm run typecheck` could not complete cleanly because project dependencies and type packages are missing in this environment (`next`, React JSX runtime, Cypress, Playwright, Node types, etc.).
- `npm run lint` failed because `eslint` is not installed.
- `npm run build` failed because `next` is not installed.

No new dependency was added.

## Remaining opportunities

1. Replace older manual related-link blocks on player/tournament/country/broadcaster pages with enrichment-only components.
2. Add enrichment quality score and route-level noindex decisions.
3. Generate FAQ schema directly from `enrichment.seo.faq` where page-specific FAQ is not stronger.
4. Add a dedicated streaming-service route if the project later creates `/streaming/[slug]`.
5. Add visual regression tests once dependencies are installed.
