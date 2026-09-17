import { expect, test } from "@playwright/test";

const FOLLOWED_PLAYERS_KEY = "watchTennisToday.followedPlayers";

test("shows an upcoming match when the provider abbreviates a followed player's name", async ({ page }) => {
  await page.addInitScript(({ storageKey }) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify([
        {
          slug: "andrey-rublev",
          name: "Andrey Rublev",
          addedAt: "2026-09-01T00:00:00.000Z",
        },
      ]),
    );
  }, { storageKey: FOLLOWED_PLAYERS_KEY });

  await page.route("**/api/matches?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "us-open-rublev-alcaraz",
          player1: "A. Rublev",
          player2: "Carlos Alcaraz",
          tournament: "US Open",
          category: "ATP",
          status: "UPCOMING",
          startTime: "2026-09-02T17:00:00.000Z",
        },
      ]),
    });
  });

  

  await page.goto("/my-players");

  await expect(page.getByRole("heading", { name: "1 followed player" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Andrey Rublev", exact: true })).toBeVisible();

  const matchCard = page.getByRole("article");
  await expect(matchCard).toHaveCount(1);
  await expect(
    matchCard.getByRole("heading", { name: "A. Rublev vs Carlos Alcaraz" }),
  ).toBeVisible();
  await expect(matchCard).toContainText("Andrey Rublev vs Carlos Alcaraz");
  await expect(matchCard).toContainText("US Open");
  await expect(matchCard).toContainText("UPCOMING");


  
});

