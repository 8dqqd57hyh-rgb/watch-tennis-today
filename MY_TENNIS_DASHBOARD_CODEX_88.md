# My Tennis Dashboard — Codex 88

## Added
- New route: `/my-dashboard`
- New client component: `app/my-dashboard/MyDashboardClient.tsx`
- Personal dashboard using the same localStorage key as My Players and My Tournament:
  - live matches
  - next matches
  - recent results
  - attention-first panel
  - quick-add player search
  - starter player cards
  - direct links to match pages and player pages

## Updated
- Header navigation now highlights `My Dashboard`.
- Footer includes `My Tennis Dashboard`.
- Sitemap includes `/my-dashboard`.

## Notes
- No account is required; saved players stay in browser localStorage.
- The dashboard reuses `/api/matches` and refreshes every 60 seconds.
