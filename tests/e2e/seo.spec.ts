import { expect, test } from "@playwright/test";

const indexablePages = ["/", "/live-tennis", "/tennis-schedule-today", "/players", "/about"];
const intentionallyNoindexPages = new Set(["/tennis-schedule-today"]);

test.describe("SEO-critical page basics", () => {
  for (const path of indexablePages) {
    test(`${path} has indexable metadata and footer links`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page).toHaveTitle(/\S/);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveCount(1);
      await expect(description).toHaveAttribute("content", /\S/);

      const canonical = page.locator('link[rel="canonical"]');
      if ((await canonical.count()) > 0) {
        await expect(canonical).toHaveAttribute("href", /^https?:\/\/.+/);
      }

      const robots = page.locator('meta[name="robots"]');
      if ((await robots.count()) > 0) {
        const content = ((await robots.first().getAttribute("content")) || "").toLowerCase();
        if (!intentionallyNoindexPages.has(path)) {
          expect(content).not.toContain("noindex");
        }
      }

      const footer = page.locator("footer");
      await expect(footer.getByRole("link", { name: /about/i })).toBeVisible();
      await expect(footer.getByRole("link", { name: /privacy policy/i })).toBeVisible();
      await expect(footer.getByRole("link", { name: /disclaimer/i })).toBeVisible();
    });
  }
});
