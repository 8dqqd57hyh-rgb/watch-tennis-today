import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("US Open hub is reachable independently of seasonal homepage banners", async ({ page }) => {
  const response = await page.goto("/us-open");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/us-open$/);
  await expect(page.getByRole("heading", { level: 1, name: /US Open \d{4}: Live Matches/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Current tournament snapshot" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Live now" })).toBeVisible();
});

for (const path of ["/", "/today", "/live-tennis", "/us-open", "/my-players"]) {
  test(`${path} QA route loads without runtime errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

for (const path of ["/today", "/us-open"]) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""))).toEqual([]);
  });
}
