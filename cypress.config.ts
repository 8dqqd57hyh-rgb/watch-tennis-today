import { defineConfig } from "cypress";
import { plugin as cypressGrepPlugin } from "@cypress/grep/plugin";

const baseUrl = process.env.CYPRESS_BASE_URL || "http://localhost:3000";

export default defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  video: true,
  screenshotOnRunFailure: true,
  defaultCommandTimeout: 10000,
  requestTimeout: 30000,
  responseTimeout: 30000,
  pageLoadTimeout: 60000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "spec, mocha-junit-reporter, mochawesome",
    mochaJunitReporterReporterOptions: {
      mochaFile: "cypress/reports/junit/results-[hash].xml",
      testsuitesTitle: "Watch Tennis Today Cypress",
    },
    mochawesomeReporterOptions: {
      reportDir: "cypress/reports/mochawesome",
      reportFilename: "mochawesome",
      html: true,
      json: true,
      overwrite: false,
      embeddedScreenshots: true,
      inlineAssets: true,
    },
  },
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
    appName: "watch-tennis-today",
  },
  e2e: {
    baseUrl,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);
      return config;
    },
  },
});
