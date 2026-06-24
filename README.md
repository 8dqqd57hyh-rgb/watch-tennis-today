# Watch Tennis Today

Next.js app for tennis schedules, player pages, live match discovery and legal viewing guides.

## Getting Started

```shell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality Architecture

The project keeps the existing Playwright tests and adds a Cypress suite shaped like a senior QA automation project: reusable commands, deterministic fixtures, component tests, network failure coverage, tagged execution and CI reporting.

### Cypress Layout

- `cypress/e2e/smoke` - homepage and key page smoke checks.
- `cypress/e2e/api` - API route health checks.
- `cypress/e2e/seo` - metadata, robots and sitemap checks.
- `cypress/e2e/accessibility` - axe checks for critical and serious violations.
- `cypress/e2e/journeys` - user flows through discovery, live tennis and players.
- `cypress/e2e/mocked` - intercepted success, empty, delayed and failure responses.
- `cypress/component` - focused component tests for reusable UI.
- `cypress/fixtures` - stable match and player fixtures.
- `cypress/support` - commands, helpers and shared assertions.

### Useful Commands

```shell
npm run lint
npm run typecheck
npm run build
npm run test:e2e
npm run cy:run
npm run cy:run:component
npm run cy:run:all
```

Tagged Cypress subsets:

```shell
npm run cy:run:smoke
npm run cy:run:seo
npm run cy:run:critical
npm run cy:run:api
npm run cy:run:journey
npm run cy:run:accessibility
```

### Custom Commands

The Cypress command layer keeps specs readable and reduces duplicated setup:

- `cy.visitHome()` and `cy.visitLiveTennis()` visit core routes and wait for the app shell.
- `cy.mockMatches()` and `cy.mockPlayers()` centralize API mocking.
- `cy.waitForAppReady()` replaces arbitrary waits with DOM readiness assertions.
- `cy.checkSeoMeta()` validates title, description and canonical metadata.
- `cy.checkNoConsoleErrors()` fails tests on unexpected browser console errors.
- `cy.getByTestId()` encourages stable selectors.

### Reporting And CI

Cypress uses JUnit and mochawesome reporters. Reports are written to `cypress/reports`, and HTML reports can be generated with:

```shell
npm run cy:report
```

GitHub Actions caches npm and the Cypress binary, then runs lint, typecheck, build, Cypress e2e, Cypress component tests, and uploads screenshots, videos, JUnit XML and mochawesome reports.

See [CYPRESS_TESTS_README.md](./CYPRESS_TESTS_README.md) for the detailed QA testing guide.
