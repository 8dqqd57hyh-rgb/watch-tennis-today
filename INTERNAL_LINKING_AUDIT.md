# Internal Linking Audit

Date: 2026-07-01

## Scope

This audit reviewed public App Router pages, sitemap/indexability helpers, shared navigation, related-link components, breadcrumbs, dynamic player/tournament/watch routes, and hardcoded SEO landing pages.

Static scan baseline:

- App page files found: 169
- Static public page routes found: 154
- Dynamic public route patterns found: 15
- Static internal JSX hrefs found before implementation: 581
- Static internal JSX hrefs found after implementation: 580
- Known redirect-only href targets after implementation: 0

The static href count is directional because many links are generated from typed arrays, route helpers, match feeds, player slug helpers, and enrichment/intelligence data.

## Public Route Inventory

### Hub Pages

- `/`
- `/today`
- `/live-tennis`
- `/players`
- `/players/atp`
- `/players/wta`
- `/grand-slam-live`
- `/grand-slams`
- `/tournament`
- `/tennis-guides`
- `/guides`
- `/watch`
- `/watch-tennis-in`
- `/broadcasters`
- `/can-i-watch`
- `/tennis-resources`
- `/tennis-calendar`
- `/start-here`

### Tournament Pages

- Static tournament hubs: `/wimbledon`, `/wimbledon-live`, `/wimbledon-schedule`, `/wimbledon-order-of-play`, `/wimbledon-results`, `/wimbledon-draw`, `/wimbledon-prize-money`, `/wimbledon-qualifying`, `/wimbledon-qualifying-live`, `/french-open`, `/french-open-guide`, `/french-open-order-of-play`, `/french-open-results`, `/where-to-watch-french-open`, `/watch-french-open-online`, `/australian-open`, `/us-open`
- Dynamic tournament route: `/tournament/[slug]`
- Sitemap-generated tournament detail pages: `stableTournamentHubSlugs` plus important tournament slugs when available from match data

### Player Pages

- Player directory routes: `/players`, `/players/atp`, `/players/wta`, `/players/live-now`
- Canonical player profile route: `/player/[slug]`
- Legacy redirect route: `/players/[slug]`
- Player live routes: `/watch-player-live`, `/watch-player-live/[slug]`, `/watch-alcaraz-live`, `/watch-djokovic-live`, `/watch-sinner-live`, `/watch-sabalenka-live`, `/watch-swiatek-live`
- Player schedule route: `/tv-schedule/[slug]`
- Sitemap-generated player pages: `ADSENSE_INDEXABLE_PLAYER_SLUGS` only

### Watch Pages

- `/watch`
- `/watch/[slug]`
- `/match/[slug]`
- `/next-match`
- `/next-match/[slug]`
- Country watch pages: `/watch-tennis-in`, `/watch-tennis-in/[country]`
- Reviewed country pages: `/watch-tennis-in/france`, `/watch-tennis-in/germany`, `/watch-tennis-in/spain`
- Redirect-only country aliases remain intentionally out of the internal link graph: `/watch-tennis-in-usa`, `/watch-tennis-in-uk`, `/watch-tennis-in-canada`, `/watch-tennis-in-australia`

### Guide Pages

- `/guides`
- `/guides/[slug]`
- `/tennis-guides`
- `/best-ways-to-watch-tennis-online`
- `/how-to-watch-tennis-legally`
- `/how-to-watch-tennis-safely-abroad`
- `/how-to-watch-tennis-without-cable`
- `/how-to-choose-tennis-streaming-service`
- `/official-tennis-broadcasters-guide`
- `/tennis-scoring-explained`
- `/tennis-live-scores-explained`
- `/tennis-schedule-terms-explained`
- `/tennis-tournament-levels-guide`
- `/grand-slam-tv-rights-explained`
- `/atp-wta-rankings-explained`
- `/tennis-court-surfaces`
- `/tennis-glossary`

### Wimbledon Country Guide Pages

- `/how-to-watch-wimbledon-in-usa`
- `/how-to-watch-wimbledon-in-uk`
- `/how-to-watch-wimbledon-in-canada`
- `/how-to-watch-wimbledon-in-australia`
- `/how-to-watch-wimbledon-in-poland`
- `/how-to-watch-wimbledon-in-germany`
- `/how-to-watch-wimbledon-in-france`
- `/how-to-watch-wimbledon-in-spain`
- `/how-to-watch-wimbledon-in-italy`
- `/how-to-watch-wimbledon-in-india`

### Utility And Trust Pages

- `/about`
- `/contact`
- `/privacy`
- `/terms`
- `/cookie-policy`
- `/affiliate-disclosure`
- `/authors/watch-tennis-today`
- `/editorial-policy`
- `/content-guidelines`
- `/how-we-source-data`
- `/how-we-verify-streams`
- `/why-trust-watch-tennis-today`
- `/advertise`
- `/media-kit`
- `/newsletter`
- `/newsletter-confirmation`
- `/disclaimer`

