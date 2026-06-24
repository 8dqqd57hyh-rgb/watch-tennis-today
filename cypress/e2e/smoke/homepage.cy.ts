describe("homepage smoke", { tags: ["@smoke", "@critical"] }, () => {
  it("loads the homepage and exposes core discovery links", () => {
    cy.request("/").its("status").should("eq", 200);

    cy.visitHome();

    cy.title().should("contain", "Tennis Matches Today");
    cy.get("h1").should("be.visible").and("contain.text", "Tennis matches today");
    cy.getByTestId("primary-navigation").should("be.visible");
    cy.contains("a", "Live tennis").should("have.attr", "href", "/live-tennis");
    cy.contains("a", "TV schedule").should("have.attr", "href", "/tennis-on-tv-today");
    cy.contains("a", "Players").should("have.attr", "href", "/players");
  });
});
