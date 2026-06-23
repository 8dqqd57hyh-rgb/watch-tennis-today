import { expect, test } from "@playwright/test";
import {
  calculateKnownMonthlyTotal,
  getCountryBroadcastEntries,
  getCountryServiceOptions,
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
