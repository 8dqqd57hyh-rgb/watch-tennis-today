import HomepageMatchExplorer from "@/app/components/HomepageMatchExplorer";
import { clearClientMatchCache } from "@/app/lib/clientMatchFetch";

describe("HomepageMatchExplorer component", { tags: ["@component", "@api"] }, () => {
  beforeEach(() => {
    clearClientMatchCache();
    cy.intercept("GET", "/api/wimbledon-qualifying*", []);
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

      cy.getByTestId("match-loading-skeleton").should("be.visible");
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
