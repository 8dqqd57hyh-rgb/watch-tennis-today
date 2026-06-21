# Monetization upgrade 111 — Streaming Service Picker

## Goal
Make the site more useful and competitive by adding an interactive tool that helps users choose a legal tennis streaming setup before paying for a subscription.

## Added
- New route: `/tennis-streaming-service-picker`
- Client-side interactive selector with:
  - country/region selection
  - watching goal selection
  - budget style selection
  - recommended next steps
  - legal-first broadcaster guidance
- Structured data:
  - `FAQPage`
  - `SoftwareApplication`
  - `Article`
- Internal links to:
  - `/tennis-streaming-cost-calculator`
  - `/tennis-streaming-checklist`
  - `/tennis-tv-broadcast-finder`
  - region-specific watch guides

## Updated
- `app/layout.tsx`
  - added the picker to More navigation and footer guide links
- `app/sitemap.ts`
  - added `/tennis-streaming-service-picker`
- `app/guides/page.tsx`
  - added the picker to core guide links
- `app/tennis-guides/page.tsx`
  - added the picker card
- `app/tennis-streaming-services/page.tsx`
  - added CTA to the picker
- `app/tennis-streaming-cost-calculator/page.tsx`
  - added CTA to choose a service first

## Validation
- `npm run typecheck` passed.
- `npm run lint` passed with existing warnings only.
- `npm run build` started production compilation, but the sandbox timed out during the optimized build step.

## Why this helps
This page is more useful than a plain article because it gives users a decision flow. It also strengthens internal linking between streaming money-pages, improves user retention, and keeps the site aligned with legal/official streaming guidance for AdSense safety.
