# Click Analytics Quality Upgrade — Codex 82

## Goal
Make the existing click analytics useful for revenue and retention decisions without adding new pages, popups, sticky banners, or duplicate content.

## What changed

### 1. Better analytics payloads
Updated `app/components/ClickAnalytics.tsx` to capture:

- `link_id`
- `link_area`
- `link_category`
- `link_position`
- `destination_type`
- `from_path`
- `href`
- `link_text`

Events still go to both:

- Vercel Analytics
- Google Analytics via `gtag`

### 2. Data attributes support
Links can now define:

- `data-track-area`
- `data-track-category`
- `data-track-id`
- `data-track-position`
- `data-track-ignore="true"`

The tracker also inherits tracking values from parent elements, so whole sections can be labelled without repeating every attribute.

### 3. Revenue CTA tagging
Added tracking metadata to the most important reusable money/retention components:

- `RevenueConversionPanel`
- `VpnPromo`
- `RelatedMoneyLinks`
- `AffiliateBar`
- `StickyAffiliateBar` if it is ever used again

## Why this helps
You can now see not only that a click happened, but which module caused it:

- revenue panel
- VPN promo
- related money links
- related player link
- country guide link
- comparison link
- affiliate CTA

This makes future optimization data-driven instead of guess-based.

## No UX changes
No popups, no sticky banners added, no visual layout changes.

## Validation
`npx tsc --noEmit --pretty false` passed locally in the container.

`npm run build` started but did not finish within the container timeout. No TypeScript errors were found.
