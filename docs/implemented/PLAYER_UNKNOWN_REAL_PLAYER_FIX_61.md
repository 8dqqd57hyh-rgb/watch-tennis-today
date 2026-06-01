# Player Unknown Real Player Fix

## Problem
The previous middleware safety net redirected every `/player/...` slug that was not present in the canonical player list.

That cleaned bad generated URLs, but it was too aggressive for real players that are not yet in the local canonical database, such as `/player/ngounoue`.

## Fix
- Middleware now redirects only clearly invalid player URLs:
  - abbreviated API names like `/player/m.-cecchinato`
  - doubles/team fragments like `/player/detiuc-khromacheva`
  - nested bad player paths
- Unknown single-player surname pages can now resolve instead of being redirected.
- `/player/ngounoue` is allowed and renders a generic player schedule page.
- Canonical players still use the canonical slug and full player metadata.

## Validation
- `npx tsc --noEmit` passes.
- `npm run build` compiles and passes TypeScript; sandbox times out during page data collection.
