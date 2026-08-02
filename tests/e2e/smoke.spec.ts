import { expect, test } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectPageHasContent,
} from "./helpers";

const htmlPages = [
  "/",
  "/live-tennis",
  "/live-tennis-upsets",
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

  test("homepage offers optional project support", async ({ request }) => {
    const response = await request.get("/", { failOnStatusCode: false });
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Support the project");
    expect(html).toContain("https://www.paypal.me/AnzhalikaSokalava");
    expect(html).toContain("Support is optional");
  });

  test("homepage surfaces the live Washington finals banner", async ({ page }) => {
    await page.route("**/api/finals", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          finals: [{
            id: "dc-final-1",
            player1: "Jessica Pegula",
            player2: "Alexandra Eala",
            tournament: "Washington DC Open",
            category: "WTA",
            status: "SUSPENDED",
            score: "6-4 1-2",
            startTime: "2026-08-03T16:00:00.000Z",
            round: "Final",
          }],
        }),
      });
    });

    await page.goto("/");
    const banner = page.getByTestId("featured-finals-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Pegula and Jódar finals");
    await expect(banner).toContainText("Rain delay");
    await expect(banner).toContainText("6-4 1-2");
  });
});
