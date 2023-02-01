import locale from "@/config/locale";

describe("Demo app requesting VC", () => {
  beforeEach(() => {
    cy.visit("localhost:3001");
  });

  it("Redirects to mockpass when request button is clicked and shows progress dialog on successful callback", () => {
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
    // should see progress dialog
    cy.get("p[data-testid='progress-dialog-title']").should(
      "have.text",
      locale.dialog.title.request
    );
    cy.get("div[data-testid='progress-dialog-title-container']", {
      timeout: 5000,
    })
      .children('svg[data-testid="progress-dialog-loading-svg"]')
      .should("be.visible");
    cy.wait(30_000);
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
      .children('svg[data-testid="progress-dialog-success-svg"]')
      .should("be.visible");
    cy.get("button[data-testid='progress-dialog-close-btn']").click();
    // close dialog

    // check if VC is displayed
    cy.scrollTo(0, 500);
    cy.get("h3[data-testid='request-corporate-vc-response-title'").should(
      "have.text",
      locale.request.response.title
    );
    cy.get("p[data-testid='request-corporate-vc-banner-text'").should(
      "have.text",
      locale.request.response.successBanner
    );
    cy.get("textarea[data-testid='request-corporate-vc-text-area'").should(
      "contain",
      "credentialSubject" // one of the fields of the VC
    );
  });
});
