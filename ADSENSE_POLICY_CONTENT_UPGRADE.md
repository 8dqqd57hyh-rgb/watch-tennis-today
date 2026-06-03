# AdSense policy/content upgrade

Changes made to reduce the main AdSense rejection risks described in Google's account-review help page:

- Expanded `/guides` to 23 evergreen tennis guides with longer original text.
- Fixed `/guides/[slug]` dynamic route for Next 16 async params.
- Added Article and FAQ structured data to guide pages.
- Added stronger About-page transparency: editorial standards, data/value explanation, no-streaming statement.
- Removed personal dashboard links from the main site navigation/footer.
- Replaced visible high-risk VPN affiliate CTAs in shared components with internal safe-viewing guide links.
- Added robots disallow entries for thin/private/risky promo routes.
- Kept legal pages available from the footer: About, Contact, Privacy, Terms, Disclaimer, Affiliate Disclosure, Editorial Policy, Author, How We Source Data.

Manual checks after deploy:

1. Open `/guides` and at least these pages:
   - `/guides/tennis-live-scores-guide`
   - `/guides/atp-wta-challenger-itf-explained`
   - `/guides/how-to-watch-tennis-online-legally`
2. Open `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/editorial-policy`.
3. Open `/robots.txt` and `/sitemap.xml`.
4. Run a Vercel production deployment and check that no public nav/footer link returns 404.
5. Re-submit AdSense only after the deployment is live and the new pages are accessible.
