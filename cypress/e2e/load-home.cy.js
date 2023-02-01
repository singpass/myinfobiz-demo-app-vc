import locale from "@/config/locale";

describe("Load Demo App", () => {
  beforeEach(() => {
    cy.visit("localhost:3001");
  });

  it(`Should have a button labeled ${locale.button.request} with color #4c7aae and clickable`, () => {
    cy.get('[data-testid="request-btn"]')
      .should("have.text", locale.button.request)
      .should("have.css", "background-color", "rgb(76, 122, 174)")
      .should("be.visible")
      .should("not.be.disabled");
  });

  it(`Should have two tabs with labels ${locale.request.tabButton} and ${locale.verify.tabButton}`, () => {
    cy.get('[data-testid="request-corporate-vc-btn-tab"]')
      .should("have.text", locale.request.tabButton)
      .should("be.visible");
    cy.get('[data-testid="verify-corporate-vc-btn-tab"]')
      .should("have.text", locale.verify.tabButton)
      .should("be.visible");
  });

  it(`Should have ${locale.request.tabButton} button white and ${locale.verify.tabButton}  button with 0.4 opacity`, () => {
    cy.get('[data-testid="request-corporate-vc-btn-tab"]').should(
      "have.css",
      "background-color",
      "rgb(255, 255, 255)"
    );
    cy.get('[data-testid="verify-corporate-vc-btn-tab"]').should(
      "have.css",
      "background-color",
      "rgba(239, 231, 236, 0.4)"
    );
  });
});
