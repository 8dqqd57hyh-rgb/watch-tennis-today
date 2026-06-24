describe("primary navigation", () => {
  const links = [
    { label: "Live Tennis", path: "/live-tennis" },
    { label: "Matches Today", path: "/best-tennis-matches-today" },
    { label: "Players", path: "/players" },
    { label: "Calendar", path: "/tennis-calendar" },
    { label: "Guides", path: "/tennis-guides" },
  ];

  beforeEach(() => {
    cy.visit("/");
  });

  it("shows the main navigation links", () => {
    cy.get('nav[aria-label="Primary navigation"]').as("primaryNav").should("be.visible");

    links.forEach(({ label, path }) => {
      cy.get("@primaryNav")
        .contains("a", label)
        .should("be.visible")
        .and("have.attr", "href", path);
    });
  });

  links.forEach(({ label, path }) => {
    it(`navigates to ${label}`, () => {
      cy.get('nav[aria-label="Primary navigation"]').contains("a", label).click();
      cy.location("pathname").should("eq", path);
      cy.get("h1").first().should("be.visible");
      cy.get("body").should("contain.text", "Tennis");
    });
  });

  it("exposes useful secondary navigation links", () => {
    cy.get('summary[aria-label="Open more navigation links"]').click();

    cy.get(".site-more-panel").within(() => {
      cy.contains("a", "TV Schedule").should("have.attr", "href", "/tv-schedule");
      cy.contains("a", "Legal Streaming Guide").should("have.attr", "href", "/how-to-watch-tennis-legally");
      cy.contains("a", "Time Zone Converter").should("have.attr", "href", "/tennis-time-zone-converter");
      cy.contains("a", "Wimbledon").should("have.attr", "href", "/wimbledon-live");
    });
  });
});
