# AdSense Guide 404 Redirect Fix — Codex 100

## Problem
Vercel production logs showed:

- `GET /guides/how-to-watch-tennis-online-legally → 404`
- Route: `/guides/[slug]`
- Cache: `HIT`

The old guide URL was still linked internally, but the reduced AdSense-quality guide library no longer contained that slug in `app/guides/articles.ts`.

## Fix

1. Added permanent redirects in `next.config.ts`:
   - `/guides/how-to-watch-tennis-online-legally` → `/best-ways-to-watch-tennis-online`
   - `/guides/watch-tennis-online-legally` → `/best-ways-to-watch-tennis-online`

2. Replaced stale internal links pointing to `/guides/how-to-watch-tennis-online-legally` with the live route:
   - `/best-ways-to-watch-tennis-online`

## Changed files

- `next.config.ts`
- `app/layout.tsx`
- `app/components/RevenueConversionPanel.tsx`
- `ADSENSE_GUIDE_404_REDIRECT_FIX_CODEX_100.md`

## Expected result

After deploy:

- `/guides/how-to-watch-tennis-online-legally` should return `308`/`301` redirect, not `404`.
- Footer and revenue panel should link directly to a live page.
- Vercel cache should stop serving the old guide 404 after redeploy/cache invalidation.

## Suggested verification

```bash
npm run lint
npm run build
curl -I https://watchtennistoday.com/guides/how-to-watch-tennis-online-legally
curl -I https://watchtennistoday.com/best-ways-to-watch-tennis-online
```
