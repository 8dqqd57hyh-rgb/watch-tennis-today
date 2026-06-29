# Internal Linking Audit

Audit date: 2026-06-29

Scope: source-level audit of `app/**/page.tsx`, with focused review of `/player/[slug]`, `/tournament/[slug]`, and `/watch/[slug]`.

Method: static extraction of literal internal `href` values plus manual review of dynamic template links. The static crawl is intentionally conservative: dynamic links such as `/player/${playerSlug}`, `/tournament/${slug}`, and graph-generated related links are not always counted as incoming links to the template route.

## Changes Implemented

- Player pages now include stronger resource links to:
  - today's matches (`/today`)
  - upcoming matches (`/tomorrow`)
  - current tournament pages from observed match data
  - top players (`/best-tennis-players`)
  - ATP/WTA rankings explainer (`/atp-wta-rankings-explained`) when a ranking is available
- Tournament pages now include:
  - participating player links from current feed data
  - live matches, schedule, results and order-of-play links
  - previous and next stable tournament hub links using `stableTournamentHubs`
  - contextual descriptions in related hub cards instead of a generic continuation phrase
- Watch pages now include:
  - player links
  - tournament links
  - Live Tennis and schedule links
  - Grand Slam live links for Grand Slam matches
  - Wimbledon hub and where-to-watch links for Wimbledon matches
  - richer related coverage on the compact match route, not only the expanded fallback route

## Dynamic Template Coverage

### `/player/[slug]`

Status: improved.

Outgoing links now cover the requested targets:

- Today's matches: `/today`
- Upcoming matches: `/tomorrow`
- Current tournament: `/tournament/${slug}` from visible tournament data
- Similar/top players: graph related-player section plus `/best-tennis-players`
- ATP/WTA ranking page: `/atp-wta-rankings-explained` when ranking exists

Opportunity: add a small "next match" link above the fold when `nextMatch` exists, pointing directly to `/match/${slug}` or `/watch/${slug}` depending on the preferred canonical match surface.

### `/tournament/[slug]`

Status: improved.

Outgoing links now cover the requested targets:

- Participating players: `featuredPlayers` from tournament match feed
- Live matches: `/live-tennis`
- Schedule: `/today`, `/tennis-order-of-play-today`, `/tv-schedule`
- Results: `/tennis-results-today`
- Previous/next tournament: adjacent stable hubs from `stableTournamentHubs`

Opportunity: add richer stable-player links for tournament pages outside the active feed window, especially Grand Slams and 1000-level hubs.

### `/watch/[slug]`

Status: improved.

Outgoing links now cover the requested targets:

- Player pages: `safePlayerUrl()` for both sides
- Tournament page: `/tournament/${tournamentSlug}`
- Live Tennis page: `/live-tennis`
- Grand Slam hubs: `/grand-slam-live` for Grand Slam matches
- Wimbledon hubs: `/wimbledon` and `/where-to-watch-wimbledon` for Wimbledon matches

Opportunity: make `/match/[slug]` and `/watch/[slug]` link to each other consistently if both remain active user-facing match surfaces.

## Orphan Page Candidates

These routes had no literal incoming links found by the static crawler. Dynamic and sitemap links may still expose some of them, so this is a prioritization list rather than a deletion list.

