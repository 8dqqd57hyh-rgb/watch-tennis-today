# Build fix: remove stale predictions route

## Problem
Vercel failed because `app/predictions/[slug]/page.tsx` imported `getServerMatchesForPlayer`, but that export does not exist in `app/lib/serverMatches.ts`.

## Fix
The low-value predictions feature was removed from the cleaned project. This package contains no `app/predictions` route and no references to `/predictions`.

## Verification
- `grep` found no `getServerMatchesForPlayer` imports.
- `npx tsc --noEmit` passed locally.