### Low-Priority Or Noindex Pages

These routes exist but are noindex, redirect-only, user-account oriented, heavily temporal, or intentionally excluded from the sitemap:

- `/atp-live-today`
- `/wta-live-today`
- `/best-tennis-matches-today`
- `/tennis-schedule-today`
- `/tennis-schedule-tomorrow`
- `/tennis-order-of-play-today`
- `/tennis-results-today`
- `/tennis-trending-now`
- `/matches/live-now`
- `/my-dashboard`
- `/my-feed`
- `/my-players`
- `/my-tournament`
- `/compare`
- `/compare/[slug]`
- `/compare/tennis-tv-vs-espn`
- `/rivalries`
- `/rivalries/[slug]`
- `/vs/[slug]`

### Sitemap And Technical Routes

- `/sitemap.xml` from `app/sitemap.ts`
- `/robots.txt` from `app/robots.ts`
- APIs are not part of the crawlable internal link graph, but API-backed routes influence dynamic links: `/api/matches`, `/api/watch-directory`, `/api/wimbledon-qualifying`, French Open APIs, subscription APIs, and match archive APIs.

## Link Graph Findings Before Changes

### Orphan Or Weak Pages

The initial static scan flagged many routes with zero or one static incoming link. Some are acceptable because they are redirect-only, noindex, or generated from dynamic data, but several important pages were weaker than ideal:

- Priority hubs needed stronger cross-links: `/today`, `/live-tennis`, `/players`, `/grand-slam-live`, `/wimbledon-live`, `/wimbledon-schedule`, `/wimbledon-results`, `/french-open-order-of-play`
- Wimbledon secondary pages had weak discovery from country and qualifying pages.
- French Open order-of-play page had a duplicated related block where multiple cards pointed to the same URLs.
- Dynamic player pages had many useful resources but did not consolidate `/today`, `/live-tennis`, `/players`, and player live-guide links in one reusable related section.
- Watch pages still linked to `/tennis-schedule-today`, which is a noindex daily alias, instead of the stronger `/today` hub.

### Duplicated Or Low-Quality Blocks

- `app/french-open-order-of-play/page.tsx` repeated `/french-open` and `/where-to-watch-french-open` in the same related block.
- Wimbledon related lists included `/wimbledon-tv-schedule`, which is marked redirect-only in `technicalSeo.ts`.
- The footer linked `/privacy-policy`, which redirects to `/privacy`.
- Wimbledon qualifying match cards linked `/wimbledon-live-stream`, which redirects to `/wimbledon-live`.

### Pages With Many Outgoing Links

High outgoing-link pages are mostly expected because they are route families or directory-style pages:

- `/tournament/[slug]`
- `/player/[slug]`
- `/watch/[slug]`
- `/watch-tennis-in/[country]`
- `/wimbledon`
- `/players`
- `/live-tennis`
- `/grand-slam-live`

No reviewed page exceeded the requested 100-link threshold from the static page-level scan.

## Priority Hub Strategy

Implemented links prioritize stable, canonical equivalents:

- `/today`
- `/live-tennis`
- `/players`
- `/wimbledon-live`
- `/wimbledon-schedule`
- `/wimbledon-results`
- `/grand-slam-live`
- `/french-open-order-of-play`
- `/where-to-watch-french-open`

Note: `/french-open-schedule`, `/french-open-live-stream`, and `/wimbledon-tv-schedule` are listed as redirect-only or deprecated in the repo policy. Internal links were steered to canonical live/order/where-to-watch targets instead of those redirect-only URLs.

## Components Created Or Updated

### Created

- `app/components/RelatedPages.tsx`
  - Typed `RelatedPageLink` data
  - Uses `next/link`
  - Shows up to 8 links
  - Filters same-page links
  - Deduplicates repeated hrefs
  - Supports light and dark page themes

### Updated

- `app/components/RelatedWimbledonGuides.tsx`
- `app/components/WimbledonCountryLandingPage.tsx`
- `app/components/WimbledonGuidePage.tsx`

## Pages Modified

- `app/today/page.tsx`
- `app/live-tennis/page.tsx`
- `app/players/page.tsx`
- `app/components/WimbledonGuidePage.tsx`
- `app/components/RelatedWimbledonGuides.tsx`
- `app/components/WimbledonCountryLandingPage.tsx`
- `app/french-open-order-of-play/page.tsx`
- `app/french-open-live-stream/page.tsx`
- `app/grand-slam-live/page.tsx`
- `app/player/[slug]/page.tsx`
- `app/watch/[slug]/page.tsx`
- `app/wimbledon-qualifying/page.tsx`
- `app/layout.tsx`

