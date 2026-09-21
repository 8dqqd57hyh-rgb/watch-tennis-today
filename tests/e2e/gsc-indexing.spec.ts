import { expect, test } from "@playwright/test";
import { shouldIncludeInSitemap } from "../../app/lib/technicalSeo";
import { ADSENSE_INDEXABLE_PLAYER_SLUGS } from "../../app/lib/adsenseIndexing";

for (const [path, heading] of [["/watch", "Tennis Viewing Directory"], ["/player/alexander-zverev", "Alexander Zverev"], ["/disclaimer", "Disclaimer"]]) {
  test(`${path} serves indexable content without JavaScript`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await context.newPage();
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"] || "").not.toMatch(/noindex/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://watchtennistoday.com${path}`);
    const robots = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content")).join(","));
    expect(robots).not.toMatch(/noindex/i);
    await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
    expect((await page.locator("main").innerText()).length).toBeGreaterThan(500);
    await expect(page.locator('a[href="/player/zverev-alexander"]')).toHaveCount(0);
    if (path === "/watch") {
      await expect(page.getByRole("link", { name: /Watch tennis by country/ })).toHaveAttribute("href", "/watch-tennis-in");
    }
    if (path.includes("player")) expect(await page.locator("main").innerText()).not.toContain("deserves indexable editorial context");
    await context.close();
  });
}

test("alias redirects once; canonical URLs agree with sitemap and indexing policies", async ({ request }) => {
  const alias = await request.get("/player/zverev-alexander", { maxRedirects: 0 });
  expect([301, 308]).toContain(alias.status());
  expect(new URL(alias.headers().location, alias.url()).pathname).toBe("/player/alexander-zverev");
  expect((await request.get("/player/alexander-zverev", { maxRedirects: 0 })).status()).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/watch", "/disclaimer", "/player/alexander-zverev"]) {
    expect(shouldIncludeInSitemap(path)).toBe(true);
    expect(sitemap).toContain(`<loc>https://watchtennistoday.com${path}</loc>`);
  }
  expect(ADSENSE_INDEXABLE_PLAYER_SLUGS.has("alexander-zverev")).toBe(true);
  expect(sitemap).not.toContain("/player/zverev-alexander");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Sitemap: https://watchtennistoday.com/sitemap.xml");
  expect(robots).not.toMatch(/Disallow: \/(?:watch|player|disclaimer)/);
  expect((await request.get("/watch-tennis-in")).status()).toBe(200);
});
