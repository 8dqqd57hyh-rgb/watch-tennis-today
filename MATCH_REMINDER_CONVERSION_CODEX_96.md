# Match Reminder Conversion Upgrade

## What was already present

The project already had the high-value SEO areas that were suggested earlier:

- Tournament hubs: `/tournament/[slug]`, French Open pages, Wimbledon pages.
- Rivalry pages: `/rivalries` and `/rivalries/[slug]`.
- Today/schedule pages: `/today`, `/tennis-schedule-today`, `/tennis-order-of-play-today`, `/tennis-results-today`, `/tennis-schedule-tomorrow`.
- Match pages: `/watch/[slug]` with related links, country viewing guides, ads and an email signup.
- Newsletter/player alert infrastructure: `EmailSignup`, player subscribe components and alert APIs.

So the next improvement should not create another duplicate hub. The best next step is to improve conversion on existing match pages.

## What changed

Added a new conversion-focused component:

- `app/components/MatchReminderPanel.tsx`

Integrated it into:

- `app/watch/[slug]/page.tsx`

## Why this is better for monetization

Every match page now has a clearer action near the top:

- Add the match to calendar
- Save an email reminder intent locally
- Keep users engaged on live/upcoming match pages
- Make the page feel more useful even before real automated email reminders are fully connected

This is safer than fake predictions because it uses real match data already available on the page.

## Notes

The email reminder save currently stores the intent in localStorage. This makes the CTA usable without adding database risk. The next backend step would be to connect it to Supabase/Resend for real reminder emails.
