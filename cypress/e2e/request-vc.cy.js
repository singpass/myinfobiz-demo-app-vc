import locale from "@/config/locale";

describe("Demo app requesting corporate verifiable credentials", () => {
  beforeEach(() => {
    cy.visit("localhost:3001");
    cy.intercept("POST", "/api/vc/**").as("vcApiCalls");
    // request VC
    cy.get("button[data-testid='request-btn']").click();
    cy.origin("https://test.api.myinfo.gov.sg", () => {
      cy.url().should(
        "contain",
        "https://test.api.myinfo.gov.sg/mockpass-cp/authorize"
      );
      cy.contains("button", "Login").click();
      cy.contains("button", "Cancel");
      cy.contains("button", "I Agree").click();
    });
    switch (Cypress.currentTest.title) {
      case "Should show progress dialog on successful callback":
        break;
      default: // wait for all the api calls
        try {
          cy.wait(["@vcApiCalls", "@vcApiCalls", "@vcApiCalls"]);
        } catch (error) {
          console.log(error);
        }
        break;
    }
  });

  it("Should show progress dialog on successful callback", () => {
    // should see progress dialog
    cy.get("p[data-testid='progress-dialog-title']").should(
      "have.text",
      locale.dialog.title.request
    );
    cy.get("div[data-testid='progress-dialog-title-container']", {
      timeout: 5000,
    })
      .children('svg[data-testid="loading-svg"]')
      .should("be.visible");
  });

  it("Should show a verifiable credential after calling the relevant APIs", () => {
    cy.get("p[data-testid='progress-dialog-title']").should(
      "have.text",
      locale.dialog.title.success
    );
    cy.get("div[data-testid='progress-dialog-task-group']").should(
      "have.text",
      locale.request.step1.concat(
        locale.request.step2,
        locale.request.step3,
        locale.request.step4
      )
    );
    cy.get("div[data-testid='progress-dialog-title-container']", {
      timeout: 5000,
    })
      .children('svg[data-testid="check-svg"]')
      .should("be.visible");
    cy.get("button[data-testid='progress-dialog-close-btn']").click();
    // close dialog

    // check if VC is displayed
    cy.get("h3[data-testid='request-corporate-vc-response-title'").should(
      "have.text",
      locale.request.response.title
    );
    cy.get("p[data-testid='container-status-banner-text'").should(
      "have.text",
      locale.request.response.successBanner
    );
    cy.get("textarea[data-testid='request-corporate-vc-textarea'").should(
      "contain",
      "credentialSubject" // one of the fields of the VC
    );
  });

  it("Should have copy to clipboard button that copies the verifiable credential upon clicking", () => {
    cy.get("button[data-testid='progress-dialog-close-btn']").click();
    // close dialog

    // check if VC is displayed
    cy.get("button[data-testid='request-corporate-vc-copy-btn']").as(
      "copy-btn"
    );
    cy.get("@copy-btn").should("have.text", locale.button.copy);
    cy.get("@copy-btn").click();
    cy.assertValueCopiedToClipboard("credentialSubject");
  });
});

Cypress.Commands.add("assertValueCopiedToClipboard", (value) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.include(value);
    });
  });
});
