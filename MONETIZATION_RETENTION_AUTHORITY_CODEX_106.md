# Monetization, Retention and Authority Upgrade — Codex 106

## Goal
Continue improving Watch Tennis Today from an AdSense-ready tennis schedule site into a stronger monetization and audience-retention project.

This pass intentionally avoids thin programmatic pages and fake authority. The changes add real utility, better commercial transparency, stronger navigation, and clearer reader journeys.

## Added pages

### `/advertise`
A dedicated advertising and partnership page for future monetization.

Purpose:
- Shows that the site is open to legitimate brand partnerships.
- Explains audience intent for tennis brands, streaming services, equipment brands, newsletters and sponsors.
- Reinforces brand-safety rules: no illegal streams, clear affiliate disclosure, useful editorial content independent of commercial clicks.
- Links to contact and affiliate disclosure pages.
- Adds WebPage and Organization JSON-LD.

### `/tennis-resources`
A curated resource center connecting the strongest informational sections.

Purpose:
- Improves internal navigation.
- Reduces isolated-page feel.
- Helps users move between live matches, guides, player pages, tournament hubs and legal streaming pages.
- Gives search engines a clearer site architecture.
- Adds CollectionPage JSON-LD and breadcrumb schema.

## Improved pages

### `/newsletter`
The newsletter page was upgraded from a simple signup page into a retention-focused page.

Changes:
- Added JSON-LD.
- Added explanation of newsletter value and how it supports return visits.
- Added internal links to Tennis Calendar and Tennis Resources.
- Converted the back link and newly touched internal links to `next/link`.

## Navigation and sitemap

### `app/layout.tsx`
Added footer and dropdown links to:
- `/tennis-resources`
- `/newsletter`
- `/advertise`

### `app/sitemap.ts`
Added indexable static URLs:
- `/tennis-resources`
- `/newsletter`
- `/advertise`

## Checks performed

### Targeted ESLint
Passed for changed files:
- `app/advertise/page.tsx`
- `app/tennis-resources/page.tsx`
- `app/newsletter/page.tsx`
- `app/layout.tsx`
- `app/sitemap.ts`

### Production build
`npm run build` compiled successfully, then timed out during Next.js page-data collection in this environment.

Observed result:
- Compile step: successful
- Type validation: skipped by existing project config
- Timeout happened at: `Collecting page data using 55 workers`

### Full lint
Full `npm run lint` still fails because of pre-existing issues in unrelated files, mostly:
- internal `<a>` links that should be `next/link`
- `any` types in API routes
- a few unescaped apostrophes
- unused variables

This pass did not attempt a broad lint cleanup because that is a separate refactor and could touch many routes.

## Changed files
- `app/advertise/page.tsx`
- `app/tennis-resources/page.tsx`
- `app/newsletter/page.tsx`
- `app/layout.tsx`
- `app/sitemap.ts`
- `MONETIZATION_RETENTION_AUTHORITY_CODEX_106.md`
