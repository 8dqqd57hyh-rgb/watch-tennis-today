# SEO Schema Deduplication — Codex 85

## Goal
Improve existing technical SEO quality without creating new pages or duplicate content.

## What changed
- Removed duplicate `WebSite` / `Organization` JSON-LD from the homepage.
- Kept one sitewide schema source in `app/layout.tsx`.
- Removed invalid `SearchAction` targets because the project does not currently expose a real `/search` route.
- Added stable `@id` values for the sitewide `WebSite` and `Organization` entities.
- Connected `WebSite.publisher` to the Organization entity.

## Why
Multiple competing sitewide schema blocks can confuse crawlers, especially when they define different search URLs. A single clean sitewide schema is safer for SEO and AdSense trust signals.

## No UX impact
- No new pages.
- No popups.
- No sticky ads.
- No visual changes.
