# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

Package manager is npm.

- `npm run dev` — start dev server
- `npm run build` / `npm run start` — production build / run
- `npm run lint` — ESLint (flat config, `eslint-config-next`)
- `npm run typecheck` — `tsc --noEmit`
- `npm run test:e2e` — Playwright, local/preview only (see production safety below)
- `npm run test:e2e:ui` / `:chromium` / `:firefox` / `:webkit` / `:cross-browser` — scoped Playwright runs
- `npm run test:e2e:prod-smoke` — the **only** sanctioned way to test against production (uses `playwright.prod.config.ts`, single serial worker, project `prod-smoke` matching `prod-smoke.spec.ts` only)
- `npm run test:predeploy` — lint + typecheck + build + Playwright; `test:predeploy:local` for a local-only variant
- Cypress suite (separate from Playwright): `npm run cy:open`, `cy:run` (and tag-filtered variants: smoke/seo/critical/api/journey/accessibility), `cy:report*`, `cy:predeploy`. Lives in `cypress/e2e/{smoke,api,seo,accessibility,journeys,mocked}` and `cypress/component`, run via `scripts/run-cypress.mjs`. See `CYPRESS_TESTS_README.md` for detail.
- There is no unit test runner (no jest/vitest). Correctness for library code is covered by Playwright/Cypress e2e specs, plus a couple of `*.smoke-test.ts` scripts under `src/lib/enrichment/` run via `tsx`.
- Misc `tsx` scripts: `npm run indexnow`, `npm run seo:audit`, `npm run update-streaming-offers`.

To run a single Playwright test: `npx playwright test tests/e2e/<file>.spec.ts`.

### Production safety guardrail

`tests/e2e/config/productionSafety.ts` exports `assertRegressionBaseUrlAllowed(baseURL)`, which `playwright.config.ts` calls at config-load time and **throws** if the resolved `baseURL` is `watchtennistoday.com` or `www.watchtennistoday.com`. Never set `TEST_BASE_URL` to production for a normal Playwright run — this is enforced in code, not just convention. `tests/e2e/production-safety.spec.ts` tests the guardrail itself.

## Architecture

This is primarily a **programmatic-SEO content site with a live tennis data layer on top** (Next.js App Router, React 19, Tailwind 4, Supabase, on a very new/bleeding-edge Next.js version — see AGENTS.md on reading `node_modules/next/dist/docs/` before using unfamiliar APIs).

### Routes (`app/`)

Two kinds of pages coexist:
- **Live/interactive app pages**: `today`, `tomorrow`, `live-tennis`, `matches`, `match/[slug]`, `player/[slug]`, `players/{atp,wta,live-now}`, `tournament/[slug]`, `broadcaster/[slug]`, `my-players`, `my-dashboard`, `my-feed`, `my-tournament`, `watch-directory`, `tv-schedule/[slug]`, `can-i-watch/[tournament]/[country]`.
- **Static SEO/content pages**: large volume of per-tournament and per-player guides (`french-open-*`, `wimbledon-*`, `watch-*-live`), country-specific "how to watch" guides, VPN comparison pages, glossary/explainer pages, plus a Polish locale subtree at `app/pl/...`.

### API routes (`app/api/`)

Match/tournament data feeds (`matches` + `bulkPlayer.ts`/`requestPlan.ts` helpers, `finals`, `tv-channels`, `tv-program`, `streaming-offers` + `revalidate/streaming-offers`, `watch-directory`, `next-grand-slam`, `match-archive/[id]`, tournament-specific feeds like `french-open-*`/`roland-garros-recap`/`wimbledon-qualifying`), email endpoints (`subscribe-{finals,general,player}`, `send-player-alerts`, `send-player-digest`, via `resend`), `revalidate` (ISR webhook), and `cron/update-tournament-calendar` (scheduled job, guarded by `CRON_SECRET`).

### Domain logic (`app/lib/`)

