# Money Sprint 12 — Click Analytics (Codex 80)

## Goal
Improve future monetization decisions without adding duplicate URLs or annoying UI.

## What changed
- Added `app/components/ClickAnalytics.tsx`.
- Added the component globally in `app/layout.tsx`.
- Tracks three event types:
  - `internal_link_click`
  - `external_link_click`
  - `affiliate_click`
- Sends events to Vercel Analytics via `track()`.
- Also sends the same events to Google Analytics through `window.gtag`, when GA is available.

## What is captured
- Destination path or external hostname.
- Current page path.
- Clicked link text.
- Link area: `header`, `footer`, or `content`.
- Whether the click is internal.

## UX impact
- No popups.
- No sticky banners.
- No visual changes.
- No new pages.

## Why this helps revenue
This makes it possible to see which internal links, money pages and affiliate CTAs users actually click. Future improvements can then focus on pages and paths that already show commercial intent.

## Suggested checks
- Open the site and click a few internal links.
- Click one VPN/affiliate CTA.
- Check Vercel Analytics events.
- Check GA events if Google Analytics is active.
