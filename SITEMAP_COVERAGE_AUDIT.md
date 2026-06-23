# Sitemap Coverage Audit

## Scope

This audit reviews the current `app/sitemap.ts` strategy after the Search Console drop investigation. Google Search Console reportedly has about 428 indexed pages, while the submitted sitemap has about 122 URLs.

I do not have direct GSC export access in this workspace, so the comparison uses:

- the GSC counts provided in the request,
- the app route inventory,
- route-level metadata/robots/canonical behavior,
- the current curated sitemap generation logic.

## Finding

The sitemap had become too restrictive for stable evergreen pages. It correctly avoids ephemeral `/watch/[slug]` match URLs, but it was also missing several indexable, self-canonical pages with durable content:

- evergreen daily-discovery pages,
- tennis education pages,
- Grand Slam and Wimbledon hubs,
- French Open schedule/order-of-play guide pages,
- self-canonical star-player live guide pages.

The sitemap already covered the most important stable player pages through `ADSENSE_INDEXABLE_PLAYER_SLUGS`, the stable tournament hubs from `stableTournamentHubSlugs`, published guide articles, reviewed country guides, and core legal/streaming hubs.

## Indexed vs Sitemap Coverage

- GSC indexed pages: about 428.
- Current sitemap coverage before this audit: about 122 submitted URLs.
- Sitemap expansion in this audit: 13 stable URLs added, so expected coverage is about 135 submitted URLs after deploy.
- Interpretation: coverage was intentionally quality-focused, but likely under-submitted stable pages that Google already knows and may keep indexed.

This gap does not mean all 428 indexed pages should be in the sitemap. Many indexed/discovered URLs are likely dynamic match pages, aliases, seasonal pages, or generated pages. The sitemap should be a curated signal for stable, high-quality URLs, not a dump of every known URL.

## Valuable Missing Pages Added

### Daily discovery and fan workflow pages

- `/who-plays-tennis-today`
- `/tennis-watchlist-today`
- `/tennis-spoiler-free-scores`

Reason: These are stable, indexable, self-canonical pages with useful non-match-specific search intent.

### Evergreen tennis education

- `/tennis-court-surfaces`

Reason: This is an evergreen explanatory guide with article schema and a self-canonical.

### Grand Slam and Wimbledon hubs

- `/grand-slam-live`
- `/wimbledon-live`
- `/wimbledon-schedule`
- `/wimbledon-results`

Reason: These are stable, self-canonical Grand Slam/Wimbledon pages with reusable hub or guide content. They are not ephemeral match detail URLs.

### French Open guide pages

- `/french-open-schedule`
- `/french-open-order-of-play`

Reason: These are real indexable pages, not current redirects. `technicalSeo.ts` incorrectly still treated `/french-open-schedule` as redirect-only, so that stale exclusion was removed.

### Star-player live guides

- `/watch-alcaraz-live`
- `/watch-djokovic-live`
- `/watch-sinner-live`

Reason: These are self-canonical, indexable player guide pages with unique editorial/player authority content. Noindex redirect aliases such as `/watch-swiatek-live` and `/watch-sabalenka-live` remain excluded.

## Already Covered

### Stable player pages

The sitemap already includes player pages from `ADSENSE_INDEXABLE_PLAYER_SLUGS`, including:

- `/player/jannik-sinner`
- `/player/carlos-alcaraz`
- `/player/novak-djokovic`
- `/player/aryna-sabalenka`
- `/player/iga-swiatek`
- `/player/coco-gauff`
- `/player/daniil-medvedev`
- `/player/alexander-zverev`
- `/player/taylor-fritz`
- `/player/jack-draper`
- `/player/tommy-paul`
- `/player/jessica-pegula`
- `/player/elena-rybakina`
- `/player/mirra-andreeva`

I did not add other `/player/[slug]` pages because the page-level indexability logic intentionally noindexes players outside this reviewed set unless they meet the quality helper.

### Stable tournament pages

The sitemap already includes tournament detail pages from `stableTournamentHubSlugs`, including Grand Slams, major 1000 events, and season finals.

I did not add arbitrary calendar-only tournament pages such as `/tournament/little-rock`. Those pages can be useful when calendar/live data exists, but sitemap inclusion should wait until the page has stable checked-in editorial support or a reviewed tournament-hub entry.

### Guides and reviewed country pages

Published guide articles and reviewed country guide pages were already included.

## Intentionally Excluded

- `/watch/[slug]` match pages, because they are volatile and heavily represented in "Crawled - currently not indexed".
- `/watch-player-live/[slug]`, because current metadata marks those detail pages `noindex`.
- Noindex aliases such as `/watch-swiatek-live`, `/watch-sabalenka-live`, `/tennis-results-today`, `/best-tennis-matches-today`, `/tennis-order-of-play-today`, `/atp-live-today`, and `/wta-live-today`.
- Redirect/canonical aliases such as `/privacy-policy`, `/wimbledon-live-stream`, `/watch/tennis-spoiler-free-scores`, and country shortcut pages like `/watch-tennis-in-usa`.
- Expired or recap-style event pages that are currently noindex.

## Changes Made

- Added the stable missing pages above to `app/sitemap.ts`.
- Removed stale redirect-only exclusions for `/french-open-schedule` and `/french-open-today` from `app/lib/technicalSeo.ts`; only `/french-open-schedule` was added to the sitemap in this pass.
- Updated the SEO sitemap smoke test to assert inclusion of the newly added high-value pages and continued exclusion of noindex/player-live detail URLs and `/watch/[slug]`.

## Follow-Up

- Export indexed URLs from GSC and compare them against sitemap URLs. Sort the missing indexed URLs into:
  - stable evergreen pages to add,
  - noindex/canonical aliases to leave out,
  - volatile match pages to leave out,
  - stale pages that should be noindexed or redirected.
- Consider promoting additional tournament pages into `stableTournamentHubs` only when they have checked-in editorial copy.
- Consider expanding `ADSENSE_INDEXABLE_PLAYER_SLUGS` only after adding substantial player editorial profiles with `watchReasons` and durable search intent.
