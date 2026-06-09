# Monetization Authority Hubs — Codex 105

Goal: strengthen Watch Tennis Today for AdSense approval and long-term monetization by adding evergreen, expert-style navigation hubs instead of thin programmatic pages.

## Added

- `/tennis-calendar` — evergreen tennis season guide with Grand Slam calendar, surface context, season blocks, FAQ schema and breadcrumb schema.
- `/tennis-tournaments` — tournament hierarchy guide explaining Grand Slams, ATP/WTA 1000, 500, 250, Challenger and ITF context, plus FAQ and breadcrumb schema.
- `/best-tennis-players` — editorial ATP/WTA player authority hub with playing-style summaries and internal links to player profiles.
- `/analysis` — editorial analysis hub to support future tactical articles without fake predictions or unsupported claims.

## Updated

- `app/layout.tsx`
  - Added top-level Calendar navigation.
  - Added More-menu links to Calendar, Tournament Levels, Best Players and Analysis.
  - Added footer links to the new evergreen hubs.
  - Converted internal anchors in the layout to Next.js `Link`.

- `app/players/page.tsx`
  - Added stronger intro copy.
  - Added links to Best Players Guide and Tennis Analysis.
  - Added a player authority card under ATP/WTA hubs.
  - Converted the root back link to Next.js `Link`.

- `app/sitemap.ts`
  - Added `/best-tennis-players`, `/tennis-calendar`, `/tennis-tournaments` and `/analysis` to indexable static pages.

## Why this helps

Google AdSense review guidance warns about insufficient text, low-quality original value, auto-generated pages with little content, and difficult navigation. These changes add original editorial hubs, stronger internal navigation and more reasons for users to browse beyond live match pages.

## Validation

- `npm ci` completed.
- Targeted ESLint passed for changed/new route files:
  - `app/layout.tsx`
  - `app/players/page.tsx`
  - `app/tennis-calendar/page.tsx`
  - `app/tennis-tournaments/page.tsx`
  - `app/best-tennis-players/page.tsx`
  - `app/analysis/page.tsx`
  - `app/sitemap.ts`
- Full `npm run lint` still fails because of pre-existing errors across unrelated files, including `any` usage in API routes and old `<a>` internal navigation in many legacy pages.
- `npm run build` compiled successfully, but page-data collection timed out in this environment after compilation. No compile error was produced before timeout.
- `npx tsc --noEmit` still fails on a pre-existing Supabase mock typing issue in `app/api/match-archive/[id]/route.ts`.
