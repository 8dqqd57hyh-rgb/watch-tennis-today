/// <reference types="cypress" />

import { mount } from "cypress/react";
import "./commands";
import { register as registerCypressGrep } from "@cypress/grep";
import "@/app/globals.css";

Cypress.Commands.add("mount", mount);
registerCypressGrep();

declare global {
  // Cypress custom command typings use namespace augmentation.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

export {};
