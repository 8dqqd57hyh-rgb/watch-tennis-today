import { expect, test } from "@playwright/test";

const indexablePages = ["/", "/today", "/live-tennis", "/players", "/tournament", "/about"];
const intentionallyNoindexPages = new Set(["/tennis-schedule-today"]);

const expectedCanonicals: Record<string, string> = {
  "/": "https://watchtennistoday.com",
  "/today": "https://watchtennistoday.com/today",
  "/live-tennis": "https://watchtennistoday.com/live-tennis",
  "/players": "https://watchtennistoday.com/players",
  "/tournament": "https://watchtennistoday.com/tournament",
  "/about": "https://watchtennistoday.com/about",
};

const canonicalPlayerSlugCases = [
  { path: "/player/j-fonseca", canonical: "https://watchtennistoday.com/player/joao-fonseca" },
  { path: "/player/swiatek-iga", canonical: "https://watchtennistoday.com/player/iga-swiatek" },
  { path: "/player/sinner-jannik", canonical: "https://watchtennistoday.com/player/jannik-sinner" },
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
    expect(urls).toContain("https://watchtennistoday.com/french-open-schedule");
    expect(urls).toContain("https://watchtennistoday.com/watch-sinner-live");
    expect(urls).toContain("https://watchtennistoday.com/watch-alcaraz-live");
    expect(urls).toContain("https://watchtennistoday.com/watch-djokovic-live");
    expect(urls).not.toContain("https://watchtennistoday.com/watch-player-live/iga-swiatek");
    expect(urls).not.toContain("https://watchtennistoday.com/watch-swiatek-live");
    expect(urls.some((url) => url.includes("/watch/"))).toBe(false);
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
