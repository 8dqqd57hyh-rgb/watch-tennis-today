# Predeployment Testing

This project uses Playwright for practical browser QA before deployment. The suite checks smoke coverage, core navigation, newsletter form stability, API route health, serious accessibility issues, and SEO-critical page basics.

## Install Browsers

After installing npm dependencies, install the Chromium browser used by the suite:

```bash
npx playwright install chromium
```

## Run Locally

Build and start the app, then run the browser tests:

```bash
npm run build
npm run start
npm run test:e2e
```

For the Playwright interactive runner:

```bash
npm run test:e2e:ui
```

## Run The Predeploy Suite

Run linting, type checking, a production build, and Playwright:

```bash
npm run test:predeploy
```

To build, start the local server, wait for it, and run Playwright:

```bash
npm run test:predeploy:local
```

## Run Against Production

Set `TEST_BASE_URL` to the deployed site. Playwright will not start a local server when this variable is set.

```bash
TEST_BASE_URL=https://watchtennistoday.com npm run test:e2e
```

On Windows PowerShell:

```powershell
$env:TEST_BASE_URL="https://watchtennistoday.com"; npm run test:e2e
```

## When A Test Fails

Open the HTML report:

```bash
npx playwright show-report
```

Use the failure message to decide whether the issue is a real regression or a test expectation that needs to become more resilient. These tests should not depend on live tennis data being present, exact match names, or third-party ad/analytics availability.

For page crashes, check console errors and the failing route first. For accessibility failures, fix serious or critical violations unless the finding is clearly caused by an external embed. For API failures, confirm the route returns a non-500 response even when upstream tennis data is unavailable.

## Recommended Workflow

Before deployment:

1. Pull the latest changes.
2. Run `npm install` if dependencies changed.
3. Run `npx playwright install chromium` on new machines or CI images.
4. Run `npm run test:predeploy`.
5. Review the HTML report for any failures.
6. Deploy only after lint, typecheck, build, and Playwright all pass.
