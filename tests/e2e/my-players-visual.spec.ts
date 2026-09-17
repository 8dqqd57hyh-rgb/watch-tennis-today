import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("watchTennisToday.followedPlayers", JSON.stringify([
      { slug: "andrey-rublev", name: "Andrey Rublev", addedAt: "2026-08-31T00:00:00.000Z" },
    ]));
  });
  await page.route("**/api/matches?**", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify([{ id: "rublev-demo", player1: "O. Virtanen", player2: "A. Rublev", tournament: "US Open", category: "ATP", status: "UPCOMING", score: "", startTime: "2026-08-31T17:00:00.000Z" }]),
  }));
});

test("keeps abbreviated Rublev matching and exposes enabled card actions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/my-players");

  await expect(page.getByRole("link", { name: "Andrey Rublev", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "O. Virtanen vs A. Rublev" })).toBeVisible();
  for (const name of ["Open match →", "Player page →", "Where to watch →"]) {
    const link = page.getByRole("link", { name, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
  }
  expect(errors).toEqual([]);
});

test("has accessible contrast, focus states, and no mobile overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/my-players");
  await expect(page.getByRole("heading", { name: "O. Virtanen vs A. Rublev" })).toBeVisible();

  const serious = (await new AxeBuilder({ page }).analyze()).violations.filter((violation) => ["serious", "critical"].includes(violation.impact || ""));
  expect(serious).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  const playerPage = page.getByRole("link", { name: "Player page →", exact: true });
  await playerPage.focus();
  await expect(playerPage).toBeFocused();
  expect(await playerPage.evaluate((element) => getComputedStyle(element).boxShadow !== "none" || getComputedStyle(element).outlineStyle !== "none")).toBe(true);
});
