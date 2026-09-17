import { expect, test } from "@playwright/test";

const criticalRoutes = [
  { path: "/", heading: /Tennis matches today/i },
  { path: "/live-tennis", heading: /Live tennis/i },
  { path: "/tennis-schedule-today", heading: /Tennis schedule today/i },
];

for (const route of criticalRoutes) {
  test(`${route.path} is available`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
  });
}
