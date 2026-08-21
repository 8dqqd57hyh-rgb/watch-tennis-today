import { expect } from "@playwright/test";
import { test } from "./fixtures";
import { abortEndpoint, mockJsonEndpoint, mockRawEndpoint } from "./network/mockApi";

const finalsEndpoint = "**/api/finals";
const finalsBanner = "featured-finals-banner";

const featuredFinal = {
  id: "dc-final-1",
  player1: "Jessica Pegula",
  player2: "Alexandra Eala",
  tournament: "Washington DC Open",
  category: "WTA",
  status: "SUSPENDED",
  score: "6-4 1-2",
  startTime: "2026-08-03T16:00:00.000Z",
  round: "Final",
};

test.describe("homepage finals network behavior", () => {
  test.beforeEach(async ({ runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);
  });

  test("renders a deterministic successful response and sends the expected request", async ({ page }) => {
    let requestDetails: { method: string; pathname: string } | undefined;
    await mockJsonEndpoint(page, finalsEndpoint, {
      body: { ok: true, finals: [featuredFinal] },
      onRequest: (request) => {
        requestDetails = {
          method: request.method(),
          pathname: new URL(request.url()).pathname,
        };
      },
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });

    const banner = page.getByTestId(finalsBanner);
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Pegula and Jódar finals");
    await expect(banner).toContainText("Rain delay");
    await expect(banner).toContainText("6-4 1-2");
    expect(requestDetails).toEqual({ method: "GET", pathname: "/api/finals" });
  });

  test("keeps the optional banner hidden for an empty successful response", async ({ page }) => {
    const responsePromise = page.waitForResponse(finalsEndpoint);
    await mockJsonEndpoint(page, finalsEndpoint, { body: { ok: true, finals: [] } });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect((await responsePromise).status()).toBe(200);

    await expect(page.getByTestId(finalsBanner)).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Tennis matches today" })).toBeVisible();
  });

  test("keeps the homepage usable when the finals endpoint returns 500", async ({ page }) => {
    const responsePromise = page.waitForResponse(finalsEndpoint);
    await mockJsonEndpoint(page, finalsEndpoint, {
      status: 500,
      body: { ok: false, message: "Temporary finals failure" },
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect((await responsePromise).status()).toBe(500);

    await expect(page.getByTestId(finalsBanner)).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  });

  test("keeps the homepage usable after a network-level request failure", async ({ page }) => {
    const requestPromise = page.waitForRequest(finalsEndpoint);
    await abortEndpoint(page, finalsEndpoint);

    await page.goto("/", { waitUntil: "domcontentloaded" });
    const request = await requestPromise;
    await expect.poll(() => request.failure()?.errorText).toBeTruthy();

    await expect(page.getByTestId(finalsBanner)).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  });

  test("waits for a delayed response and renders the final data", async ({ page }) => {
    await mockJsonEndpoint(page, finalsEndpoint, {
      body: { ok: true, finals: [featuredFinal] },
      delayMs: 400,
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId(finalsBanner)).toHaveCount(0);
    await expect(page.getByTestId(finalsBanner)).toContainText("Jessica Pegula");
  });

  test("keeps the homepage usable when the endpoint returns malformed JSON", async ({ page }) => {
    const responsePromise = page.waitForResponse(finalsEndpoint);
    await mockRawEndpoint(page, finalsEndpoint, "{not-valid-json");

    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect((await responsePromise).status()).toBe(200);

    await expect(page.getByTestId(finalsBanner)).toHaveCount(0);
    await expect(page.locator("main")).toBeVisible();
  });
});
