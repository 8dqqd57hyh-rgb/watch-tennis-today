# Codex 75 — Tennis Watchlist Hub

Added a retention-focused Tennis Watchlist experience.

## What changed

- Added `app/components/TennisWatchlistHub.tsx`
  - Ranks matches by watch score.
  - Boosts live matches, saved players, Grand Slams, ATP/WTA matches, late rounds and star players.
  - Reads saved players from the existing `watchTennisToday.followedPlayers` localStorage key.
  - Links users into match pages, My Tournament and Players.

- Added homepage placement below French Open survivors.

- Added SEO explainer page:
  - `/tennis-watchlist-today`

- Added footer link and sitemap entry.

## Why it matters

This makes the site more product-like: users get a quick answer to “what should I watch today?” and have a reason to save players and return daily.
