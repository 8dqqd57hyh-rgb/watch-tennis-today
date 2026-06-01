# Cleanup + Homepage UX Sprint (Codex 67)

## Changed

- Removed the unused duplicate component `app/components/AffiliateBar.tsx`.
- Kept `app/components/StickyAffiliateBar.tsx` as the single sticky affiliate CTA component.
- Simplified the header navigation to focus on core user intents: live tennis, matches today, TV schedule, players, Grand Slams and where-to-watch lookup.
- Rebuilt the footer into grouped sections instead of one long flat link list.
- Kept monetization links present, but moved them into cleaner guide/footer sections to reduce navigation clutter.

## Why

The project had grown a lot of revenue and SEO links across many sprints. This cleanup reduces duplicate UI, improves UX clarity, and keeps important pages accessible without making the header/footer feel spammy.

## Notes

No player URL generation was added in this sprint.
