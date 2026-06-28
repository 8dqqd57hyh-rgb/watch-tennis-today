# Tennis Entity Enrichment Engine

## Changed files

- `src/lib/enrichment/types.ts`
- `src/lib/enrichment/shared.ts`
- `src/lib/enrichment/player.ts`
- `src/lib/enrichment/tournament.ts`
- `src/lib/enrichment/match.ts`
- `src/lib/enrichment/country.ts`
- `src/lib/enrichment/broadcaster.ts`
- `src/lib/enrichment/streaming.ts`
- `src/lib/enrichment/index.ts`
- `src/lib/enrichment/enrichment.smoke-test.ts`
- `app/broadcaster/[slug]/page.tsx`
- `app/watch-tennis-in/[country]/page.tsx`

## Architecture

The enrichment layer is a pure TypeScript data layer under `src/lib/enrichment/`. It derives reusable computed intelligence from existing sources instead of replacing or duplicating them.

Primary sources reused:

- `src/data/tennisBroadcasts.ts`
- `src/lib/intelligence/*`
- `src/lib/matchCenter.ts`
- `data/players.ts`
- `data/tournamentHubs.ts`

The UI consumes wrapper functions from `src/lib/enrichment/index.ts`, while the individual entity modules remain independent from React.

## Computed fields

Implemented enrichments for:

- players
- tournaments
- matches
- countries
- broadcasters
- streaming services

Each enrichment returns serializable data including quick facts, related content, watch availability, coverage summaries, SEO fields, FAQ data and source-backed viewing context.

## Cache strategy

`src/lib/enrichment/index.ts` adds a small module-level memoization cache for enrichment wrappers:

- deterministic cache keys
- explicit `clearEnrichmentCache()` helper
- `getEnrichmentCacheSize()` helper for smoke testing
- no React dependency

## Replaced / reused logic

Two production pages now consume enrichments directly:

- broadcaster pages show enriched coverage level, tours, streaming services and confidence summary
- country watching pages show enriched quick facts, coverage summary, free-viewing and premium-viewing summaries

This keeps the first integration low-risk while providing a reusable path for player, tournament, match, Can I Watch and TV Schedule pages.

## Tests

Added `src/lib/enrichment/enrichment.smoke-test.ts` covering:

- player enrichment
- tournament enrichment
- match enrichment
- country enrichment
- broadcaster enrichment
- streaming enrichment
- cache behavior

## Quality checks

Attempted checks:

- `npm run typecheck` — could not complete because `node_modules` is missing in the sandbox; TypeScript reports missing `next`, `react`, `@types/node`, Cypress and Playwright types. Grepping the typecheck output for the changed enrichment files showed no enrichment-specific TypeScript errors.
- `npm run lint` — failed because `eslint` is not installed in the sandbox.
- `npm run build` — failed because `next` is not installed in the sandbox.

Run `npm install` or `npm ci`, then rerun:

```bash
npm run lint
npm run typecheck
npm run build
```

## Remaining opportunities

- Replace duplicated computations in player, tournament, match, Can I Watch and TV Schedule pages.
- Use enrichment SEO objects in `generateMetadata` across entity pages.
- Add real unit test runner if the project later introduces Vitest/Jest.
- Add live form and H2H enrichment only when a reliable data source exists.
