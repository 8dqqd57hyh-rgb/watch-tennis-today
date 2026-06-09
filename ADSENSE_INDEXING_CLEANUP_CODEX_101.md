# AdSense indexing cleanup

## Changed files
- `app/lib/adsenseIndexing.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- `app/compare/[slug]/page.tsx`
- `app/player/[slug]/page.tsx`
- `app/rivalries/[slug]/page.tsx`
- `app/tournament/[slug]/page.tsx`
- `app/watch/[slug]/page.tsx`
- `app/api/subscribe-finals/route.ts`
- `app/lib/supabase.ts`

## Pages noindexed
- `/compare/*` unless expanded into substantial editorial pages
- unknown/missing `/player/*`
- player pages without a substantial editorial profile
- unknown/API-only `/tournament/*`
- `/watch/*` pages without a stable local archived match
- missing rivalry pages; rivalry pages index only when they contain matchup storylines/context
- existing noindex pages remain: `/vs/*`, `/next-match/*`, `/watch-player-live/*`

## Pages removed from sitemap
- `/compare`
- `/compare/*`
- player pages without known editorial profiles
- dynamic match and tournament URLs that depend on live API data remain excluded

## Verification
- `npm install` completed.
- `npm run lint -- --quiet` still fails on pre-existing project lint errors, mostly `<a>` internal links, `any` types, and unescaped apostrophes. New AdSense indexing helper avoids introducing `any` lint errors.
- `npm run build` compiles successfully, then times out during page data collection in this sandbox. I fixed two build-time env blockers discovered during the run: eager Resend construction and missing Supabase env handling. The remaining timeout appears related to existing page data collection/external runtime work, not syntax compilation.

## Remaining AdSense risks
- Internal links to noindexed comparison pages still exist in `RelatedMoneyLinks`; consider replacing them with guide/country pages or turning those comparison pages into full editorial guides.
- Lint should be cleaned before deploy for engineering quality.
- Country pages should stay indexed only while their content remains meaningfully country-specific.
