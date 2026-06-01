# Path to the Title — Codex 76

## What changed

Added a new `Path to the Title` section to match-focused pages.

### New component

- `app/components/PathToTitle.tsx`

### Pages updated

- `app/watch/[slug]/page.tsx`
- `app/vs/[slug]/page.tsx`

## Product behavior

The section shows each player's tournament route using only data available in the current match feed:

- completed wins from the same tournament
- the current listed match
- confirmed future matches when available
- otherwise future rounds as `Opponent TBA`

No fake opponents, fake probabilities, or fake bracket predictions are generated.

## Why this is useful

This gives match pages a stronger editorial/SEO layer around queries like:

- player path to final
- player road to title
- tournament draw path
- match preview

## Validation note

`npx tsc --noEmit` could not complete in this ZIP environment because dependencies / React types are not installed in the extracted archive. The command fails globally with missing `react/jsx-runtime`, `next`, and JSX type errors before project-specific validation can run.
