import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { getMatchLifecycle } from "@/app/lib/matchLifecycle";
import { NOINDEX_ONLY_PATHS, REDIRECT_ONLY_PATHS, SITE_URL } from "@/app/lib/technicalSeo";

const indexablePages = ["/", "/today", "/live-tennis", "/players", "/tournament", "/about", "/wimbledon-order-of-play"];
const intentionallyNoindexPages = new Set(["/tennis-schedule-today"]);

const expectedCanonicals: Record<string, string> = {
  "/": "https://watchtennistoday.com",
  "/today": "https://watchtennistoday.com/today",
  "/live-tennis": "https://watchtennistoday.com/live-tennis",
  "/players": "https://watchtennistoday.com/players",
  "/tournament": "https://watchtennistoday.com/tournament",
  "/about": "https://watchtennistoday.com/about",
  "/wimbledon-order-of-play": "https://watchtennistoday.com/wimbledon-order-of-play",
};

const canonicalPlayerSlugCases = [
  { path: "/player/j-fonseca", canonical: "https://watchtennistoday.com/player/joao-fonseca" },
  { path: "/player/swiatek-iga", canonical: "https://watchtennistoday.com/player/iga-swiatek" },
  { path: "/player/sinner-jannik", canonical: "https://watchtennistoday.com/player/jannik-sinner" },
];

const dailyLandingPages = [
  {
    path: "/tennis-schedule-today",
    canonical: "https://watchtennistoday.com/tennis-schedule-today",
    h1: "Tennis Schedule Today",
  },
  {
    path: "/tennis-schedule-tomorrow",
    canonical: "https://watchtennistoday.com/tennis-schedule-tomorrow",
    h1: "Tennis Schedule Tomorrow",
  },
  {
    path: "/tennis-results-today",
    canonical: "https://watchtennistoday.com/tennis-results-today",
    h1: "Tennis Results Today",
  },
  {
    path: "/tennis-order-of-play-today",
    canonical: "https://watchtennistoday.com/tennis-order-of-play-today",
    h1: "Tennis Order of Play Today",
  },
  {
    path: "/best-tennis-matches-today",
    canonical: "https://watchtennistoday.com/best-tennis-matches-today",
    h1: "Best Tennis Matches Today",
  },
  {
    path: "/watch-tennis-live-today",
    canonical: "https://watchtennistoday.com/watch-tennis-live-today",
    h1: "Watch Tennis Live Today",
  },
];

const wimbledonCountryLandingPages = [
  {
    path: "/how-to-watch-wimbledon-in-usa",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-usa",
    h1: "How to Watch Wimbledon in USA",
    anchorText: "How to watch Wimbledon in the USA",
  },
  {
    path: "/how-to-watch-wimbledon-in-uk",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-uk",
    h1: "How to Watch Wimbledon in UK",
    anchorText: "Wimbledon TV and streaming in the UK",
  },
  {
    path: "/how-to-watch-wimbledon-in-canada",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-canada",
    h1: "How to Watch Wimbledon in Canada",
    anchorText: "How to watch Wimbledon in Canada",
  },
  {
    path: "/how-to-watch-wimbledon-in-australia",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-australia",
    h1: "How to Watch Wimbledon in Australia",
    anchorText: "Wimbledon TV and streaming in Australia",
  },
  {
    path: "/how-to-watch-wimbledon-in-poland",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-poland",
    h1: "How to Watch Wimbledon in Poland",
    anchorText: "How to watch Wimbledon in Poland",
  },
  {
    path: "/how-to-watch-wimbledon-in-germany",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-germany",
    h1: "How to Watch Wimbledon in Germany",
    anchorText: "How to watch Wimbledon in Germany",
  },
  {
    path: "/how-to-watch-wimbledon-in-france",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-france",
    h1: "How to Watch Wimbledon in France",
    anchorText: "Wimbledon TV and streaming in France",
  },
  {
    path: "/how-to-watch-wimbledon-in-spain",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-spain",
    h1: "How to Watch Wimbledon in Spain",
    anchorText: "How to watch Wimbledon in Spain",
  },
  {
    path: "/how-to-watch-wimbledon-in-italy",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-italy",
    h1: "How to Watch Wimbledon in Italy",
    anchorText: "Wimbledon TV and streaming in Italy",
  },
  {
    path: "/how-to-watch-wimbledon-in-india",
    canonical: "https://watchtennistoday.com/how-to-watch-wimbledon-in-india",
    h1: "How to Watch Wimbledon in India",
    anchorText: "How to watch Wimbledon in India",
  },
];

const wimbledonCountryLinkSources = [
  "/wimbledon",
  "/where-to-watch-wimbledon",
  "/wimbledon-tv-schedule",
];

