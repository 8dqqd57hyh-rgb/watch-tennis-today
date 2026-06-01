# Match Edge Predictor — Codex 92

## Added
- New reusable `MatchEdgePredictor` component.
- Added a monetizable/SEO-friendly "Who has the edge today?" block to match pages.
- Added the same predictor block to `/vs/[slug]` pages when a direct match is found.
- Added internal links to the full vs hub and spoiler-free scores.

## How it works
The predictor does **not** fake H2H records or betting odds. It uses only available Watch Tennis Today feed signals:
- current tournament appearances
- active/live/upcoming match signals
- completed/result records from the match feed

## Why this helps
- Targets search intent around `player A vs player B prediction` and `who has the edge today`.
- Adds more useful content to match pages without relying on scraped betting odds.
- Creates another click path into `/vs/...` pages.

## Validation
- `npx tsc --noEmit --pretty false` passed.
- `next build` compiled successfully and TypeScript completed; full static page-data collection was terminated by the container timeout/SIGTERM after that stage.
- Targeted ESLint still reports pre-existing page-level warnings/errors related to older `<a>` usage in existing pages, not from the new component.
