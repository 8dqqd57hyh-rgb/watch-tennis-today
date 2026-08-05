import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  calculateTotalMonthlyPrice, formatStreamingPrice, isOfferExpired, isOfferStale,
  normalizeStreamingOffer, resolveStreamingOffers, selectPreferredOffers,
  validateStreamingOfferQuery, type StreamingDataProvider, type StreamingOffer,
} from "../../src/data/streamingOffers";

const base: StreamingOffer = {
  id: "test", tournamentSlug: "us-open", countryCode: "PL", providerName: "Provider",
  providerSlug: "provider", currency: "PLN", billingPeriod: "monthly",
  officialUrl: "https://example.com", sourceUrls: ["https://example.com/source"],
  lastCheckedAt: "2026-08-05T00:00:00.000Z", status: "verified",
};

function provider(source: "supabase" | "local-fallback", getOffers: StreamingDataProvider["getOffers"]): StreamingDataProvider { return { source, getOffers }; }

test.describe("streaming offer data", () => {
  test("calculates base plan plus add-on without duplicating a stored total", () => {
    expect(calculateTotalMonthlyPrice({ ...base, basePlan: { name: "Base", price: 29.99 }, sportsAddon: { name: "Sport", price: 15 } })).toBe(44.99);
    expect(normalizeStreamingOffer({ ...base, basePlan: { name: "Base", price: 29.99 }, sportsAddon: { name: "Sport", price: 15 }, totalMonthlyPrice: 999 })?.totalMonthlyPrice).toBe(44.99);
  });

  test("calculates an offer with no add-on", () => {
    expect(calculateTotalMonthlyPrice({ ...base, basePlan: { name: "Base", price: 12 } })).toBe(12);
  });

  test("detects age-based staleness and expired offers", () => {
    const now = new Date("2026-08-05T12:00:00.000Z");
    expect(isOfferStale({ ...base, lastCheckedAt: "2026-07-01T00:00:00.000Z" }, now, 168)).toBe(true);
    expect(isOfferExpired({ validUntil: "2026-08-04T00:00:00.000Z" }, now)).toBe(true);
  });

  test("formats known currencies and safely rejects invalid currencies", () => {
    expect(formatStreamingPrice(44.99, "PLN", "pl-PL")).toContain("44,99");
    expect(formatStreamingPrice(10, "not-currency", "en")).toBeNull();
    expect(formatStreamingPrice(10, undefined, "en")).toBeNull();
  });

  test("validates and normalizes API query parameters", () => {
    expect(validateStreamingOfferQuery(new URL("https://example.com/api?country=pl&tournament=us-open"))).toMatchObject({ ok: true, countryCode: "PL", tournamentSlug: "us-open" });
    expect(validateStreamingOfferQuery(new URL("https://example.com/api?country=Poland&tournament="))).toMatchObject({ ok: false });
  });

  test("uses fallback data when the remote source fails", async () => {
    const result = await resolveStreamingOffers({ tournamentSlug: "us-open", countryCode: "PL" }, provider("supabase", async () => { throw new Error("offline"); }), provider("local-fallback", async () => [base]), new Date("2026-08-05T12:00:00Z"));
    expect(result.offers).toHaveLength(1);
    expect(result.meta).toMatchObject({ source: "local-fallback", isFallback: true });
  });

  test("supports empty results and multiple providers", async () => {
    const empty = await resolveStreamingOffers({ tournamentSlug: "us-open", countryCode: "PL" }, provider("supabase", async () => []), provider("local-fallback", async () => []));
    expect(empty.offers).toEqual([]);
    const second = { ...base, id: "second", providerSlug: "second" };
    expect(selectPreferredOffers([base, second])).toHaveLength(2);
  });

  test("prioritizes a manual override over automatic data", () => {
    const automatic = { ...base, id: "automatic", verificationMethod: "automatic" as const, verifiedAt: "2026-08-05T10:00:00Z" };
    const manual = { ...base, id: "manual", verificationMethod: "manual" as const, verifiedAt: "2026-08-04T10:00:00Z" };
    expect(selectPreferredOffers([automatic, manual])).toEqual([manual]);
  });

  test("filters expired and unavailable offers from active responses", async () => {
    const expired = { ...base, id: "expired", validUntil: "2026-08-04T00:00:00Z" };
    const unavailable = { ...base, id: "gone", providerSlug: "gone", status: "unavailable" as const };
    const result = await resolveStreamingOffers({ tournamentSlug: "us-open", countryCode: "PL" }, provider("supabase", async () => [expired, unavailable]), provider("local-fallback", async () => []), new Date("2026-08-05T00:00:00Z"));
    expect(result.offers).toEqual([]);
  });

  test("keeps Poland-specific values out of React components", () => {
    const component = readFileSync("app/components/StreamingOfferCard.tsx", "utf8");
    expect(component).not.toMatch(/29\.99|44\.99|Kanały TV i Sport|HBO Max|Eurosport 1/);
  });
});

test("streaming API validates input and returns fallback data", async ({ request }) => {
  const invalid = await request.get("/api/streaming-offers?tournament=US Open&country=Poland");
  expect(invalid.status()).toBe(400);
  const response = await request.get("/api/streaming-offers?tournament=us-open&country=pl");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toMatchObject({ tournamentSlug: "us-open", countryCode: "PL", offers: [{ id: "us-open-pl-max-eurosport", totalMonthlyPrice: 44.99 }], meta: { source: "local-fallback", isFallback: true } });
});

test("country page server-renders the normalized offer and source attribution", async ({ page, request }) => {
  const html = await (await request.get("/can-i-watch/us-open/poland")).text();
  expect(html).toContain("HBO Max");
  expect(html).toContain("44,99");
  await page.goto("/can-i-watch/us-open/poland", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Subscription and streaming details" })).toBeVisible();
  await expect(page.getByText(/Choose Standard and add Kanały TV i Sport\. Your calculated monthly cost is 44,99/)).toBeVisible();
  await expect(page.getByText("Every court is available to stream according to the reviewed coverage source.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Check provider offer" })).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.getByText("Sources", { exact: true })).toBeVisible();
});
