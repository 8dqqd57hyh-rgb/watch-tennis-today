export const PRODUCTION_BASE_URL = "https://watchtennistoday.com";

const productionHostnames = new Set([
  "watchtennistoday.com",
  "www.watchtennistoday.com",
]);

export function isProductionUrl(value: string) {
  return productionHostnames.has(new URL(value).hostname.toLowerCase());
}

export function assertRegressionBaseUrlAllowed(baseURL: string) {
  if (!isProductionUrl(baseURL)) return;

  throw new Error(
    [
      `Production regression execution is blocked for ${baseURL}.`,
      "Run the full Playwright suite against localhost or a non-production preview URL.",
      "For the isolated read-only production checks, run: npm run test:e2e:prod-smoke",
    ].join(" "),
  );
}
