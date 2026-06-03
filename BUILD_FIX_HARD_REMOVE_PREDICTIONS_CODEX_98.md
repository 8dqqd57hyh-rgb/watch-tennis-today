# Build Fix: Hard remove stale predictions route

Vercel was still compiling `app/predictions/[slug]/page.tsx`, which means the stale route still exists in the deployed GitHub repository.

This package contains two protections:

1. The `app/predictions` route is physically absent.
2. `app/lib/serverMatches.ts` now exports a compatibility helper `getServerMatchesForPlayer()` so a stale predictions page cannot break the build if it still exists in GitHub during cleanup.

After applying this package, also make sure GitHub deletes:

```bash
rm -rf app/predictions
```