function canonicalHref(html: string) {
  for (const [, tag] of html.matchAll(/<link\b([^>]*)>/gi)) {
    if (!/\brel=["']canonical["']/i.test(tag)) continue;
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
  }

  return undefined;
}

function metaContent(html: string, name: string) {
  for (const [, tag] of html.matchAll(/<meta\b([^>]*)>/gi)) {
    if (!new RegExp(`\\bname=["']${name}["']`, "i").test(tag)) continue;
    return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1];
  }

  return undefined;
}

function h1Text(html: string) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);

  return match?.[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

test.describe("SEO-critical page basics", () => {
  test.describe.configure({ mode: "serial" });

  for (const path of indexablePages) {
    test(`${path} has indexable metadata and footer links`, async ({ request }) => {
      const response = await request.get(path, { failOnStatusCode: false });
      const html = await response.text();

      expect(response.status()).toBe(200);

      expect(html).toMatch(/<h1[\s>]/i);
      expect(html).toMatch(/<title>[^<\s][^<]*<\/title>/i);

      expect(metaContent(html, "description")).toMatch(/\S/);
      expect(canonicalHref(html)).toBe(expectedCanonicals[path]);

      const robots = metaContent(html, "robots")?.toLowerCase();
      if (robots) {
        if (!intentionallyNoindexPages.has(path)) {
          expect(robots).not.toContain("noindex");
        }
      }

      expect(html).toMatch(/<footer[\s>]/i);
      expect(html).toContain("About");
      expect(html).toContain("Privacy Policy");
      expect(html).toContain("Disclaimer");
    });
  }

  test("robots.txt allows public pages and advertises the canonical sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt", { failOnStatusCode: false });
    const body = await response.text();

    expect(response.status()).toBe(200);
    expect(body).toContain("Allow: /");
    expect(body).not.toMatch(/Disallow:\s*\/(?:\r?\n|$)/);
    expect(body).toContain("Sitemap: https://watchtennistoday.com/sitemap.xml");
  });

  test("sitemap prioritizes stable SEO pages and excludes volatile watch pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml", { failOnStatusCode: false });
    const xml = await response.text();
    const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);

    expect(response.status()).toBe(200);
    expect(urls.length).toBeGreaterThan(20);
    expect(urls.length).toBeLessThan(500);
    expect(urls).toContain("https://watchtennistoday.com");
    expect(urls).toContain("https://watchtennistoday.com/today");
    expect(urls).toContain("https://watchtennistoday.com/live-tennis");
    expect(urls).toContain("https://watchtennistoday.com/who-plays-tennis-today");
    expect(urls).toContain("https://watchtennistoday.com/tennis-watchlist-today");
    expect(urls).toContain("https://watchtennistoday.com/tennis-spoiler-free-scores");
    expect(urls).toContain("https://watchtennistoday.com/tennis-court-surfaces");
    expect(urls).toContain("https://watchtennistoday.com/players");
    expect(urls).toContain("https://watchtennistoday.com/tournament");
    expect(urls).toContain("https://watchtennistoday.com/grand-slam-live");
    expect(urls).toContain("https://watchtennistoday.com/wimbledon-live");
    expect(urls).toContain("https://watchtennistoday.com/wimbledon-order-of-play");
    expect(urls).not.toContain("https://watchtennistoday.com/french-open-schedule");
    expect(urls).toContain("https://watchtennistoday.com/watch-sinner-live");
    expect(urls).toContain("https://watchtennistoday.com/watch-alcaraz-live");
    expect(urls).toContain("https://watchtennistoday.com/watch-djokovic-live");
    expect(urls).not.toContain("https://watchtennistoday.com/watch-player-live/iga-swiatek");
    expect(urls).not.toContain("https://watchtennistoday.com/watch-swiatek-live");
    expect(urls.some((url) => url.includes("/watch/"))).toBe(false);
  });

  test("sitemap excludes redirect-only and noindex-only paths", async ({ request }) => {
    const response = await request.get("/sitemap.xml", { failOnStatusCode: false });
    const xml = await response.text();
    const urls = Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);

    expect(response.status()).toBe(200);

    for (const redirectOnlyPath of REDIRECT_ONLY_PATHS) {
      expect(urls).not.toContain(`${SITE_URL}${redirectOnlyPath}`);
    }

    for (const noindexOnlyPath of NOINDEX_ONLY_PATHS) {
      expect(urls).not.toContain(`${SITE_URL}${noindexOnlyPath}`);
    }
  });

  test("root layout does not define a homepage canonical for all pages", () => {
    const layoutSource = fs.readFileSync(path.join(process.cwd(), "app", "layout.tsx"), "utf8");

    expect(layoutSource).not.toMatch(/alternates\s*:\s*\{[\s\S]*canonical\s*:\s*["']https:\/\/watchtennistoday\.com["']/);
  });

  for (const { path, canonical, h1 } of wimbledonCountryLandingPages) {
    test(`${path} is indexable with self-referencing Wimbledon metadata`, async ({ request }) => {
      const response = await request.get(path, { failOnStatusCode: false });
      const html = await response.text();

      expect(response.status()).toBe(200);
      expect(canonicalHref(html)).toBe(canonical);
      expect(h1Text(html)).toContain(h1);
      expect(metaContent(html, "description")?.length || 0).toBeGreaterThan(80);
      expect(html).toContain("Official TV and streaming options");
      expect(html).toContain("Time zone note");
      expect(html).toContain("FAQPage");
      expect(html).toContain("/wimbledon-schedule");
      expect(html).toContain("/wimbledon-order-of-play");
      expect(html).toContain("/wimbledon-tv-schedule");
      expect(html).toContain("/where-to-watch-wimbledon");

      const robots = metaContent(html, "robots")?.toLowerCase();
      expect(robots ?? "").not.toContain("noindex");
    });
  }

  test("Wimbledon country landing pages are listed in sitemap source and output", async ({ request }) => {
    const sitemapSource = fs.readFileSync(path.join(process.cwd(), "app", "sitemap.ts"), "utf8");
    const response = await request.get("/sitemap.xml", { failOnStatusCode: false });
    const xml = await response.text();

    expect(response.status()).toBe(200);
    expect(sitemapSource).toContain("WIMBLEDON_COUNTRY_SLUGS");

    for (const { path, canonical } of wimbledonCountryLandingPages) {
      expect(sitemapSource).toContain("how-to-watch-wimbledon-in-${country}");
      expect(xml).toContain(`<loc>${canonical}</loc>`);
      expect(path).toMatch(/^\/how-to-watch-wimbledon-in-/);
    }
  });

  for (const sourcePath of wimbledonCountryLinkSources) {
    test(`${sourcePath} links to Wimbledon country guides with descriptive anchors`, async ({ request }) => {
      const response = await request.get(sourcePath, { failOnStatusCode: false });
      const html = await response.text();

      expect(response.status()).toBe(200);
      expect(html).toContain("How to watch Wimbledon by country");

      for (const { path, anchorText } of wimbledonCountryLandingPages) {
        expect(html).toContain(`href="${path}"`);
        expect(html).toContain(anchorText);
      }
    });
  }

  for (const { path, canonical, h1 } of dailyLandingPages) {
    test(`${path} has improved SEO landing-page signals`, async ({ request }) => {
      const response = await request.get(path, { failOnStatusCode: false });
      const html = await response.text();

      expect(response.status()).toBe(200);
      expect(canonicalHref(html)).toBe(canonical);
      expect(h1Text(html)).toContain(h1);
      expect(metaContent(html, "description")?.length || 0).toBeGreaterThan(80);
      expect(html).toContain("Last updated:");
      expect(html).toContain("FAQ");
      expect(html).toContain("FAQPage");
      expect(html).toContain("BreadcrumbList");
      expect(html).toContain('data-testid="related-links"');
      expect(html.toLowerCase()).not.toContain("live tennis matches right now");
      expect(html).toContain("does not claim a match is live");
    });
  }

  test("Wimbledon order of play page renders key SEO content and links", async ({ request }) => {
    const response = await request.get("/wimbledon-order-of-play", {
      failOnStatusCode: false,
    });
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Wimbledon Order of Play Today");
    expect(html).toContain("Today&#x27;s Wimbledon matches");
    expect(html).toContain("/wimbledon-live");
    expect(html).toContain("/wimbledon-schedule");
    expect(html).toContain("/wimbledon-results");
    expect(html).toContain("/live-tennis");
    expect(html).toContain("/today");
    expect(html).toContain("/players");
    expect(html).toContain("FAQPage");
    expect(html).toContain("BreadcrumbList");
  });

  for (const { path, canonical } of canonicalPlayerSlugCases) {
    test(`${path} resolves to a verified player canonical without hub collapse`, async ({ request }) => {
      const response = await request.get(path, { failOnStatusCode: false });
      const html = await response.text();

      expect(response.status()).toBe(200);
      expect(response.url()).not.toMatch(/\/players$/);
      expect(html).toMatch(/<h1[\s>]/i);
      expect(canonicalHref(html)).toBe(canonical);
    });
  }

  test("player page renders a compact useful profile instead of an SEO-heavy long page", async ({ request }) => {
    const response = await request.get("/player/jannik-sinner", {
      failOnStatusCode: false,
    });
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Jannik Sinner");
    expect(html).toContain("Match center");
    expect(html).toMatch(/Where to watch\s*(?:<!-- -->)?\s*Jannik Sinner/);
    expect(html).toContain("Related players");
    expect(html).not.toContain("Sources for this player page");
    expect(html).not.toContain("About Jannik Sinner Matches and Coverage");
    expect(html).not.toContain("live stream and schedule FAQ");
  });

  test("expired watch match pages do not get sitemap-style index signals", async ({ request }) => {
    const response = await request.get("/watch/i-jovic-vs-a-eala-12129955", {
      failOnStatusCode: false,
    });
    const html = await response.text();

    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) {
      expect(canonicalHref(html)).toBe("https://watchtennistoday.com/watch/i-jovic-vs-a-eala-12129955");
      const robots = (metaContent(html, "robots") || "").toLowerCase();
      expect(robots).toContain("noindex");
    }
  });

  test("watch match fallback renders a basic match hub without fake broadcaster data", async ({ request }) => {
    const response = await request.get("/watch/carlos-alcaraz-vs-jannik-sinner-999999999", {
      failOnStatusCode: false,
      headers: {
        "user-agent": "Googlebot",
      },
    });
    const html = await response.text();

    expect(response.status()).toBe(200);
    expect(html).toContain("Carlos Alcaraz");
    expect(html).toContain("Jannik Sinner");
    expect(html).toContain("Match hub");
    expect(html).toContain("Match Details");
    expect(html).toContain("How to watch this match");
    expect(html).toContain("Check the official tournament broadcaster page or your local rights holder.");
    expect(html).toContain("Carlos Alcaraz page");
    expect(html).toContain("Jannik Sinner page");
    expect(html).toContain("Today&#x27;s tennis schedule");
    expect(html).toContain("Live tennis page");
    expect(html).toContain("Tennis order of play page");
    expect(html).not.toContain("<p class=\"mb-2 text-sm text-zinc-500\">Court</p>");
    expect(html).not.toContain("<p class=\"mb-2 text-sm text-zinc-500\">Surface</p>");
    expect(html).not.toContain("Final score unavailable");
    expect(html).not.toContain("Add to calendar");
    expect(html).not.toContain("Fake");
  });

  test("non-match dynamic watch slugs still return not found", async ({ request }) => {
    const response = await request.get("/watch/not-a-match-page", {
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(404);
  });

  test("static non-match watch child route still works", async ({ request }) => {
    const response = await request.get("/watch/tennis-spoiler-free-scores", {
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(200);
  });
});

test.describe("watch match lifecycle helpers", () => {
  const now = new Date("2026-06-23T12:00:00.000Z");

  test("scheduled match shows countdown and enables calendar only with reliable start time", () => {
    const lifecycle = getMatchLifecycle({
      status: "UPCOMING",
      startTime: "2026-06-23T14:30:00.000Z",
      score: "",
    }, now);

    expect(lifecycle.state).toBe("scheduled");
    expect(lifecycle.statusText).toBe("Scheduled");
    expect(lifecycle.countdownText).toBe("Starts in 2 hours 30 minutes");
    expect(lifecycle.hasReliableStartTime).toBe(true);
    expect(lifecycle.hasReliableScore).toBe(false);
  });

  test("live match shows live state and score only when reliable", () => {
    const withScore = getMatchLifecycle({
      status: "LIVE",
      startTime: "2026-06-23T11:00:00.000Z",
      score: "6-4, 2-1",
    }, now);
    const withoutScore = getMatchLifecycle({
      status: "LIVE",
      startTime: "2026-06-23T11:00:00.000Z",
      score: "0-0",
    }, now);

    expect(withScore.state).toBe("live");
    expect(withScore.statusText).toBe("Live now");
    expect(withScore.scoreText).toBe("6-4, 2-1");
    expect(withoutScore.hasReliableScore).toBe(false);
    expect(withoutScore.scoreText).toBeNull();
  });

  test("finished match shows finished state and final score when available", () => {
    const lifecycle = getMatchLifecycle({
      status: "FINISHED",
      startTime: "2026-06-23T10:00:00.000Z",
      score: "7-6, 6-3",
    }, now);

    expect(lifecycle.state).toBe("finished");
    expect(lifecycle.statusText).toBe("Match finished");
    expect(lifecycle.scoreText).toBe("7-6, 6-3");
  });

  test("missing start time does not create countdown or calendar eligibility", () => {
    const lifecycle = getMatchLifecycle({
      status: "SCHEDULED",
      startTime: null,
      score: "",
    }, now);

    expect(lifecycle.state).toBe("scheduled");
    expect(lifecycle.countdownText).toBeNull();
    expect(lifecycle.hasReliableStartTime).toBe(false);
  });
});
