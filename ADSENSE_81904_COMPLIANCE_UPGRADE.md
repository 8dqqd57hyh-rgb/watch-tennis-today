# AdSense 81904 Compliance Upgrade

Updated against the common AdSense account review failure areas listed in Google Help article 81904:

- insufficient content
- content quality problems
- content-policy risk
- navigation problems
- traffic-source concerns
- unsupported language

## Changes made

1. Rebuilt `/guides` content
   - 31 guide articles in `app/guides/articles.ts`
   - unique titles, intros, sections and FAQ content
   - removed repeated template-like article bodies
   - added coverage for scoring, live scores, schedules, Grand Slams, rankings, broadcasters, safe legal viewing and player-following topics

2. Strengthened player pages
   - added an editorial player guide block to `app/player/[slug]/page.tsx`
   - explains match context, legal viewing checks, schedule caution and data transparency
   - reduces the risk that player pages look like raw API output only

3. Reduced risky monetization signals
   - changed `RevenueConversionPanel` to use internal editorial guide links instead of direct affiliate/VPN CTA links
   - kept legal streaming and broadcaster verification language

4. Improved navigation quality
   - removed `My Players` from primary navigation and footer because it is a personal/local-storage feature and not a strong AdSense review page
   - personal pages remain available but are not highlighted as core editorial content

5. Kept transparency pages
   - About, Contact, Privacy, Terms, Disclaimer, Affiliate Disclosure, Editorial Policy, How We Source Data and How We Verify Streams remain available through footer/navigation.

## Manual checks after deploy

- Open `/guides` and at least 10 guide URLs.
- Confirm every guide is unique, not repeated template text.
- Open `/player/carlos-alcaraz`, `/player/jannik-sinner`, `/player/novak-djokovic`.
- Open `/privacy`, `/about`, `/contact`, `/terms`, `/disclaimer`, `/editorial-policy`.
- Open `/sitemap.xml` and `/robots.txt`.
- Check Vercel build logs for 404/500 errors.
- Do not resubmit to AdSense until the production build is clean and the new pages are reachable.
