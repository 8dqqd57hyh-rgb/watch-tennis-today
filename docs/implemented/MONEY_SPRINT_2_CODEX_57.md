# Money Sprint 2 — Best Matches Today Engine

## What was already present

The project already had several Phase 2 foundations:

- `TodaysTennisHub` on the homepage
- live tennis pages
- daily schedule/order/results pages
- `/tennis-trending-now`
- `/players/live-now`
- H2H route at `/vs/[slug]`
- VPN and watch-abroad monetization pages
- editorial/legal trust pages

So this sprint avoids duplicating those features.

## What was added

### 1. Best Matches Today Engine

New component:

- `app/components/BestMatchesTodayEngine.tsx`

It ranks matches using:

- live status
- upcoming status
- priority players
- Grand Slam tournaments
- ATP/WTA category
- finals and semifinals

It creates stronger daily SEO and gives users a clearer reason to keep clicking.

### 2. Homepage integration

Updated:

- `app/page.tsx`

Added the Best Matches Today Engine directly after `TodaysTennisHub`.

### 3. New SEO landing page

New route:

- `/best-tennis-matches-today`

File:

- `app/best-tennis-matches-today/page.tsx`

Purpose:

- rank for “best tennis matches today” intent
- route daily traffic to H2H pages, match hubs, player hubs and VPN/watch-abroad pages
- reduce bounce from generic daily visitors

### 4. Navigation and footer links

Updated:

- `app/layout.tsx`

Added:

- header link: `Best Today`
- footer link: `Best Matches Today`

### 5. Sitemap update

Updated:

- `app/sitemap.ts`

Added:

- `/best-tennis-matches-today`

Marked as a daily/hourly-style important page through existing live page behavior.

## Verification

- `npx tsc --noEmit` passes.
- `next build` compiled successfully and TypeScript passed.
- Full build reached page-data collection, then sandbox timed out / hit EPIPE during worker execution. This appears environment-related after successful compile and TS validation.

## Why this should help money

This sprint creates a better flow:

Google daily query → Best Matches Today → Match hub / H2H page → Watch Abroad / VPN page → affiliate click

That is a stronger revenue path than sending users only to static schedule pages.
