# Codex 85 — Rivalry internal linking

## What changed

- Added curated rivalry matching helpers in `data/rivalries.ts`.
- Match pages now detect when the current match is a known rivalry and show a dedicated Rivalry guide CTA.
- Player pages now show player-specific rivalry guide links when available.
- Replaced legacy generic `/vs/*` links on player pages with canonical `/rivalries/*` URLs.

## Why

This improves SEO and retention by connecting high-intent pages:

- live match pages → rivalry pages
- player pages → rivalry pages
- rivalry pages → player/watch coverage

It helps users keep browsing instead of leaving after checking one score.

## Validation

- `npx tsc --noEmit` passes.
- `npx eslint app/watch/[slug]/page.tsx app/player/[slug]/page.tsx data/rivalries.ts` returns warnings only from existing unused code, no errors.
