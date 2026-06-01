# Server Match Cache Optimization — Codex 86

## Why
Vercel logs showed repeated `/api/matches` calls after navigation. The biggest remaining source was server-rendered pages requesting the same match feed during metadata/page rendering.

## Changes
- Added `app/lib/serverMatches.ts` shared server fetch helper.
- Normalizes `/api/matches` responses in one place.
- Uses Next `revalidate` caching for server match feed calls.
- Updated match pages to use shared server cache.
- Updated rivalry pages to use shared server cache.
- Removed an extra `/api/matches` call from watch page metadata generation.
- Changed rivalry pages from forced dynamic no-store fetches to 60-second revalidation.

## Result
- Fewer server-side `/api/matches` requests.
- Less Vercel function pressure during navigation.
- Better cache reuse across SEO-heavy match/rivalry pages.
