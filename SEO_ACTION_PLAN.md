# SEO Action Plan

Audit date: 2026-06-27

Scope: source crawl of the existing Next.js app under `app/`, plus `next.config.ts`, `robots.ts`, `sitemap.ts`, `app/layout.tsx`, and shared SEO helpers. No page implementations were changed.

## Executive Summary

The site has a strong commercial footprint: live tennis, Grand Slam, country, streaming, schedule, player, and broadcaster pages are already present. The main opportunity is not adding more pages. It is consolidating authority into the highest-intent existing URLs and preventing thin/redirect/noindex pages from diluting crawl quality.

The crawl found 162 page routes, about 106 source-indexable routes, about 55 routes with noindex logic, and 16 page-level redirect routes. The most important SEO issues are:

- HIGH: many indexable commercial pages are thin, especially Wimbledon, TV schedule, country/watch, and guide pages.
- HIGH: redirect/canonical/sitemap inconsistencies create mixed signals for high-intent URLs.
- HIGH: several revenue pages lack page-specific OG/Twitter metadata and structured data.
- MEDIUM: high-value pages have weak internal linking or appear orphaned from source-level crawl.
- MEDIUM: player, country, and dynamic watch routes have index/noindex rules that should be audited against revenue goals.
- LOW: duplicate static titles are limited, but a few titles are clearly wrong or inherited from UI data.

## Crawl Findings

### HIGH Impact

#### Thin Indexable Pages

Estimated SEO impact: high. Thin pages are unlikely to rank for competitive commercial queries and can weaken perceived site quality.

High-value indexable thin pages under 500 words include:

- `/where-to-watch-wimbledon` - 50 words
- `/wimbledon-live` - 51 words
- `/wimbledon-schedule` - 51 words
- `/wimbledon-tv-schedule` - 48 words
- `/wimbledon-draw` - 48 words
- `/wimbledon-results` - 44 words
- `/wimbledon-prize-money` - 47 words
- `/tennis-on-tv-today` - 51 words
- `/today` - 56 words
- `/watch-player-live` - 71 words
- `/watch-tennis-online` - 404 words
- `/watch-tennis-in` - 291 words
- `/tennis-tv-broadcast-finder` - 211 words
- `/tennis-streaming-services` - 367 words
- `/tennis-streaming-service-picker` - 297 words
- `/tennis-streaming-cost-calculator` - 288 words
- `/french-open` - 328 words
- `/french-open-guide` - 236 words
- `/where-to-watch-french-open` - 287 words
- `/grand-slams` - 133 words
- `/players` - 219 words

Recommendation: expand these existing pages with commercial modules, FAQs, comparison tables, internal links, and schema before creating any new URLs.

#### Redirect, Canonical, and Sitemap Conflicts

Estimated SEO impact: high. Search engines should receive one clear signal per URL: indexable canonical page, noindex support page, or permanent redirect.

Observed conflicts:

- `next.config.ts` permanently redirects `/wimbledon-tv-schedule` to `/where-to-watch-wimbledon`, but `app/wimbledon-tv-schedule/page.tsx` exists, has canonical self-reference, and `sitemap.ts` includes `/wimbledon-tv-schedule`.
- `next.config.ts` redirects `/french-open-live-stream`, `/french-open-schedule`, `/french-open-tv-schedule`, and `/french-open-today`, but source pages still exist for several of those paths.
- Static country alias pages such as `/watch-tennis-in-usa`, `/watch-tennis-in-uk`, `/watch-tennis-in-canada`, and `/watch-tennis-in-australia` are noindex and canonicalize to `/watch-tennis-in/{country}` instead of redirecting.
- `/french-open-streaming-countries` canonicalizes to `/where-to-watch-french-open`, while also being present as a page route.

Recommendation: choose one canonical URL per intent cluster and align route files, redirects, sitemap inclusion, and internal links. Do not keep a URL in the sitemap if it redirects.

#### Missing or Generic Social Metadata

Estimated SEO impact: medium-high. OG/Twitter metadata is not a direct ranking factor, but it affects click-through, link previews, and commercial trust.

Source crawl found 105 non-redirect pages without page-specific `openGraph` metadata and 119 without page-specific `twitter` metadata. Root layout defaults exist, but high-value pages need unique previews.

Priority pages missing page-specific OG/Twitter:

- `/wimbledon`
- `/french-open`
- `/us-open`
- `/australian-open`
- `/where-to-watch-french-open`
- `/best-ways-to-watch-tennis-online`
- `/watch-tennis-online`
- `/tennis-tv-broadcast-finder`
- `/players`
- `/today`
- `/grand-slam-live`
- `/grand-slams`

