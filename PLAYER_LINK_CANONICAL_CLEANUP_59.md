# Player Link Canonical Cleanup

This patch removes remaining local player slug generation from public UI areas that could create invalid `/player/...` URLs from match-feed strings.

## Changed

- `app/tennis-trending-now/TennisTrendingNowClient.tsx`
  - Removed local `playerSlug()` helper.
  - Added `safePlayerUrl()` from `data/playerSlugs.ts`.
  - Trending player links now render only if the player exists in the canonical player database.

- `app/players/page.tsx`
- `app/players/atp/page.tsx`
- `app/players/wta/page.tsx`
  - Removed local slug generation.
  - Player directory links now use canonical `safePlayerUrl()`.

## Why

Invalid URLs such as `/player/sach`, `/player/kittay-ram`, `/player/bouzas-maneiro-cocciaretto`, and `/player/kempen-klepac` damage SEO quality because they look like fake player pages.

After this patch, public `/player/...` links should only be emitted for validated canonical players.

## Validation

- `npx tsc --noEmit` passes.
- `npm run build` compiles and passes TypeScript. The sandbox timed out during page-data collection, not during code compilation/type checking.
