/// <reference types="cypress" />

describe('Main Page Acceptance Test', () => {
  beforeEach(() => {
    // Visit the main page before each test
    cy.visit('/')
  })

  it('should load the main page and display the home view', () => {
    // Verify the page loads by checking for key elements
    cy.contains('Transitmix').should('be.visible')
    cy.contains('Design, remix, and share your perfect transit map.').should('be.visible')
    cy.contains('Choose a city:').should('be.visible')
    cy.contains('San Francisco, CA').should('be.visible')
  })

  it('should have a Start button that can be clicked', () => {
    // Find and click the Start button using the specific class selector
    cy.get('.homeStartButton').should('be.visible').click({ force: true })

    // After clicking Start, we should see the map interface
    // This might take a moment to load, so we'll wait for key elements
    // Use multiple strategies to handle potential WebGL issues
    cy.get('#map', { timeout: 20000 }).should('exist')
    cy.get('body').then(($body) => {
      // Check if map is visible or if WebGL fallback occurred
      if ($body.find('#map').length > 0) {
        cy.get('#map').should('be.visible')
      } else {
        // If map isn't visible due to WebGL issues, check for fallback content
        cy.contains('Transitmix').should('exist')
      }
    })

    // Verify we're no longer seeing the home view
    cy.get('.homeStartButton').should('not.exist')
  })

  it('should allow changing the city name before starting', () => {
    // Find the editable city field
    cy.get('.homeCity').should('be.visible').click({ force: true })

    // Clear and type a new city name
    cy.get('.homeCity').clear({ force: true }).type('New York, NY', { force: true })

    // Verify the city name changed
    cy.get('.homeCity').should('contain', 'New York, NY')

    // Click Start with the new city
    cy.get('.homeStartButton').click({ force: true })

    // Verify we transitioned to the map view
    cy.get('#map', { timeout: 20000 }).should('exist')
    cy.get('body').then(($body) => {
      // Check if map is visible or if WebGL fallback occurred
      if ($body.find('#map').length > 0) {
        cy.get('#map').should('be.visible')
      } else {
        // If map isn't visible due to WebGL issues, check for fallback content
        cy.contains('Transitmix').should('exist')
      }
    })
  })
})