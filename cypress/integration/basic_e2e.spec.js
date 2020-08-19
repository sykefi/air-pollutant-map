describe("Page load and initial UI", () => {
  it("render main div", () => {
    cy.visit("http://localhost:8080/");
    cy.get("div#app-wrapper");
  });
  it("show year selector", () => {
    cy.contains("Vuosi");
  });
  it("show gnfr selector", () => {
    cy.contains("Luokka");
  });
  it("show pollutant selector", () => {
    cy.contains("Saastuke");
  });
  it("show map data type selector (ruudukko/kunnat)", () => {
    cy.contains("Ruudukko");
    cy.contains("Kunnat");
  });
});

describe("Year selector", () => {
  it("toggle year options visible", () => {
    cy.get(".year-selector-div").within(() => cy.get(".custom-select").click());
    cy.contains("2018");
    cy.contains("2015");
    cy.contains("2010");
    cy.contains("2005");
    cy.contains("2000");
    cy.contains("1995");
  });

  it("toggle year options hidden by clicking the input", () => {
    cy.get(".year-selector-div").within(() => {
      cy.get(".custom-select").click();
      cy.get("#custom-select-list").should("have.class", "hidden-all");
    });
  });

  it("toggle year options hidden by clicking outside the input", () => {
    cy.get(".year-selector-div").within(() => cy.get(".custom-select").click());
    cy.contains("2015");
    cy.get("#map-container").click(325, 520);
  });
});
