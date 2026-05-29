# Codex 83 — AdSense Slot Readiness

## What changed

Improved the existing `AdSlot` component instead of creating new pages or adding aggressive ad UX.

### Before

`app/components/AdSlot.tsx` returned `null`, so pages that imported `<AdSlot />` could not render display ad units.

### After

`AdSlot` now supports non-intrusive inline AdSense placements:

- renders only when an ad slot is configured;
- uses the existing AdSense client id by default;
- supports `NEXT_PUBLIC_ADSENSE_SLOT` as the default slot id;
- supports optional `slot`, `format`, and `className` props;
- pushes `adsbygoogle` safely on the client;
- does not break the page if an ad blocker or AdSense loading issue occurs;
- adds basic tracking attributes for ad-slot visibility/click analytics context.

## Why this is safe

- No popups.
- No sticky ads.
- No layout takeover.
- No new duplicate URLs.
- If `NEXT_PUBLIC_ADSENSE_SLOT` is not set, the component returns `null` like before.

## To enable ads

Add a real AdSense ad unit slot id in Vercel:

```env
NEXT_PUBLIC_ADSENSE_SLOT=your_ad_slot_id_here
```

Optional, if the client id changes:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
```

Then redeploy.

## Pages already using AdSlot

Existing placements include:

- `/watch/[slug]`
- `/compare/[slug]`
- `/matches/live-now`
- `/next-match`
- `/rome-open-final-live`

No extra placements were added in this sprint.
