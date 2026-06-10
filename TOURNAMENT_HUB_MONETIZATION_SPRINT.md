# Tournament hub monetization sprint

## Goal
Improve Watch Tennis Today monetization potential without adding thin pages, fake streaming claims, or indexable empty feed pages.

## Changes

### 1. Stable tournament hub data
Added `data/tournamentHubs.ts` with manually reviewed evergreen tournament hubs for:

- Australian Open
- Roland Garros / French Open
- Wimbledon
- US Open
- Indian Wells
- Miami Open
- Madrid Open
- Italian Open / Rome
- Cincinnati Open
- ATP Finals
- WTA Finals

Each hub includes level, surface, season window, location, tournament summary, why-it-matters context, legal viewing notes and related internal links.

### 2. Stronger `/tournament` directory
Updated `app/tournament/page.tsx` so the tournament directory no longer depends only on the live match feed or Supabase calendar rows. It now mixes:

- tournaments from current match feed
- tournaments from stored calendar entries
- stable editorial tournament hubs

This keeps the page useful even when the API has no live fixtures for major events.

### 3. Better `/tournament/[slug]` fallback pages
Updated `app/tournament/[slug]/page.tsx` so stable tournament pages show evergreen context and related links even when there are no current matches. This reduces the risk of thin “no matches found” pages for important tournaments.

### 4. Sitemap improvement
Updated `app/sitemap.ts` to include stable tournament detail pages from `data/tournamentHubs.ts`, with monthly change frequency for evergreen hubs and daily frequency for live-feed-backed tournament URLs.

## Validation

- ESLint passed for changed files:
  - `app/tournament/page.tsx`
  - `app/tournament/[slug]/page.tsx`
  - `app/sitemap.ts`
  - `data/tournamentHubs.ts`

## Known existing issue

`npx tsc --noEmit` still reports a pre-existing issue unrelated to this sprint:

```txt
app/api/match-archive/[id]/route.ts
Property 'single' does not exist on type 'SupabaseMockBuilder'
```

This was already present before the tournament hub changes.
