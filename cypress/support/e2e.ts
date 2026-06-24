// Cypress support file for shared e2e setup.
// Keep this lightweight so tests remain easy to debug locally and in CI.
import "./commands";
import "cypress-axe";

Cypress.on("uncaught:exception", (error) => {
  const ignoredThirdPartyErrors = [
    /googlesyndication/i,
    /doubleclick/i,
    /adsbygoogle/i,
    /google analytics/i,
  ];

  if (ignoredThirdPartyErrors.some((pattern) => pattern.test(error.message))) {
    return false;
  }

  return true;
});
