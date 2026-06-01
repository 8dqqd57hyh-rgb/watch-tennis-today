# Live match score updates

Implemented client-side live score updates on match pages without reloading the page.

## Changed files

- `app/watch/[slug]/LiveMatchScore.tsx`
  - New client component for the score card.
  - Polls the current match every 30 seconds.
  - Updates score, status, start time, match phase and update timestamp in place.
  - Stops polling when the match reaches a final/cancelled/retired/completed status.
  - Shows a soft warning if live updates are temporarily unavailable.

- `app/watch/[slug]/page.tsx`
  - Replaced the static hero score card with `LiveMatchScore`.
  - Kept the rest of the page server-rendered for SEO and metadata stability.

- `app/api/matches/route.ts`
  - Added optional `matchId` query parameter.
  - `/api/matches?matchId=123` now returns the requested match directly, including finished statuses when available.
  - This makes client polling cheaper and allows the score card to show final status before stopping updates.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `next build` compiled successfully, but the sandbox command timed out during the later TypeScript/build reporting stage. A direct TypeScript check passed after that.
- `npm run lint` still fails because of pre-existing lint issues across the project, mainly internal `<a>` links and existing `any` usage. The new feature did not introduce TypeScript errors.
