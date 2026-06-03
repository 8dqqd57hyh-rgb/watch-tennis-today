# AdSense 81904 compliance upgrade notes

Applied changes for the current review package:

- Removed `/privacy-policy` from robots.txt disallow rules so Google can freely reach privacy/legal information.
- Rebuilt the About page with clearer ownership, editorial, data-source, advertising and legal-viewing transparency.
- Added detailed player editorial profile sections for major ATP/WTA players to reduce the risk that player pages look like API-only pages.
- Added additional unique guide articles covering walkovers, surfaces, order of play, draws, country TV rights, spoiler-free watching, qualifying and seeds/rankings.
- Preserved legal streaming language and avoided claiming that the site hosts streams.

Manual checks after deployment:

1. `/robots.txt` should allow `/privacy` and should not block `/privacy-policy`.
2. `/about`, `/privacy`, `/contact`, `/guides`, and `/guides/how-tennis-walkovers-and-retirements-work` should return 200.
3. `/player/carlos-alcaraz`, `/player/jannik-sinner`, `/player/novak-djokovic`, `/player/iga-swiatek`, and `/player/aryna-sabalenka` should show the new biography/style/context section.
4. Check Vercel build logs for TypeScript errors before resubmitting to AdSense.
