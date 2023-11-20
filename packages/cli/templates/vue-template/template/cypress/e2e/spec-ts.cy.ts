describe("empty spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
    cy.contains("type").click();
    cy.url().should("include", "/commands/actions");
    cy.get('[class*="action-email"]').type("hello-world").should("have.value", "hello-world");
  });
});
