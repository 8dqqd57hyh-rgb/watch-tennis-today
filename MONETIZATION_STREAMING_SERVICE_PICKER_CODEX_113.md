# Monetization Upgrade 7 — Source-first Streaming Service Picker

## What changed

Updated `/tennis-streaming-service-picker` so the tool is less generic and more useful for users who are close to paying for a tennis streaming service.

## Improvements

- Replaced broad country guidance with source-first recommendations.
- Added concrete service candidates for each country + Grand Slam combination.
- Added official external verification links:
  - Australian Open broadcast partners
  - Roland-Garros broadcasters
  - Wimbledon TV coverage
  - US Open international broadcast partners
  - ATP Tour TV schedule for weekly ATP events
- Changed the main CTA from a generic internal country guide to an official source link.
- Added clear “Check these first” service chips.
- Added an “Official verification source” card with explanation.
- Kept the cost calculator CTA as the next monetization-supporting action.

## Why this helps

This makes the page more useful than a generic article because users can select their country and exact Grand Slam, then immediately see the service candidates and the official source to verify rights before subscribing.

## Validation

- `npm run typecheck` passed.
- `npm run lint` passed with existing warnings only.
