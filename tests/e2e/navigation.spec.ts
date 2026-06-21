import { expect, test } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectPageHasContent,
} from "./helpers";

test("primary navigation links are visible and navigate", async ({ page }) => {
  const errors = collectCriticalConsoleErrors(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const nav = page.getByRole("navigation", { name: /primary/i });
  await expect(nav).toBeVisible();

  const links = [
    { name: /live tennis/i, url: /\/live-tennis$/ },
    { name: /matches today/i, url: /\/best-tennis-matches-today$/ },
    { name: /^players$/i, url: /\/players$/ },
    { name: /calendar/i, url: /\/tennis-calendar$/ },
    { name: /guides/i, url: /\/tennis-guides$/ },
  ];

  for (const link of links) {
    await expect(nav.getByRole("link", { name: link.name }).first()).toBeVisible();
  }

  for (const link of links.slice(0, 4)) {
    await nav.getByRole("link", { name: link.name }).first().click();
    await expect(page).toHaveURL(link.url);
    await expectPageHasContent(page);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.goto("/", { waitUntil: "domcontentloaded" });
  }

  expectNoCriticalConsoleErrors(errors);
});
