# Monetization + Authority Upgrade — Glossary / Start Here / Surfaces

## Goal
Improve Watch Tennis Today as a monetizable tennis resource without adding thin programmatic pages.

This sprint focused on evergreen user-help pages that improve:

- beginner usefulness
- E-E-A-T signals
- internal linking
- topical coverage
- AdSense perceived content quality
- return-user pathways

## Added pages

### `/start-here`
A new onboarding hub for new tennis fans.

Purpose:
- gives first-time readers a clear path through the site
- connects match intent, education, players and legal streaming
- reduces bounce from users who do not yet know where to click

Includes:
- structured new-fan journey
- links to live tennis, scoring, glossary, tournaments, players and legal streaming
- WebPage + ItemList schema
- Breadcrumb schema

### `/tennis-glossary`
A beginner-friendly tennis glossary.

Purpose:
- strengthens evergreen tennis knowledge coverage
- adds non-thin explanatory content
- supports many informational long-tail searches
- gives Google a clear expert resource rather than only match/listing pages

Includes:
- scoring terms
- rankings terms
- tournament/draw terms
- surface terms
- streaming terms
- DefinedTermSet schema
- Breadcrumb schema

### `/tennis-court-surfaces`
A tactical guide to clay, grass and hard courts.

Purpose:
- adds educational tennis analysis content
- supports player/tournament context
- improves internal link depth from calendar, tournament and analysis pages

Includes:
- clay court explanation
- grass court explanation
- hard court explanation
- match-day interpretation advice
- Article schema
- Breadcrumb schema

## Updated existing pages

### `app/layout.tsx`
Added navigation/footer links for:
- Start Here
- Tennis Glossary
- Court Surfaces

### `app/tennis-resources/page.tsx`
Added the new pages to the main resources hub.

### `app/tennis-guides/page.tsx`
Added the new pages to the guides hub and connected the court-surface guide to tournament-level context.

### `app/sitemap.ts`
Added indexable sitemap entries for:
- `/start-here`
- `/tennis-glossary`
- `/tennis-court-surfaces`

## Validation

Targeted ESLint passed for changed files:

```bash
npx eslint app/tennis-glossary/page.tsx app/start-here/page.tsx app/tennis-court-surfaces/page.tsx app/tennis-resources/page.tsx app/tennis-guides/page.tsx app/layout.tsx app/sitemap.ts
```

Build result:

```bash
npm run build
```

- production compilation completed successfully
- build timed out during Next.js page-data collection in the local environment, consistent with previous project runs

## Changed files

- `app/start-here/page.tsx`
- `app/tennis-glossary/page.tsx`
- `app/tennis-court-surfaces/page.tsx`
- `app/layout.tsx`
- `app/tennis-resources/page.tsx`
- `app/tennis-guides/page.tsx`
- `app/sitemap.ts`
- `MONETIZATION_AUTHORITY_GLOSSARY_STARTER_CODEX_107.md`