Recommendation: add unique title, description, URL, type, and image for each revenue page. Use event/tournament/country-specific OG copy where applicable.

#### Missing Structured Data on Revenue Pages

Estimated SEO impact: medium-high. Schema can improve eligibility for rich results and helps clarify page entities.

Source crawl found 84 non-redirect pages without page-level structured data. Priority revenue gaps include:

- `/where-to-watch-wimbledon`
- `/wimbledon-live`
- `/wimbledon-schedule`
- `/wimbledon-tv-schedule`
- `/wimbledon-draw`
- `/wimbledon-results`
- `/wimbledon-prize-money`
- `/tennis-on-tv-today`
- `/today`
- `/players`
- `/grand-slam-live`
- `/watch-player-live`

Recommendation: add `FAQPage`, `BreadcrumbList`, `WebPage`, `Article`, `ItemList`, `SportsEvent`, or `ProfilePage` schema depending on page type. Keep one clear primary schema purpose per page.

### MEDIUM Impact

#### Missing Canonicals

Estimated SEO impact: medium. Root layout metadata may cover some defaults, but explicit canonical URLs should be present on indexable commercial pages and all alias/noindex pages.

Routes missing explicit canonical signals in source crawl:

- `/best-vpn-for-tennis-streaming`
- `/compare/tennis-tv-vs-espn`
- `/french-open-live-stream`
- `/french-open-schedule`
- `/french-open-today`
- `/matches/live-now`
- `/players/live-now`
- `/tennis-trending-now`
- `/tomorrow`
- `/tv-schedule`
- `/watch-french-open-online`
- `/watch-player-live`

Recommendation: add explicit canonical metadata or remove/redirect the page if it is not meant to be indexable.

#### Orphan or Weakly Linked Pages

Estimated SEO impact: medium. Source-level crawl counted global nav links from layout. Some dynamic links may be generated at runtime, so this should be confirmed with a rendered crawl, but several important pages appear underlinked.

High-value pages with no or weak source-level incoming links:

- `/french-open-guide`
- `/watch-tennis-online`
- `/where-to-watch-wimbledon`
- `/wimbledon-draw`
- `/wimbledon-order-of-play`
- `/wimbledon-prize-money`
- `/wimbledon-qualifying`
- `/wimbledon-qualifying-live`
- `/wimbledon-results`
- `/wimbledon-schedule`
- `/wimbledon-tv-schedule`
- `/watch-player-live`
- `/watch-tennis-in/[country]`
- `/player/[slug]`

Recommendation: add contextual links from hubs, guide pages, schedule pages, and tournament pages. Link toward money pages using descriptive anchors, not generic "read more."

#### Pages Blocked or Held From Indexing

Estimated SEO impact: medium. Many noindex pages are intentional, but revenue intent should be checked.

Important noindex groups:

- Match/day utility pages: `/best-tennis-matches-today`, `/tennis-schedule-today`, `/tennis-order-of-play-today`, `/watch-tennis-live-today`, `/atp-live-today`, `/wta-live-today`
- Account/personal pages: `/my-dashboard`, `/my-feed`, `/my-players`, `/my-tournament`
- Comparison/affiliate pages: `/compare`, `/compare/tennis-tv-vs-espn`, `/compare/[slug]`
- Player/watch aliases: `/watch-sabalenka-live`, `/watch-swiatek-live`
- Legacy French Open/Roland Garros pages

Recommendation: keep account and unstable daily pages noindex. Reconsider noindex for pages with durable commercial value only after adding enough unique content and resolving duplication.

#### Broken Internal Links

Estimated SEO impact: medium if confirmed. Source crawl did not confirm hard broken links because many apparent targets map to dynamic routes, such as `/player/carlos-alcaraz`, `/watch-tennis-in/usa`, and `/tv-schedule/iga-swiatek`.

Potential issue: internal links point to redirecting aliases such as `/wimbledon-live-stream` and static country aliases. These are not necessarily broken, but they waste crawl equity.

Recommendation: run a rendered crawl after the next SEO cleanup and replace internal links to redirecting URLs with final canonical destinations.

#### Duplicate Structured Data

Estimated SEO impact: low-medium. Exact duplicate page schema was not confirmed from source crawl. The root layout injects a sitewide `WebSite`, `Organization`, and author `Person` graph on every page, which is acceptable if IDs are stable. Some pages also emit page-specific `WebPage`/`FAQPage` schema.

