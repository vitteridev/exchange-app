/// <reference types="cypress" />

context("ExchangeApp", () => {
  before(() => {
    cy.visit("/");
  });

  describe("probando test", () => {
    it("prueba de carga de página", () => {
      cy.get(".header").contains("Conversor de divisas online");
    });
  });
});
