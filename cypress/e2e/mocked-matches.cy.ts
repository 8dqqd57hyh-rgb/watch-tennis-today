describe("mocked tennis match data", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
  });

  it("renders match cards from a stable /api/matches fixture on the homepage", () => {
    cy.intercept("GET", "/api/matches*", { fixture: "matches-today.json" }).as("matchesToday");

    cy.visit("/");
    cy.wait("@matchesToday");

    cy.getByTestId("match-card").should("have.length.at.least", 2);
    cy.getByTestId("match-card").first().within(() => {
      cy.contains("Jannik Sinner").should("be.visible");
      cy.contains("Carlos Alcaraz").should("be.visible");
      cy.contains("Wimbledon").should("be.visible");
      cy.getByTestId("guide-streaming-link").should("have.length.at.least", 1);
    });
  });

  it("renders a practical empty state when no matches are returned", () => {
    cy.intercept("GET", "/api/matches*", []).as("emptyMatches");

    cy.visit("/");
    cy.wait("@emptyMatches");

    cy.getByTestId("empty-state").should("be.visible");
    cy.getByTestId("match-card").should("not.exist");
    cy.contains(/No matches found|temporarily unavailable/i).should("be.visible");
  });

  it("renders live match cards from a stable live response", () => {
    cy.intercept("GET", "/api/matches*", { fixture: "live-matches.json" }).as("liveMatches");

    cy.visit("/matches/live-now");
    cy.wait("@liveMatches");

    cy.getByTestId("match-card").should("have.length.at.least", 1);
    cy.contains("Novak Djokovic").should("be.visible");
    cy.contains("Taylor Fritz").should("be.visible");
    cy.contains("6-4 2-3").should("be.visible");
  });

  it("renders the live page empty state when no live matches are returned", () => {
    cy.intercept("GET", "/api/matches*", []).as("noLiveMatches");

    cy.visit("/matches/live-now");
    cy.wait("@noLiveMatches");

    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("No live tennis matches right now").should("be.visible");
  });
});
