# SEO CTR Sprint — Codex 87

Goal: improve organic CTR for pages that already receive impressions in Google Search Console, without adding duplicate URLs or new content pages.

## Changed

### Player pages
- Updated `/player/[slug]` metadata template.
- New title pattern: `{Player Name} Schedule, Results & Live Matches ({year})`.
- New description targets schedule, results, tournament updates and legal TV intent.
- Open Graph and Twitter titles/descriptions now reuse the same CTR-focused copy.

### Tournament pages
- Updated `/tournament/[slug]` metadata template.
- New title pattern: `{Tournament Name} {year}: Schedule, Results, Draw & Live Coverage`.
- Added canonical URL for tournament pages.
- Added Open Graph and Twitter metadata.

### Watch match pages
- Improved `/watch/[slug]` metadata template.
- Match names are now title-cased instead of lower-case slug text.
- New title pattern for live matches: `🔴 {Match} Live Score, Stream Info & Match Time`.
- New title pattern for non-live matches: `{Match} Match Time, Score Updates & TV Info`.
- Descriptions now target match time, score updates, tournament details and legal TV/streaming intent.

## Not changed
- No new URLs.
- No duplicate pages.
- No popups, sticky banners, or intrusive monetization.
- No changes to ads.txt.

## Validation
- `npx tsc --noEmit` passed.
- `npm run build` started but did not finish in the container timeout.
