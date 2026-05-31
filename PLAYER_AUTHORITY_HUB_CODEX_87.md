# Player Authority Hub upgrade

Search Console showed that player URLs are driving the strongest early traffic, especially `/player/j-fonseca`, `/player/swiatek-iga`, and `/player/sinner-jannik`.

## Changes

- Reworked `/player/[slug]` metadata toward CTR intent:
  - `Watch {Player} Live Today: Next Match, Schedule & Results`
- Added a stronger player hero section with:
  - live status
  - upcoming count
  - recent results count
  - next listed match CTA
- Rebuilt the match list into a player match center:
  - Live / Upcoming / Result labels
  - match time formatting
  - opponent/context text
  - match page CTA
  - player live guide CTA
- Added current tournament context links based on the match feed.
- Added a visible FAQ section matching the existing FAQ structured data.
- Kept player pages focused on legal viewing information and internal links.

## Validation

- `npx tsc --noEmit` passed after installing dependencies locally.
- `npm run build` compiled successfully, then timed out during the later validation phase in the sandbox.
