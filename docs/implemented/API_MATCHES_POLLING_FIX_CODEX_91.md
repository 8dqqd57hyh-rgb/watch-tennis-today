# API matches polling + AbortError log fix

## Problem
Vercel logs showed repeated `/api/matches` calls and warnings like:

```txt
API-Tennis get_fixtures fetch skipped (AbortError)
```

The endpoint still returned `200`, but the live match score component was scheduling the next refresh incorrectly.

## Fixes

### 1. Stop aggressive `/api/matches` polling
`app/watch/[slug]/LiveMatchScore.tsx` was calling `refreshMatch()` again immediately inside `finally`, creating a tight request loop after the first live-score update.

Changed it to schedule the next refresh with `setTimeout(refreshMatch, 30000)`.

Result:
- live match pages still auto-refresh
- no immediate recursive API loop
- fewer Vercel invocations
- fewer API-Tennis calls

### 2. Silence expected AbortError warnings
`app/api/matches/route.ts` uses `AbortController` as a timeout guard for the external API.

An `AbortError` means the timeout guard worked; it is not a deployment error. The route now ignores AbortError warnings and only logs unexpected fetch failures.

Result:
- cleaner Vercel logs
- healthy `200` responses no longer look scary
- real API errors are still visible

## Files changed
- `app/watch/[slug]/LiveMatchScore.tsx`
- `app/api/matches/route.ts`
