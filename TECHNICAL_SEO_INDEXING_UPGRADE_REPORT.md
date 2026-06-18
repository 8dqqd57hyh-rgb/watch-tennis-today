# Technical SEO + Indexing Control Upgrade

## Summary

This upgrade centralizes core SEO decisions and tightens crawl/indexing behavior without redesigning the site or changing public route behavior.

## Root issues found

- Sitemap logic had redirect-only path filtering embedded directly in `app/sitemap.ts`, making it easy for future dynamic pages to bypass the same rules.
- Canonical URL and robots directives were duplicated across dynamic pages.
- `/live-tennis` was missing from the stable sitemap even though it is one of the highest-value organic pages.
- There was no custom 404 recovery page, which increased soft-404 risk and gave users/crawlers fewer useful paths back into the site.
- Robots.txt blocked only a small technical subset and did not explicitly block common internal Next.js paths.

## Files changed

- `app/lib/technicalSeo.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/not-found.tsx`
- `app/player/[slug]/page.tsx`
- `app/tournament/[slug]/page.tsx`
- `app/watch/[slug]/page.tsx`

## Sitemap changes

- Added a centralized sitemap helper:
  - `canonicalUrl`
  - `normalizePath`
  - `buildSitemapEntry`
  - `uniqueSitemapEntries`
  - `shouldIncludeInSitemap`
- Added `/live-tennis` to the stable sitemap.
- Kept redirect-only and technical paths excluded through reusable shared logic.
- Added duplicate URL protection before returning the sitemap.
- Preserved existing indexable player, tournament, guide, country and match inclusion rules.

## Robots changes

- Kept important public pages crawlable.
- Continued blocking private/technical paths.
- Added explicit blocking for `/_next/` and `/_next/data/`.
- Kept sitemap reference pointed to `https://watchtennistoday.com/sitemap.xml`.
- Added host declaration.

## Noindex/canonical changes

- Added shared `robotsFor()` helper for consistent index/follow directives.
- Added shared `canonicalUrl()` helper for clean canonical URL generation.
- Updated player, tournament and watch pages to use centralized canonical/robots helpers.
- Preserved existing noindex strategy:
  - unknown/thin player pages stay noindex
  - unknown/thin tournament pages stay noindex
  - unstable live/missing watch pages stay noindex
  - stable archived watch pages remain indexable

## 404 improvements

- Added a custom `app/not-found.tsx` page.
- Set 404 page to `noindex, follow`.
- Added useful recovery links to:
  - `/live-tennis`
  - `/today`
  - `/players`
  - `/tennis-tournaments`
  - `/tennis-guides`

## Remaining recommendations

1. In Google Search Console, inspect `/live-tennis` after deploy and request indexing.
2. Watch the sitemap submitted/indexed count after deployment.
3. Add automated tests for `technicalSeo.ts` helpers when the project has a test runner.
4. Periodically review noindex pages in Search Console to ensure valuable pages are not accidentally excluded.
5. Keep dynamic match pages mostly out of the sitemap unless they are stable, useful and not thin.
