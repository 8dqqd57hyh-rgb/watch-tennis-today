import { expect, test } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectPageHasContent,
} from "./helpers";

const htmlPages = [
  "/",
  "/live-tennis",
  "/tennis-schedule-today",
  "/players",
  "/about",
  "/privacy-policy",
  "/disclaimer",
  "/watch-alcaraz-live",
  "/watch-djokovic-live",
  "/watch-sinner-live",
];

const documentPages = ["/robots.txt", "/sitemap.xml", "/ads.txt"];

test.describe("smoke checks", () => {
  for (const path of htmlPages) {
    test(`${path} loads without crashing`, async ({ page }) => {
      const errors = collectCriticalConsoleErrors(page);
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });

      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/\S/);
      await expectPageHasContent(page);
      expectNoCriticalConsoleErrors(errors);
    });
  }

  for (const path of documentPages) {
    test(`${path} returns content`, async ({ request }) => {
      const response = await request.get(path, { failOnStatusCode: false });
      const body = await response.text();

      expect(response.status()).toBe(200);
      expect(body.trim().length).toBeGreaterThan(0);
    });
  }
});
