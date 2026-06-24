describe("tennis fan user journey", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/matches*", { fixture: "live-matches.json" }).as("liveMatches");
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
  });

  it("moves from discovery to live tennis and then to a player page", () => {
    cy.visit("/");
    cy.wait("@liveMatches");

    cy.get("h1").should("contain.text", "Tennis matches today");
    cy.getByTestId("match-card").first().should("contain.text", "Novak Djokovic");

    cy.getByTestId("primary-navigation").contains("a", "Live Tennis").click();
    cy.location("pathname").should("eq", "/live-tennis");
    cy.get("h1").first().should("contain.text", "Live Tennis Today");
    cy.get("main").then(($main) => {
      expect($main.find('[data-testid="match-card"], [data-testid="empty-state"]').length).to.be.greaterThan(0);
    });

    cy.getByTestId("primary-navigation").contains("a", "Players").click();
    cy.location("pathname").should("eq", "/players");
    cy.get("h1").first().should("contain.text", "Tennis Players");
    cy.getByTestId("player-card").contains("Jannik Sinner").click();

    cy.location("pathname").should("eq", "/player/jannik-sinner");
    cy.get("h1").first().should("contain.text", "Jannik Sinner");
    cy.contains(/matches|coverage|stream/i).should("be.visible");
  });
});
