# Player alert cron 401 cleanup — Codex 72

## What changed

- Kept `/api/send-player-alerts` protected for real cron execution.
- Added a safe browser probe response: opening the URL in Chrome now returns a harmless JSON explanation instead of a scary 401.
- Browser requests do **not** send emails.
- Missing `CRON_SECRET` now returns a clear config error instead of accidentally allowing the route to run.
- Marked the route as dynamic so it is not cached.
- Cleaned duplicate Resend logging and formatting in the alert sender.

## Why

The Vercel log with Chrome user agent was a manual browser request, not the scheduled cron run. Vercel cron calls protected cron endpoints with `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is configured.

## Files changed

- `app/api/send-player-alerts/route.ts`
