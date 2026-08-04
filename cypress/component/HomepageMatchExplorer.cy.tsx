import HomepageMatchExplorer from "@/app/components/HomepageMatchExplorer";
import { clearClientMatchCache } from "@/app/lib/clientMatchFetch";

describe("HomepageMatchExplorer component", { tags: ["@component", "@api"] }, () => {
  beforeEach(() => {
    clearClientMatchCache();
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
  });

  it("renders server-provided match cards before the client refresh completes", () => {
    cy.intercept("GET", "/api/matches*", { delay: 1000, body: [] }).as("refreshMatches");

    cy.mount(
      <HomepageMatchExplorer
        initialMatches={[
          {
            id: "server:1",
            player1: "Server Player One",
            player2: "Server Player Two",
            tournament: "Server Open",
            category: "ATP",
            status: "UPCOMING",
            score: "",
            startTime: "2026-08-04T12:00:00.000Z",
            watchProviders: [],
          },
        ]}
      />,
    );

    cy.getByTestId("match-loading-skeleton").should("not.exist");
    cy.contains("Server Player One").should("be.visible");
    cy.contains("Server Player Two").should("be.visible");
  });

  it("renders loading state and then match cards from props returned by the API", () => {
    let releaseMatches: (matches: unknown) => void = () => {};
    const matchesPromise = new Promise((resolve) => {
      releaseMatches = resolve;
    });

    cy.fixture("matches-today.json").then((matches) => {
      cy.intercept("GET", "/api/matches*", (req) => {
        return matchesPromise.then((body) => req.reply({ body }));
      }).as("matchesToday");

      cy.mount(<HomepageMatchExplorer />);

      cy.getByTestId("match-loading-card").should("have.length", 6);
      cy.then(() => releaseMatches(matches));
      cy.wait("@matchesToday");
      cy.getByTestId("match-card").should("have.length", 2);
      cy.contains("Jannik Sinner").should("be.visible");
      cy.contains("Carlos Alcaraz").should("be.visible");
    });
  });

  it("renders an empty state and lets the user clear restrictive filters", () => {
    cy.mockMatches({ fixture: "matches-today.json" }, "matchesToday");

    cy.mount(<HomepageMatchExplorer />);
    cy.wait("@matchesToday");

    cy.get('input[aria-label="Search by player or tournament"]').type("not a real match");
    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("button", "Clear filters").click();
    cy.getByTestId("match-card").should("have.length", 2);
  });

  it("renders recovery content after a network failure", () => {
    cy.mockMatches({ forceNetworkError: true }, "networkError");

    cy.mount(<HomepageMatchExplorer />);
    cy.wait("@networkError");

    cy.getByTestId("empty-state").should("be.visible");
    cy.contains("Match feed is temporarily unavailable.").should("be.visible");
    cy.contains("a", "Open live tennis").should("have.attr", "href", "/live-tennis");
  });
});
