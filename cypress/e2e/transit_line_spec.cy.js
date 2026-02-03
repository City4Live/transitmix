/// <reference types="cypress" />

describe('Transit Line Creation Test', () => {
  beforeEach(() => {
    // Handle uncaught exceptions from the application
    cy.on('uncaught:exception', (err, runnable) => {
      // Return false to prevent Cypress from failing the test on app errors
      return false
    })

    // Visit the main page before each test
    cy.visit('/')

    // Click Start to enter the map interface
    cy.get('.homeStartButton').should('be.visible').click({ force: true })

    // Wait for the map interface to load - check for "adding a transit line" link
    cy.get('.add', { timeout: 20000 }).should('exist')
  })

  it('should create a new transit line on the map', () => {
    // Click on "adding a transit line" to start creating a line
    cy.get('.add').first().click({ force: true })

    // Wait for the line creation interface to appear - check for the line panel
    cy.get('.back', { timeout: 10000 }).should('be.visible')

    // Verify we're in line editing mode - should see schedule options
    cy.contains('AM Peak').should('be.visible')

    // Click on the map to create points for the transit line
    // First point
    cy.get('#map').click(300, 250, { force: true })
    cy.wait(1500)

    // Second point
    cy.get('#map').click(500, 300, { force: true })
    cy.wait(1500)

    // Third point - double-click to finish the line
    cy.get('#map').dblclick(700, 250, { force: true })
    cy.wait(2000)

    // Verify the line stats have been updated (should show non-zero values)
    cy.contains('km').should('be.visible')
    cy.contains('buses').should('be.visible')

    // Click "← All lines" to go back to the lines list
    cy.get('.back').click({ force: true })
    cy.wait(1000)

    // Verify we're back at the lines list view
    cy.contains('Add a line').should('be.visible')

    // Verify line has statistics (km, buses) in the list
    cy.get('body').then($body => {
      const hasStats = $body.text().includes('km') && $body.text().includes('buses')
      expect(hasStats).to.be.true
    })
  })
})
