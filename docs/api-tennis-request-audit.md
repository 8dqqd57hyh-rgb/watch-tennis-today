# API-Tennis Request Audit

## Goal

Reduce oversized API-Tennis payloads that slow tournament/player/watch pages and trigger Next.js Data Cache warnings such as `items over 2MB can not be cached`.

## Changes made

### 1. Added request-size logging

Added guarded API-Tennis logging in:

- `app/lib/apiTennisClient.ts`
- `app/api/matches/route.ts`

Enable with:

```bash
LOG_API_TENNIS=1
```

Log format:

```ts
console.log("[API-TENNIS]", endpoint, payloadSize, duration)
```

The log intentionally excludes the API key and full URL.

### 2. Removed full-year tournament fixture lookups

File changed:

- `app/lib/tournamentDateRange.ts`

Before:

- tournament pages could request `get_fixtures` from `YYYY-01-01` to `YYYY-12-31`
- this produced payloads above 2 MB for tournament pages such as `/tournament/hamburg`

After:

- tournament fixture inference uses a rolling window of `today - 30 days` to `today + 30 days`
- no full-season `get_fixtures` request is used for tournament date inference

### 3. Avoided unnecessary tournament fixture API calls

File changed:

- `app/tournament/[slug]/page.tsx`

Before:

- tournament pages fetched calendar metadata and API-Tennis fixture date ranges in parallel

After:

- the page checks the local/verified tournament calendar first
- API-Tennis fixture date inference runs only when the local calendar does not have a date range

### 4. Reduced `/api/matches` date windows

File changed:

- `app/api/matches/route.ts`

New maximum windows:

| Context | Before | After |
|---|---:|---:|
| Global/today/live feed | up to 120 days back / 90 days forward | 3 days back / 3 days forward |
| Watch page by `matchId` | 7 days back / 90 days forward | 7 days back / 7 days forward |
| Player page / player alerts | up to 365 days back / 45–90 days forward | 30 days back / 30 days forward |

### 5. Updated callers to request smaller windows

Files changed:

- `app/lib/serverMatches.ts`
- `app/player/[slug]/page.tsx`
- `app/tournament/[slug]/page.tsx`
- `app/api/french-open-upsets/route.ts`
- `app/api/next-grand-slam/route.ts`

Examples:

- player server match lookup now requests `daysBack=30&daysForward=30`
- tournament pages request `/api/matches?daysBack=3&daysForward=3`
- French Open upsets own-API fallback now requests `daysBack=30`
- next Grand Slam fixture scan now uses 120 days instead of 365 days

## Oversized requests found

| Area | Endpoint | Old range | Risk | Fix |
|---|---|---:|---|---|
| Tournament date inference | `get_fixtures` | Full season, `YYYY-01-01` → `YYYY-12-31` | Very high. Observed ~2.12 MB payload in Vercel logs. | Rolling ±30 days. |
| Global matches feed | `get_fixtures` | Up to 120 days back / 90 days forward | High for bot traffic and homepage/tournament pages. | Global ±3 days. |
| Player pages | `get_fixtures` | Up to 60/365 days back depending caller/history mode | Medium/high. | Player ±30 days; older rows come from Supabase archive. |
| Watch pages | `get_fixtures` | Could accept oversized forward windows through query params | Medium. | Match-specific ±7 days. |
| Next Grand Slam helper | `get_fixtures` | 365 days forward | Medium. | 120 days forward. |

## Estimated impact

These estimates are based on the observed Vercel payload warning and the old/new date windows.

| Area | Estimated bandwidth reduction | Estimated response-time improvement |
|---|---:|---:|
| `/tournament/hamburg` and similar tournament pages | 70–90% for API-Tennis fixture payloads | 2–6 seconds faster on uncached/bot requests |
| `/api/matches` global feed | 80–95% for fixture payloads | 1–4 seconds faster depending API latency |
| Player pages | 40–80% for direct API fixture lookups | 1–3 seconds faster; older form data now depends more on Supabase archive |
| Watch pages | 30–70% for match lookups | Lower timeout risk and faster live score hydration |

## Remaining risks

- Some French Open/Roland Garros legacy endpoints still call API-Tennis directly instead of the shared client, so their logs are not yet standardized.
- Full project lint still has older unrelated `no-explicit-any` errors in existing files.
- Production payload sizes should be verified with `LOG_API_TENNIS=1` after deployment.
- Build compiled successfully, but local `next build` timed out while collecting page data because the project has many dynamic routes.

## Recommended next step

After deployment, watch Vercel logs for:

```text
[API-TENNIS]
```

Confirm that:

- no `get_fixtures` response is above 2 MB
- `/tournament/hamburg` no longer logs Next.js Data Cache warnings
- tournament page execution time drops below 3 seconds on normal requests