Recommendation: ensure shared entities use stable `@id` values and page-specific schema references those IDs rather than creating conflicting duplicate organizations/authors.

### LOW Impact

#### Duplicate Titles

Estimated SEO impact: low, except where title is clearly wrong.

Detected duplicate titles:

- `Live now`: `/live-tennis` and `/wimbledon-qualifying`
- `Privacy Policy | Watch Tennis Today`: `/privacy` and `/privacy-policy`

Recommendation: update titles where the page is indexable. `/privacy-policy` can remain redirected/noindex if it consistently resolves to `/privacy`.

#### Duplicate H1 and Meta Descriptions

Estimated SEO impact: low. No exact duplicate H1 or duplicate meta descriptions were found in the source crawl. Several pages have missing H1 text because they delegate rendering to shared components, so this should be rechecked with a rendered crawl.

#### Inconsistent URL Patterns

Estimated SEO impact: medium-low unless links/canonicals conflict.

Patterns to rationalize:

- `/watch-tennis-in/{country}` versus `/watch-tennis-in-usa`
- `/player/{slug}` versus `/players/[slug]`
- `/where-to-watch-wimbledon` versus `/wimbledon-tv-schedule`
- `/french-open-*` versus `/roland-garros-*`
- `/watch-player-live/{slug}` versus static `/watch-alcaraz-live`, `/watch-sinner-live`, etc.

Recommendation: keep the best commercial canonical for each cluster and make all aliases redirect or noindex/canonical consistently.

## Top 20 Revenue-Potential Pages

Priority is based on commercial intent, event demand, conversion fit, and current page quality gap.

| Priority | Page | Why It Is Valuable | Current Gap | Recommended Focus |
|---:|---|---|---|---|
| 1 | `/wimbledon` | Wimbledon has huge seasonal search demand and strong broadcaster/VPN/subscription intent. | Good base, missing page-specific OG/Twitter, only moderate depth. | Expand hub, add country modules, FAQ, current schedule links, stronger CTAs. |
| 2 | `/where-to-watch-wimbledon` | Direct "where to watch" query captures high purchase intent. | Extremely thin, no schema, weak links. | Add country table, broadcaster comparison, FAQ, internal links to country guides. |
| 3 | `/wimbledon-live` | "Wimbledon live stream" is a high-converting query cluster. | Extremely thin, no schema. | Add legal stream decision tree, country blocks, schedule CTA, FAQ. |
| 4 | `/wimbledon-schedule` | Schedule intent converts into reminders, streaming checks, and TV pages. | Extremely thin, one incoming link. | Add order-of-play explainer, time zone table, daily update module. |
| 5 | `/wimbledon-order-of-play` | Users are close to watching a match and need TV/session guidance. | Under 500 words, weak incoming links, title appears wrong. | Fix title, add session table, broadcaster CTA, FAQ. |
| 6 | `/wimbledon-tv-schedule` | Strong TV intent and advertiser relevance. | Redirect conflict: page exists, sitemap includes it, config redirects it. | Choose canonical strategy, then deepen or redirect fully. |
| 7 | `/how-to-watch-wimbledon-in-usa` | Country-specific Wimbledon intent has high affiliate and ad value. | Source wrapper appears thin, depends on shared component. | Ensure rendered content is substantial, add USA broadcaster comparison, ESPN notes, FAQ. |
| 8 | `/how-to-watch-wimbledon-in-uk` | Local Wimbledon query has high seasonal volume. | Wrapper appears thin. | Add BBC/iPlayer flow, TV licence note, schedule CTA, FAQ. |
| 9 | `/how-to-watch-wimbledon-in-canada` | Country page can rank for localized broadcaster intent. | Wrapper appears thin. | Add TSN/RDS-style broadcaster comparison, timezone notes, FAQ. |
| 10 | `/how-to-watch-wimbledon-in-australia` | High localized Grand Slam viewing intent. | Wrapper appears thin. | Add 9Now/Stan-style viewing workflow, time zone guidance, FAQ. |
| 11 | `/us-open` | Grand Slam page with large late-summer commercial value. | Missing OG/Twitter; depth can grow. | Add TV rights, schedule, country paths, player storylines, FAQ. |
| 12 | `/french-open` | Grand Slam hub with existing authority and high incoming links. | Under 500 words, missing OG/Twitter. | Add evergreen Roland Garros guide depth, entity links, country CTAs. |
| 13 | `/where-to-watch-french-open` | Strong "where to watch" commercial intent by country. | Under 500 words, missing OG/Twitter. | Add country comparison table, legal stream checklist, FAQ. |
| 14 | `/french-open-guide` | Evergreen Grand Slam guide builds topical authority. | Under 500 words and source-orphaned. | Add history, format, courts, schedule, viewing links, FAQ. |
| 15 | `/grand-slams` | Hub can distribute authority to all four majors. | Very thin. | Add comparison table for Australian Open/French Open/Wimbledon/US Open. |
| 16 | `/grand-slam-live` | Live Grand Slam query captures event-specific urgency. | Missing schema and OG/Twitter. | Add live-event modules, tournament cards, TV CTAs, FAQ. |
| 17 | `/tennis-on-tv-today` | Daily TV schedule intent has strong ad and subscription value. | Extremely thin, no schema. | Add broadcaster table, country selector links, schedule FAQ. |
| 18 | `/tennis-tv-broadcast-finder` | Tool page has high conversion potential and internal link value. | Thin, missing OG/Twitter. | Add country index, use cases, FAQ, stronger CTAs. |
| 19 | `/watch-tennis-in` | Country hub can capture international commercial intent. | Thin and only modest source incoming links. | Add country directory, comparison logic, legal viewing guidance. |
| 20 | `/player/[slug]` | Player pages can capture "watch Alcaraz/Sinner/Djokovic live" intent. | Dynamic noindex logic needs revenue review; source incoming appears weak. | Index only editorial-rich top players, add Player schema, upcoming match CTAs. |

