const pages = [
  { path: "/", name: "homepage" },
  { path: "/players", name: "players page" },
  { path: "/best-tennis-matches-today", name: "best matches page" },
];

describe("accessibility smoke checks", { tags: ["@accessibility"] }, () => {
  beforeEach(() => {
    cy.mockMatches({ fixture: "matches-today.json" }, "matchesToday");
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
  });

  pages.forEach(({ path, name }) => {
    it(`${name} has no critical or serious axe violations`, () => {
      cy.visit(path);
      cy.waitForAppReady();
      cy.injectAxe();
      cy.checkA11y(undefined, {
        includedImpacts: ["critical", "serious"],
      });
    });
  });
});
