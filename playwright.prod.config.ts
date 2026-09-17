import { defineConfig, devices } from "@playwright/test";
import { PRODUCTION_BASE_URL } from "./tests/e2e/config/productionSafety";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: PRODUCTION_BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "prod-smoke",
      testMatch: /prod-smoke\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
