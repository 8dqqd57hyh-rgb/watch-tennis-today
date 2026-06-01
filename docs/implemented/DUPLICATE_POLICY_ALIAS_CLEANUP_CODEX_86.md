# Codex 86 — Duplicate Policy/Alias URL Cleanup

## Goal
Reduce duplicate-content risk without creating new pages or changing UX.

## Changes

### 1. Made `/privacy` the real privacy page
- Moved the full Privacy Policy content to `app/privacy/page.tsx`.
- This keeps the canonical URL and footer/internal links focused on `/privacy`.

### 2. Turned `/privacy-policy` into a redirect-only alias
- `app/privacy-policy/page.tsx` now redirects to `/privacy`.
- Added `robots.index = false` for the alias metadata as an extra safety signal.

### 3. Added edge redirects for known canonical aliases
Added permanent redirects in `middleware.ts` for:

- `/privacy-policy` → `/privacy`
- `/watch-french-open-in-australia` → `/where-to-watch-french-open#australia`
- `/watch-french-open-in-canada` → `/where-to-watch-french-open#canada`
- `/watch-french-open-in-uk` → `/where-to-watch-french-open#uk`
- `/watch-french-open-in-usa` → `/where-to-watch-french-open#usa`

## Why this helps
- Prevents Google from crawling/indexing thin alias pages as separate content.
- Keeps existing user-facing links working through clean redirects.
- Does not add new URLs, popups, banners, or duplicate content.

## Manual checks
- `/privacy` should show the privacy policy.
- `/privacy-policy` should redirect to `/privacy`.
- `/watch-french-open-in-usa` should redirect to `/where-to-watch-french-open#usa`.
- `/sitemap.xml` should remain valid.
