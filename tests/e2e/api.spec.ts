import { expect, test } from "@playwright/test";

const apiRoutes = [
  { path: "/api/matches", type: "json", optional: false },
  { path: "/api/ads.txt", type: "text", optional: true },
  { path: "/api/tv-channels", type: "json", optional: true },
] as const;

test.describe("API route health", () => {
  for (const route of apiRoutes) {
    test(`${route.path} does not crash`, async ({ request }) => {
      const response = await request.get(route.path, { failOnStatusCode: false });

      if (route.optional && response.status() === 404) {
        test.skip(true, `${route.path} is not implemented in this app.`);
      }

      expect(response.status()).not.toBe(500);
      expect(response.status()).toBeLessThan(500);

      const body = await response.text();
      expect(body.trim().length).toBeGreaterThan(0);

      if (route.type === "json") {
        expect(() => JSON.parse(body)).not.toThrow();
      }
    });
  }
});
