# Cypress Test Architecture

This Cypress suite is organized as a maintainable QA automation project. It complements the existing Playwright tests and does not replace them.

## Folder Structure

- `cypress/e2e/smoke` - fast checks for the homepage and stable key pages.
- `cypress/e2e/api` - route health and API contract smoke checks.
- `cypress/e2e/seo` - metadata, robots and sitemap coverage.
- `cypress/e2e/accessibility` - axe checks for critical and serious issues.
- `cypress/e2e/journeys` - user flows across navigation, live tennis and players.
- `cypress/e2e/mocked` - deterministic network, empty, error and malformed-response scenarios.
- `cypress/component` - focused component tests for reusable UI.
- `cypress/fixtures` - stable match and player data used by intercepted tests.
- `cypress/support/commands.ts` - documented custom Cypress commands.
- `cypress/support/helpers.ts` - shared route and console-error helpers.
- `cypress/support/assertions.ts` - reusable assertions such as SEO metadata checks.

## Run Locally

```bash
npm run cy:run
npm run cy:open
npm run cy:run:component
npm run cy:run:all
```

The e2e runner starts the local Next.js dev server when `http://localhost:3000` is not already available. Override the target with:

```bash
CYPRESS_BASE_URL=http://localhost:3001 npm run cy:run
```

## Tagged Runs

Tests use `@cypress/grep` tags so CI and local debugging can run only the required subset. The scripts pass `--expose grepTags=...` and the config enables spec pre-filtering.

```bash
npm run cy:run:smoke
npm run cy:run:seo
npm run cy:run:critical
npm run cy:run:api
npm run cy:run:journey
npm run cy:run:accessibility
```

## Custom Commands

- `cy.visitHome()` and `cy.visitLiveTennis()` visit core routes and assert the app shell is ready.
- `cy.mockMatches()` and `cy.mockPlayers()` centralize API intercept setup.
- `cy.waitForAppReady()` avoids arbitrary waits by checking the rendered app shell.
- `cy.checkSeoMeta()` validates title, description and canonical metadata.
- `cy.checkNoConsoleErrors()` fails on unexpected `console.error` while allowing known third-party exclusions.
- `cy.getByTestId()` keeps selectors stable and independent from CSS.

## Component Tests

Component tests are configured through Cypress Component Testing for Next.js. Current coverage focuses on reusable UI and stateful behavior:

- `HomepageMatchExplorer` - loading, populated, empty and network-error states.
- `EmailCapture` - rendering, validation, successful submit and failed submit.
- `TennisNavigationHub` - default props, custom props and duplicate-link handling.

## Network And Negative Testing

The mocked network suite uses `cy.intercept()` for deterministic responses:

- successful match response
- empty response
- delayed response
- HTTP 500 fallback
- forced network error
- malformed JSON

Assertions check user-facing recovery UI and avoid fixed sleeps.

## Reporting

Cypress writes both machine-readable and human-readable reports:

- JUnit XML: `cypress/reports/junit`
- Mochawesome JSON: `cypress/reports/mochawesome`
- Mochawesome HTML: `cypress/reports/html`

Generate the merged HTML report after a run:

```bash
npm run cy:report
```

## CI Workflow

GitHub Actions installs dependencies with npm cache, caches the Cypress binary, runs lint, typecheck, production build, Cypress e2e, Cypress component tests, then uploads screenshots, videos, JUnit reports and mochawesome reports.
