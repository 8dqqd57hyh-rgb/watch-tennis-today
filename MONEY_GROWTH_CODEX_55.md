# Money Growth Codex Changes

Implemented monetization and SEO improvements focused on affiliate conversion, Wimbledon search demand and daily tennis intent.

## Added pages

- `/wimbledon-live` — legal Wimbledon live viewing hub.
- `/wimbledon-schedule` — Wimbledon order-of-play and schedule planning page.
- `/wimbledon-results` — Wimbledon results and draw-context page.
- `/wimbledon-tv-schedule` — Wimbledon TV schedule and session planning page.
- `/where-to-watch-wimbledon` — country-aware legal broadcaster page.
- `/tennis-on-tv-today` — daily TV-intent page.
- `/who-plays-tennis-today` — daily player/match discovery page.

## Added component

- `app/components/WimbledonGuidePage.tsx` — reusable Wimbledon hub component with:
  - official stream safety checklist,
  - broadcaster starting-points table,
  - VPN travel CTA,
  - FAQ schema,
  - newsletter capture.

## Improved affiliate/VPN pages

- Updated `app/components/MoneyGuidePage.tsx` with:
  - comparison table for NordVPN vs official broadcaster app vs tournament site,
  - affiliate disclosure link beside the table,
  - newsletter capture under FAQ,
  - clearer conversion path that stays AdSense-safe and avoids illegal stream language.

## SEO/indexing

- Updated `app/sitemap.ts` to include the new Wimbledon and daily-intent pages.