## Page-Level Improvement Briefs

### `/wimbledon`

- Add a compact Wimbledon broadcaster and streaming comparison table.
- Link prominently to `/where-to-watch-wimbledon`, `/wimbledon-live`, `/wimbledon-schedule`, `/wimbledon-order-of-play`, and country pages.
- Add FAQ covering legal streams, TV schedule, Tennis TV limitations, VPN/travel viewing, and time zones.
- Add page-specific OG/Twitter metadata.
- Keep schema as the tournament hub and connect it to country guides with breadcrumbs.

### `/where-to-watch-wimbledon`

- Expand from thin guide to country-by-country broadcaster directory.
- Add a table with country, main broadcaster, streaming app, free/paid status, and verification link.
- Add FAQPage and BreadcrumbList schema.
- Add CTA blocks to streaming service picker and cost calculator.
- Link back to `/wimbledon`, `/wimbledon-live`, and `/wimbledon-schedule`.

### `/wimbledon-live`

- Add a legal live-stream decision tree.
- Add sections for main draw, qualifying, finals weekend, replays, and highlights.
- Add comparison of official broadcaster, TV package, streaming app, and travel/VPN scenario.
- Add FAQ schema.

### `/wimbledon-schedule`

- Add daily schedule planning guidance: courts, sessions, estimated starts, rain delays, and time zones.
- Add table linking schedule intent to TV/stream pages.
- Add internal links to `/wimbledon-order-of-play`, `/wimbledon-live`, and `/where-to-watch-wimbledon`.
- Add FAQ schema.

### `/wimbledon-order-of-play`

- Fix metadata title so it is not `Centre Court`.
- Add H2 sections for Centre Court, No. 1 Court, outside courts, and session timing.
- Add broadcaster CTA near the top.
- Link to player pages and watch pages when match data is available.

### `/wimbledon-tv-schedule`

- Decide whether this URL should exist. If yes, remove the redirect and keep it in sitemap. If no, remove it from sitemap and internal links.
- If retained, add channel/session table, country broadcaster links, and FAQ schema.

### Wimbledon Country Pages

- Make sure each `/how-to-watch-wimbledon-in-{country}` page renders at least 700-1,200 words of unique local content.
- Add broadcaster comparison, local time notes, "does Tennis TV show Wimbledon?" FAQ, and legal travel viewing guidance.
- Add contextual links between country pages and the main Wimbledon hub.

### `/us-open`

- Add US Open-specific TV schedule, country links, surfaces/entity coverage, and finals-week CTA.
- Add FAQ schema and page-specific OG/Twitter metadata.
- Link to `/grand-slams`, `/watch-tennis-in`, and `/tennis-tv-broadcast-finder`.

### `/french-open`

- Expand from event snapshot to evergreen Roland Garros hub.
- Add sections for TV, streaming, schedule, order of play, draw, results, and country guides.
- Add page-specific OG/Twitter metadata.
- Link to `/where-to-watch-french-open` and `/french-open-guide`.

