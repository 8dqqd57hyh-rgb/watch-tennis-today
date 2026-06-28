# Enrichment UI/SEO Type Fix

## Issue

Vercel build failed during TypeScript checking in `app/player/[slug]/page.tsx` because `players[canonicalSlug].surfaceStrength` was accessed directly.

The `players` object is typed as a readonly union. Some player entries include `surfaceStrength`, but many entries do not. TypeScript correctly rejected direct property access because the property does not exist on every member of the union.

## Fix

Added a safe helper:

```ts
function getPlayerSurfaceStrength(player: (typeof players)[PlayerSlug] | undefined): string | undefined {
  if (player && "surfaceStrength" in player && typeof player.surfaceStrength === "string") {
    return player.surfaceStrength;
  }

  return undefined;
}
```

Then replaced direct access with:

```ts
surfaceStrength: canonicalSlug ? getPlayerSurfaceStrength(players[canonicalSlug]) : undefined
```

## Files changed

- `app/player/[slug]/page.tsx`
- `ENRICHMENT_UI_SEO_TYPE_FIX_REPORT.md`

## Validation

Local full validation could not be completed in this sandbox because dependencies are not installed (`next: not found`). The fix directly targets the Vercel TypeScript error and keeps the enrichment input safe for players without optional editorial fields.
