# CODEX 112 — Streaming Service Picker usefulness upgrade

## Goal
Make `/tennis-streaming-service-picker` more useful and realistic by avoiding one generic “Europe / EU” option and by separating Grand Slam selection.

## Changes
- Replaced broad `Europe / EU` region with specific country options:
  - Poland
  - Germany
  - France
  - Italy
  - Spain
  - Netherlands
  - Ireland
- Renamed the data model from region-oriented copy to country-oriented copy.
- Added a dedicated Grand Slam dropdown shown only when `Grand Slams` is selected.
- Added separate Grand Slam guidance for:
  - Australian Open
  - Roland Garros
  - Wimbledon
  - US Open
- Updated recommendation logic so Grand Slam output uses tournament-specific service checks and warnings.
- Updated CTA copy from “region guide” to “country guide”.
- Updated metadata/page copy to mention exact Grand Slam selection.

## Why this is better
- More useful for real users because European rights differ by country.
- Better UX because Grand Slams are not treated as one generic category.
- Stronger AdSense/SEO value because the tool provides interactive decision help rather than thin generic advice.

## Validation
- `npm run typecheck` passed.
- `npm run lint` passed with existing warnings only.
