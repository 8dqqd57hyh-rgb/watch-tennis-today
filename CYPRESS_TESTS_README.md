# Cypress tests

This project has a Cypress E2E suite for practical smoke, navigation, SEO, technical SEO and API health coverage. It complements the existing Playwright tests without replacing them.

## Install Cypress

```bash
npm install
```

If Cypress is not installed yet:

```bash
npm install cypress --save-dev
```

## Run locally

Run Cypress headlessly. The script starts the local Next.js app if one is not already available on `http://localhost:3000`.

```bash
npm run cy:run
```

Or open the Cypress runner:

```bash
npm run cy:open
```

## Run against a production-like local build

```bash
npm run cy:predeploy
```

## Test files

- `cypress/e2e/smoke.cy.ts` - homepage smoke checks.
- `cypress/e2e/navigation.cy.ts` - primary and secondary navigation checks.
- `cypress/e2e/seo.cy.ts` - titles, meta descriptions and canonical links.
- `cypress/e2e/key-pages.cy.ts` - stable coverage for important tennis pages.
- `cypress/e2e/technical-seo.cy.ts` - `robots.txt` and `sitemap.xml` checks.
- `cypress/e2e/api.cy.ts` - API routes should not crash and should return valid content.
