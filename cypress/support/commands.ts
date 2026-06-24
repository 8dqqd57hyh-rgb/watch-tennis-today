/// <reference types="cypress" />

import type { RouteHandler, StaticResponse } from "cypress/types/net-stubbing";
import { assertAppReady, assertSeoMeta } from "./assertions";
import {
  appRoutes,
  consoleErrorIsExpected,
  type ConsoleErrorOptions,
  type SeoMetaExpectation,
} from "./helpers";

/**
 * Selects elements by stable data-testid instead of brittle CSS selectors.
 */
Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

/**
 * Visits the homepage and waits for the app shell to render.
 */
Cypress.Commands.add("visitHome", () => {
  cy.visit(appRoutes().home);
  cy.waitForAppReady();
});

/**
 * Visits the live tennis page and waits for the app shell to render.
 */
Cypress.Commands.add("visitLiveTennis", () => {
  cy.visit(appRoutes().liveTennis);
  cy.waitForAppReady();
});

/**
 * Intercepts the match API with deterministic fixtures or inline responses.
 */
Cypress.Commands.add("mockMatches", (response = { fixture: "matches-today.json" }, alias = "matches") => {
  cy.intercept("GET", "/api/matches*", response).as(alias);
});

/**
 * Intercepts player-related fixtures for future player flows.
 */
Cypress.Commands.add("mockPlayers", (response = { fixture: "players.json" }, alias = "players") => {
  cy.intercept("GET", "/api/players*", response).as(alias);
});

/**
 * Waits for the Next.js app shell without arbitrary sleeps.
 */
Cypress.Commands.add("waitForAppReady", () => {
  assertAppReady();
});

/**
 * Verifies title, meta description and canonical link for SEO-critical pages.
 */
Cypress.Commands.add("checkSeoMeta", (expected: SeoMetaExpectation) => {
  assertSeoMeta(expected);
});

/**
 * Fails the test on unexpected browser console.error calls.
 * Pass exclude patterns for known third-party warnings that do not affect the app.
 */
Cypress.Commands.add("checkNoConsoleErrors", (options: ConsoleErrorOptions = {}) => {
  cy.on("window:before:load", (win) => {
    cy.stub(win.console, "error").callsFake((...args: unknown[]) => {
      const message = args.map(String).join(" ");

      if (consoleErrorIsExpected(message, options.exclude)) {
        return;
      }

      throw new Error(`Unexpected console.error: ${message}`);
    });
  });
});

declare global {
  // Cypress custom command typings use namespace augmentation.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      visitHome(): Chainable<void>;
      visitLiveTennis(): Chainable<void>;
      mockMatches(
        response?: StaticResponse | RouteHandler,
        alias?: string
      ): Chainable<void>;
      mockPlayers(
        response?: StaticResponse | RouteHandler,
        alias?: string
      ): Chainable<void>;
      waitForAppReady(): Chainable<void>;
      checkSeoMeta(expected: SeoMetaExpectation): Chainable<void>;
      checkNoConsoleErrors(options?: ConsoleErrorOptions): Chainable<void>;
    }
  }
}

export {};
