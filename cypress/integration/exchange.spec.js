/// <reference types="cypress" />

context("ExchangeApp", () => {
  before(() => {
    cy.visit("/");
  });

  describe("Hago una conversión de divisas", () => {
    const ERRORES = 3;
    const LABELS = 3;
    const INPUT = 1;
    const SELECTS = 2;

    it("se asegura que haya un formulario con inputs", () => {
      cy.get(".header").contains("Conversor de divisas online");
      cy.get("#formulario").within(() => {
        cy.get("label").should("have.length", LABELS);
        cy.get("input").should("have.length", INPUT);
        cy.get("select").should("have.length", SELECTS);
        cy.get("#btn-cotizacion").contains("Ver cotización");
      });
    });

    it("se asegura que funcionen los validadores del formulario", () => {
      cy.get("#btn-cotizacion").click();
      cy.get("#importe").should("have.class", "error");
      cy.get("#divisa-base").should("have.class", "error");
      cy.get("#divisa-a-convertir").should("have.class", "error");
      cy.get("li").should("have.length", ERRORES);
      cy.get("li").eq(0).contains("Este campo necesita al menos un digito");
      cy.get("li").eq(1).contains("Seleccione una divisa por favor");
      cy.get("li").eq(2).contains("Seleccione una divisa por favor");
    });

    it("se asegura que muestra la conversión correctamente", () => {
      cy.get("#importe").type("5000");
      cy.get("#divisa-base").select("USD");
      cy.get("#divisa-a-convertir").select("ARS");
      cy.get(".resultados__divisas").should("not.be.visible");
      cy.get("#btn-cotizacion").click();
      cy.get(".resultados__divisas")
        .should("be.visible")
        .within(() => {
          cy.get(".cotizacion__importe").contains("5000 USD =");
          cy.get(".cotizacion").contains("526700 ARS");
          cy.get(".cotizacion__base").contains("1 USD = 105.34 ARS");
        });
    });
  });
});
