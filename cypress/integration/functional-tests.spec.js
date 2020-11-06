describe("Page load and initial UI", () => {
  it("renders main div", () => {
    cy.visit("http://localhost:8080/");
    cy.get("div#app-wrapper");
  });

  it("shows year selector", () => {
    cy.contains("Vuosi");
  });

  it("shows GNFR selector", () => {
    cy.contains("Luokka");
  });

  it("shows pollutant selector", () => {
    cy.contains("Päästö");
    cy.contains("Typen oksidit");
  });

  it("shows map data type selector (ruudukko/kunnat)", () => {
    cy.contains("Ruudukko");
    cy.contains("Kunnat");
  });

  it("shows legend", () => {
    cy.contains("Päästömäärä");
  });

  it("shows GNFR description", () => {
    cy.contains("esittää kaikkien inventoitujen");
  });

  it("shows total pollution statistics", () => {
    cy.contains("Päästöt yhteensä:");
  });

  it("shows correct total pollution (2018 combined: typen oksidit)", () => {
    cy.contains("126595.3 t");
  });
});

describe("Year selector", () => {
  it("toggles year options visible", () => {
    cy.get("#year-selector-div").within(() => cy.get("#select-container-year").click());
    cy.contains("2018");
    cy.contains("2015");
    cy.contains("2010");
    cy.contains("2005");
    cy.contains("2000");
    cy.contains("1995");
  });

  it("toggles year options hidden by clicking the input", () => {
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-container-year").click();
      cy.get("#select-list-year").should("have.class", "hidden-all");
    });
  });

  it("toggles year options hidden by clicking outside the input", () => {
    cy.get("#year-selector-div").within(() => cy.get("#select-container-year").click());
    cy.contains("2015");
    cy.get("#map-container").click(325, 520);
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-list-year").should("have.class", "hidden-all");
    });
  });

  it("selects year by clicking an option (2010)", () => {
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-container-year").click();
      cy.contains("li", "2010").click();
      cy.get("#select-list-year").should("have.class", "hidden-all");
      cy.contains("2010");
    });
  });
});

describe("GNFR selector", () => {
  it("toggles GNFR options visible", () => {
    cy.get("#gnfr-selector-div").within(() => cy.get("#select-container-gnfr").click());
    cy.get("#select-list-gnfr").within(() => cy.contains("li", "Shipping"));
  });

  it("toggles GNFR options hidden by clicking the input", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
    });
  });

  it("toggles GNFR options hidden by clicking outside the input", () => {
    cy.get("#gnfr-selector-div").within(() => cy.get("#select-container-gnfr").click());
    cy.contains("Shipping");
    cy.get("#map-container").click(325, 520);
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
    });
  });

  it("selects GNFR by clicking an option (public power)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Public").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
      cy.contains("Public");
    });
  });

  it("selects combined GNFR", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Kokonaisp").click();
      cy.get("#select-list-gnfr").should("have.class", "hidden-all");
      cy.get("#selection-input-gnfr").should("have.value", "Kokonaispäästöt");
    });
  });

  it("finds & selects option by input value (road & transport)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click().clear().type("roadTranspor");
      cy.get("li").click();
      cy.get("#selection-input-gnfr").should("have.value", "F_RoadTransport_fi");
    });
  });

  it("shows previously selected GNFR after exiting selector", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click().clear().type("kokonais{esc}");
      cy.get("#selection-input-gnfr").should("have.value", "F_RoadTransport_fi");
    });
  });

  it("selects option with keyboard actions (combined GNFR)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click().clear().type("kokonais{downarrow}{enter}");
      cy.get("#selection-input-gnfr").should("have.value", "Kokonaispäästöt");
    });
  });
});

describe("Pollutant selector", () => {
  it("toggles pollutant options visible", () => {
    cy.get("#pollutant-selector-div").within(() =>
      cy.get("#select-container-pollutant").click()
    );
    cy.get("#select-list-pollutant").within(() => cy.contains("Rikkidioksidi"));
  });

  it("toggles pollutant options hidden by clicking the input", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
    });
  });

  it("toggles pollutant options hidden by clicking outside the input", () => {
    cy.get("#pollutant-selector-div").within(() =>
      cy.get("#select-container-pollutant").click()
    );
    cy.contains("Rikkidioksidi");
    cy.get("#map-container").click(325, 520);
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
    });
  });

  it("selects pollutant by clicking an option (rikkidioksidi)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#select-list-pollutant").should("have.class", "hidden-all");
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
  });

  it("finds & selects option by input value (hiilimonoksidi)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click().clear().type("hiilimono");
      cy.get("li").click();
      cy.get("#selection-input-pollutant").should("have.value", "Hiilimonoksidi");
    });
  });

  it("shows previously selected pollutant after exiting selector (hiilimonoksidi)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click().clear().type("rikkidio{esc}");
      cy.get("#selection-input-pollutant").should("have.value", "Hiilimonoksidi");
    });
  });

  it("selects option with keyboard actions (rikkidioksidi", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click().clear().type("rikkidioksi{downarrow}{enter}");
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
  });
});

