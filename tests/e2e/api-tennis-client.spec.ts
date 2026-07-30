import { expect, test } from "@playwright/test";

import { getApiTennisCacheMode } from "../../app/lib/apiTennisClient";

test.describe("API-Tennis cache safety", () => {
  test("keeps fixture requests out of the Next.js data cache", () => {
    expect(getApiTennisCacheMode("get_fixtures", 60 * 60 * 6)).toBe("no-store");
  });

  test("retains revalidation for small reference-data requests", () => {
    expect(getApiTennisCacheMode("get_tournaments", 60 * 60 * 24)).toBe("next-revalidate");
  });

  test("uses no-store when no cache lifetime is requested", () => {
    expect(getApiTennisCacheMode("get_livescore")).toBe("no-store");
  });
});
