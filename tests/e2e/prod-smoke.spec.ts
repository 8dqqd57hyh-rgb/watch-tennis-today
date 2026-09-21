import { expect, test } from "@playwright/test";

const criticalRoutes = [
  { path: "/", heading: /Tennis matches today/i },
  { path: "/live-tennis", heading: /Live tennis/i },
  { path: "/tennis-schedule-today", heading: /Tennis schedule today/i },
];

for (const route of criticalRoutes) {
  test(`${route.path} is available`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
  });
}

// A bounded, read-only audit of the four reported GSC URLs. Keep this separate
// from local regression tests; observations work both before and after deploy.
test("GSC URLs: HTTP, server HTML, canonical, robots and sitemap audit", async ({ request, browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const observations = [];
  for (const path of ["/watch", "/player/alexander-zverev", "/player/zverev-alexander", "/disclaimer", "/watch-tennis-in"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    const html = await response.text();
    const location = response.headers().location;
    if (path === "/player/zverev-alexander") {
      expect([301, 308]).toContain(response.status());
      expect(new URL(location, response.url()).pathname).toBe("/player/alexander-zverev");
    } else {
      expect(response.status()).toBe(200);
      await page.setContent(html);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBe(`https://watchtennistoday.com${path}`);
      const robots = await page.locator('meta[name="robots"]').allTextContents();
      const robotsContent = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content")));
      expect(robotsContent.join(",")).not.toMatch(/noindex/i);
      expect(response.headers()["x-robots-tag"] || "").not.toMatch(/noindex/i);
      const mainText = await page.locator("main").innerText();
      expect(mainText.length).toBeGreaterThan(500);
      observations.push({ path, status: response.status(), canonical, robots: robotsContent, robotsCount: robots.length,
        xRobotsTag: response.headers()["x-robots-tag"] || null, mainText,
        links: await page.locator("a[href]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))) });
    }
    if (location) observations.push({ path, status: response.status(), location });
  }
  const robots = await request.get("/robots.txt");
  const sitemap = await request.get("/sitemap.xml");
  expect(robots.status()).toBe(200);
  expect(sitemap.status()).toBe(200);
  const sitemapText = await sitemap.text();
  for (const path of ["/watch", "/player/alexander-zverev", "/disclaimer"]) {
    expect(sitemapText).toContain(`<loc>https://watchtennistoday.com${path}</loc>`);
  }
  expect(sitemapText).not.toContain("/player/zverev-alexander");
  observations.push({ robots: await robots.text() });
  console.log(JSON.stringify(observations.map(({ mainText, links, ...rest }) => ({ ...rest, textLength: mainText?.length, linkCount: links?.length })), null, 2));
  await testInfo.attach("gsc-production-audit.json", { body: JSON.stringify(observations, null, 2), contentType: "application/json" });
  await context.close();
});
