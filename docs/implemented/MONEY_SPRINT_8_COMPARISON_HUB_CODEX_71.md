# Money Sprint 8 — Non-intrusive comparison hub

Goal: improve monetization paths without annoying users.

## What changed

- Rebuilt `/compare` into a stronger comparison hub using existing `data/comparisons.ts`.
- Expanded comparison data from 4 to 8 high-intent pages:
  - Tennis TV vs ESPN+
  - Tennis TV vs Eurosport
  - Tennis TV vs Sky Sports
  - Tennis TV vs DAZN
  - ESPN+ vs Tennis Channel
  - Eurosport vs discovery+
  - Tennis Channel vs Tennis TV
  - NordVPN vs Surfshark for Tennis
- Added audience/intent copy and next-step CTAs to each comparison.
- Added a non-pushy “Best next step” block on comparison detail pages.
- Updated sitemap generation so comparison pages are generated from the data file instead of being hardcoded.

## Why this helps revenue

Comparison pages catch high-intent visitors who are already deciding between paid services. This is better than showing more ads because the user chooses to continue deeper into the site.

## Non-annoying UX rules followed

- No popups.
- No sticky bars.
- No forced newsletter gate.
- No fake urgency.
- Affiliate/VPN routes remain contextual and optional.
