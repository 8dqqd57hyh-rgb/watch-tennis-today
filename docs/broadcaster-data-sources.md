# Broadcaster Data Sources

This project currently has two broadcaster-related data files with different jobs. Keep them separate unless a future refactor deliberately migrates country-guide editorial copy into the structured broadcaster database.

## `src/data/tennisBroadcasts.ts`

Use this as the core Broadcaster Intelligence database.

It owns structured, source-backed rows:

- country and ISO-style country code
- tournament group: Australian Open, Roland Garros, Wimbledon, US Open, ATP Tour, WTA Tour
- broadcaster and streaming service names
- official source links
- free/subscription flags
- known price status and monthly price when verified
- replay, commentary and device notes
- coverage notes, confidence level and last verified date
- normalized records and validation

Main consumers include `/broadcasters`, `/broadcaster/[slug]`, `/can-i-watch`, `/can-i-watch/[tournament]/[country]`, `/watch-tennis-in/[country]`, the streaming service picker, the cost calculator and sitemap generation.

## `data/broadcastFinder.ts`

Use this as the country-guide registry and editorial layer.

It owns broad country page material:

- country slug and optional country code bridge
- high-level primary broadcaster labels
- Grand Slam, ATP and WTA fallback labels
- official directories used by the older Broadcast Finder UI
- local context, verification advice, travel tip and SEO copy
- the `ADSENSE_INDEXABLE_BROADCAST_COUNTRIES` gate for reviewed country guides

Main consumers include `/tennis-tv-broadcast-finder`, `/watch-tennis-in`, `/watch-tennis-in/[country]`, older match-page country links and sitemap country-guide inclusion.

## Rules

- Do not invent broadcaster names, prices or official links.
- Add exact broadcaster rows, prices and source URLs to `src/data/tennisBroadcasts.ts` only when they are verified.
- Add broad fallback or editorial guidance to `data/broadcastFinder.ts` when the exact structured row is not verified yet.
- Keep `countryCode` aligned between both files when a country exists in both places.
- Do not widen `ADSENSE_INDEXABLE_BROADCAST_COUNTRIES` until the country page has enough reviewed structured rows and unique local copy.
- Prefer using helpers from `src/data/tennisBroadcasts.ts` for new tools, profile pages, calculators and query matching.
