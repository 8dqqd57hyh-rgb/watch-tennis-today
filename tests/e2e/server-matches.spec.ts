import { expect, test } from "@playwright/test";
import { createServer } from "node:http";
import { getBaseUrl } from "../../app/lib/serverMatches";
import { SITE_URL } from "../../app/lib/technicalSeo";

test.describe("server match API origin", () => {
  test.afterEach(() => { delete process.env.NEXT_PUBLIC_SITE_URL; });

  test("uses a valid configured HTTP origin without paths", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://preview.example.com/some/path";
    expect(getBaseUrl()).toBe("https://preview.example.com");
  });

  for (const host of ["localhost:3107", "127.0.0.1:3107", "[::1]:3107"]) {
    test(`uses HTTP for the local request host ${host}`, () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://preview.example.com";
      expect(getBaseUrl(host)).toBe(`http://${host}`);
    });
  }

  test("uses HTTPS for public request hosts, including names containing localhost", () => {
    expect(getBaseUrl("preview.example.com")).toBe("https://preview.example.com");
    expect(getBaseUrl("localhost.example.com")).toBe("https://localhost.example.com");
  });

  test("uses the configured origin when the request host is missing", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3107/some/path";
    expect(getBaseUrl(null)).toBe("http://localhost:3107");
  });

  test("falls back to the canonical origin for an invalid request host", () => {
    expect(getBaseUrl("[invalid")).toBe(SITE_URL);
  });

  test("falls back to the canonical site for missing or unsafe URLs", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getBaseUrl()).toBe(SITE_URL);
    process.env.NEXT_PUBLIC_SITE_URL = "javascript:alert(1)";
    expect(getBaseUrl()).toBe(SITE_URL);
    process.env.NEXT_PUBLIC_SITE_URL = "not a url";
    expect(getBaseUrl()).toBe(SITE_URL);
  });
});

for (const pagePath of ["/tennis-schedule-today", "/player/jannik-sinner"]) {
  test(`${pagePath} renders matches from an IPv4 HTTP request origin`, async ({ request }) => {
    const apiPaths: string[] = [];
    const apiServer = createServer((apiRequest, apiResponse) => {
      apiPaths.push(apiRequest.url || "");
      apiResponse.writeHead(200, { "Content-Type": "application/json" });
      apiResponse.end(JSON.stringify([{
        id: "ssl-regression-12345",
        player1: "Jannik Sinner",
        player2: "Carlos Alcaraz",
        tournament: "Local HTTP Regression Open",
        category: "ATP",
        status: "UPCOMING",
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      }]));
    });

    await new Promise<void>((resolve, reject) => {
      apiServer.once("error", reject);
      apiServer.listen(0, "127.0.0.1", resolve);
    });

    try {
      const address = apiServer.address();
      if (!address || typeof address === "string") {
        throw new Error("Local match API did not receive a TCP port");
      }

      const response = await request.get(pagePath, {
        headers: { host: `127.0.0.1:${address.port}` },
      });
      const html = await response.text();

      expect(response.status()).toBe(200);
      expect(apiPaths.some((path) => new URL(path, "http://localhost").pathname === "/api/matches")).toBe(true);
      expect(html).toContain("Jannik Sinner");
      expect(html).toContain("Carlos Alcaraz");
      expect(html).toContain("Local HTTP Regression Open");
    } finally {
      apiServer.closeAllConnections();
      await new Promise<void>((resolve, reject) => {
        apiServer.close((error) => error ? reject(error) : resolve());
      });
    }
  });
}
