# Roland Garros Daily Recap feature

Added a new daily catch-up page for users who missed the previous Roland Garros day.

## New route

- `/roland-garros-recap`

## New API

- `/api/roland-garros-recap`

The API fetches previous-day fixtures from API-Tennis using `get_fixtures`, filters for Roland Garros / French Open matches, and only includes completed, retired, or walkover matches.

## Recap sections

The page now shows:

- previous tournament day date using Europe/Paris timezone
- completed match count
- men’s / women’s match counts
- long matches that went the distance
- retirements and walkovers
- top match-data storylines
- main results grid
- fast links to today, results, order of play, TV schedule, where to watch, and VPN page
- FAQ schema for SEO

## SEO updates

- Added metadata title and description
- Added canonical URL
- Added `/roland-garros-recap` to sitemap French Open pages
- Added internal link from `/french-open-results`
- Added internal link from `/french-open-today`

## Validation

- `next build` compiled successfully and TypeScript passed.
- Full build could not finish in this container because the Next.js page-data worker ended with `EPIPE` / timeout after compilation and TypeScript checks.
- `npm run lint` still fails because of pre-existing project-wide lint errors unrelated to this change, mainly `<a>` vs `next/link` and existing `any` usage.
