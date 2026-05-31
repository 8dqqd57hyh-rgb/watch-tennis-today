# Daily Tennis Loop + Recap Monetization Upgrade

## Why
The site already had Roland Garros recap, today, tomorrow and draw pages. This change connects them into a clear daily user journey so visitors can move from catching up to planning the next match and checking official viewing options.

## Changed files

### `app/components/DailyTennisLoop.tsx`
- Added a reusable retention/navigation component.
- Links together:
  - Yesterday: `/roland-garros-recap`
  - Today: `/french-open-today`
  - Tomorrow: `/tomorrow`
  - Draw: `/french-open-draw`
  - TV schedule CTA: `/french-open-tv-schedule`

### `app/page.tsx`
- Added `DailyTennisLoop` under the French Open hero.
- Removed an unused `affiliateLinks` import.
- Converted a few homepage internal anchors to Next `<Link>` to reduce lint errors.

### `app/roland-garros-recap/page.tsx`
- Added `DailyTennisLoop` near the top of the recap page.
- Added a recap-specific `RevenueConversionPanel` after the “tomorrow matches” block.
- Added an email signup block for Roland Garros catch-up reminders.

### `app/components/RevenueConversionPanel.tsx`
- Added a new `recap` context with copy tailored to users who just caught up on yesterday’s matches and may want official viewing guidance for the next match.

## Validation
- `npx eslint app/components/DailyTennisLoop.tsx app/components/RevenueConversionPanel.tsx app/roland-garros-recap/page.tsx app/page.tsx`
  - Passed with 0 errors.
  - 2 existing warnings remain in `app/page.tsx` for unused `error` variables.
- `npx tsc --noEmit`
  - Passed.
- `npm run build`
  - Compiled successfully and TypeScript passed.
  - Timed out during Next page data collection in this environment, same pattern as previous build attempts.
