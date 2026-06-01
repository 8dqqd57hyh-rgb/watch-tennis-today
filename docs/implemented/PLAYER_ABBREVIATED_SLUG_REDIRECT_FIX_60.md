# Player abbreviated slug redirect fix

## Problem

Vercel logs still showed invalid player requests such as:

- `/player/m.-cecchinato`
- doubles/team slugs like `/player/kumar-poling`

These are generated from API display names or doubles teams and should not become indexable player pages or SEO 404 noise.

## Fix

- Added a hard middleware safety net for `/player/*` routes.
- Only canonical player slugs from `data/players.ts` are allowed to resolve.
- Unknown, abbreviated, doubles/team or malformed player slugs redirect to `/players` with `308`.
- Added initial-only name detection such as `M. Cecchinato` in `data/playerSlugs.ts`.
- Validated player subscription API input against the canonical player database.

## Expected result

Bad URLs like `/player/m.-cecchinato`, `/player/detiuc-khromacheva`, `/player/arribage-olivetti`, `/player/kumar-poling` should redirect to `/players` instead of returning `404`.

Valid URLs like `/player/jannik-sinner`, `/player/carlos-alcaraz`, `/player/novak-djokovic` continue to work.
