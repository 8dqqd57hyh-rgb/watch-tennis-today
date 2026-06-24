const keyPages = [
  {
    path: "/players",
    h1: "Tennis Players",
    stableText: ["ATP Tennis Players", "WTA Tennis Players", "Live Tennis Today"],
  },
  {
    path: "/best-tennis-matches-today",
    h1: "Best Tennis Matches Today",
    stableText: ["All tennis matches today", "Live matches", "Scheduled matches", "Finished matches"],
  },
  {
    path: "/tennis-schedule-today",
    h1: "Tennis Schedule Today",
    stableText: ["Daily tennis schedule", "Complete daily overview", "legal viewing"],
  },
  {
    path: "/watch-alcaraz-live",
    h1: "Watch Carlos Alcaraz Live",
    stableText: ["What to check before the match", "legal viewing", "Carlos Alcaraz player profile"],
  },
  {
    path: "/watch-djokovic-live",
    h1: "Watch Novak Djokovic Live",
    stableText: ["What to check before the match", "legal viewing", "Novak Djokovic player profile"],
  },
  {
    path: "/watch-sinner-live",
    h1: "Watch Jannik Sinner Live",
    stableText: ["What to check before the match", "legal viewing", "Jannik Sinner player profile"],
  },
];

describe("key page coverage", { tags: ["@smoke"] }, () => {
  keyPages.forEach(({ path, h1, stableText }) => {
    it(`${path} renders stable editorial and navigation content`, () => {
      cy.request(path).its("status").should("eq", 200);
      cy.visit(path);
      cy.waitForAppReady();

      cy.get("h1").first().should("be.visible").and("contain.text", h1);
      cy.get("main").should("be.visible");

      // These checks avoid live match rows because the external tennis feed can change minute to minute.
      stableText.forEach((text) => {
        cy.contains(text).should("be.visible");
      });
    });
  });
});
