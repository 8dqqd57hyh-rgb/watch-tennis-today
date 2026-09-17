<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Playwright production safety

Never run the full Playwright suite against `watchtennistoday.com` or
`www.watchtennistoday.com`. Run regression tests locally or against a non-production
preview. Production validation must use only `npm run test:e2e:prod-smoke`; never set
`TEST_BASE_URL` to production for a normal Playwright command.
