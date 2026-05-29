# Money Sprint 5 — Tennis Live Alerts

## Added

- New email capture page: `/tennis-live-alerts`
- SEO metadata and canonical URL
- FAQPage JSON-LD schema
- Article JSON-LD schema
- Formspree signup flow with source tracking
- Internal links to Best Matches Today, Broadcast Finder and Watch Tennis Abroad
- Revenue conversion panel on the alerts page

## Updated

- Added Alerts link to the header on extra-wide screens
- Added Tennis Alerts link to the footer
- Added homepage CTA block to convert daily visitors into returning visitors
- Added `/tennis-live-alerts` to sitemap and live page freshness list

## Why

This creates a retention layer for the site. Instead of relying only on one-off search traffic, users can subscribe for match schedule reminders, TV checks and Grand Slam viewing updates.

## Validation

- `npx tsc --noEmit` passes
- `npm run build` compiled and passed TypeScript; full page-data collection hit the sandbox timeout after compile/TS, not a code error
