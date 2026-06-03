# AdSense 81904 full content fix

Changes made to reduce AdSense risks described in Google's account review guidance:

- Added reusable editorial tournament and match context helpers in `data/tennisEditorial.ts`.
- Strengthened `/tournament/[slug]` pages with tournament context, surface/format notes, viewing-rights context and fan checklists.
- Strengthened `/watch/[slug]` match pages with an additional editorial preview block that explains match context, schedule caveats and tournament conditions.
- Fixed duplicate `description` key in tournament metadata.

Goal: reduce the chance that player, tournament and match pages look like thin API-only pages. The site should now provide more complete text, practical fan guidance and clearer legal viewing context.

Manual checks after deploy:

1. `/tournament/roland-garros`
2. `/tournament/wimbledon`
3. a random `/tournament/[slug]`
4. a random `/watch/[slug]`
5. `/player/carlos-alcaraz`
6. `/about`
7. `/privacy`
8. `/guides`
9. `/sitemap.xml`
10. `/robots.txt`
