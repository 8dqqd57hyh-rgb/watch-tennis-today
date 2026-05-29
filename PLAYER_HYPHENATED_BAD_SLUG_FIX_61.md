# Player hyphenated bad slug fix

## Problem
Production logs still showed non-canonical `/player/...` pages for match fragments and doubles teams:

- `/player/bennani-lopez-morillo`
- `/player/moutet-van-assche`
- `/player/berkieta-nagoudi`
- `/player/siegemund-zvonareva`

Some returned `200` because the previous middleware safety net only caught limited two-part patterns.

## Fix
`data/playerSlugs.ts` now treats any **non-canonical hyphenated player slug** as clearly invalid.

This keeps valid canonical pages working, for example:

- `/player/jannik-sinner`
- `/player/carlos-alcaraz`
- `/player/novak-djokovic`

It also preserves real unknown single-surname players, for example:

- `/player/ngounoue`
- `/player/cecchinato`

But redirects bad match/team fragments to `/players`:

- `/player/detiuc-khromacheva`
- `/player/moutet-van-assche`
- `/player/bennani-lopez-morillo`

## Why
This reduces low-quality generated player pages while avoiding the previous overly aggressive behavior that redirected legitimate single-surname players.
