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
    cy.contains("Typen oksidit");
  });
  it("show map data type selector (ruudukko/kunnat)", () => {
    cy.contains("Ruudukko");
    cy.contains("Kunnat");
  });
  it("show legend", () => {
    cy.visit("http://localhost:8080/");
    cy.contains("Päästömäärä (t)");
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
    cy.get(".year-selector-div").within(() => {
      cy.get("#custom-select-list").should("have.class", "hidden-all");
    });
  });

  it("select year by clicking an option (2010)", () => {
    cy.get(".year-selector-div").within(() => {
      cy.get(".custom-select").click();
      cy.contains("2010").click();
      cy.get("#custom-select-list").should("have.class", "hidden-all");
      cy.contains("2010");
    });
  });
});

describe("Gnfr selector", () => {
  it("toggle gnfr options visible", () => {
    cy.get(".gnfr-selector-div").within(() => cy.get(".gnfr-select").click());
    cy.get("#gnfr-select-list").within(() => cy.contains("li", "Shipping"));
  });
  it("toggle gnfr options hidden by clicking the input", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get(".gnfr-select").click();
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
    });
  });
  it("toggle gnfr options hidden by clicking outside the input", () => {
    cy.get(".gnfr-selector-div").within(() => cy.get(".gnfr-select").click());
    cy.contains("Shipping");
    cy.get("#map-container").click(325, 520);
    cy.get(".gnfr-selector-div").within(() => {
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
    });
  });
  it("select gnfr by clicking an option (Shipping)", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get(".gnfr-select").click();
      cy.contains("li", "Shipping").click();
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
      cy.contains("G_Shipping");
    });
  });
});

describe("Pollutant selector", () => {
  it("toggle pollutant options visible", () => {
    cy.get(".pollutant-selector-div").within(() => cy.get(".pollutant-select").click());
    cy.get("#pollutant-select-list").within(() => cy.contains("Rikkidioksidi"));
  });
  it("toggle pollutant options hidden by clicking the input", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
    });
  });
  it("toggle pollutant options hidden by clicking outside the input", () => {
    cy.get(".pollutant-selector-div").within(() => cy.get(".pollutant-select").click());
    cy.contains("Rikkidioksidi");
    cy.get("#map-container").click(325, 520);
    cy.get(".pollutant-selector-div").within(() => {
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
    });
  });
  it("select pollutant by clicking an option (Rikkidioksidi)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
      cy.contains("Rikkidioksidi");
    });
  });
});

describe("Grid data layer", () => {
  it("open rikkidioksidi layer", () => {
    cy.visit("http://localhost:8080/");
    cy.contains("Typen oksidit");
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Rikkidioksidi").click();
    });
    // wait for the layer and legend to appear
    cy.contains("Päästömäärä (t)");
  });
  it("show popup", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Rikkidioksidi (t):");
    cy.contains("0.45");
  });
  it("close popup", () => {
    cy.get(".olpopup-closer").click();
  });
  it("show expected class ranges in legend (combined: Rikkidioksidi)", () => {
    cy.get("#legend-box").within(() => {
      cy.contains("0 - 0.0031");
      cy.contains("0.0031 - 0.053");
      cy.contains("0.053 - 0.17");
      cy.contains("0.17 - 0.52");
      cy.contains("0.52 - 89");
      cy.contains("89 - 255");
      cy.contains("255 - 4129");
    });
  });
  it("show expected class ranges in legend (combined: Typen oksidit)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Typen oksidit").click();
    });
    cy.get("#legend-box").within(() => {
      cy.contains("0 - 0.63");
      cy.contains("0.63 - 1.8");
      cy.contains("1.8 - 4.3");
      cy.contains("4.3 - 11");
      cy.contains("11 - 133");
      cy.contains("133 - 366");
      cy.contains("366 - 3282");
    });
  });
  it("show expected class ranges in legend (road/transport: Typen oksidit)", () => {
    cy.get(".gnfr-selector-div").within(() => cy.get(".gnfr-select").click());
    cy.get("#gnfr-select-list").within(() => cy.contains("li", "Road").click());
    cy.get("#legend-box").within(() => {
      cy.contains("0 - 0.63");
      cy.contains("0.63 - 1.8");
      cy.contains("1.8 - 4.3");
      cy.contains("4.3 - 11");
      cy.contains("11 - 133");
      cy.contains("133 - 366");
      cy.contains("366 - 842");
    });
  });
});

describe("Municipality layer", () => {
  it("toggle municipality layer", () => {
    // switch back to typen oksidit
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Typen oksidit").click();
    });
    cy.contains("Kunnat").click();
    cy.contains("Päästömäärä (t / km2)");
  });
  it("show popup", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Typen oksidit (Vaala):");
    cy.contains("120.6 t");
    cy.contains("0.068 t / km2");
  });
  it("close popup", () => {
    cy.get(".olpopup-closer").click();
  });
  it("show expected class ranges in legend (Typen oksidit)", () => {
    cy.get("#legend-box").within(() => {
      cy.contains("0 - 0.11");
      cy.contains("0.11 - 0.2");
      cy.contains("0.2 - 0.37");
      cy.contains("0.37 - 0.66");
      cy.contains("0.66 - 3.7");
      cy.contains("3.7 - 11");
      cy.contains("11 - 26");
    });
  });
  it("show expected class ranges in legend (Rikkidioksidi)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select").click();
      cy.contains("Rikkidioksidi").click();
    });
    cy.get("#legend-box").within(() => {
      cy.contains("0 - 0.0058");
      cy.contains("0.0058 - 0.012");
      cy.contains("0.012 - 0.027");
      cy.contains("0.027 - 0.085");
      cy.contains("0.085 - 1.5");
      cy.contains("1.5 - 4");
      cy.contains("4 - 13");
    });
  });
});

describe("Toggle back to grid data layer", () => {
  it("toggle grid data layer active", () => {
    cy.contains("Ruudukko").click();
    cy.contains("Päästömäärä (t)");
  });
  it("popups work", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Rikkidioksidi (t):");
    cy.contains("0.45");
    cy.get(".olpopup-closer").click();
  });
  it("show expected class ranges in legend (combined: Rikkidioksidi)", () => {
    cy.get("#legend-box").within(() => {
      cy.contains("0 - 0.0031");
      cy.contains("0.0031 - 0.053");
      cy.contains("0.053 - 0.17");
      cy.contains("0.17 - 0.52");
      cy.contains("0.52 - 89");
      cy.contains("89 - 255");
      cy.contains("255 - 4129");
    });
  });
});
