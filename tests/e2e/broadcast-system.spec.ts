import { expect, test, type Page } from "@playwright/test";
import {
  calculateKnownMonthlyTotal,
  findBroadcasts,
  findBroadcastsForPlayer,
  getBroadcastCountryBySlug,
  getBroadcastCountryOptions,
  getCoverageSummary,
  getCountryBroadcastEntries,
  getCountryServiceOptions,
  getNormalizedBroadcastRecords,
  normalizeCountry,
  normalizeTournament,
  tennisBroadcastDatabase,
  tennisBroadcastCountries,
  tennisTournamentGroups,
  validateBroadcastDatabase,
  type TennisCountryBroadcastDatabase,
} from "../../src/data/tennisBroadcasts";

const grandSlamIds = ["australian-open", "roland-garros", "wimbledon", "us-open"];

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

async function expectMetaContent(page: Page, selector: string, expected: string | RegExp) {
  await expect(page.locator(selector)).toHaveAttribute("content", expected);
}

test.describe("tennis broadcaster database", () => {
  test("stores Grand Slams separately from ATP and WTA rows", () => {
    const usaEntries = getCountryBroadcastEntries("US");
    const usaGrandSlams = usaEntries.filter((entry) => entry.eventType === "grand_slam");
    const usaTours = usaEntries.filter((entry) => entry.eventType === "tour");

    expect(usaGrandSlams.map((entry) => entry.tournamentId).sort()).toEqual([...grandSlamIds].sort());
    expect(usaTours.map((entry) => entry.tournamentId).sort()).toEqual(["atp-tour", "wta-tour"].sort());
  });

  test("has supported country rows without an other-Europe bucket", () => {
    for (const country of tennisBroadcastCountries) {
      const entries = getCountryBroadcastEntries(country.countryCode);

      expect(entries).toHaveLength(6);
      expect(entries.every((entry) => entry.countryCode === country.countryCode)).toBe(true);
      expect(entries.some((entry) => /other/i.test(entry.countryName))).toBe(false);
    }
  });

  test("keeps unknown prices out of the monthly total", () => {
    const services = getCountryServiceOptions("US");
    const tennisChannel = services.find((service) => service.serviceName === "Tennis Channel app");
    const espn = services.find((service) => service.serviceName === "ESPN platforms");

    expect(tennisChannel?.knownMonthlyPrice).toBe(11.99);
    expect(espn?.knownMonthlyPrice).toBeUndefined();

    const result = calculateKnownMonthlyTotal(
      services,
      [tennisChannel?.id, espn?.id].filter(Boolean) as string[],
    );

    expect(result.total).toBe(11.99);
    expect(result.knownServices.map((service) => service.serviceName)).toContain("Tennis Channel app");
    expect(result.unknownServices.map((service) => service.serviceName)).toContain("ESPN platforms");
  });

  test("exposes country-specific known service prices", () => {
    const ukServices = getCountryServiceOptions("GB");
    const now = ukServices.find((service) => service.serviceName === "NOW / Sky Go");

    expect(now?.knownMonthlyPrice).toBe(34.99);
    expect(now?.currency).toBe("GBP");
    expect(now?.tournamentIds).toEqual(expect.arrayContaining(["atp-tour", "wta-tour", "us-open"]));
  });

  test("has the required Grand Slam tournament labels", () => {
    expect(tennisTournamentGroups.filter((group) => group.eventType === "grand_slam").map((group) => group.tournamentName)).toEqual([
      "Australian Open",
      "Roland Garros / French Open",
      "Wimbledon",
      "US Open",
    ]);
  });

  test("derives Can I Watch country options from the broadcast database", () => {
    const options = getBroadcastCountryOptions();

    expect(options).toHaveLength(tennisBroadcastDatabase.length);
    expect(options.map((country) => country.countryCode).sort()).toEqual(
      tennisBroadcastDatabase.map((country) => country.countryCode).sort(),
    );
    expect(options.find((country) => country.countryCode === "US")?.slug).toBe("usa");
    expect(options.find((country) => country.countryCode === "GB")?.slug).toBe("uk");
  });

  test("matches broadcast countries by slug, code and country name", () => {
    expect(getBroadcastCountryBySlug("poland")?.countryCode).toBe("PL");
    expect(getBroadcastCountryBySlug("PL")?.slug).toBe("poland");
    expect(getBroadcastCountryBySlug("Poland")?.slug).toBe("poland");
    expect(getBroadcastCountryBySlug("united-states")?.slug).toBe("usa");
  });

  test("normalizes country aliases", () => {
    expect(normalizeCountry("UK")).toBe("uk");
    expect(normalizeCountry("Great Britain")).toBe("uk");
    expect(normalizeCountry("Britain")).toBe("uk");
    expect(normalizeCountry("GB")).toBe("uk");
    expect(normalizeCountry("United Kingdom")).toBe("uk");
    expect(normalizeCountry("USA")).toBe("usa");
    expect(normalizeCountry("US")).toBe("usa");
    expect(normalizeCountry("United States")).toBe("usa");
    expect(normalizeCountry("America")).toBe("usa");
    expect(normalizeCountry("Czechia")).toBe("czechia");
    expect(normalizeCountry("Czech Republic")).toBe("czechia");
  });

  test("normalizes tournament aliases", () => {
    expect(normalizeTournament("French Open")).toBe("roland-garros");
    expect(normalizeTournament("Roland Garros")).toBe("roland-garros");
    expect(normalizeTournament("Roland-Garros")).toBe("roland-garros");
    expect(normalizeTournament("RG")).toBe("roland-garros");
    expect(normalizeTournament("US Open")).toBe("us-open");
    expect(normalizeTournament("U.S. Open")).toBe("us-open");
    expect(normalizeTournament("Australian Open")).toBe("australian-open");
    expect(normalizeTournament("AO")).toBe("australian-open");
    expect(normalizeTournament("Wimbledon Championships")).toBe("wimbledon");
    expect(normalizeTournament("ATP Finals")).toBe("atp-tour");
    expect(normalizeTournament("Nitto Finals")).toBe("atp-tour");
    expect(normalizeTournament("WTA Finals")).toBe("wta-tour");
  });

  test("finds the same Wimbledon rows for Poland by slug, code and name", () => {
    const bySlug = findBroadcasts("poland", "wimbledon");
    const byCode = findBroadcasts("PL", "wimbledon");
    const byName = findBroadcasts("Poland", "Wimbledon");

    expect(bySlug).toHaveLength(1);
    expect(bySlug.map((entry) => entry.tournamentId)).toEqual(["wimbledon"]);
    expect(byCode).toEqual(bySlug);
    expect(byName).toEqual(bySlug);
  });

  test("maps French Open queries to Roland Garros rows", () => {
    const rows = findBroadcasts("usa", "french open");

    expect(rows).toHaveLength(1);
    expect(rows[0]?.countryCode).toBe("US");
    expect(rows[0]?.tournamentId).toBe("roland-garros");
  });

  test("matches aliases case, accent, hyphen and space insensitively", () => {
    expect(findBroadcasts("America", "U.S. Open").map((entry) => entry.tournamentId)).toEqual(["us-open"]);
    expect(findBroadcasts("great britain", "Roland-Garros").map((entry) => entry.tournamentId)).toEqual(["roland-garros"]);
    expect(findBroadcasts("GB", "roland garros").map((entry) => entry.tournamentId)).toEqual(["roland-garros"]);
  });

  test("maps popular player aliases to tour coverage", () => {
    const rows = findBroadcastsForPlayer("GB", "Carlos Alcaraz");

    expect(rows).toHaveLength(1);
    expect(rows[0]?.countryCode).toBe("GB");
    expect(rows[0]?.tournamentId).toBe("atp-tour");
  });

  test("summarizes Can I Watch coverage fields", () => {
    const summary = getCoverageSummary("PL", "wimbledon");

    expect(summary.broadcasterCount).toBe(1);
    expect(summary.freeRouteCount).toBe(0);
    expect(summary.subscriptionRouteCount).toBe(1);
    expect(summary.lastVerified).toBe("2026-06-21");
    expect(summary.confidenceLevels).toEqual(["partial"]);
  });

  test("exposes normalized broadcast records with required fields", () => {
    const records = getNormalizedBroadcastRecords();
    const polandWimbledon = records.find((record) => record.countrySlug === "poland" && record.tournamentSlug === "wimbledon");

    expect(records).toHaveLength(72);
    expect(polandWimbledon).toMatchObject({
      countryCode: "PL",
      countryName: "Poland",
      countrySlug: "poland",
      tournamentSlug: "wimbledon",
      tournamentName: "Wimbledon",
      broadcasterName: "Polsat",
      officialUrl: "https://www.wimbledon.com/en_GB/about/tv_coverage",
      streamingService: "Polsat Box Go or current Polsat sports access",
      free: false,
      subscriptionRequired: true,
      confidence: "partial",
      lastVerified: "2026-06-21",
    });
    expect(polandWimbledon?.id).toBe("poland:wimbledon:polsat:polsat-box-go-or-current-polsat-sports-access");
  });

  test("supports per-row last verified dates without changing the global default", () => {
    const refreshedDatabase = structuredClone(tennisBroadcastDatabase) as TennisCountryBroadcastDatabase[];
    refreshedDatabase[0].groups[2].services[0].lastVerified = "2026-06-27";

    const records = getNormalizedBroadcastRecords(refreshedDatabase);
    const refreshedRecord = records.find((record) => record.countrySlug === "poland" && record.tournamentSlug === "wimbledon");
    const defaultRecord = records.find((record) => record.countrySlug === "poland" && record.tournamentSlug === "australian-open");
    const validation = validateBroadcastDatabase(refreshedDatabase, { referenceDate: "2026-06-28" });

    expect(refreshedRecord?.lastVerified).toBe("2026-06-27");
    expect(defaultRecord?.lastVerified).toBe("2026-06-21");
    expect(validation.isValid).toBe(true);
    expect(validation.warnings).toEqual([]);
  });

  test("validates the broadcaster database", () => {
    const result = validateBroadcastDatabase(tennisBroadcastDatabase, { referenceDate: "2026-06-28" });

    expect(result.isValid).toBe(true);
    expect(result.recordCount).toBe(72);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  test("warns when broadcaster rows need freshness review", () => {
    const staleDatabase = structuredClone(tennisBroadcastDatabase) as TennisCountryBroadcastDatabase[];
    staleDatabase[0].groups[2].services[0].lastVerified = "2025-01-15";

    const result = validateBroadcastDatabase(staleDatabase, { referenceDate: "2026-06-28", staleAfterDays: 365 });

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.warnings.map((warning) => warning.code)).toContain("stale_last_verified");
    expect(result.warnings.find((warning) => warning.code === "stale_last_verified")?.path).toBe("countries[0].groups[2].services[0].lastVerified");
  });

  test("detects duplicate mappings and invalid fields", () => {
    const invalidDatabase = structuredClone(tennisBroadcastDatabase) as TennisCountryBroadcastDatabase[];
    const duplicateService = structuredClone(invalidDatabase[0].groups[0].services[0]);
    invalidDatabase[0].groups[0].services.push(duplicateService);
    invalidDatabase[0].groups[1].services[0].officialWebsiteUrl = "not-a-url";
    invalidDatabase[0].groups[2].services[0].broadcasterName = "";
    invalidDatabase[0].groups[3].services[0].isFree = "sometimes" as unknown as boolean;
    invalidDatabase[0].groups[4].services[0].confidenceLevel = "maybe" as never;
    invalidDatabase[0].groups[5].services[0].lastVerified = "June 21 2026";

    const result = validateBroadcastDatabase(invalidDatabase, { referenceDate: "2026-06-28" });
    const codes = result.errors.map((error) => error.code);

    expect(result.isValid).toBe(false);
    expect(codes).toEqual(expect.arrayContaining([
      "duplicate_id",
      "duplicate_mapping",
      "invalid_url",
      "missing_required_field",
      "invalid_boolean",
      "invalid_confidence",
      "invalid_last_verified",
    ]));
  });
});

test.describe("broadcaster UI", () => {
  test("country page renders ATP, WTA, Grand Slams, prices and FAQs", async ({ page }) => {
    await page.goto("/watch-tennis-in/usa", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /where to watch tennis in united states/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Grand Slams", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ATP Tour", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "WTA Tour", exact: true })).toBeVisible();
    await expect(page.getByText("Tennis Channel monthly subscription: USD 11.99/month before taxes and fees")).toBeVisible();
    await expect(page.getByText(/Last verified: 2026-06-21/).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Who shows the Grand Slams in United States/i })).toBeVisible();
  });

  test("cost calculator uses country services and separates unknown prices", async ({ page }) => {
    await page.goto("/tennis-streaming-cost-calculator", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "Monthly total" })).toBeVisible();
    await page.locator("select").first().selectOption("US");
    await page.getByRole("checkbox", { name: /^Tennis Channel app/ }).click();
    await page.getByRole("checkbox", { name: /ESPN platforms/ }).click();

    await expect(page.getByText("$11.99", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("No stable monthly price stored")).toBeVisible();
    await expect(page.getByText("ESPN platforms", { exact: true }).first()).toBeVisible();
  });

  test("service picker recommends services for selected tournament groups", async ({ page }) => {
    await page.goto("/tennis-streaming-service-picker", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: /Recommended services for United States/i })).toBeVisible();
    await expect(page.getByText("Tennis Channel app").first()).toBeVisible();
    await expect(page.getByText("ESPN platforms").first()).toBeVisible();
    await expect(page.getByText("$11.99/month").first()).toBeVisible();
  });
});

