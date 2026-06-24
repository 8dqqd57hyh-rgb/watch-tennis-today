const seoPages = [
  {
    path: "/",
    title: "Tennis Matches Today",
    descriptionIncludes: "live and upcoming tennis matches",
    canonical: "https://watchtennistoday.com",
  },
  {
    path: "/players",
    title: "Tennis Players Directory",
    descriptionIncludes: "ATP and WTA player profiles",
    canonical: "https://watchtennistoday.com/players",
  },
  {
    path: "/best-tennis-matches-today",
    title: "Best Tennis Matches Today",
    descriptionIncludes: "best tennis matches to watch today",
    canonical: "https://watchtennistoday.com/best-tennis-matches-today",
  },
  {
    path: "/tennis-schedule-today",
    title: "Tennis Schedule Today",
    descriptionIncludes: "today's tennis schedule",
    canonical: "https://watchtennistoday.com/tennis-schedule-today",
  },
  {
    path: "/watch-alcaraz-live",
    title: "Carlos Alcaraz Live Stream Today",
    descriptionIncludes: "Watch Carlos Alcaraz live online",
    canonical: "https://watchtennistoday.com/watch-alcaraz-live",
  },
  {
    path: "/watch-djokovic-live",
    title: "Novak Djokovic Live Stream Today",
    descriptionIncludes: "Watch Novak Djokovic live online",
    canonical: "https://watchtennistoday.com/watch-djokovic-live",
  },
  {
    path: "/watch-sinner-live",
    title: "Jannik Sinner Live Stream Today",
    descriptionIncludes: "Watch Jannik Sinner live online",
    canonical: "https://watchtennistoday.com/watch-sinner-live",
  },
];

describe("SEO basics", { tags: ["@seo", "@critical"] }, () => {
  seoPages.forEach(({ path, title, descriptionIncludes, canonical }) => {
    it(`${path} has title, meta description and canonical link`, () => {
      cy.visit(path);
      cy.checkSeoMeta({ title, descriptionIncludes, canonical });
    });
  });
});
