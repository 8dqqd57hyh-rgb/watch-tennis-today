# Project documentation

This folder keeps implementation notes, previous Codex change summaries, growth ideas, and fixes out of the project root.

## Structure

- `implemented/` — historical implementation notes and sprint/fix summaries.

Keep root clean for app source, config, and deployment files only.

## Validation

- `npm run typecheck` runs `tsc --noEmit` so production builds do not rely on suppressed TypeScript errors.
