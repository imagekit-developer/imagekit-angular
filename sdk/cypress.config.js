const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    // component options here
  },
  fixturesFolder: './tests/cypress/fixtures',
  screenshotsFolder: './tests/cypress/screenshots',
  videosFolder: './tests/cypress/videos',
  env: {
    APP_HOST: 'http://localhost:4200/',
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return require('./tests/cypress/plugins/index.js')(on, config)
    },
    specPattern: 'tests/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'tests/cypress/support/e2e.js',
  },
});
