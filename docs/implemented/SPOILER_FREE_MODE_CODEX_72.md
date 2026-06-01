# Spoiler-Free Mode — Codex 72

## Added
- New reusable component: `app/components/SpoilerFreeScoreToggle.tsx`
- New SEO/support page: `/tennis-spoiler-free-scores`
- Added `/tennis-spoiler-free-scores` to sitemap

## Improved
- `/today` now has a spoiler-free toggle above the featured match.
- The preference is saved in `localStorage`.
- Featured match score and match-card scores are hidden when spoiler-free mode is enabled.

## Why
This improves retention for tennis fans who missed matches and want to check schedules/watch links without accidentally seeing results.

## Validation
- `npx tsc --noEmit --pretty false` passed.
- `npm run build` compiled successfully but the sandbox timed out while Next.js continued the TypeScript/build pipeline.
- `npm run lint` still reports pre-existing project-wide lint issues, mostly internal `<a>` links and existing `any` usages. The new component was adjusted to avoid the new React hook lint error.
