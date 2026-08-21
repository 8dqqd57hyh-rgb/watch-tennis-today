import { expect, type Page } from "@playwright/test";
import { test } from "./fixtures";
import { expectPageHasContent } from "./helpers";

async function getJsonLdObjects(page: Page) {
  const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();

  return scripts
    .map((script) => {
      try {
        return JSON.parse(script);
      } catch {
        return null;
      }
    })
    .filter(Boolean) as Array<Record<string, unknown>>;
}

function schemaMatchesType(schema: Record<string, unknown>, type: string): boolean {
  const schemaType = schema["@type"];
  const graph = schema["@graph"];

  if (schemaType === type) return true;
  if (Array.isArray(schemaType) && schemaType.includes(type)) return true;
  if (Array.isArray(graph)) {
    return graph.some((item) =>
      typeof item === "object" && item !== null && schemaMatchesType(item as Record<string, unknown>, type),
    );
  }

  return false;
}

async function expectJsonLdType(page: Page, type: string) {
  await expect.poll(async () => {
    const schemas = await getJsonLdObjects(page);

    return schemas.some((schema) => schemaMatchesType(schema, type));
  }).toBe(true);
}

test.describe("Can I Watch finder", () => {
  test("loads with default Wimbledon coverage for Poland", async ({ canIWatchPage, runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);
    const response = await canIWatchPage.goto();

    expect(response?.status()).toBe(200);
    await expect(canIWatchPage.page).toHaveTitle(/Can I Watch This Tennis Match/i);
    await expect(canIWatchPage.finderHeading).toBeVisible();
    await expect(canIWatchPage.countrySelect).toHaveValue("poland");
    await expect(canIWatchPage.searchInput).toHaveValue("Wimbledon");

    await expect(canIWatchPage.broadcastersSection).toBeVisible();
    await expect(canIWatchPage.freeRoutes).toBeVisible();
    await expect(canIWatchPage.paidRoutes).toBeVisible();
    await expect(canIWatchPage.lastVerified).toBeVisible();
    await expect(canIWatchPage.seoPageLink).toHaveAttribute(
      "href",
      "/can-i-watch/wimbledon/poland",
    );
    await expectPageHasContent(canIWatchPage.page);
  });

  test("updates results and SEO page link when country and tournament change", async ({ canIWatchPage }) => {
    await canIWatchPage.goto();

    await canIWatchPage.selectCountry("usa");
    await canIWatchPage.searchFor("US Open");

    await expect(canIWatchPage.seoPageLink).toHaveAttribute(
      "href",
      "/can-i-watch/us-open/usa",
    );
    await expect(canIWatchPage.streamingRoute).toBeVisible();
    await expect(canIWatchPage.broadcasterProfileLink).toBeVisible();
  });

  test("supports player search without crashing", async ({ canIWatchPage }) => {
    await canIWatchPage.goto();

    await canIWatchPage.selectCountry("uk");
    await canIWatchPage.searchFor("Iga Swiatek");

    await expect(canIWatchPage.seoPageLink).toHaveAttribute(
      "href",
      "/can-i-watch/iga-swiatek/uk",
    );
    await expect(canIWatchPage.coverageResult).toBeVisible();
  });

  test("exposes SearchAction, FAQ and breadcrumb schema on finder page", async ({ canIWatchPage }) => {
    await canIWatchPage.goto();

    await expectJsonLdType(canIWatchPage.page, "WebSite");
    await expectJsonLdType(canIWatchPage.page, "FAQPage");
    await expectJsonLdType(canIWatchPage.page, "BreadcrumbList");

    const schemas = await getJsonLdObjects(canIWatchPage.page);
    const website = schemas.find((schema) => schemaMatchesType(schema, "WebSite"));
    expect(website).toBeTruthy();
    expect(JSON.stringify(website)).not.toContain("SearchAction");
    expect(JSON.stringify(website)).not.toContain("search_term_string");
  });
});

test.describe("Can I Watch SEO pages", () => {
  const pages = [
    {
      path: "/can-i-watch/wimbledon/poland",
      heading: /Can I watch Wimbledon in Poland\?/i,
      canonical: "https://watchtennistoday.com/can-i-watch/wimbledon/poland",
    },
    {
      path: "/can-i-watch/us-open/usa",
      heading: /Can I watch US Open in United States\?/i,
      canonical: "https://watchtennistoday.com/can-i-watch/us-open/usa",
    },
  ];

  for (const route of pages) {
    test(`${route.path} renders broadcaster research and SEO metadata`, async ({ page, runtimeMonitor }) => {
      expect(runtimeMonitor.isActive()).toBe(true);
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", route.canonical);
      await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/i);
      await expect(page.getByText("Broadcasters").first()).toBeVisible();
      await expect(page.getByText("Related tools")).toBeVisible();
      await expect(page.getByRole("link", { name: /Can I Watch\? finder/i }).first()).toBeVisible();
      await expectJsonLdType(page, "FAQPage");
      await expectJsonLdType(page, "BreadcrumbList");
    });
  }

  test("keeps non-curated detail combinations usable but noindex", async ({ page }) => {
    const response = await page.goto("/can-i-watch/iga-swiatek/poland", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex,\s*follow/i);
  });

  test("unknown country returns not found", async ({ request }) => {
    const response = await request.get("/can-i-watch/wimbledon/atlantis", { failOnStatusCode: false });

    expect(response.status()).toBe(404);
  });
});
