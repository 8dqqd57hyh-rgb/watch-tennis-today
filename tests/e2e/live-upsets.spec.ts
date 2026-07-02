import { expect, test } from "@playwright/test";
import {
  calculateUpsetCandidate,
  calculateUpsetScareCandidate,
  getUpsetCandidates,
  type UpsetMatch,
} from "@/lib/tennis/upsets";

function match(overrides: Partial<UpsetMatch> = {}): UpsetMatch {
  return {
    id: "sample-match",
    player1: "Higher Ranked Player",
    player2: "Lower Ranked Player",
    tournament: "Sample Tennis Event",
    category: "ATP",
    status: "LIVE",
    score: "3-6",
    startTime: "2026-07-01T12:00:00.000Z",
    round: "Round 2",
    ranking1: 12,
    ranking2: 86,
    ...overrides,
  };
}

test.describe("live tennis upset scoring", () => {
  test("detects a live lower-ranked player leading a higher-ranked player", () => {
    const candidate = calculateUpsetCandidate(match());

    expect(candidate?.type).toBe("live");
    expect(candidate?.favorite.name).toBe("Higher Ranked Player");
    expect(candidate?.underdog.name).toBe("Lower Ranked Player");
    expect(candidate?.rankingGap).toBe(74);
    expect(candidate?.scoreBreakdown.underdogSetLeadBonus).toBe(10);
  });

  test("detects a completed lower-ranked win", () => {
    const candidate = calculateUpsetCandidate(
      match({
        status: "Finished",
        score: "4-6, 3-6",
        round: "Final",
      })
    );

    expect(candidate?.type).toBe("completed");
    expect(candidate?.scoreExplanation).toContain("beat World No. 12");
    expect(candidate?.scoreBreakdown.underdogResultBonus).toBe(15);
    expect(candidate?.scoreBreakdown.roundBonus).toBe(10);
  });

  test("does not flag a match when the favorite is winning", () => {
    const candidate = calculateUpsetCandidate(
      match({
        score: "6-4",
      })
    );

    expect(candidate).toBeNull();
  });

  test("missing rankings do not crash or produce an alert", () => {
    const candidate = calculateUpsetCandidate(
      match({
        ranking1: undefined,
        ranking2: undefined,
      })
    );

    expect(candidate).toBeNull();
  });

  test("sorts upset candidates by score descending", () => {
    const candidates = getUpsetCandidates([
      match({ id: "small-gap", ranking1: 40, ranking2: 70, score: "3-6" }),
      match({ id: "large-gap", ranking1: 5, ranking2: 150, score: "3-6", round: "Semifinal" }),
    ]);

    expect(candidates).toHaveLength(2);
    expect(candidates[0].id).toBe("large-gap");
    expect(candidates[0].upsetScore).toBeGreaterThan(candidates[1].upsetScore);
  });

  test("detects a completed upset scare when the favorite survives a lower-ranked player", () => {
    const candidate = calculateUpsetScareCandidate(
      match({
        id: "upset-scare",
        player1: "Lower Ranked Player",
        player2: "Top Favorite",
        ranking1: 56,
        ranking2: 7,
        status: "Finished",
        score: "3-6, 6-3, 6-7",
      })
    );

    expect(candidate?.badgeLabel).toBe("Upset Scare");
    expect(candidate?.underdog.name).toBe("Lower Ranked Player");
    expect(candidate?.favorite.name).toBe("Top Favorite");
    expect(candidate?.scoreBreakdown.reasons).toContain("underdog won at least one set");
  });

  test("/live-tennis-upsets loads as an SEO page", async ({ page }) => {
    const response = await page.goto("/live-tennis-upsets", { waitUntil: "domcontentloaded" });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Live Tennis Upsets Today/);
    await expect(page.getByRole("heading", { name: "Live Tennis Upsets Today" })).toBeVisible();
    await expect(page.getByText("Upset scares and near misses")).toBeVisible();
  });
});
