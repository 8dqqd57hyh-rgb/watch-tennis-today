# Storylines Today

Implemented a new **Storylines Today** product block for the French Open hub.

## Added
- New component: `app/components/FrenchOpenStorylinesToday.tsx`
- Uses existing project feeds only:
  - `/api/french-open-today`
  - `/api/french-open-upsets`
  - `/api/french-open-draw-tracker`
- Builds useful editorial cards:
  - Live now
  - Match to watch / Next big match
  - Biggest shock
  - Draw pulse
  - Latest result

## Integrated
- Added to `/french-open`
- Added to `/french-open-today`

## Product goal
This turns raw match-feed data into a more editorial layer for users who missed the day and want to know what actually matters.

## Validation
Could not run lint/build in the extracted ZIP because dependencies are not installed (`node_modules` is missing, so `eslint`, React and Next types are unavailable). The component is client-only and uses existing internal API routes.
