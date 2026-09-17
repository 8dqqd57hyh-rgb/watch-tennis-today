import { expect, test } from "@playwright/test";
import {
  getCanonicalPlayerSlug,
  isCanonicalPlayerSlug,
  looksLikeClearlyInvalidPlayerSlug,
} from "../../data/playerSlugs";

test.describe("player alias resolution (unit-level)", () => {
  test("resolves historical abbreviated slugs to the verified canonical player", () => {
    expect(getCanonicalPlayerSlug("j-fonseca")).toBe("joao-fonseca");
    expect(getCanonicalPlayerSlug("v-gaubas")).toBe("vilius-gaubas");
    expect(getCanonicalPlayerSlug("d-prizmic")).toBe("dino-prizmic");
  });

  test("keeps existing verified players resolving to themselves", () => {
    expect(getCanonicalPlayerSlug("iga-swiatek")).toBe("iga-swiatek");
    expect(getCanonicalPlayerSlug("swiatek-iga")).toBe("iga-swiatek");
    expect(getCanonicalPlayerSlug("jannik-sinner")).toBe("jannik-sinner");
    expect(getCanonicalPlayerSlug("sinner-jannik")).toBe("jannik-sinner");
  });

  test("does not merge the three fixed players with unrelated surnames", () => {
    expect(getCanonicalPlayerSlug("v-gaubas")).not.toBe("joao-fonseca");
    expect(getCanonicalPlayerSlug("d-prizmic")).not.toBe("vilius-gaubas");
    // A bare surname fragment must not fuzzy-match any of the three.
    expect(getCanonicalPlayerSlug("gaubas")).toBeNull();
    expect(getCanonicalPlayerSlug("prizmic")).toBeNull();
  });

  test("keeps random, invalid and unknown slugs unresolved", () => {
    expect(getCanonicalPlayerSlug("totally-unknown-player-xyz")).toBeNull();
    expect(getCanonicalPlayerSlug("q-random")).toBeNull();
    // Any non-canonical multi-word slug (real unknown player or garbage) is
    // treated as an invalid link candidate by design, same as doubles-team
    // surname chains such as "shimizu-watanabe".
    expect(looksLikeClearlyInvalidPlayerSlug("totally-unknown-player-xyz")).toBe(true);
    expect(looksLikeClearlyInvalidPlayerSlug("shimizu-watanabe")).toBe(true);
  });

  test("the three fixed players are registered as canonical slugs", () => {
    expect(isCanonicalPlayerSlug("joao-fonseca")).toBe(true);
    expect(isCanonicalPlayerSlug("vilius-gaubas")).toBe(true);
    expect(isCanonicalPlayerSlug("dino-prizmic")).toBe(true);
  });
});

test.describe("player page resilience and content", () => {
  const fixedPlayers = [
    { slug: "joao-fonseca", name: "Joao Fonseca" },
    { slug: "vilius-gaubas", name: "Vilius Gaubas" },
    { slug: "dino-prizmic", name: "Dino Prizmic" },
  ];

  for (const { slug, name } of fixedPlayers) {
    test(`/player/${slug} renders a full profile without the "not verified" banner`, async ({ page }) => {
      const response = await page.goto(`/player/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { name, exact: true }).first()).toBeVisible();
      // Missing/failed live match data must not turn a verified profile into an
      // empty page, a 404, or the "not manually verified" placeholder banner.
      await expect(page.getByText("has not been manually verified yet")).toHaveCount(0);
    });
  }
});

test.describe("sitemap consistency for the fixed players", () => {
  test("sitemap includes the canonical player URLs, not legacy aliases", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    const body = await response.text();

    for (const slug of ["joao-fonseca", "vilius-gaubas", "dino-prizmic"]) {
      expect(body).toContain(`/player/${slug}`);
    }

    for (const legacySlug of ["j-fonseca", "v-gaubas", "d-prizmic"]) {
      expect(body).not.toContain(`/player/${legacySlug}<`);
    }
  });
});
