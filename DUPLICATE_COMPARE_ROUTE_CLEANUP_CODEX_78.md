# Duplicate Compare Route Cleanup — Codex 78

## Goal
Avoid duplicate comparison implementations and keep monetizable comparison pages maintainable.

## What changed
- Removed the hardcoded static route:
  - `app/compare/tennis-tv-vs-espn/page.tsx`
- The existing dynamic route now handles the same URL:
  - `app/compare/[slug]/page.tsx`
- The `tennis-tv-vs-espn` content already exists in:
  - `data/comparisons.ts`

## Why this is better
- Prevents two separate implementations for the same comparison intent.
- Reduces risk of outdated copy, inconsistent CTAs, and schema drift.
- Keeps future comparison improvements centralized in one template.
- Does not create any new URLs or duplicate content.

## Check after deploy
- `/compare/tennis-tv-vs-espn`
- `/compare`
- `/sitemap.xml`