test.describe("broadcaster metadata and schema", () => {
  test("broadcaster directory exposes canonical metadata, OG tags and collection schema", async ({ page }) => {
    await page.goto("/broadcasters", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle("Tennis Broadcasters | Official TV & Streaming Services by Country");
    await expectMetaContent(
      page,
      'meta[name="description"]',
      "Browse tennis broadcasters and streaming services by country, tournament coverage, free or paid status, source confidence and last verified date.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://watchtennistoday.com/broadcasters");
    await expectMetaContent(page, 'meta[property="og:title"]', "Tennis Broadcasters");
    await expectMetaContent(page, 'meta[property="og:url"]', "https://watchtennistoday.com/broadcasters");
    await expectJsonLdType(page, "BreadcrumbList");
    await expectJsonLdType(page, "FAQPage");
    await expectJsonLdType(page, "CollectionPage");
  });

  test("broadcaster profile exposes profile metadata, social tags and service schema", async ({ page }) => {
    await page.goto("/broadcaster/espn", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle("ESPN Tennis Coverage | Countries, Tournaments & Streaming Notes");
    await expectMetaContent(
      page,
      'meta[name="description"]',
      "Check ESPN tennis coverage by country and tournament, including free/paid status, official links, confidence level and last verified dates.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://watchtennistoday.com/broadcaster/espn");
    await expectMetaContent(page, 'meta[property="og:title"]', "ESPN Tennis Coverage | Countries, Tournaments & Streaming Notes");
    await expectMetaContent(page, 'meta[property="og:url"]', "https://watchtennistoday.com/broadcaster/espn");
    await expectMetaContent(page, 'meta[name="twitter:card"]', "summary_large_image");
    await expectJsonLdType(page, "BreadcrumbList");
    await expectJsonLdType(page, "FAQPage");
    await expectJsonLdType(page, "Service");
  });

  test("Can I Watch finder exposes route metadata, schema and SEO detail links", async ({ page }) => {
    await page.goto("/can-i-watch", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle("Can I Watch This Tennis Match? | Country & Broadcaster Finder");
    await expect(page.getByRole("heading", { name: /can i watch this tennis match/i })).toBeVisible();
    await expectMetaContent(
      page,
      'meta[name="description"]',
      "Choose a country and player or tournament to find official tennis broadcasters, streaming services, free/paid notes and verification links.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://watchtennistoday.com/can-i-watch");
    await expectMetaContent(page, 'meta[property="og:title"]', "Can I Watch This Tennis Match?");
    await expectMetaContent(page, 'meta[property="og:url"]', "https://watchtennistoday.com/can-i-watch");
    await expectJsonLdType(page, "BreadcrumbList");
    await expectJsonLdType(page, "WebSite");
    await expectJsonLdType(page, "FAQPage");

    await page.getByLabel("Country").selectOption("usa");
    await page.getByPlaceholder("Wimbledon, Iga Swiatek, Carlos Alcaraz...").fill("Wimbledon");

    await expect(page.getByText("ESPN", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Open SEO page" })).toHaveAttribute("href", "/can-i-watch/wimbledon/usa");
  });

  test("Can I Watch detail pages expose canonical metadata and FAQ schema", async ({ page }) => {
    await page.goto("/can-i-watch/wimbledon/usa", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle("Can I Watch Wimbledon in United States? | Tennis Broadcasters");
    await expectMetaContent(
      page,
      'meta[name="description"]',
      "Find official tennis broadcasters and streaming services for Wimbledon in United States, including free/paid notes, confidence level and source links.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://watchtennistoday.com/can-i-watch/wimbledon/usa");
    await expectMetaContent(page, 'meta[property="og:title"]', "Can I Watch Wimbledon in United States? | Tennis Broadcasters");
    await expectMetaContent(page, 'meta[property="og:url"]', "https://watchtennistoday.com/can-i-watch/wimbledon/usa");
    await expectJsonLdType(page, "BreadcrumbList");
    await expectJsonLdType(page, "FAQPage");
  });
});
