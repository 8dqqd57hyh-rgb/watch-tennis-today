# Money Sprint 28 — SEO Prediction Pages

Added a prediction-focused SEO growth layer for ATP/WTA singles matches.

## Added

- `/predictions` index page with prediction-ready current ATP/WTA singles matches.
- `/predictions/[slug]` dynamic prediction preview pages.
- Prediction page includes:
  - match metadata and canonical URL
  - tournament/category/status/start time cards
  - data-led prediction lean with confidence label
  - key signal comparison table
  - recent feed form sections for both players
  - live match page CTA
  - matchup hub CTA
  - email signup block
  - ad slot
  - SportsEvent JSON-LD
  - breadcrumb schema
  - editorial quality notice

## Updated

- MatchEdgePredictor now links users to the new prediction preview page first.
- Sitemap now includes `/predictions` and dynamic prediction URLs when dynamic matches are enabled in the sitemap feed.

## Validation

- `npx tsc --noEmit` passes.
- `npm run lint` still fails because of pre-existing lint issues in older files, mainly `<a>` vs `<Link />` and existing `any` usage.
- `npm run build` compiles successfully, then fails during page data collection because required Supabase environment variables are missing locally (`supabaseUrl is required` for `/api/subscribe-player`).
