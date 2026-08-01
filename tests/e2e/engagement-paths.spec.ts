import { expect, test } from "@playwright/test";

test.describe("engagement pathways", () => {
  test("today schedule exposes interactive tour and status filters", async ({ page }) => {
    const response = await page.goto("/today", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("group", { name: "Tour" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ATP + WTA" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "ATP", exact: true }).click();
    await expect(page.getByRole("button", { name: "ATP", exact: true })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Results" }).click();
    await expect(page.getByRole("button", { name: "Results" })).toHaveAttribute("aria-pressed", "true");
  });

  test("ATP tournament-level guide offers useful next steps above the long-form copy", async ({ page }) => {
    const response = await page.goto("/guides/masters-1000-500-250-explained", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Masters 1000 vs ATP 500 vs ATP 250" })).toBeVisible();
    await expect(page.getByRole("table")).toContainText("1,000");
    await expect(page.getByRole("link", { name: "See today's ATP matches" })).toHaveAttribute("href", "/today");
    await expect(page.getByRole("link", { name: "View the tennis calendar" })).toHaveAttribute("href", "/tennis-calendar");
  });
});
