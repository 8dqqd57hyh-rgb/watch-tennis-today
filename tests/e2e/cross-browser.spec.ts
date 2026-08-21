import { expect } from "@playwright/test";
import { test } from "./fixtures";
import { expectPageHasContent } from "./helpers";

test.describe("critical cross-browser journeys", () => {
  test("homepage loads with primary navigation", async ({ page, runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/\S/);
    await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
    await expectPageHasContent(page);
  });

  test("primary navigation opens the live tennis page", async ({ page, runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await page.getByRole("navigation", { name: /primary/i })
      .getByRole("link", { name: /live tennis/i })
      .first()
      .click();

    await expect(page).toHaveURL(/\/live-tennis$/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("Can I Watch finder accepts country and tournament input", async ({ canIWatchPage, runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);
    await canIWatchPage.goto();

    await canIWatchPage.selectCountry("usa");
    await canIWatchPage.searchFor("US Open");

    await expect(canIWatchPage.countrySelect).toHaveValue("usa");
    await expect(canIWatchPage.searchInput).toHaveValue("US Open");
    await expect(canIWatchPage.seoPageLink).toHaveAttribute("href", "/can-i-watch/us-open/usa");
    await expect(canIWatchPage.streamingRoute).toBeVisible();
  });
});
