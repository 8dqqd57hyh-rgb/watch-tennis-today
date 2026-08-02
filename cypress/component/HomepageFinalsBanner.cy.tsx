import HomepageFinalsBanner from "../../app/components/HomepageFinalsBanner";

describe("HomepageFinalsBanner polling", () => {
  it("pauses while hidden and refreshes immediately when visible", () => {
    cy.clock();
    let hidden = false;
    cy.document().then((document) => {
      Object.defineProperty(document, "hidden", {
        configurable: true,
        get: () => hidden,
      });
    });
    cy.window().then((window) => {
      const fetchFinals = cy.stub(window, "fetch").resolves(new Response(JSON.stringify({ finals: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }));
      cy.wrap(fetchFinals).as("fetchFinals");
    });

    cy.mount(<HomepageFinalsBanner />);
    cy.get("@fetchFinals").should("have.been.calledOnce");

    cy.document().then((document) => {
      hidden = true;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    cy.tick(5 * 60_000);
    cy.get("@fetchFinals").should("have.been.calledOnce");

    cy.document().then((document) => {
      hidden = false;
      document.dispatchEvent(new Event("visibilitychange"));
    });
    cy.get("@fetchFinals").should("have.been.calledTwice");
  });

  it("backs off after a failed refresh", () => {
    cy.clock();
    cy.window().then((window) => {
      const fetchFinals = cy.stub(window, "fetch")
        .onFirstCall().resolves(new Response(null, { status: 503 }))
        .onSecondCall().resolves(new Response(JSON.stringify({ finals: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }))
        .resolves(new Response(JSON.stringify({ finals: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }));
      cy.wrap(fetchFinals).as("fetchFinals");
    });

    cy.mount(<HomepageFinalsBanner />);
    cy.get("@fetchFinals").should("have.been.calledOnce");
    cy.tick(119_999);
    cy.get("@fetchFinals").should("have.been.calledOnce");
    cy.tick(1);
    cy.get("@fetchFinals").should("have.been.calledTwice");
  });
});
