# Money Sprint 14 — French Open SEO Schema + Intent Bridge

## What changed

- Added `app/components/JsonLd.tsx` to keep structured data reusable and cleaner.
- Added `app/components/FrenchOpenSeoBridge.tsx` to route visitors between the core French Open search intents:
  - missed yesterday → `/roland-garros-recap`
  - watching today → `/french-open-today`
  - planning tomorrow → `/tomorrow`
  - legal streaming → `/where-to-watch-french-open`
- Added the intent bridge to `/french-open` and `/roland-garros-recap`.
- Added Breadcrumb structured data to `/french-open`.
- Upgraded `/french-open` structured data from a generic WebPage shape to:
  - `CollectionPage`
  - `FAQPage`
- Added Breadcrumb structured data to `/roland-garros-recap`.
- Added recap structured data to `/roland-garros-recap`:
  - `WebPage`
  - completed results `ItemList`
  - upcoming matches `ItemList`
  - `FAQPage`
- Removed duplicate inline FAQ schema from the recap page and replaced it with the reusable JSON-LD component.

## Why this helps monetization

This makes the French Open cluster easier for Google to understand and keeps users moving from daily recap pages into today/tomorrow/streaming money pages. The goal is more indexed intent coverage and more internal clicks per visitor.

## Validation

- Targeted ESLint passed.
- TypeScript passed.
- Production build compiled and TypeScript passed, then timed out during page data collection in this environment, same pattern as previous sprints.
