import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/", "/live-tennis", "/tennis-schedule-today", "/players", "/about"];

test.describe("accessibility basics", () => {
  for (const path of pages) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      test.setTimeout(60_000);
      await page.goto(path, { waitUntil: "domcontentloaded" });

      const results = await new AxeBuilder({ page }).analyze();
      const seriousViolations = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact || "")
      );

      expect(
        seriousViolations,
        seriousViolations.map((violation) => `${violation.id}: ${violation.description}`).join("\n")
      ).toEqual([]);
    });

    test(`${path} exposes landmarks and keyboard focus`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(page.getByRole("navigation", { name: /primary/i })).toBeVisible();
      await expect(page.locator("main")).toBeVisible();

      await page.keyboard.press("Tab");
      const focused = page.locator(":focus");
      await expect(focused).toBeVisible();

      const focusBox = await focused.boundingBox();
      expect(focusBox?.width || 0).toBeGreaterThan(0);
      expect(focusBox?.height || 0).toBeGreaterThan(0);

      const hasVisibleFocusStyle = await focused.evaluate((element) => {
        const style = window.getComputedStyle(element);
        return (
          style.outlineStyle !== "none" ||
          style.boxShadow !== "none" ||
          style.borderColor !== "rgba(0, 0, 0, 0)"
        );
      });

      expect(hasVisibleFocusStyle).toBe(true);
    });
  }
});
