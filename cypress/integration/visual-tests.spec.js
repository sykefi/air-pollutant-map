describe("Visual regression tests", () => {
  it("renders initial map", () => {
    cy.visit("http://localhost:8080/");
    cy.contains("Päästömäärä (t)");
    cy.wait(500);
    cy.matchImageSnapshot();
  });

  it("opens popup", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Typen oksidit (t):");
    cy.contains("10.4");
    cy.matchImageSnapshot();
  });

  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
    cy.wait(100);
    cy.matchImageSnapshot();
  });

  it("zooms in on scroll", () => {
    cy.get("#map-container").trigger("wheel", 300, 700, {
      deltaX: 0,
      deltaY: -1000
    });
    cy.wait(1500);
    cy.matchImageSnapshot();
  });

  it("zooms out on scroll", () => {
    cy.get("#map-container").trigger("wheel", 300, 700, {
      deltaX: 0,
      deltaY: 1000
    });
    cy.wait(1500);
    cy.matchImageSnapshot();
  });

  it("shows grid data layer rikkidioksidi (combined)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
      cy.contains("Rikkidioksidi");
    });
    cy.wait(1500);
    cy.matchImageSnapshot();
  });

  it("shows grid data layer road/transport: rikkidioksidi", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get(".gnfr-select").click();
      cy.contains("li", "Road").click();
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
      cy.contains("G_Shipping");
    });
    cy.wait(1500);
    cy.matchImageSnapshot();
  });

  it("shows municipality layer rikkidioksidi", () => {
    cy.contains("Kunnat").click();
    cy.contains("Päästömäärä (t / km2)");
    cy.wait(1500);
    cy.matchImageSnapshot();
  });

  it("shows municipality layer typen oksidit", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Typen oksidit").click();
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
      cy.contains("Typen oksidit");
    });
    cy.wait(1500);
    cy.matchImageSnapshot();
  });
});
