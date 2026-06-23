import { expect, test } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectPageHasContent,
} from "./helpers";

const htmlPages = [
  "/",
  "/live-tennis",
  "/best-tennis-matches-today",
  "/tennis-schedule-today",
  "/players",
  "/about",
  "/privacy-policy",
  "/disclaimer",
  "/watch-alcaraz-live",
  "/watch-djokovic-live",
  "/watch-sinner-live",
  "/wimbledon-order-of-play",
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

  test("/best-tennis-matches-today shows today's match groups", async ({ request }) => {
    const response = await request.get("/best-tennis-matches-today", {
      failOnStatusCode: false,
    });
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Today&#x27;s match center");
    expect(html).toContain("All tennis matches today");
    expect(html).toContain("Live matches");
    expect(html).toContain("Scheduled matches");
    expect(html).toContain("Finished matches");
  });
});
