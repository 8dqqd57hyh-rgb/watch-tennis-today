const apiRoutes = [
  { path: "/api/matches", type: "json", optional: false },
  { path: "/api/ads.txt", type: "text", optional: true },
  { path: "/api/tv-channels", type: "json", optional: true },
] as const;

describe("API route health", () => {
  apiRoutes.forEach((route) => {
    it(`${route.path} does not crash`, () => {
      cy.request({ url: route.path, failOnStatusCode: false }).then((response) => {
        if (route.optional && response.status === 404) {
          cy.log(`${route.path} is not implemented in this app.`);
          return;
        }

        expect(response.status).to.be.lessThan(500);
        expect(String(response.body).trim()).to.not.eq("");

        if (route.type === "json") {
          expect(() => {
            JSON.parse(typeof response.body === "string" ? response.body : JSON.stringify(response.body));
          }).to.not.throw();
        }
      });
    });
  });
});
