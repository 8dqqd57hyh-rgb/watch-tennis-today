import { expect, test, type Page } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectPageHasContent,
} from "./helpers";

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
  test("loads with default Wimbledon coverage for Poland", async ({ page }) => {
    const errors = collectCriticalConsoleErrors(page);
    const response = await page.goto("/can-i-watch", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Can I Watch This Tennis Match/i);
    await expect(page.getByRole("heading", { name: /Can I watch this tennis match\?/i })).toBeVisible();
    await expect(page.getByLabel(/Country/i)).toHaveValue("poland");
    await expect(page.getByLabel(/Player or tournament/i)).toHaveValue("Wimbledon");

    await expect(page.getByText("Broadcasters").first()).toBeVisible();
    await expect(page.getByText("Free routes").first()).toBeVisible();
    await expect(page.getByText("Paid routes").first()).toBeVisible();
    await expect(page.getByText("Last verified").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Open SEO page/i })).toHaveAttribute(
      "href",
      "/can-i-watch/wimbledon/poland",
    );
    await expectPageHasContent(page);
    expectNoCriticalConsoleErrors(errors);
  });

  test("updates results and SEO page link when country and tournament change", async ({ page }) => {
    await page.goto("/can-i-watch", { waitUntil: "domcontentloaded" });

    await page.getByLabel(/Country/i).selectOption("usa");
    await page.getByLabel(/Player or tournament/i).fill("US Open");

    await expect(page.getByRole("link", { name: /Open SEO page/i })).toHaveAttribute(
      "href",
      "/can-i-watch/us-open/usa",
    );
    await expect(page.getByText(/Streaming route:/i).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Broadcaster profile/i }).first()).toBeVisible();
  });

  test("supports player search without crashing", async ({ page }) => {
    await page.goto("/can-i-watch", { waitUntil: "domcontentloaded" });

    await page.getByLabel(/Country/i).selectOption("uk");
    await page.getByLabel(/Player or tournament/i).fill("Iga Swiatek");

    await expect(page.getByRole("link", { name: /Open SEO page/i })).toHaveAttribute(
      "href",
      "/can-i-watch/iga-swiatek/uk",
    );
    await expect(page.getByText(/Broadcasters|No verified route/i).first()).toBeVisible();
  });

  test("exposes SearchAction, FAQ and breadcrumb schema on finder page", async ({ page }) => {
    await page.goto("/can-i-watch", { waitUntil: "domcontentloaded" });

    await expectJsonLdType(page, "WebSite");
    await expectJsonLdType(page, "FAQPage");
    await expectJsonLdType(page, "BreadcrumbList");

    const schemas = await getJsonLdObjects(page);
    const website = schemas.find((schema) => schemaMatchesType(schema, "WebSite"));
    expect(JSON.stringify(website)).toContain("SearchAction");
    expect(JSON.stringify(website)).toContain("search_term_string");
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
      heading: /Can I watch US Open in USA\?/i,
      canonical: "https://watchtennistoday.com/can-i-watch/us-open/usa",
    },
  ];

  for (const route of pages) {
    test(`${route.path} renders broadcaster research and SEO metadata`, async ({ page }) => {
      const errors = collectCriticalConsoleErrors(page);
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });

      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", route.canonical);
      await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/i);
      await expect(page.getByText("Broadcasters").first()).toBeVisible();
      await expect(page.getByText("Related tools")).toBeVisible();
      await expect(page.getByRole("link", { name: /Can I Watch\? finder/i })).toBeVisible();
      await expectJsonLdType(page, "FAQPage");
      await expectJsonLdType(page, "BreadcrumbList");
      expectNoCriticalConsoleErrors(errors);
    });
  }

  test("unknown country returns not found", async ({ request }) => {
    const response = await request.get("/can-i-watch/wimbledon/atlantis", { failOnStatusCode: false });

    expect(response.status()).toBe(404);
  });
});
