# Money Sprint 3 — Broadcast Finder Conversion Layer

## What changed

Added a new high-intent country broadcast discovery layer focused on users searching for where to watch tennis by country.

## New files

- `data/broadcastFinder.ts`
  - Country-based broadcaster data for Poland, USA, UK, Germany, France, Canada, Australia and India.
  - Separates primary viewing options, Grand Slam options, ATP options, WTA options and official verification directories.

- `app/components/BroadcastFinder.tsx`
  - Interactive country selector.
  - Links users to country guides, official broadcaster sources and the travel/VPN monetization path.

- `app/tennis-tv-broadcast-finder/page.tsx`
  - New SEO landing page targeting country-based broadcast discovery queries.
  - Includes FAQ schema, internal links to country pages, travel viewing CTA and official-source explanation.

## Updated files

- `app/page.tsx`
  - Added Broadcast Finder module to homepage after Best Matches Today.

- `app/layout.tsx`
  - Added Broadcast Finder to header and footer navigation.

- `app/sitemap.ts`
  - Added `/tennis-tv-broadcast-finder` to sitemap with live/daily priority.

## Why this matters

This improves the path:

Google search → daily tennis page → broadcaster finder → country guide → watch abroad / VPN guide

That is stronger for both SEO and affiliate conversion than sending users only to generic schedule pages.
