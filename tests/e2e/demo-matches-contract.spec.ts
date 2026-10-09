import { expect, test } from "@playwright/test";

test("GET /api/matches returns matches that satisfy the response contract", async ({ request }) => {
  const response = await request.get("/api/matches?includeFinished=1", {
    failOnStatusCode: false,
  });

  expect(response.status()).toBe(200);

  const matches: unknown = await response.json();
  expect(Array.isArray(matches)).toBe(true);
  if (!Array.isArray(matches)) return;

  const normalizedStatuses = [
    "LIVE",
    "UPCOMING",
    "FINISHED",
    "RETIRED",
    "SUSPENDED",
    "CANCELLED",
    "EXPIRED",
    "UNKNOWN",
  ];

  for (const match of matches) {
    expect(match).toEqual(
      expect.objectContaining({
        player1: expect.any(String),
        player2: expect.any(String),
        status: expect.stringMatching(/^(LIVE|UPCOMING|FINISHED|RETIRED|SUSPENDED|CANCELLED|EXPIRED|UNKNOWN)$/),
      }),
    );
    expect(normalizedStatuses).toContain(match.status);
  }
});