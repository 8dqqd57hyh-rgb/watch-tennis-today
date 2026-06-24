/// <reference types="cypress" />

import type { SeoMetaExpectation } from "./helpers";

export function assertSeoMeta({
  title,
  descriptionIncludes,
  canonical,
}: SeoMetaExpectation) {
  cy.title().should("contain", title);
  cy.get('meta[name="description"]')
    .should("have.attr", "content")
    .and("include", descriptionIncludes)
    .and("have.length.greaterThan", 40);
  cy.get('link[rel="canonical"]').should("have.attr", "href", canonical);
}

export function assertAppReady() {
  cy.get("body").should("be.visible");
  cy.get("main").should("exist");
}
