describe("mocked tennis match data", { tags: ["@api", "@critical"] }, () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
  });

  it("renders match cards from a stable /api/matches fixture on the homepage", () => {
    cy.mockMatches({ fixture: "matches-today.json" }, "matchesToday");

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
    cy.mockMatches([], "emptyMatches");

    cy.visit("/");
    cy.wait("@emptyMatches");

    cy.getByTestId("empty-state").should("be.visible");
    cy.getByTestId("match-card").should("not.exist");
    cy.contains(/No matches found|temporarily unavailable/i).should("be.visible");
  });

  it("renders live match cards from a stable live response", () => {
    cy.mockMatches({ fixture: "live-matches.json" }, "liveMatches");

    cy.visit("/matches/live-now");
    cy.wait("@liveMatches");

    cy.getByTestId("match-card").should("have.length.at.least", 1);
    cy.contains("Novak Djokovic").should("be.visible");
    cy.contains("Taylor Fritz").should("be.visible");
    cy.contains("6-4 2-3").should("be.visible");
  });

  it("renders the live page empty state when no live matches are returned", () => {
    cy.mockMatches([], "noLiveMatches");

    cy.visit("/matches/live-now");
    cy.wait("@noLiveMatches");

    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("No live tennis matches right now").should("be.visible");
  });

  it("keeps the homepage usable while the match API responds slowly", () => {
    cy.mockMatches(
      {
        fixture: "matches-today.json",
        delay: 750,
      },
      "delayedMatches"
    );

    cy.visit("/");
    cy.getByTestId("match-loading-skeleton").should("be.visible");
    cy.wait("@delayedMatches");
    cy.getByTestId("match-card").should("have.length.at.least", 1);
  });

  it("shows fallback content for HTTP 500 responses", () => {
    cy.mockMatches({ statusCode: 500, body: { error: "upstream unavailable" } }, "serverError");

    cy.visit("/");
    cy.wait("@serverError");

    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("No matches found.").should("be.visible");
    cy.getByTestId("guide-streaming-link").should("have.length.at.least", 1);
  });

  it("shows a friendly recovery state when the match API times out", () => {
    cy.mockMatches({ forceNetworkError: true }, "networkError");

    cy.visit("/");
    cy.wait("@networkError");

    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("Match feed is temporarily unavailable.").should("be.visible");
    cy.contains("a", "Open live tennis").should("have.attr", "href", "/live-tennis");
  });

  it("does not throw uncaught errors when the match API returns malformed JSON", () => {
    cy.mockMatches(
      {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: "{not-json",
      },
      "malformedMatches"
    );

    cy.visit("/");
    cy.wait("@malformedMatches");

    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("Match feed is temporarily unavailable.").should("be.visible");
  });
});
