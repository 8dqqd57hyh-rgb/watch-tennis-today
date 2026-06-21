# Monetization Broadcaster Database - Codex 114

## What changed

- Added a reusable typed broadcaster data layer for country and tournament combinations.
- Refactored `/tennis-streaming-service-picker` so the dropdowns use the shared country and tournament data instead of generic hardcoded advice.
- Updated the picker result card to show broadcaster, streaming service, price note, free/paid status, replay and commentary notes, supported devices, last verified date, confidence badge and official source buttons.
- Added stronger warnings for partial and needs-check rows: broadcast rights can change and users should verify official sources before paying.
- Updated FAQ/schema content and added WebApplication schema for the picker.
- Updated `/tennis-streaming-cost-calculator` so known official prices are imported from the new broadcaster data helper, with custom fallbacks for unverified prices.

## Files changed

- `src/data/tennisBroadcasts.ts`
- `app/tennis-streaming-service-picker/StreamingServicePickerClient.tsx`
- `app/tennis-streaming-service-picker/page.tsx`
- `app/tennis-streaming-cost-calculator/StreamingCostCalculatorClient.tsx`
- `MONETIZATION_BROADCASTER_DATABASE_CODEX_114.md`

## How the data model works

`src/data/tennisBroadcasts.ts` exports:

- `tennisBroadcastCountries`: supported country dropdown options.
- `tennisTournamentGroups`: Australian Open, Roland Garros, Wimbledon, US Open, ATP Tour and WTA Tour.
- `tennisBroadcasts`: one broadcaster entry per country plus tournament group.
- `getTennisBroadcast(countryCode, tournamentId)`: picker lookup helper.
- `getKnownBroadcastPriceOptions()`: calculator helper that exposes only entries with stored monthly price and currency.

Each broadcast row supports country, tournament, broadcaster, streaming service, official website URL, official source URLs, price notes, optional monthly price, free/subscription flags, replay/commentary notes, device notes, coverage notes, last verified date and confidence level.

## Confirmed vs needs_check

Confirmed examples include rows backed by explicit official sources, such as:

- France Roland Garros: France Televisions and Prime Video.
- Wimbledon UK: BBC / BBC iPlayer.
- Wimbledon France: beIN Sports France.
- Wimbledon Germany: Prime Video.
- US Open US: ESPN via USOpen.org domestic coverage.
- US Open UK/Ireland and ATP/WTA Tour UK/Ireland: Sky Sports/NOW sources.
- US WTA Tour price: Tennis Channel official help lists USD 11.99/month.
- NOW Sports price: official NOW help lists GBP 34.99/month.

Partial or needs_check rows use official tournament/tour directories but still require territory/package verification. These include many Eurosport/Max/discovery+, Movistar Plus+, Ziggo Sport, Polsat, SuperTennis and Sportdeutschland.TV rows where the official directory or provider routing can change by season, app package or court coverage.

## What to verify manually later

- Exact 2026 country listings in Australian Open, Wimbledon, Roland Garros and US Open broadcaster directories after each tournament refreshes its page.
- Current monthly prices for Max/Eurosport sports access in Poland, France, Spain and Netherlands.
- Current discovery+ sports pricing and routing in Germany, Italy, UK and Ireland.
- Current Grand Slam package prices for ESPN, Prime Video, Polsat, Movistar Plus+, Ziggo Sport, SuperTennis and Sportdeutschland.TV.
- Whether each provider includes all courts, replays, language options and app-device support for the selected tournament.

## Commands run and results

- `npm run typecheck` - passed.
- `npm run lint` - passed with 13 existing warnings unrelated to this change.
- `npm run build` - passed; production build completed and generated all static pages.
