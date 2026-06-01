# Rivalry Pages - Codex 94

## Added
- New `/rivalries` hub page.
- New dynamic `/rivalries/[slug]` rivalry guide pages.
- Curated rivalry data in `data/rivalries.ts`.
- Homepage rivalry guide block.
- Rivalry URLs in sitemap.

## Rivalries included
- Carlos Alcaraz vs Jannik Sinner
- Novak Djokovic vs Carlos Alcaraz
- Novak Djokovic vs Jannik Sinner
- Aryna Sabalenka vs Iga Swiatek
- Iga Swiatek vs Coco Gauff
- Aryna Sabalenka vs Coco Gauff
- Alexander Zverev vs Carlos Alcaraz
- Jannik Sinner vs Daniil Medvedev
- Elena Rybakina vs Aryna Sabalenka

## Why
Rivalry queries are high-intent SEO pages before big matches. They also connect to match pages, player pages, streaming guides and monetization panels.

## Checks
- `npx tsc --noEmit` passed.
- `npx eslint app/rivalries/page.tsx app/rivalries/[slug]/page.tsx data/rivalries.ts app/page.tsx app/player/[slug]/page.tsx` passed with existing warnings only in `app/player/[slug]/page.tsx`.
