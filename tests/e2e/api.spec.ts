import { expect, test } from "@playwright/test";

const apiRoutes = [
  { path: "/api/matches", type: "json" },
  { path: "/ads.txt", type: "text" },
  { path: "/api/tv-channels", type: "json" },
] as const;

test.describe("Public endpoint health", () => {
  for (const route of apiRoutes) {
    test(`${route.path} does not crash`, async ({ request }) => {
      const response = await request.get(route.path, { failOnStatusCode: false });

      expect(response.ok()).toBeTruthy();

      const body = await response.text();
      expect(body.trim().length).toBeGreaterThan(0);

      if (route.type === "json") {
        expect(() => JSON.parse(body)).not.toThrow();
      }
    });
  }
});
