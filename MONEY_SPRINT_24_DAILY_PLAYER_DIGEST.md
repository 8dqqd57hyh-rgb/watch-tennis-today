# Money Sprint 24 — Daily Player Digest

## What changed

Added a protected daily email digest endpoint:

- `GET /api/send-player-digest`
- Groups confirmed `player_subscriptions` by email address.
- Builds one daily email per recipient instead of many noisy single-match emails.
- Includes followed player sections with:
  - Live matches
  - Upcoming matches
  - Recent results
  - Player hub links
  - Match page links
- Uses `player_alert_logs` with `alert_type = daily-digest` to avoid sending the same digest twice per day.
- Reuses the existing `CRON_SECRET`, `RESEND_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` setup.
- Honors `ALERT_TEST_MODE=true` and sends to the configured safe test recipient.

## Cron

Updated `vercel.json`:

```json
{
  "path": "/api/send-player-digest",
  "schedule": "30 8 * * *"
}
```

Existing instant player alerts remain available at `/api/send-player-alerts`.

## Monetization reason

This turns one-off player follows into a daily return loop:

1. User follows several players.
2. They receive one useful daily tennis email.
3. Email links return them to player and match pages.
4. More returning users means more ad impressions and stronger audience retention.

## Production notes

Make sure these env vars exist in Vercel:

- `CRON_SECRET`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL=https://watchtennistoday.com`

The sender currently uses:

```txt
Watch Tennis Today <alerts@watchtennistoday.com>
```

That domain should be verified in Resend for best deliverability.
