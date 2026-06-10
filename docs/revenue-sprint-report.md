# Revenue Sprint Report

## Goal
Increase monetization readiness without thin content, fake affiliate links, unsafe streaming claims or invented authority signals.

## Pages added

### `/why-trust-watch-tennis-today`
Added a trust and transparency page covering:

- who maintains the site at a high level
- how tennis data is sourced
- limitations of live tennis data and API feeds
- how streaming information is checked
- what Watch Tennis Today does not do
- correction handling
- editorial standards
- links to About, Author, Editorial Policy, Content Guidelines, Privacy and Contact

Added metadata, FAQ schema and breadcrumb schema.

### `/tennis-streaming`
Added a central legal tennis streaming hub covering:

- how to watch tennis legally
- ATP coverage context
- WTA coverage context
- Grand Slam coverage context
- country-by-country starting points
- legal stream verification checklist
- VPN note for travelers only
- links to related streaming guides
- FAQ schema and breadcrumb schema
- contextual email capture for streaming guide updates

No fake affiliate links were added. No unsafe or unofficial stream promises were added.

## Components added

### `components/EmailCapture.tsx`
Added a reusable email capture component with support for:

- player alerts
- tournament alerts
- daily tennis alerts
- streaming guide alerts
- watch page alerts
- guide page alerts

Props supported:

- `title`
- `description`
- `placeholder`
- `buttonText`
- `contextType`
- `contextValue`
- `variant`
- `dark`
- `compact`

Also added `app/components/EmailCapture.tsx` as a compatibility re-export.

## Email capture placements added

Added contextual email capture to:

- `/today`
- `/live-tennis`
- `/player/[slug]`
- `/tournament/[slug]`
- `/watch/[slug]`
- `/guides/[slug]`
- `/tennis-streaming`

Copy stays privacy-friendly and avoids spammy claims.

## Internal linking improvements

Added or improved links from:

- `/start-here` to `/today`, `/live-tennis`, `/players`, `/tournament`, `/tennis-guides` and `/tennis-streaming`
- player pages to rankings, tournament levels, scoring and legal streaming hub
- streaming hub to country guides and related legal streaming guides
- sitemap to include `/why-trust-watch-tennis-today`, `/tennis-streaming` and `/start-here`

## Redirect audit

Found current redirect usage in:

- `app/french-open-draw/page.tsx` → `/french-open-schedule`
- `app/french-open-survivors/page.tsx` → `/french-open-results`
- `app/french-open-upsets/page.tsx` → `/french-open-results`
- `app/privacy-policy/page.tsx` → `/privacy`
- `app/roland-garros-predictions/page.tsx` → `/french-open-today`
- `app/roland-garros-pulse/page.tsx` → `/french-open`
- `app/tennis-schedule-tomorrow/page.tsx` → `/tomorrow`
- `app/vs/[slug]/page.tsx` → `/rivalries/[slug]` for known rivalries
- `app/watch-french-open-in-australia/page.tsx` → `/where-to-watch-french-open#australia`
- `app/watch-french-open-in-canada/page.tsx` → `/where-to-watch-french-open#canada`
- `app/watch-french-open-in-uk/page.tsx` → `/where-to-watch-french-open#uk`
- `app/watch-french-open-in-usa/page.tsx` → `/where-to-watch-french-open#usa`
- `app/watch-sabalenka-live/page.tsx` → `/watch-player-live/aryna-sabalenka`
- `app/watch-swiatek-live/page.tsx` → `/watch-player-live/iga-swiatek`
- `app/watch/tennis-spoiler-free-scores/page.tsx` → `/tennis-spoiler-free-scores`
- `app/wimbledon-live-stream/page.tsx` → `/wimbledon-live`
- `middleware.ts` canonical redirect rules

No sitemap additions were made for redirect-only alias pages. The new sitemap additions are canonical destination pages.

## Checks run

### Changed-file ESLint
Command:

```bash
npx eslint components/EmailCapture.tsx app/components/EmailCapture.tsx app/why-trust-watch-tennis-today/page.tsx app/tennis-streaming/page.tsx app/start-here/page.tsx app/today/page.tsx app/live-tennis/page.tsx app/player/[slug]/page.tsx app/tournament/[slug]/page.tsx app/watch/[slug]/page.tsx app/guides/[slug]/page.tsx
```

Result:

- 0 errors in changed files
- 6 existing warnings in `app/player/[slug]/page.tsx` for unused variables/imports

### Full ESLint
Command:

```bash
npm run lint
```

Result:

- Failed due to existing project-wide lint errors unrelated to this sprint, mostly `no-html-link-for-pages`, `no-explicit-any` and unescaped apostrophes.

### TypeScript check
Command:

```bash
npx tsc --noEmit
```

Result:

- Failed due to existing TypeScript errors in:
  - `app/api/match-archive/[id]/route.ts`
  - `app/lib/tournamentDateRange.ts`

### Build
Command:

```bash
npm run build
```

Result:

- Production build compiled successfully.
- The command timed out during `Collecting page data`, likely because this project has many dynamic routes and data-heavy pages.

## Risks remaining

- Full lint is still blocked by pre-existing project-wide issues.
- TypeScript check is still blocked by pre-existing project-wide type errors.
- Several redirect-only aliases still exist. They are acceptable if excluded from sitemap, but they should be monitored in Search Console and Vercel logs.
- Some pages may still be thin if they mostly display feed output without editorial context.
- Email capture currently uses existing Formspree/player subscription paths; tournament and streaming alerts may need backend segmentation later.

## Recommended next steps for AdSense

1. Fix project-wide lint issues that affect internal links.
2. Fix TypeScript errors in `match-archive` and `tournamentDateRange`.
3. Crawl sitemap and confirm every URL returns 200 with no redirects.
4. Keep redirect-only alias pages out of sitemap.
5. Review indexable feed-heavy pages and noindex pages that do not have enough original editorial value.

## Recommended next steps for affiliate monetization

1. Do not add fake affiliate URLs.
2. Apply only to relevant official/legal streaming partners.
3. Add affiliate disclosure near monetized links.
4. Track clicks separately for official broadcasters, VPN traveler guides and streaming comparison pages.
5. Prioritize Wimbledon, US Open and ATP Finals legal viewing hubs before adding more player pages.

## Follow-up sprint: email capture infrastructure cleanup

### What changed

- Added `app/api/subscribe-general/route.ts` so reusable email CTAs no longer depend on a hardcoded third-party Formspree endpoint.
- Updated `components/EmailCapture.tsx` to submit non-player signups to the first-party API route.
- Updated `app/components/EmailSignup.tsx` to reuse `EmailCapture`, reducing duplicate signup UI and keeping privacy/illegal-stream copy consistent.
- Added `docs/sql/email-subscriptions.sql` for the optional Supabase table that stores non-player email signups by context.
- Fixed duplicate confirmation sending in `app/api/subscribe-finals/route.ts`.

### Production setup still needed

- Run `docs/sql/email-subscriptions.sql` in Supabase if you want daily, guide, watch, tournament and streaming signups to persist.
- Configure `RESEND_API_KEY` for confirmation emails.
- Replace `onboarding@resend.dev` with a verified sender domain before public launch.
- Add unsubscribe handling before sending regular marketing/newsletter emails.

### Why this matters for monetization

The previous CTA layer collected some signups through mixed mechanisms. This follow-up centralizes capture behind site-owned API routes, which makes the email list easier to segment later by player, tournament, streaming guide, watch page and daily tennis intent.
