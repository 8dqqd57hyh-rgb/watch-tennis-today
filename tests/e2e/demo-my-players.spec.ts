import { expect, test } from "@playwright/test";

test("My Players requests and displays only matches involving followed players", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "watchTennisToday.followedPlayers",
      JSON.stringify([{ slug: "andrey-rublev" }]),
    );
  });

  const matches = [
    {
      id: "rublev-medvedev",
      player1: "A. Rublev",
      player2: "Daniil Medvedev",
      tournament: "Test Open",
      category: "ATP",
      status: "UPCOMING",
      score: "",
      startTime: "2026-09-26T12:00:00.000Z",
    },
    {
      id: "alcaraz-sinner",
      player1: "Carlos Alcaraz",
      player2: "Jannik Sinner",
      tournament: "Test Open",
      category: "ATP",
      status: "UPCOMING",
      score: "",
      startTime: "2026-09-27T12:00:00.000Z",
    },
  ];
  let matchesRouteFulfilled = false;
  let matchesRequestUrl: URL | undefined;

  await page.route("**/api/matches**", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.pathname !== "/api/matches") {
      await route.continue();
      return;
    }

    matchesRequestUrl = requestUrl;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(matches),
    });
    matchesRouteFulfilled = true;
  });

  await page.goto("/my-players");
  await expect.poll(() => matchesRouteFulfilled).toBe(true);

  expect(matchesRequestUrl?.searchParams.get("playerNames")).toBe("Andrey Rublev");
  await expect(page.getByText("Andrey Rublev vs Daniil Medvedev", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "A. Rublev vs Daniil Medvedev", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Carlos Alcaraz vs Jannik Sinner", exact: true })).not.toBeVisible();
});