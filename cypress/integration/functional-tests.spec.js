describe("Page load and initial UI", () => {
  it("renders main div", () => {
    cy.visit("http://localhost:8080/");
    cy.get("div#app-wrapper");
  });
  it("shows year selector", () => {
    cy.contains("Vuosi");
  });
  it("shows gnfr selector", () => {
    cy.contains("Luokka");
  });
  it("shows pollutant selector", () => {
    cy.contains("Saastuke");
    cy.contains("Typen oksidit");
  });
  it("shows map data type selector (ruudukko/kunnat)", () => {
    cy.contains("Ruudukko");
    cy.contains("Kunnat");
  });
  it("shows legend", () => {
    cy.contains("Päästömäärä (t)");
  });
});

describe("Year selector", () => {
  it("toggles year options visible", () => {
    cy.get(".year-selector-div").within(() => cy.get(".year-select-container").click());
    cy.contains("2018");
    cy.contains("2015");
    cy.contains("2010");
    cy.contains("2005");
    cy.contains("2000");
    cy.contains("1995");
  });

  it("toggles year options hidden by clicking the input", () => {
    cy.get(".year-selector-div").within(() => {
      cy.get(".year-select-container").click();
      cy.get("#year-select-list").should("have.class", "hidden-all");
    });
  });

  it("toggles year options hidden by clicking outside the input", () => {
    cy.get(".year-selector-div").within(() => cy.get(".year-select-container").click());
    cy.contains("2015");
    cy.get("#map-container").click(325, 520);
    cy.get(".year-selector-div").within(() => {
      cy.get("#year-select-list").should("have.class", "hidden-all");
    });
  });

  it("selects year by clicking an option (2010)", () => {
    cy.get(".year-selector-div").within(() => {
      cy.get(".year-select-container").click();
      cy.contains("2010").click();
      cy.get("#year-select-list").should("have.class", "hidden-all");
      cy.contains("2010");
    });
  });
});

describe("GNFR selector", () => {
  it("toggles gnfr options visible", () => {
    cy.get(".gnfr-selector-div").within(() => cy.get(".gnfr-select-container").click());
    cy.get("#gnfr-select-list").within(() => cy.contains("li", "Shipping"));
  });
  it("toggles gnfr options hidden by clicking the input", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get(".gnfr-select-container").click();
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
    });
  });
  it("toggles gnfr options hidden by clicking outside the input", () => {
    cy.get(".gnfr-selector-div").within(() => cy.get(".gnfr-select-container").click());
    cy.contains("Shipping");
    cy.get("#map-container").click(325, 520);
    cy.get(".gnfr-selector-div").within(() => {
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
    });
  });
  it("selects GNFR by clicking an option (public power)", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get(".gnfr-select-container").click();
      cy.contains("li", "Public").click();
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
      cy.contains("Public");
    });
  });
  it("selects combined GNFR", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get(".gnfr-select-container").click();
      cy.contains("li", "Kaikki").click();
      cy.get("#gnfr-select-list").should("have.class", "hidden-all");
      cy.get("#gnfr-select-input").should("have.value", "Kaikki");
    });
  });
  it("finds & selects option by input value (road & transport)", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get("#gnfr-select-input").click().clear().type("roadTranspor");
      cy.get("li").click();
      cy.get("#gnfr-select-input").should("have.value", "F_RoadTransport_fi");
    });
  });
  it("shows previously selected GNFR after exiting selector", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get("#gnfr-select-input").click().clear().type("kaikki{esc}");
      cy.get("#gnfr-select-input").should("have.value", "F_RoadTransport_fi");
    });
  });
  it("selects option with keyboard actions (combined GNFR)", () => {
    cy.get(".gnfr-selector-div").within(() => {
      cy.get("#gnfr-select-input").click().clear().type("kaikki{downarrow}{enter}");
      cy.get("#gnfr-select-input").should("have.value", "Kaikki");
    });
  });
});

