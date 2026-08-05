# Streaming offers data

Detailed subscription data is read on the server from Supabase's `streaming_offers` table and normalized before it reaches the API or React UI. If Supabase is unavailable, the service returns the matching rows from `data/streaming-offers.v1.json` and marks the response as a fallback. Totals are always calculated from the base plan and add-on in `src/data/streamingOffers.ts`.

## Setup and seed

Apply `supabase/migrations/202608050001_create_streaming_offers.sql` with the project's normal Supabase migration workflow. The migration creates the offer and audit tables, enables RLS, adds the lookup index, and inserts the manually verified Poland/US Open seed. `on conflict do nothing` makes the seed safe to apply once; later editorial changes belong in Supabase.

Required server-only variables:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional variables:

```text
STREAMING_DATA_STALE_AFTER_HOURS=168
CRON_SECRET=
```

The service-role key is imported only by server modules and must never use a `NEXT_PUBLIC_` name. Responses are cached for 12 hours. After a database edit, send `POST /api/revalidate/streaming-offers` with `Authorization: Bearer <CRON_SECRET>`.

## Verification command

Run `npm run update-streaming-offers`. The script fetches configured official source pages outside the user request path, compares stable text fingerprints, writes every outcome to `streaming_offer_audit_log`, and flags automatic rows for review when content changes or cannot be checked. It never parses and overwrites prices, and it never modifies manually verified rows.

Provider pages commonly render checkout data by geography, cookies, JavaScript, account state, or app-store billing. A content hash can identify a likely change but cannot safely identify a new price or package. Changed content therefore requires editorial review and a manual Supabase update.
