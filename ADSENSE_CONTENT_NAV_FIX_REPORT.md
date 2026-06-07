# AdSense Content Quality + Navigation Fix

## Changed files
- app/guides/articles.ts
- app/guides/page.tsx
- app/components/HelpfulArticle.tsx
- app/how-we-source-data/page.tsx
- app/how-we-verify-streams/page.tsx
- app/tennis-schedule-tomorrow/page.tsx
- app/wimbledon-live-stream/page.tsx
- app/watch-sabalenka-live/page.tsx
- app/watch-swiatek-live/page.tsx
- app/watch-french-open-in-usa/page.tsx
- app/watch-french-open-in-uk/page.tsx
- app/watch-french-open-in-canada/page.tsx
- app/watch-french-open-in-australia/page.tsx
- app/sitemap.ts

## Summary of risks fixed
- Removed repeated boilerplate article descriptions and intros from guide articles.
- Removed repeated guide section headings flagged in the audit.
- Added match-day usage and verification context to guide articles.
- Added stronger editorial/legal streaming notes to HelpfulArticle pages.
- Expanded How We Source Data and How We Verify Streams with detailed trust/compliance content.
- Added a visible evergreen guide section to the Guides hub.
- Converted redirect aliases to noindex/follow redirect pages where needed.
- Removed redirect-only alias URLs from sitemap entries.

## Remaining risks
- The site is still young, so AdSense may still evaluate it as limited-history even after content improvements.
- Some dynamic player/match pages can still look feed-heavy if indexed broadly; keep sitemap limited to high-value pages.
- For best results, continue adding manually written evergreen articles over time.

## Validation
- app/guides/articles.ts JSON content was parsed successfully after changes.
- Repeated phrases from the audit now return 0 occurrences:
  - Start with official tournament information
  - Confirm your country before paying
  - Avoid unsafe streaming shortcuts
  - Final checklist
  - A practical, original Watch Tennis Today guide
- npm run lint and npm run build could not be completed in this container because dependency installation was terminated with SIGTERM before node_modules/.bin tools were available.
