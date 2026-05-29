# AdSense ads.txt readiness - Codex 84

## Goal
Make the AdSense setup more production-ready without adding new pages, duplicate content, popups, or sticky ads.

## What changed
- Added `/ads.txt` via `app/ads.txt/route.ts`.
- Centralized AdSense configuration in `app/lib/adsense.ts`.
- Updated `AdSlot` to reuse the centralized publisher ID and default slot.
- Updated `layout.tsx` so the AdSense script also uses the centralized publisher ID.

## Why this helps
AdSense commonly checks `ads.txt` ownership. Having `/ads.txt` ready reduces setup friction once the site is reviewed or approved.

## Environment variables
Optional overrides:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_ADSENSE_SLOT=your_slot_id
```

If no env value is provided, the project uses the existing configured publisher ID.

## URLs to check
- `/ads.txt`
- `/`
- any page where `AdSlot` is rendered
