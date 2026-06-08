# AdSense 81904 Route Cleanup

## Goal
Reduce AdSense review risks from low-value, duplicate, redirect-only, or overly similar route clusters.

Google AdSense review guidance emphasizes:
- enough complete text content;
- original, useful content;
- avoiding automatically generated or low-originality pages;
- clear navigation without confusing redirects, broken links, unfinished pages, or pages under construction.

## Changes made

### Sitemap cleanup
Removed low-value or duplicate intent URLs from `app/sitemap.ts`:
- `/tennis-spoiler-free-scores` removed from sitemap while still available through internal UX links.
- `/wimbledon-live` removed from sitemap to reduce Wimbledon duplicate intent clustering.
- `/wimbledon-tv-schedule` removed and redirected to `/where-to-watch-wimbledon`.
- `/french-open-live`, `/french-open-tv-schedule`, `/french-open-today`, `/french-open-order-of-play` removed from sitemap where they duplicate stronger French Open hub/search intents.
- `frenchOpenPages` reduced to stronger pages only:
  - `/watch-french-open-online`
  - `/french-open-results`
  - `/where-to-watch-french-open`

### Robots cleanup
Added crawl exclusions for weak aliases, retired experiments, and redirect-only pages in `app/robots.ts`:
- `/watch/tennis-spoiler-free-scores`
- `/french-open-draw`
- `/french-open-survivors`
- `/french-open-upsets`
- `/roland-garros-pulse`
- `/roland-garros-predictions`
- `/tennis-schedule-tomorrow`
- `/wimbledon-live-stream`
- `/watch-sabalenka-live`
- `/watch-swiatek-live`

### Redirect cleanup
Updated `next.config.ts` to route weak/duplicate pages directly to stronger canonical destinations:
- `/roland-garros-draw` → `/french-open-order-of-play`
- `/watch/tennis-spoiler-free-scores` → `/tennis-spoiler-free-scores`
- `/wimbledon-tv-schedule` → `/where-to-watch-wimbledon`
- `/french-open-tv-schedule` → `/where-to-watch-french-open`
- `/french-open-live` → `/french-open`
- `/french-open-today` → `/french-open`

### Duplicate route fix
Changed `app/watch/tennis-spoiler-free-scores/page.tsx` from a re-exported duplicate page into an explicit `noindex + redirect` alias.

## Files changed
- `app/sitemap.ts`
- `app/robots.ts`
- `next.config.ts`
- `app/watch/tennis-spoiler-free-scores/page.tsx`
- `ADSENSE_81904_ROUTE_CLEANUP_CODEX_99.md`

## Validation
Run:

```bash
npm run lint
npm run build
```

Then verify:
- `/sitemap.xml` does not include retired or duplicate pages.
- `/robots.txt` lists the low-value/redirect aliases.
- Redirects resolve to canonical destinations without chains.
- Strong pages remain available and crawlable:
  - `/french-open`
  - `/french-open-results`
  - `/where-to-watch-french-open`
  - `/where-to-watch-wimbledon`
  - `/today`
  - `/tomorrow`
  - `/guides`
