# Money Sprint 14 — French Open country conversion

## What changed

- Added `FrenchOpenCountryGuides` as a reusable country-by-country Roland Garros streaming component.
- Rebuilt `/where-to-watch-french-open` into a stronger conversion page with:
  - country cards,
  - internal country guide links,
  - official broadcaster outbound links,
  - JSON-LD `CollectionPage` + `ItemList`,
  - links to TV schedule, VPN guide, live hub, results and order of play.
- Upgraded `/french-open-streaming-countries` from a simple list into a proper SEO landing page.
- Added compact country guide block to `/french-open` hub.
- Added high-intent resource links for USA, UK and Poland into the French Open hub quick links.

## Why this helps

Country pages are monetizable search intent: users looking for where to watch a tournament are closer to clicking broadcaster, streaming or VPN recommendations.

## Validation

- Targeted ESLint passed.
- TypeScript passed.
