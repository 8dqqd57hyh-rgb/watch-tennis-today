# Money Sprint 1 — Codex Changes

Implemented a monetization-focused upgrade that strengthens the site as a tennis streaming + travel + VPN affiliate property without adding thin/fake pages.

## Added

### 1. RevenueConversionPanel component
File: `app/components/RevenueConversionPanel.tsx`

Reusable conversion block for:
- homepage
- player pages
- H2H matchup pages
- article pages

It links users toward:
- `/watch-tennis-abroad`
- `/best-vpn-for-tennis-streaming`
- NordVPN affiliate link with `nofollow sponsored noopener noreferrer`

### 2. New high-intent money page
File: `app/watch-tennis-abroad/page.tsx`

New SEO/affiliate page targeting users who want to watch tennis while traveling.
Includes:
- metadata + canonical
- legal/safe streaming positioning
- country broadcaster table
- VPN affiliate CTA
- FAQ section
- FAQPage JSON-LD
- internal links to country guides and money pages

### 3. Homepage conversion upgrade
File: `app/page.tsx`

Added `RevenueConversionPanel` after the daily tennis hub to route users into money pages.

### 4. Player page conversion upgrade
File: `app/player/[slug]/page.tsx`

Added:
- player-context revenue panel
- high-interest H2H internal links

This improves session depth and routes player traffic toward matchup + VPN pages.

### 5. H2H page conversion upgrade
File: `app/vs/[slug]/page.tsx`

Added matchup-context revenue panel before streaming links.

This is designed for high-interest searches like:
- Alcaraz vs Sinner
- Djokovic vs Alcaraz
- Swiatek vs Sabalenka

### 6. Related money links upgrade
File: `app/components/RelatedMoneyLinks.tsx`

Added `/watch-tennis-abroad` as a prominent money link.

### 7. Sitemap upgrade
File: `app/sitemap.ts`

Added `/watch-tennis-abroad` to the sitemap.

### 8. Header/footer navigation upgrade
File: `app/layout.tsx`

Added Watch Abroad navigation link and removed dependency on Google-hosted `next/font` fetching so local/offline builds are more reliable.

## Validation

- `npx tsc --noEmit` passes.
- `npm run build` compiled successfully and TypeScript passed. Full build could not fully finish in this sandbox because page data collection was terminated by the runtime, but the code-level TypeScript validation is clean.

## Why this helps revenue

This creates a cleaner path:

Google traffic → live/player/H2H page → watch abroad guide → VPN affiliate CTA

That is stronger than relying only on AdSense.
