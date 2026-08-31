import { expect, test } from "@playwright/test";

test("today preserves the provider's full upcoming fixture set", async ({ page }) => {
  const startTime = new Date();
  startTime.setHours(18, 0, 0, 0);
  const pastStartTime = new Date();
  pastStartTime.setHours(0, 1, 0, 0);
  const base = { tournament: "Status Test Open", category: "ATP", score: "", startTime: startTime.toISOString() };
  const matches = [
    ...Array.from({ length: 7 }, (_, index) => ({ ...base, id: `suspended-${index}`, player1: `Suspended ${index} A`, player2: `Suspended ${index} B`, status: index === 0 ? "Live - Suspended" : "SUSPENDED" })),
    ...Array.from({ length: 44 }, (_, index) => ({ ...base, id: `upcoming-${index}`, player1: `Upcoming ${index} A`, player2: `Upcoming ${index} B`, status: index === 0 ? "SCHEDULED" : "UPCOMING", startTime: index === 0 ? pastStartTime.toISOString() : startTime.toISOString() })),
    ...Array.from({ length: 4 }, (_, index) => ({ ...base, id: `finished-${index}`, player1: `Finished ${index} A`, player2: `Finished ${index} B`, status: index === 3 ? "RETIRED" : "FINISHED", score: "6-4 6-4" })),
  ];

  await page.route("**/api/matches?**", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(matches) }));
  await page.goto("/today");

  await expect(page.getByText("0 live", { exact: true })).toBeVisible();
  await expect(page.getByText("7 suspended", { exact: true })).toBeVisible();
  await expect(page.getByText("44 upcoming", { exact: true })).toBeVisible();
  await expect(page.getByText("4 finished", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Upcoming", exact: true }).click();
  const upcomingSection = page.getByRole("heading", { name: "Coming up today", exact: true }).locator("xpath=ancestor::section");
  await expect(upcomingSection.getByText("44 matches", { exact: true })).toBeVisible();
  await expect(upcomingSection.locator("article")).toHaveCount(44);
  await expect(upcomingSection.getByText("Upcoming 0 A")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suspended", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Live now", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Latest results", exact: true })).toHaveCount(0);

  await page.getByRole("button", { name: "Suspended", exact: true }).click();
  const suspendedSection = page.getByRole("heading", { name: "Suspended", exact: true }).locator("xpath=ancestor::section");
  await expect(suspendedSection.locator("article")).toHaveCount(7);
  await expect(suspendedSection.getByText("SUSPENDED", { exact: true })).toHaveCount(7);
  await expect(suspendedSection.getByText("LIVE NOW", { exact: true })).toHaveCount(0);
});
