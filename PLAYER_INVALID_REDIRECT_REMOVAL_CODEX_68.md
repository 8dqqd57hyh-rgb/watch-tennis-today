# Player Invalid Redirect Removal — Codex 68

## Problem

Invalid or unverified player URLs such as `/player/a-nguyen` were being permanently redirected to `/players` by middleware.

That created noisy 308 redirects in production logs and could be misleading for crawlers, especially when the slug may refer to a real player that is not yet in the canonical player database.

## Change

- Removed the `/player/<bad-slug> -> /players` middleware redirect.
- Kept canonical alias redirects for known players, for example `/player/j-fonseca -> /player/joao-fonseca`.
- Kept nested old-link repair for paths such as `/player/name/fragment`.
- Let `/player/[slug]` handle invalid slugs with `notFound()` instead of a permanent redirect.

## Expected Result

- `/player/a-nguyen` should no longer return `308 -> /players`.
- Known aliases still canonicalize correctly.
- Bad/unverified player URLs should resolve as proper 404/noindex pages instead of permanent redirects.