## Links Added By Page

### `/today`

- Added visible breadcrumb: Home > Tennis Today
- Added BreadcrumbList schema through `BreadcrumbSchema`
- Added related links to `/live-tennis`, `/players`, `/wimbledon-live`, `/wimbledon-schedule`, `/grand-slam-live`, `/tennis-tv-broadcast-finder`

### `/live-tennis`

- Replaced dead `#faq` nav item with `#related`
- Added related links to `/today`, `/players`, `/wimbledon-live`, `/grand-slam-live`, `/watch-alcaraz-live`, `/watch-sinner-live`, `/watch-djokovic-live`, `/tennis-tv-broadcast-finder`

### `/players`

- Added related links to `/today`, `/live-tennis`, `/players/atp`, `/players/wta`, `/watch-alcaraz-live`, `/watch-sinner-live`, `/watch-djokovic-live`, `/grand-slam-live`

### Wimbledon Guide Cluster

- Added related links from shared `WimbledonGuidePage` to `/wimbledon-live`, `/wimbledon-schedule`, `/wimbledon-results`, `/today`, `/live-tennis`, `/players`, `/grand-slam-live`
- Replaced `/wimbledon-tv-schedule` links in shared Wimbledon guide surfaces with stable Wimbledon targets.
- Updated country pages to link schedule, order of play, where to watch, and results.

### French Open Cluster

- Added breadcrumbs and BreadcrumbList schema to `/french-open-order-of-play`
- Replaced duplicated related links with a deduped block linking `/french-open`, `/where-to-watch-french-open`, `/french-open-results`, `/today`, `/live-tennis`, `/players`, `/grand-slam-live`
- Added breadcrumbs and related links to `/french-open-live-stream`

### `/grand-slam-live`

- Added related links to `/today`, `/live-tennis`, `/players`, `/wimbledon-live`, `/wimbledon-schedule`, `/wimbledon-results`, `/french-open-order-of-play`, `/where-to-watch-french-open`

### Dynamic Player Pages

- Reworked the related resources section to include `/today`, `/live-tennis`, `/players`, the current `/watch-player-live/[slug]` page, and existing evergreen player-resource links.
- Changed the generic schedule CTA from `/watch` to `/today`.

### Dynamic Watch Pages

- Repointed match-page schedule links from `/tennis-schedule-today` to `/today`.

## Breadcrumbs Added

- `/today`: visible breadcrumb plus BreadcrumbList schema
- `/french-open-order-of-play`: visible breadcrumb plus BreadcrumbList schema
- `/french-open-live-stream`: visible breadcrumb plus BreadcrumbList schema

Existing breadcrumb/schema coverage was preserved on Wimbledon, player, watch, tournament, broadcaster, and several guide pages.

## Broken Or Redirected Links Fixed

- `/privacy-policy` -> `/privacy`
- `/wimbledon-live-stream` -> `/wimbledon-live`
- `/wimbledon-tv-schedule` removed from shared Wimbledon related blocks
- `/tennis-schedule-today` -> `/today` on match pages
- Duplicate French Open related links removed from the same related block

Post-change scan found no hardcoded internal hrefs to known `REDIRECT_ONLY_PATHS`.

## Validation

- Read local Next.js 16.2.6 docs for App Router linking and metadata before edits.
- Ran targeted ESLint on all modified TS/TSX files: passed.
- Ran static redirect-target scan against `REDIRECT_ONLY_PATHS`: passed with zero hits.

## Remaining Risks

- Static scanning cannot fully resolve dynamic hrefs produced by API data, match feeds, slug helpers, enrichment graph data, and typed link arrays.
- Some routes with zero static incoming links are intentionally redirect-only, noindex, user-account pages, or generated by runtime data. They should not all be treated as SEO orphans.
- `/french-open-live-stream` and `/french-open-schedule` are named as priority hubs in the brief, but the repo marks them redirect-only. Future SEO decisions should either restore them as canonical pages with sitemap inclusion or keep internal links on stable canonical targets.
- Several low-priority/noindex pages still exist as public routes. They are acceptable if they remain excluded from sitemap and avoid receiving heavy internal PageRank.

## Future Improvements

- Add a small automated internal-link test that fails when hardcoded hrefs point to `REDIRECT_ONLY_PATHS` or `NOINDEX_ONLY_PATHS` from high-priority SEO pages.
- Extend the static graph extractor to parse typed `href` objects, template literals with known constants, and sitemap-generated dynamic routes.
- Consider a shared hub-link dataset for Today, Live Tennis, Wimbledon, French Open, Grand Slam, Player, and Watch clusters so future pages do not recreate link lists by hand.
- Review noindex daily aliases such as `/tennis-schedule-today` and decide whether they should stay low-priority or be consolidated more aggressively into `/today`.
