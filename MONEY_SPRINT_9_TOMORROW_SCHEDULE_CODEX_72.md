# Money Sprint 9 — Tomorrow Schedule Page (Codex 72)

## Goal
Add a non-intrusive SEO and retention page for users who plan ahead instead of only checking live matches.

## Added
- `/tomorrow` page with tomorrow's tennis schedule, featured match, match cards and useful internal links.
- `/tennis-schedule-tomorrow` alias page for search intent coverage.
- Homepage quick links to Today's matches, Tomorrow's schedule and Compare streaming services.
- Sitemap entries for the two new schedule pages.

## Monetization logic
The page supports revenue without annoying users:
- no popups;
- no sticky banners;
- one optional inline email signup near the bottom;
- contextual internal links to TV, schedule and comparison pages;
- soft RevenueConversionPanel placement after useful content.

## QA checklist
- Open `/tomorrow`.
- Open `/tennis-schedule-tomorrow`.
- Check homepage quick links.
- Check `/sitemap.xml` contains both URLs.
- Run `npm run build`.
