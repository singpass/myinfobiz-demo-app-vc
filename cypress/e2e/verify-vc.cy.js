import locale from "@/config/locale";

describe("Demo app verifying corporate verifiable credentials", () => {
  beforeEach(() => {
    cy.visit("localhost:3001");
    cy.intercept("POST", "/api/vc/**").as("vcApiCalls");
    // select Verify VC tab
    cy.get('[data-testid="verify-corporate-vc-btn-tab"]').click();

    // write vc into textarea
    cy.fixture("vc").then((vc) => {
      cy.get('textarea[data-testid="verify-corporate-vc-textarea"]')
        .should("be.visible")
        .first()
        .type(JSON.stringify(vc), {
          parseSpecialCharSequences: false,
          delay: 0,
        });
    });

    switch (Cypress.currentTest.title) {
      case `Should have a button labeled ${locale.button.verify} with color #4c7aae and clickable`:
        break;
      default:
        cy.get('button[data-testid="verify-btn"]').click();
        // should see progress dialog
        cy.get("p[data-testid='progress-dialog-title']").should(
          "have.text",
          locale.dialog.title.verify
        );
        cy.wait("@vcApiCalls");
        break;
    }
  });

  it(`Should have a button labeled ${locale.button.verify} with color #4c7aae and clickable`, () => {
    cy.get('[data-testid="verify-btn"]')
      .should("have.text", locale.button.verify)
      .should("have.css", "background-color", "rgb(76, 122, 174)")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it("Should show progress dialog on successful callback", () => {
    // should see progress dialog
    cy.get("p[data-testid='progress-dialog-title']").should(
      "have.text",
      locale.dialog.title.verify
    );
    cy.get("div[data-testid='progress-dialog-title-container']", {
      timeout: 5000,
    })
      .children('svg[data-testid="loading-svg"]')
      .should("be.visible");
  });

  it("Should show a verifiable credential after calling the relevant APIs", () => {
    cy.wait("@vcApiCalls");
    cy.get("p[data-testid='progress-dialog-title']").should(
      "have.text",
      locale.dialog.title.success
    );
    cy.get("div[data-testid='progress-dialog-task-group']").should(
      "have.text",
      locale.verify.step1.concat(
        locale.verify.step2,
        locale.verify.step3,
        locale.verify.step4
      )
    );
    cy.get("div[data-testid='progress-dialog-title-container']", {
      timeout: 5000,
    })
      .children('svg[data-testid="check-svg"]')
      .should("be.visible");
    // close dialog
    cy.get("button[data-testid='progress-dialog-close-btn']").click();

    // check if VC is displayed
    cy.get("h3[data-testid='verify-corporate-vc-response-title'").should(
      "have.text",
      locale.verify.title
    );
    cy.get("p[data-testid='container-status-banner-text'").should(
      "have.text",
      locale.verify.response.successBanner
    );
    cy.get("textarea[data-testid='verify-corporate-vc-textarea'").should(
      "contain",
      "credentialSubject" // one of the fields of the VC
    );
  });
});

Cypress.Commands.add("assertValueCopiedToClipboard", (value) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.include(value);
    });
  });
});
