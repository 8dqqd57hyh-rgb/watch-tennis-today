const expectedSitemapUrls = [
  "https://watchtennistoday.com",
  "https://watchtennistoday.com/players",
  "https://watchtennistoday.com/watch-alcaraz-live",
  "https://watchtennistoday.com/watch-djokovic-live",
  "https://watchtennistoday.com/watch-sinner-live",
];

describe("technical SEO files", { tags: ["@seo", "@critical"] }, () => {
  it("robots.txt allows public pages, blocks technical paths and points to the sitemap", () => {
    cy.request("/robots.txt").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.include("text/plain");

      const body = String(response.body);

      expect(body).to.include("User-Agent: *");
      expect(body).to.include("Allow: /");
      expect(body).to.include("Disallow: /api/");
      expect(body).to.include("Disallow: /_next/");
      expect(body).to.include("Sitemap: https://watchtennistoday.com/sitemap.xml");
      expect(body).to.include("Host: https://watchtennistoday.com");
    });
  });

  it("sitemap.xml is valid enough for crawlers and lists important indexable pages", () => {
    cy.request("/sitemap.xml").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.include("xml");

      const body = String(response.body);

      expect(body).to.include("<urlset");
      expect(body).to.include("</urlset>");

      expectedSitemapUrls.forEach((url) => {
        expect(body).to.include(`<loc>${url}</loc>`);
      });

      expect(body).not.to.include("<loc>https://watchtennistoday.com/api/");
      expect(body).not.to.include("<loc>https://watchtennistoday.com/_next/");
    });
  });
});
