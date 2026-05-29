# Homepage 3.0 Growth Engine — Codex 65

## Goal
Turn the homepage into a stronger daily entry point for revenue, internal linking and match discovery without adding risky programmatic player pages.

## Changes

- Added `app/components/HomepageGrowthEngine.tsx`.
- Added a high-priority homepage section before the existing daily hub:
  - Best tennis matches to follow today
  - Grand Slam spotlight
  - Live demand card
  - Schedule intent card
  - Money path card
  - Tournament path links
- The new component only links to:
  - `/watch/[slug]`
  - tournament pages
  - schedule pages
  - TV/country/streaming pages
- It does **not** create `/player/...` links, so it avoids the previous bad player slug generation issue.

## Revenue angle

This update routes homepage visitors into:

- match pages
- tournament pages
- legal streaming service comparison
- country TV guides
- schedule pages

That should improve page depth, session duration and affiliate discovery paths.
