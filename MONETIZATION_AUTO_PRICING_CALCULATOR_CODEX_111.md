# Monetization Upgrade: Auto-Priced Streaming Cost Calculator

## What changed

Updated `/tennis-streaming-cost-calculator` so users no longer need to manually type every price.

The calculator now includes:

- service dropdowns for each cost category;
- automatic price prefilling when a service is selected;
- service-specific coverage notes;
- service-specific price disclaimers;
- custom editable options for unsupported/local services;
- selected-services summary in the estimate panel;
- USD-normalized total for easier comparison;
- clearer copy explaining that prices are estimates and should be verified at checkout.

## Why this is better

The previous version asked users to enter costs manually, which made the page feel less helpful. The new version behaves more like a real planning tool:

1. Pick a service.
2. See the estimated price automatically.
3. Compare monthly, seasonal and yearly cost.
4. Use custom mode only when needed.

This should improve perceived quality, engagement and reader trust.

## Important policy note

The copy intentionally keeps the page legal-first. It does not encourage piracy, illegal streams or bypassing sports rights restrictions. VPN wording is framed as travel/privacy support only.

## Validation

- `npm run typecheck` passes.
- `npm run lint` passes with the same existing warnings already present elsewhere in the project.

## Files changed

- `app/tennis-streaming-cost-calculator/StreamingCostCalculatorClient.tsx`
- `MONETIZATION_AUTO_PRICING_CALCULATOR_CODEX_111.md`