- `/atp-wta-rankings-explained`
- `/best-vpn-for-wimbledon`
- `/broadcaster/[slug]`
- `/can-i-watch/[tournament]/[country]`
- `/compare/[slug]`
- `/compare/tennis-tv-vs-espn`
- `/cookie-policy`
- `/coverage-graph`
- `/disclaimer`
- `/french-open-draw`
- `/french-open-guide`
- `/french-open-live`
- `/french-open-live-stream`
- `/french-open-schedule`
- `/french-open-streaming-countries`
- `/french-open-survivors`
- `/french-open-today`
- `/french-open-tv-schedule`
- `/french-open-upsets`
- `/guides`
- `/guides/[slug]`
- `/how-to-choose-tennis-streaming-service`
- `/how-to-watch-french-open-in-usa`
- `/how-to-watch-tennis-without-cable`
- `/match/[slug]`
- `/matches/live-now`
- `/my-dashboard`
- `/my-feed`
- `/newsletter-confirmation`
- `/next-match/[slug]`
- `/player/[slug]`
- `/players/[slug]`
- `/privacy-policy`
- `/rivalries/[slug]`
- `/roland-garros-predictions`
- `/roland-garros-pulse`
- `/rome-open-final-live`
- `/start-here`
- `/tennis-court-surfaces`
- `/tennis-live-scores-explained`
- `/tennis-schedule-terms-explained`
- `/tennis-schedule-tomorrow`
- `/tennis-streaming-rights-explained`
- `/tennis-tournament-levels-guide`
- `/terms`
- `/tournament/[slug]`
- `/tv-schedule/[slug]`
- `/vs/[slug]`
- `/watch-alcaraz-live`
- `/watch-djokovic-live`
- `/watch-french-open-in-australia`
- `/watch-french-open-in-canada`
- `/watch-french-open-in-uk`
- `/watch-french-open-in-usa`
- `/watch-player-live`
- `/watch-player-live/[slug]`
- `/watch-sabalenka-live`
- `/watch-sinner-live`
- `/watch-tennis-in-australia`
- `/watch-tennis-in-canada`
- `/watch-tennis-in-uk`
- `/watch-tennis-in-usa`
- `/watch-tennis-in/[country]`
- `/watch/[slug]`
- `/watch/tennis-spoiler-free-scores`
- `/why-trust-watch-tennis-today`
- `/wimbledon-draw`
- `/wimbledon-order-of-play`
- `/wimbledon-prize-money`
- `/wimbledon-qualifying`
- `/wimbledon-qualifying-live`
- `/wimbledon-tv-schedule`

Highest-priority orphan candidates:

- `/atp-wta-rankings-explained`: now linked from ranked player pages, but should also be linked from `/players`, `/best-tennis-players`, tournament-level guides and ranking-sensitive tournament hubs.
- Wimbledon country guides: many have no literal outgoing links and should be connected from `/wimbledon`, `/where-to-watch-wimbledon`, and `/watch-tennis-in`.
- French Open support pages: several thin or isolated French Open pages should be consolidated into the main French Open hub cluster or cross-linked from `/french-open`, `/where-to-watch-french-open`, and `/tournament/roland-garros`.
- Legal/trust pages: `/privacy-policy`, `/disclaimer`, `/affiliate-disclosure`, and `/content-guidelines` should be reachable from footer/sitewide navigation if they are meant to remain indexable.

## Pages With Fewer Than 3 Internal Links

Routes with 0 outgoing links:

- `/affiliate-disclosure`
- `/atp-wta-rankings-explained`
- `/best-vpn-for-roland-garros`
- `/best-vpn-for-wimbledon`
- `/content-guidelines`
- `/french-open-draw`
- `/french-open-live-stream`
- `/french-open-streaming-countries`
- `/french-open-survivors`
- `/french-open-upsets`
- `/grand-slam-tv-rights-explained`
- `/how-to-choose-tennis-streaming-service`
- `/how-to-watch-wimbledon-in-australia`
- `/how-to-watch-wimbledon-in-canada`
- `/how-to-watch-wimbledon-in-france`
- `/how-to-watch-wimbledon-in-germany`
- `/how-to-watch-wimbledon-in-india`
- `/how-to-watch-wimbledon-in-italy`
- `/how-to-watch-wimbledon-in-poland`
- `/how-to-watch-wimbledon-in-spain`
- `/how-to-watch-wimbledon-in-uk`
- `/how-to-watch-wimbledon-in-usa`
- `/matches/live-now`
- `/my-feed`
- `/official-tennis-broadcasters-guide`
- `/players/[slug]`
- `/privacy-policy`
- `/roland-garros-predictions`
- `/roland-garros-pulse`
- `/tennis-live-scores-explained`
- `/tennis-on-tv-today`
- `/tennis-order-of-play-today`
- `/tennis-results-today`
- `/tennis-schedule-terms-explained`
- `/tennis-schedule-today`
- `/tennis-schedule-tomorrow`
- `/tennis-scoring-explained`
- `/tennis-tournament-levels-guide`
- `/tennis-trending-now`
- `/tennis-tv-not-working`
- `/tomorrow`
- `/tv-schedule`
- `/watch-french-open-in-australia`
- `/watch-french-open-in-canada`
- `/watch-french-open-in-uk`
- `/watch-french-open-in-usa`
- `/watch-player-live`
- `/watch-sabalenka-live`
- `/watch-swiatek-live`
- `/watch/tennis-spoiler-free-scores`
- `/where-to-watch-wimbledon`
- `/who-plays-tennis-today`
- `/wimbledon-draw`
- `/wimbledon-live`
- `/wimbledon-live-stream`
- `/wimbledon-prize-money`
- `/wimbledon-results`
- `/wimbledon-schedule`
- `/wimbledon-tv-schedule`

