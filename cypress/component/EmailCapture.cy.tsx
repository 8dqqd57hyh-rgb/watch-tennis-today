import EmailCapture from "@/components/EmailCapture";

const defaultProps = {
  title: "Get match alerts",
  description: "Useful tennis updates for matches and legal viewing.",
  contextType: "daily" as const,
  contextValue: "component-test",
};

describe("EmailCapture component", { tags: ["@component"] }, () => {
  it("renders custom copy and validates an invalid email", () => {
    cy.mount(<EmailCapture {...defaultProps} buttonText="Join" />);

    cy.getByTestId("email-signup").should("contain.text", "Get match alerts");
    cy.getByTestId("email-signup-input").type("invalid");
    cy.getByTestId("email-signup-submit").click();
    cy.contains("Please enter a valid email address.").should("be.visible");
  });

  it("submits a daily signup and shows success state", () => {
    cy.intercept("POST", "/api/subscribe-general", { body: { ok: true } }).as("subscribe");

    cy.mount(<EmailCapture {...defaultProps} />);
    cy.getByTestId("email-signup-input").type("fan@example.com");
    cy.getByTestId("email-signup-submit").click();

    cy.wait("@subscribe")
      .its("request.body")
      .should("include", {
        email: "fan@example.com",
        source: "daily-tennis-alerts",
        contextType: "daily",
        contextValue: "component-test",
      });
    cy.contains("You are signed up for useful tennis updates.").should("be.visible");
  });

  it("shows a user-friendly error when subscription fails", () => {
    cy.intercept("POST", "/api/subscribe-general", { statusCode: 500, body: { ok: false } }).as("subscribe");

    cy.mount(<EmailCapture {...defaultProps} />);
    cy.getByTestId("email-signup-input").type("fan@example.com");
    cy.getByTestId("email-signup-submit").click();

    cy.wait("@subscribe");
    cy.contains("Could not save this signup right now. Please try again later.").should("be.visible");
  });
});
