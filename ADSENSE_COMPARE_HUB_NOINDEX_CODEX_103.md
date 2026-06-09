# AdSense compare hub noindex cleanup (Codex 103)

## Goal
Remove the last remaining AdSense approval risk around comparison pages. Google AdSense review can flag pages that look thin, templated, affiliate-heavy, or automatically generated with low original value.

## Changes

### `app/compare/page.tsx`
- Added `robots: { index: false, follow: true }` to the compare hub.
- Kept the page crawlable for users and internal navigation.
- Added an explanatory AdSense quality comment.

### `app/compare/tennis-tv-vs-espn/page.tsx`
- Added `robots: { index: false, follow: true }` to the legacy/static comparison page under `/compare`.
- Added an explanatory AdSense quality comment.
- Replaced the local homepage `<a>` with Next `<Link>` so this touched file does not add a lint violation.

## Sitemap status
- `/compare` is not included in `app/sitemap.ts`.
- `/compare/*` pages are already excluded from `app/sitemap.ts`.

## Result
All comparison URLs are now intentionally crawlable but non-indexable, reducing the risk that AdSense treats them as low-originality generated or affiliate-style pages during review.
