# Time Zone Planner – Codex 76

Added a new retention + SEO improvement for international tennis fans.

## What changed

- Added `app/components/TennisTimeZonePlanner.tsx`
  - Shows match times in the user's browser timezone.
  - Groups matches into Live now, Next up, Morning, Afternoon, Evening and Later.
  - Links directly to match pages.

- Updated `app/today/TodayClient.tsx`
  - Inserts the planner near the top of the Tennis Today page, right after spoiler-free mode.

- Added `app/tennis-time-zone-converter/page.tsx`
  - SEO landing page for “tennis time zone converter” and “tennis match start time local time” intent.

- Updated `app/layout.tsx`
  - Added footer link to the new page.

- Updated `app/sitemap.ts`
  - Added `/tennis-time-zone-converter`.

## Why this helps

This improves usefulness for users outside the tournament country and creates a new evergreen search target around tennis start times and timezone confusion.
