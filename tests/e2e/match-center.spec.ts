import { expect, test } from "@playwright/test";
import {
  buildMatchSchemas,
  findMatchBySlug,
  getMatchCoverageSummary,
  getMatchFaq,
  getMatchSeoDescription,
  getMatchSeoTitle,
  getMatchSlug,
  getMatchWatchOptions,
  isMatchPageIndexable,
  parseMatchSlug,
  shouldIncludeMatchInSitemap,
  type MatchCenterMatch,
} from "@/src/lib/matchCenter";

function match(overrides: Partial<MatchCenterMatch> = {}): MatchCenterMatch {
  return {
    id: "fixture:123",
    player1: "Jannik Sinner",
    player2: "Carlos Alcaraz",
    tournament: "Wimbledon",
    category: "ATP",
    status: "UPCOMING",
    score: "",
    startTime: "2026-07-10T13:00:00.000Z",
    round: "Semifinal",
    court: "Centre Court",
    surface: "Grass",
    watchProviders: [],
    ...overrides,
  };
}

test.describe("AI match center helpers", () => {
  test("generates and parses readable match slugs", () => {
    const slug = getMatchSlug(match());

    expect(slug).toBe("jannik-sinner-vs-carlos-alcaraz");
    expect(parseMatchSlug(slug)).toMatchObject({
      playerOneSlug: "jannik-sinner",
      playerTwoSlug: "carlos-alcaraz",
      playerOneName: "Jannik Sinner",
      playerTwoName: "Carlos Alcaraz",
    });
  });

  test("finds a match by slug from existing match data", async () => {
    const source = [
      match({ player1: "Iga Swiatek", player2: "Coco Gauff", id: "fixture:1" }),
      match({ id: "fixture:2" }),
    ];

    await expect(findMatchBySlug("jannik-sinner-vs-carlos-alcaraz", source)).resolves.toMatchObject({
      id: "fixture:2",
      tournament: "Wimbledon",
    });
  });

  test("builds SEO title and description from match facts", () => {
    expect(getMatchSeoTitle(match())).toBe(
      "Jannik Sinner vs Carlos Alcaraz: Time, TV Channel, Live Stream & How to Watch"
    );
    expect(getMatchSeoDescription(match())).toContain("Wimbledon");
    expect(getMatchSeoDescription(match())).toContain("official broadcaster checks");
  });

  test("protects thin or stale match pages from indexing", () => {
    expect(isMatchPageIndexable(match())).toBe(true);
    expect(shouldIncludeMatchInSitemap(match())).toBe(true);
    expect(isMatchPageIndexable(match({ tournament: "" }))).toBe(false);
    expect(isMatchPageIndexable(match({ startTime: null }))).toBe(false);
    expect(isMatchPageIndexable(match({ startTime: "2026-06-01T13:00:00.000Z" }))).toBe(false);
    expect(shouldIncludeMatchInSitemap(match({ status: "FINISHED" }))).toBe(false);
  });

  test("reuses broadcaster intelligence instead of hardcoded page data", () => {
    const options = getMatchWatchOptions(match(), ["usa", "uk", "poland"]);
    const summary = getMatchCoverageSummary(match());

    expect(options.length).toBeGreaterThan(0);
    expect(options[0]).toHaveProperty("lastVerified");
    expect(options[0]).toHaveProperty("officialSourceUrls");
    expect(summary.broadcasterCount).toBeGreaterThan(0);
    expect(summary.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test("generates SportsEvent, BreadcrumbList and FAQPage schema", () => {
    const schemas = buildMatchSchemas(match());
    const types = schemas.map((schema) => schema["@type"]);

    expect(types).toEqual(["SportsEvent", "BreadcrumbList", "FAQPage"]);
    expect(JSON.stringify(schemas[0])).toContain("Jannik Sinner vs Carlos Alcaraz");
    expect(getMatchFaq(match()).length).toBeGreaterThanOrEqual(3);
  });
});
