# AdSense final risk cleanup — CodeX 102

Purpose: reduce the remaining AdSense approval risks called out by Google: thin text, low-originality generated pages, unfinished/empty pages, redirects, and confusing navigation.

## Changes made

- Marked all `/rivalries` and `/rivalries/[slug]` pages as `noindex, follow`.
  - Reason: these are useful internal matchup pages, but they are generated around H2H/live-feed context and can look thin or templated during AdSense review.
- Marked all `/compare/[slug]` pages as `noindex, follow`.
  - Reason: affiliate/comparison pages should not be indexable until expanded into manually edited editorial guides.
- Added an explicit `ADSENSE_INDEXABLE_BROADCAST_COUNTRIES` allowlist.
  - Current indexable country guides: Poland, USA, UK, Germany, France, Spain, Italy, Canada, Australia, India.
  - Future countries default to `noindex` unless added to the allowlist after manual content review.
- Updated `/watch-tennis-in/[country]` metadata to use the country allowlist.
- Updated sitemap country URLs to be generated only from the reviewed country allowlist.
- Kept generated/noindex pages crawlable with `follow` so internal navigation still works.

## Pages intentionally noindexed

- `/compare/*`
- `/vs/*` already noindexed/redirect-only where relevant
- `/rivalries`
- `/rivalries/*`
- Any future `/watch-tennis-in/*` country not in the AdSense country allowlist

## Sitemap cleanup

- Country URLs now come only from `ADSENSE_INDEXABLE_BROADCAST_COUNTRIES`.
- Generated rivalry/comparison detail pages remain excluded from sitemap.
- Sitemap stays focused on core/editorial/legal/guide pages plus carefully reviewed player/tournament/watch pages.

## Remaining risks

- Some legacy lint errors may still exist outside this cleanup scope.
- Final production check should confirm `/sitemap.xml` contains no redirect/404/noindex URLs after deploy.
- AdSense can review any reachable page, so continue avoiding internal links to broken or placeholder pages.
