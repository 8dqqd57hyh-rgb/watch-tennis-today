const pages = [
  { path: "/", name: "homepage" },
  { path: "/players", name: "players page" },
  { path: "/best-tennis-matches-today", name: "best matches page" },
];

describe("accessibility smoke checks", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/matches*", { fixture: "matches-today.json" });
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
  });

  pages.forEach(({ path, name }) => {
    it(`${name} has no critical or serious axe violations`, () => {
      cy.visit(path);
      cy.injectAxe();
      cy.checkA11y(undefined, {
        includedImpacts: ["critical", "serious"],
      });
    });
  });
});
