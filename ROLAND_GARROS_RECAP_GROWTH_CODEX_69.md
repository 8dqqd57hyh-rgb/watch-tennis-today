# Roland Garros Recap Growth Upgrade — Codex 69

## What already existed

- `/roland-garros-recap` page already existed.
- `/api/roland-garros-recap` already existed and fetched completed Roland Garros fixtures.
- `/tomorrow` and `/tennis-schedule-tomorrow` already existed.
- `/french-open-draw` already existed, but it is mostly a static hub page.

## Changes made

### 1. Upgraded the recap from result cards into a fast daily catch-up page

File: `app/roland-garros-recap/page.tsx`

Added a compact table-style section near the top:

- who advanced
- who was eliminated
- who they may play next
- category and round context

This is better for users who missed the previous day and want the answer in seconds.

### 2. Added next-match retention block

File: `app/roland-garros-recap/page.tsx`

Added a new `Tomorrow’s must-watch Roland Garros matches` section that points users from yesterday’s recap into the next viewing session.

This supports the daily loop:

- yesterday recap
- today matches
- tomorrow schedule

### 3. Exposed upcoming Roland Garros matches from the recap API

File: `app/api/roland-garros-recap/route.ts`

The API now returns:

```ts
upcomingMatches: upcomingMatches.slice(0, 12)
```

The page uses this to populate the next-match section.

### 4. Added one more stat card

File: `app/roland-garros-recap/page.tsx`

Added `Next matches` to the recap stats area.

### 5. Fixed a duplicated grid wrapper bug on tomorrow schedule

File: `app/tomorrow/TomorrowClient.tsx`

There was a duplicated nested grid:

```tsx
<div className="grid ...">
<div className="grid ...">
```

It is now one clean grid.

### 6. Cleaned touched-file lint issues

File: `app/tomorrow/TomorrowClient.tsx`

Changed two internal navigation links from `<a>` to Next `<Link>`:

- back to homepage
- compare services card

## Validation

Targeted ESLint passed for changed files:

```bash
npx eslint app/roland-garros-recap/page.tsx app/api/roland-garros-recap/route.ts app/tomorrow/TomorrowClient.tsx
```

TypeScript passed:

```bash
npx tsc --noEmit
```

Full project lint still has many pre-existing errors in unrelated files, mostly Next.js `<a>` vs `<Link>` warnings and `any` usage.

Full `next build` compiled and finished TypeScript, but the command timed out during page data collection in this environment.