describe("Pollutant selector", () => {
  it("toggles pollutant options visible", () => {
    cy.get(".pollutant-selector-div").within(() =>
      cy.get(".pollutant-select-container").click()
    );
    cy.get("#pollutant-select-list").within(() => cy.contains("Rikkidioksidi"));
  });
  it("toggles pollutant options hidden by clicking the input", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select-container").click();
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
    });
  });
  it("toggles pollutant options hidden by clicking outside the input", () => {
    cy.get(".pollutant-selector-div").within(() =>
      cy.get(".pollutant-select-container").click()
    );
    cy.contains("Rikkidioksidi");
    cy.get("#map-container").click(325, 520);
    cy.get(".pollutant-selector-div").within(() => {
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
    });
  });
  it("selects pollutant by clicking an option (rikkidioksidi)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select-container").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#pollutant-select-list").should("have.class", "hidden-all");
      cy.get("#pollutant-select-input").should("have.value", "Rikkidioksidi");
    });
  });
  it("finds & selects option by input value (road & transport)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get("#pollutant-select-input").click().clear().type("hiilimono");
      cy.get("li").click();
      cy.get("#pollutant-select-input").should("have.value", "Hiilimonoksidi");
    });
  });
  it("shows previously selected pollutant after exiting selector", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get("#pollutant-select-input").click().clear().type("rikkidio{esc}");
      cy.get("#pollutant-select-input").should("have.value", "Hiilimonoksidi");
    });
  });
  it("selects option with keyboard actions (combined GNFR)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get("#pollutant-select-input").click().clear().type("rikkidioksi{downarrow}{enter}");
      cy.get("#pollutant-select-input").should("have.value", "Rikkidioksidi");
    });
  });
});

describe("Grid data layer", () => {
  it("opens rikkidioksidi layer", () => {
    cy.visit("http://localhost:8080/");
    cy.contains("Typen oksidit");
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select-container").click();
      cy.contains("Rikkidioksidi").click();
    });
    // wait for the layer and legend to appear
    cy.contains("Päästömäärä (t)");
  });
  it("shows grid layer popup on click", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Rikkidioksidi (t):");
    cy.contains("0.45");
  });
  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
  });
  it("shows expected class ranges in legend (combined: rikkidioksidi)", () => {
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
  it("shows expected class ranges in legend (combined: typen oksidit)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select-container").click();
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
  it("shows expected class ranges in legend (road/transport: typen oksidit)", () => {
    cy.get(".gnfr-selector-div").within(() => cy.get(".gnfr-select-container").click());
    cy.get("#gnfr-select-list").within(() => cy.contains("li", "Road").click());
    cy.get("#gnfr-select-list").should("have.class", "hidden-all");
    cy.contains("Road");
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
  it("toggles municipality layer visible", () => {
    // switch back to typen oksidit
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select-container").click();
      cy.contains("Typen oksidit").click();
    });
    cy.contains("Kunnat").click();
    cy.contains("Kaikki");
    cy.contains("Päästömäärä (t / km2)");
  });
  it("shows municipality layer popup", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Typen oksidit (Vaala):");
    cy.contains("120.6 t");
    cy.contains("0.068 t / km2");
  });
  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
  });
  it("shows expected class ranges in legend (Typen oksidit)", () => {
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
  it("shows expected class ranges in legend (rikkidioksidi)", () => {
    cy.get(".pollutant-selector-div").within(() => {
      cy.get(".pollutant-select-container").click();
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
  it("toggles grid data layer active again", () => {
    cy.contains("Ruudukko").click();
    cy.contains("Päästömäärä (t)");
  });
  it("popups keep working", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Rikkidioksidi (t):");
    cy.contains("0.45");
    cy.get(".olpopup-closer").click();
  });
  it("shows expected class ranges in legend (combined: rikkidioksidi)", () => {
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
