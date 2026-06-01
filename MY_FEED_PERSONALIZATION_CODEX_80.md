# My Feed personalization upgrade

## What changed

- Removed the generic Roland Garros Tournament Pulse block and route because it duplicated existing live/upcoming/completed modules.
- Removed `/roland-garros-pulse` from the sitemap.
- Upgraded `/my-feed` into a more useful personalized retention page:
  - Personal feed briefing: highlights saved players live, next saved matches, recent saved results, and one big outside match if relevant.
  - Player status board: shows each followed player with live/next/result/quiet state.
  - Big names outside your feed: adds discovery value when saved items are quiet.
- Kept the existing saved matches, tournaments, live, next and recent-results sections.

## Why

A generic pulse page was not adding new value. The improved My Feed gives users a reason to return daily because it is centered on their saved players and matches.

## Validation

- `npx eslint app/my-feed/MyFeedClient.tsx app/french-open-today/page.tsx app/page.tsx app/sitemap.ts`
- `npx tsc --noEmit`
- `npm run build` compiled successfully and reached TypeScript; the local container timeout stopped the process before Next.js finished page-data collection.