- `apiTennisClient.ts` — client for the external tennis data provider (`API_TENNIS_KEY`; `DEBUG_API_TENNIS`/`LOG_API_TENNIS` toggle verbose logging).
- `providerMatchIdentity.ts` — builds a stable match identity key from provider fields (prefers `event_key`, falls back to a normalized player/tournament/date composite). This exists to dedupe/match records across provider re-syncs, since the provider's own IDs aren't always stable.
- `serverMatches.ts` — server-side match fetch/shape (`ServerMatch` type), `getBaseUrl()`.
- `matchNormalization.ts`, `matchStatus.ts`, `matchLifecycle.ts`, `matchArchive.ts` — match data shaping/status/lifecycle handling.
- `smartMatchPolling.ts` — polling cadence strategy for live match data.
- `supabaseAdmin.ts` (service-role, server-only) / `supabaseCourtData.ts` — Supabase access; anon key is used client-side, service-role key server-side only.
- `streamingOffers.ts`, `tournamentCalendar.ts`, `finals.ts`, `wimbledonOfficial*.ts`, `grandSlamQualifying.ts` — tournament/streaming data.
- `indexNow.ts`/`adsenseIndexing.ts`, `technicalSeo.ts` — SEO ping/indexing utilities.
- `i18n.ts`, `rateLimit.ts`.

### Enrichment & intelligence (`src/lib/`)

- `src/lib/enrichment/` — a distinct enrichment subsystem (`player.ts`, `tournament.ts`, `match.ts`, `country.ts`, `broadcaster.ts`, `streaming.ts`, `shared.ts`, `types.ts`, `presentation.ts`), exposed via `index.ts`. Uses a module-level `Map` cache keyed by slug+match count (`getPlayerEnrichment`, `getTournamentEnrichment`, `getMatchEnrichment`, `clearEnrichmentCache`/`getEnrichmentCacheSize`) rather than re-deriving enriched data on every call — clear the cache explicitly if underlying data changes within a process lifetime.
- `src/lib/intelligence/` — relationship graph between players/tournaments (graph/queries/relationships).
- `src/lib/matchCenter.ts`.
- `src/data/` — static datasets (`coverageGraph.ts`, `streamingOffers.ts`, `tennisBroadcasts.ts`).

### Components (`app/components/`)

Mostly per-tournament SEO/content components (`FrenchOpen*`, `Wimbledon*`), plus core UI: `MatchDashboard.tsx`, `EnrichmentPanels.tsx` (consumes `src/lib/enrichment`), `Local{Player,Match,Tournament}FollowButton.tsx` (client-side "follow" state), `BroadcastFinder.tsx`, `StreamingOfferCard.tsx`, `AdSlot.tsx`/`AdSenseEditorialBlock.tsx`, `JsonLd.tsx`/`BreadcrumbSchema.tsx` (structured data).

### Data layer summary

External tennis data comes through `apiTennisClient.ts`; Supabase (Postgres) persists derived/cached data (court data, streaming offers, match archive); ISR/on-demand revalidation goes through `/api/revalidate`; `providerMatchIdentity.ts` stabilizes identity across provider re-syncs; `smartMatchPolling.ts` governs live-match refresh cadence.

### Path aliases

`@/*` resolves to the repo root — imports are written as `@/app/lib/...` or `@/src/lib/...`, not `@/lib/...`.

## Environment variables

No `.env.example` exists (only a gitignored `.env.local`) — if you add a new env var, there's no template to update, but consider whether one should exist.

Known vars: `API_TENNIS_KEY`, `DEBUG_API_TENNIS`, `LOG_API_TENNIS`, `DEBUG_MATCH_FILTERS`, `LOG_TOURNAMENT_FIXTURES`, `SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, `ALERT_TEST_MODE`, `STREAMING_DATA_STALE_AFTER_HOURS`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT`, `CYPRESS_BASE_URL`.
