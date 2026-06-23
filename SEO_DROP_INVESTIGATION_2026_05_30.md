# SEO Drop Investigation: 2026-05-30

## Summary

Google Search Console impressions fell sharply beginning 2026-05-30, immediately after a dense SEO/refactor window on 2026-05-29 and 2026-05-30. Commit subjects in this window are not reliable, so this audit inspected actual diffs and current code.

The most likely cause is not one single `noindex` bug on the homepage. It is a cluster of crawl-discovery and canonical/indexability changes shipped close together:

1. Player discovery was narrowed to verified canonical singles players in `b66e28b`.
2. Middleware briefly used permanent redirects for invalid-looking `/player/...` URLs during the 2026-05-29 cleanup window.
3. `/watch/...` match pages were heavily represented in crawl paths and are mostly short-lived, thin, or expired.
4. Dynamic player, tournament, and watch metadata changed around `18fce6b` and `adf2add`.
5. Some stable hub pages lacked explicit self-canonical metadata in the current tree.

Current code already contains later mitigations for the biggest crawl-budget issue: `app/sitemap.ts` no longer fetches live match pages for the sitemap, so `/watch/...` URLs are not currently emitted from the sitemap.

## What Changed In The Window

### Player canonical and discovery changes

`b66e28b` changed player extraction in `app/sitemap.ts` and `app/page.tsx` from simple slash-splitting to `verifiedPlayersFromMatchSide()`. This stopped arbitrary doubles teams and bad feed fragments from becoming player URLs, but it also meant only players already recognized by `data/playerSlugs.ts` could be discovered through these paths.

Impact: high. If many impressions came from long-tail player or match-derived player pages, this could remove internal links and sitemap discovery for those pages overnight.

### Player redirects and slug cleanup

The 2026-05-29 cleanup commits changed `data/playerSlugs.ts` and `middleware.ts`. During the window, invalid-looking player slugs were redirected with 308s to `/players`; later code changed this behavior so suspicious player URLs were no longer permanently collapsed into the hub.

Impact: high during the affected deployment. Permanent redirects from many `/player/...` URLs to one hub can cause Google to consolidate or drop long-tail URLs.

### Dynamic metadata changes

`18fce6b` added player canonical metadata and Person/FAQPage schema. `adf2add` changed titles/descriptions/Open Graph/Twitter metadata for player, tournament, and watch pages.

Impact: medium. The changes are mostly reasonable, but when combined with noindex/canonical and sitemap changes, they made many URL signals change at once.

### Watch match pages

The current `app/watch/[slug]/page.tsx` intentionally noindexes live/missing watch URLs and indexes only stable archived match content. Current `app/sitemap.ts` has `getMatches()` return `[]`, preventing volatile match URLs from flooding the sitemap.

Impact: high historically, lower currently. Search Console showing about 2,012 "Crawled - currently not indexed" URLs mostly under `/watch/...` strongly suggests crawl budget was spent on short-lived match pages. The current sitemap behavior is directionally correct.

### Stable hub canonicals

Current `/players` and `/tournament` pages did not declare explicit self-canonical metadata, while dynamic pages did. The root layout also lacked `metadataBase` and a root self-canonical.

Impact: medium. This probably did not cause the whole collapse by itself, but stable high-value pages should have unambiguous self-references.

## Ranked Issues By SEO Impact

1. **Abrupt removal/pruning of player URL discovery**  
   `b66e28b` limited discovered player links/sitemap candidates to verified canonical players. Good for quality, risky if the canonical player database was incomplete.

2. **Temporary 308 redirects from player detail URLs to `/players`**  
   This was risky for canonical consolidation. Current code no longer has `middleware.ts`, but deployment history should be checked for how long the bad version was live.

3. **Short-lived `/watch/...` URLs overwhelming crawl budget**  
   GSC's "Crawled - currently not indexed" sample being mostly match pages is consistent with low-value dynamic URL churn.

4. **Dynamic route metadata churn**  
   Player/tournament/watch titles, descriptions, schema, robots, and canonicals changed in a tight window. Individually mostly reasonable, collectively noisy.

5. **Missing explicit self-canonicals on stable hubs**  
   Fixed in this pass for root, `/players`, and `/tournament`.

## Fixes Applied

- Added `metadataBase` and a root self-canonical in `app/layout.tsx`.
- Added explicit `robots: { index: true, follow: true }` and self-canonical metadata to `app/players/page.tsx`.
- Added explicit `robots: { index: true, follow: true }` and self-canonical metadata to `app/tournament/page.tsx`.
- Tightened `/watch/[slug]` indexability so ordinary archived/expired match pages no longer get `index, follow`; only durable tour-level Grand Slam match pages involving selected high-demand players remain eligible.
- Strengthened `tests/e2e/seo.spec.ts` with:
  - exact canonical checks for stable pages,
  - robots.txt smoke coverage,
  - sitemap URL count/type coverage,
  - guard that `/watch/...` URLs are not emitted in the sitemap,
  - guard that valid legacy player slugs do not collapse to `/players`,
  - guard that expired watch pages are 404 or noindex.

## Not Automatically Changed

- I did not broaden `ADSENSE_INDEXABLE_PLAYER_SLUGS`. That list is a quality policy decision: expanding it can recover long-tail impressions, but each added player page should have enough editorial content to avoid thin-page risk.
- I did not make `/watch/[slug]` broadly indexable. The current noindex/sitemap policy is appropriate unless a match has stable archived content and durable search demand.
- I did not reintroduce middleware redirects. Current behavior avoids the previous hub-collapse risk.

## Manual Verification Needed

In Google Search Console after deploy:

- Inspect `/`, `/today`, `/live-tennis`, `/players`, `/tournament`.
- Inspect `/player/joao-fonseca`, `/player/iga-swiatek`, `/player/jannik-sinner`.
- Inspect legacy aliases:
  - `/player/j-fonseca`
  - `/player/swiatek-iga`
  - `/player/sinner-jannik`
- Inspect `/tournament/little-rock` and decide whether it should remain noindex unless it has stable editorial/calendar support.
- Inspect `/watch/i-jovic-vs-a-eala-12129955`; expected result should be either 404 for stale/missing match pages or 200 with `noindex`.
- Re-submit `https://watchtennistoday.com/sitemap.xml`.
- Check Vercel deployments for `47b3618` and `7ddf04e` to confirm whether failed/error deployments were public and for how long.

## URLs To Inspect After Deploy

- `https://watchtennistoday.com/`
- `https://watchtennistoday.com/today`
- `https://watchtennistoday.com/live-tennis`
- `https://watchtennistoday.com/players`
- `https://watchtennistoday.com/tournament`
- `https://watchtennistoday.com/player/joao-fonseca`
- `https://watchtennistoday.com/player/iga-swiatek`
- `https://watchtennistoday.com/player/jannik-sinner`
- `https://watchtennistoday.com/player/j-fonseca`
- `https://watchtennistoday.com/player/swiatek-iga`
- `https://watchtennistoday.com/player/sinner-jannik`
- `https://watchtennistoday.com/tournament/little-rock`
- `https://watchtennistoday.com/watch/i-jovic-vs-a-eala-12129955`
- `https://watchtennistoday.com/sitemap.xml`
- `https://watchtennistoday.com/robots.txt`
