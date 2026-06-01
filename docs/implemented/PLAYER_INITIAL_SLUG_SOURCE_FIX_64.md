# Player initial slug source fix 64

## Problem
Production logs still showed generated redirects like:

- `/player/j-de-jong`

This came from abbreviated API player names such as `J. de Jong`. These are real players, but the short initial-based slug is not a good public player URL.

## Changes

- Added canonical lookup aliases for abbreviated player names:
  - `J. de Jong` / `j-de-jong` can resolve to `jesper-de-jong` when the player exists in the canonical database.
- Added observed real players to the canonical player database:
  - Alex Michelsen
  - Jesper de Jong
  - Joao Fonseca
  - Jakub Mensik
- Updated middleware so canonical short slugs redirect to the full canonical player slug instead of `/players`.
- Updated match pages so unknown/unverified players render as plain text instead of fallback player links.

## Result

- `/player/j-de-jong` should redirect to `/player/jesper-de-jong` instead of `/players`.
- Match pages should stop creating player links when the player name cannot be verified.
- Doubles/team fragments remain blocked.
