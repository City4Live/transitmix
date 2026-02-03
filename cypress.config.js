const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    chromeWebSecurity: false,
    defaultCommandTimeout: 15000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 2,
      openMode: 1
    },
    env: {
      // Disable WebGL-related checks that might cause failures
      failOnStatusCode: false
    }
  }
})