Routes with 1 outgoing link:

- `/broadcasters`
- `/compare`
- `/compare/[slug]`
- `/compare/tennis-tv-vs-espn`
- `/contact`
- `/french-open-live`
- `/french-open-today`
- `/grand-slams`
- `/guides`
- `/how-to-watch-tennis-legally`
- `/my-players`
- `/my-tournament`
- `/players/live-now`
- `/privacy`
- `/rivalries`
- `/rivalries/[slug]`
- `/tennis-resources`
- `/tennis-tv-schedule-today`
- `/terms`
- `/vs/[slug]`
- `/watch-french-open-online`
- `/watch-tennis-abroad`
- `/where-to-watch-french-open`

Routes with 2 outgoing links:

- `/`
- `/can-i-watch`
- `/can-i-watch/[tournament]/[country]`
- `/cookie-policy`
- `/disclaimer`
- `/editorial-policy`
- `/french-open`
- `/french-open-guide`
- `/french-open-order-of-play`
- `/french-open-results`
- `/french-open-tv-schedule`
- `/how-we-source-data`
- `/how-we-verify-streams`
- `/next-match/[slug]`
- `/tennis-glossary`
- `/tennis-spoiler-free-scores`
- `/tennis-time-zone-converter`
- `/tennis-tv-broadcast-finder`
- `/tournament`

## Internal Link Opportunities

1. Add a reusable footer or "more tennis guides" strip to thin evergreen guide pages with 0 outgoing links. Use contextual anchors to `/today`, `/live-tennis`, `/tennis-on-tv-today`, `/players`, `/tournament`, `/watch-tennis-in`, and relevant Grand Slam hubs.
2. Add a Wimbledon cluster module that links `/wimbledon`, `/wimbledon-schedule`, `/wimbledon-results`, `/wimbledon-draw`, `/wimbledon-order-of-play`, `/where-to-watch-wimbledon`, and country-specific Wimbledon pages.
3. Add a French Open cluster module that links `/french-open`, `/french-open-results`, `/french-open-order-of-play`, `/where-to-watch-french-open`, `/watch-french-open-online`, and `/tournament/roland-garros`.
4. Link top player pages from `/players`, `/best-tennis-players`, `/today`, `/live-tennis`, and tournament pages using verified player slugs only.
5. Connect commercial broadcaster pages to player and tournament pages through the intelligence graph, especially `/broadcaster/[slug]`, `/watch-tennis-in/[country]`, and `/can-i-watch/[tournament]/[country]`.
6. Decide whether thin isolated pages with no outgoing links should be strengthened, merged, redirected, or left `noindex`.
7. Add contextual anchors in place of generic "View" or "Open" labels where the destination needs SEO value, for example "Iga Swiatek player schedule" instead of "Open page".

## Verification

- `npx eslint app/player/[slug]/page.tsx app/tournament/[slug]/page.tsx app/watch/[slug]/page.tsx` passed.
- `git diff --check` passed, with only existing line-ending warnings reported by Git.
