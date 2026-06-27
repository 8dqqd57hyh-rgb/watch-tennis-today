import { expect, test } from "@playwright/test";
import {
  calculateKnownMonthlyTotal,
  findBroadcasts,
  findBroadcastsForPlayer,
  getBroadcastCountryBySlug,
  getBroadcastCountryOptions,
  getCoverageSummary,
  getCountryBroadcastEntries,
  getCountryServiceOptions,
  tennisBroadcastDatabase,
  tennisBroadcastCountries,
  tennisTournamentGroups,
} from "../../src/data/tennisBroadcasts";

const grandSlamIds = ["australian-open", "roland-garros", "wimbledon", "us-open"];

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