### `/where-to-watch-french-open`

- Add country table and broadcaster verification workflow.
- Add comparison of official broadcasters, streaming services, VPN/travel notes, and schedule links.
- Add FAQ schema and stronger CTAs.

### `/french-open-guide`

- Add entity-rich guide sections: tournament format, clay court, draw, schedule, notable players, TV rights, and legal stream checks.
- Link from `/french-open`, `/grand-slams`, and `/tennis-guides`.

### `/grand-slams`

- Add a comparison table for all four majors: month, surface, location, typical broadcasters, watch page, schedule page.
- Add internal links to `/australian-open`, `/french-open`, `/wimbledon`, and `/us-open`.
- Add FAQ schema.

### `/grand-slam-live`

- Add live module and tournament cards for the current/next Grand Slam.
- Add `ItemList` or `SportsEvent` schema where event data is available.
- Add internal links to TV/country/watch pages.

### `/tennis-on-tv-today`

- Add daily TV schedule guidance with country selector and broadcaster table.
- Add schema: `WebPage`, `FAQPage`, possibly `ItemList`.
- Link to `/tv-schedule/[slug]`, `/tennis-tv-broadcast-finder`, `/watch-tennis-in`, and `/live-tennis`.

### `/tennis-tv-broadcast-finder`

- Expand tool page with examples by country and event.
- Add links to country pages and Grand Slam hubs.
- Add stronger CTA to streaming service picker and cost calculator.

### `/watch-tennis-in`

- Expand country hub with indexable country directory, popular countries, Grand Slam-specific notes, and legal viewing guidance.
- Link to `/watch-tennis-in/{country}` dynamic pages and Wimbledon country guides.
- Add FAQ schema.

### `/player/[slug]`

- Keep unknown/API-only players noindex.
- For top players, ensure editorial-rich pages are indexable with `ProfilePage`, `Person`, and upcoming `SportsEvent` schema.
- Add CTAs to watch live, next match, TV schedule, and tournament pages.

## Prioritized Work Plan

| Priority | Task | Estimated Effort | Expected SEO Impact | Expected Revenue Impact |
|---:|---|---:|---|---|
| 1 | Resolve `/wimbledon-tv-schedule` redirect/sitemap/page conflict. | S | High | High |
| 2 | Remove redirecting URLs from sitemap and update internal links to final canonical URLs. | S-M | High | Medium |
| 3 | Expand `/where-to-watch-wimbledon`, `/wimbledon-live`, `/wimbledon-schedule`, `/wimbledon-tv-schedule` or final canonical equivalent. | M-L | High | High |
| 4 | Expand Wimbledon country pages and ensure rendered content is unique and substantial. | M-L | High | High |
| 5 | Add page-specific OG/Twitter metadata to top 20 revenue pages. | M | Medium | Medium |
| 6 | Add FAQ/Breadcrumb/WebPage schema to thin commercial pages. | M | Medium-High | Medium |
| 7 | Expand `/tennis-on-tv-today`, `/tennis-tv-broadcast-finder`, `/watch-tennis-in`, and `/watch-tennis-online`. | M-L | High | High |
| 8 | Strengthen `/french-open`, `/where-to-watch-french-open`, and `/french-open-guide` as evergreen pages. | M | Medium-High | Medium-High |
| 9 | Build a Grand Slam internal-link hub through `/grand-slams` and `/grand-slam-live`. | M | Medium | Medium |
| 10 | Audit dynamic `/player/[slug]` indexability for top players only. | M | Medium | High |
| 11 | Add contextual internal links from tournament hubs to watch/country/player pages. | S-M | Medium | Medium |
| 12 | Keep account/personalized pages noindex and out of sitemap. | S | Low-Medium | Low |
| 13 | Re-run a rendered crawl after cleanup to confirm H1, canonical, robots, redirect, schema, and broken-link behavior. | S | Medium | Medium |

## Suggested First Sprint

1. Fix canonical/redirect/sitemap contradictions.
2. Deepen the Wimbledon money cluster.
3. Add schema and social metadata to the top commercial pages.
4. Improve internal links from `/wimbledon`, `/grand-slams`, `/tennis-on-tv-today`, `/watch-tennis-in`, and `/tennis-tv-broadcast-finder`.
5. Re-crawl rendered pages and validate redirect status codes before shipping.

This plan intentionally avoids creating new pages. The fastest commercial lift is making the existing high-intent URLs deeper, clearer, better linked, and technically unambiguous.
