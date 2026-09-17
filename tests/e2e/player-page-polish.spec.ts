import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { hasMeaningfulValue } from "../../src/lib/enrichment/presentation";

test("filters missing enrichment without treating every zero as missing", () => {
  expect(hasMeaningfulValue(null)).toBe(false);
  expect(hasMeaningfulValue("unknown")).toBe(false);
  expect(hasMeaningfulValue("Not enough sourced data yet")).toBe(false);
  expect(hasMeaningfulValue(0)).toBe(true);

});

test("removes Rublev quick facts and keeps accessible follow controls", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    window.localStorage.setItem("watchTennisToday.followedPlayers", JSON.stringify([
      { slug: "andrey-rublev", name: "Andrey Rublev", addedAt: "2026-08-31T00:00:00.000Z" },
    ]));
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/player/andrey-rublev");

  await expect(page.getByRole("heading", { name: "Andrey Rublev" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Andrey Rublev at a glance" })).toHaveCount(0);
  await expect(page.getByText("Not enough sourced data yet")).toHaveCount(0);
  await expect(page.getByText("Entity intelligence", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Career stage", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Following/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /My Players/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  const serious = (await new AxeBuilder({ page }).include('[data-testid="player-follow-card"]').analyze()).violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact || "")
  );
  expect(serious).toEqual([]);
  expect(errors).toEqual([]);
});

test("removes quick facts from shared ATP and WTA player pages", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const { slug, name } of [
    { slug: "jannik-sinner", name: "Jannik Sinner" },
    { slug: "iga-swiatek", name: "Iga Swiatek" },
  ]) {
    await page.goto(`/player/${slug}`);
    await expect(page.getByRole("heading", { name, exact: true }).first()).toBeVisible();
    await expect(page.getByText("Player info", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: `${name} at a glance` })).toHaveCount(0);
    await expect(page.getByText("Career stage", { exact: true })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }

  expect(errors).toEqual([]);
});
