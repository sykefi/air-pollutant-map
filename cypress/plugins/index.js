/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const { addMatchImageSnapshotPlugin } = require("cypress-image-snapshot/plugin");
const path = require("path");

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on("before:browser:launch", (browser = {}, launchOptions) => {
    const downloadDirectory = path.join(__dirname, "..", "csvDownloads");
    if (browser.family === "chromium" && browser.name !== "electron") {
      launchOptions.preferences.default["download"] = {
        default_directory: downloadDirectory
      };
    }
    return launchOptions;
  });
};