describe("Grid data layer", () => {
  it("opens rikkidioksidi layer", () => {
    cy.visit("http://localhost:8080/");
    // wait until the initial layer is loaded
    cy.contains("Typen oksidit");
    cy.contains("126595.3 t");
    // select rikkidioksidi
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
    });
    // wait until total emissions are shown
    cy.contains("33127.4 t");
    // wait for the layer and legend to appear
    cy.contains("Päästömäärä");
  });

  it("shows grid layer popup on click", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Rikkidioksidi (t):");
    cy.contains("0.37");
  });

  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
  });

  it("shows expected class ranges in legend (2018 combined: rikkidioksidi)", () => {
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.0072");
      cy.contains("0.0072 - 0.063");
      cy.contains("0.063 - 0.19");
      cy.contains("89 - 255");
      cy.contains("255 - 4129");
    });
  });

  it("shows expected class ranges in legend (2018 combined: typen oksidit)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.28");
      cy.contains("0.28 - 1.6");
      cy.contains("137 - 381");
      cy.contains("381 - 3300");
    });
  });

  it("shows expected class ranges in legend (2010 combined: typen oksidit)", () => {
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2010").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.28");
      cy.contains("0.28 - 1.6");
      cy.contains("137 - 381");
      cy.contains("381 - 4591");
    });
  });

  it("shows expected class ranges in legend (2010 aviation: typen oksidit)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Aviation").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.28");
      cy.contains("0.28 - 1.6");
      cy.contains("12 - 137");
      cy.contains("137 - 381");
    });
  });

  it("shows expected class ranges in legend (2018 road/transport: typen oksidit)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-container-gnfr").click();
      cy.contains("li", "Road").click();
    });
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2018").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.28");
      cy.contains("0.28 - 1.6");
      cy.contains("137 - 381");
      cy.contains("381 - 842");
    });
  });

  it("shows correct total pollution statistics (2018 road/transport: typen oksidit)", () => {
    cy.contains("Valitun luokan osuus kokonaispäästöistä");
    cy.contains("24 % (30429.7 t)");
  });
});

describe("Municipality layer", () => {
  it("toggles municipality layer visible", () => {
    // switch back to typen oksidit
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    // switch back to combined data
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Kokonaisp").click();
    });
    cy.contains("Kunnat").click();
    cy.contains("Kokonaisp");
    cy.contains("Päästömäärä (t / km2)");
  });

  it("shows municipality layer popup (2018 combined: typen oksidit)", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Typen oksidit (Kuopio):");
    cy.contains("2457.3 t");
    cy.contains("0.57 t / km2");
  });

  it("closes popup", () => {
    cy.get(".olpopup-closer").click();
  });

  it("shows expected class ranges in legend (2018 combined: typen oksidit)", () => {
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.1");
      cy.contains("0.1 - 0.19");
      cy.contains("4.8 - 14");
      cy.contains("14 - 32");
    });
  });

  it("shows expected class ranges in legend (2018 road/transport: rikkidioksidi)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Road").click();
    });
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Rikkidioksidi").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.0058");
      cy.contains("0.0058 - 0.012");
      cy.contains("0.079 - 3.5");
      cy.get("div").last().contains("3.5 - 6.5");
    });
  });

  it("shows expected class ranges in legend (2010 aviation: typen oksidit)", () => {
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-input-pollutant").click();
      cy.contains("Typen oksidit").click();
    });
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2010").click();
    });
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Aviation").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.1");
      cy.contains("0.1 - 0.19");
      cy.contains("0.66 - 4.8");
      cy.get("div").last().contains("4.8 - 14");
    });
  });

  it("shows expected class ranges in legend (2010 combined: typen oksidit)", () => {
    cy.get("#gnfr-selector-div").within(() => {
      cy.get("#select-input-gnfr").click();
      cy.contains("li", "Kokonaisp").click();
    });
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.1");
      cy.contains("0.1 - 0.19");
      cy.contains("4.8 - 14");
      cy.get("div").last().contains("14 - 48");
    });
  });

  it("shows expected class ranges in legend (2018 combined: rikkidioksidi)", () => {
    // switch back to year 2018
    cy.get("#year-selector-div").within(() => {
      cy.get("#select-input-year").click();
      cy.contains("li", "2018").click();
    });
    cy.get("#pollutant-selector-div").within(() => {
      cy.get("#select-container-pollutant").click();
      cy.contains("Rikkidioksidi").click();
      cy.get("#selection-input-pollutant").should("have.value", "Rikkidioksidi");
    });
    // wait until total emissions are shown
    cy.contains("33127.4 t");
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.0058");
      cy.contains("0.0058 - 0.012");
      cy.contains("3.5 - 6.5");
      cy.contains("6.5 - 25");
    });
  });
});

describe("Toggle back to grid data layer", () => {
  it("toggles grid data layer active again", () => {
    cy.contains("Ruudukko").click();
    cy.contains("Päästömäärä");
  });

  it("popups keep working", () => {
    cy.get("#map-container").click(325, 520);
    cy.contains("Rikkidioksidi (t):");
    cy.contains("0.37");
    cy.get(".olpopup-closer").click();
  });

  it("shows expected class ranges in legend (2018 combined: rikkidioksidi)", () => {
    cy.get(".legend-box").within(() => {
      cy.contains("0 - 0.0072");
      cy.contains("0.0072 - 0.063");
      cy.contains("89 - 255");
      cy.contains("255 - 4129");
    });
  });
});
