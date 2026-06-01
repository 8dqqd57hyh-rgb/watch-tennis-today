# Money Sprint 23 — French Open Upset Tracker

Added a new SEO + retention page for shock Roland Garros results.

## Added

- `/french-open-upsets`
- `/api/french-open-upsets`
- Seeded player exit cards
- Major shock / big upset / seed watch labels
- ATP / WTA stat counts
- Links to match pages, results, survivors and recap
- JSON-LD CollectionPage schema
- Sitemap entry
- Navigation link in the More menu
- French Open hub promo block

## Why it helps monetization

Upsets create high-intent search and social traffic during Grand Slam weeks. This page gives fans a reason to return after each match window and naturally sends them into results, live, survivors and streaming pages.

## Safety

The API route returns a soft JSON fallback instead of throwing a 500 when API-Tennis is unavailable.
