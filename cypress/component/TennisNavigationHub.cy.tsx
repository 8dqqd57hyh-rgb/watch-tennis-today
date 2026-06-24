import TennisNavigationHub, { tennisHubLinks } from "@/app/components/TennisNavigationHub";

describe("TennisNavigationHub component", { tags: ["@component"] }, () => {
  it("renders default navigation links", () => {
    cy.mount(<TennisNavigationHub />);

    cy.getByTestId("tennis-navigation-hub").should("be.visible");
    cy.getByTestId("navigation-hub-link").should("have.length.at.least", 6);
    cy.contains("a", "Live tennis today").should("have.attr", "href", "/live-tennis");
    cy.contains("a", "Player pages").should("have.attr", "href", "/players");
  });

  it("prioritizes custom links and removes duplicate hrefs", () => {
    const links = tennisHubLinks([
      {
        href: "/live-tennis",
        title: "Custom live hub",
        description: "Custom description wins for duplicate hrefs.",
      },
      {
        href: "/wimbledon-live",
        title: "Wimbledon live",
        description: "Follow Wimbledon coverage.",
        label: "Grand Slam",
      },
    ]);

    cy.mount(<TennisNavigationHub title="Next steps" links={links} dark={false} />);

    cy.contains("h2", "Next steps").should("be.visible");
    cy.contains("a", "Custom live hub").should("have.attr", "href", "/live-tennis");
    cy.contains("a", "Wimbledon live").should("have.attr", "href", "/wimbledon-live");
    cy.contains("a", "Live tennis today").should("not.exist");
  });
});
