# Non-intrusive Email Signup Codex 70

## What I checked first

The project already had email/alert functionality, so I did not add a new popup or aggressive signup flow.

Existing pieces found:

- `app/components/EmailSignup.tsx`
- `app/components/PlayerSubscribeBox.tsx`
- `app/newsletter/page.tsx`
- `app/tennis-live-alerts/page.tsx`
- inline signup block on `app/page.tsx`
- inline signup block on `app/watch/[slug]/page.tsx`
- `app/api/subscribe-player/route.ts`
- `app/api/send-player-alerts/route.ts`

## What changed

### 1. Reworked `EmailSignup` into a reusable soft signup component

File:

- `app/components/EmailSignup.tsx`

The component now supports:

- custom title
- custom description
- source tracking
- context tracking
- custom CTA label
- dark/light styling
- compact mode

It also clearly says:

- no popups
- no auto-subscribe
- no illegal streams
- unsubscribe anytime

### 2. Removed duplicate hardcoded signup forms

Replaced duplicated Formspree forms with the shared `EmailSignup` component in:

- `app/page.tsx`
- `app/watch/[slug]/page.tsx`
- `app/tennis-live-alerts/page.tsx`
- `app/newsletter/page.tsx`

This keeps the UX consistent and prevents the project from becoming annoying.

### 3. Improved player subscription UX

File:

- `app/components/PlayerSubscribeBox.tsx`

Changes:

- clearer non-spam wording
- better layout
- basic email normalization before submit
- softer success message
- explicit unsubscribe reassurance

## UX principle

No modal, no sticky banner, no forced signup gate.

The signup appears only as an inline contextual block, so users can ignore it and continue reading the site normally.
