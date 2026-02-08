/// <reference types="cypress" />

describe('Service Window Editing', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    // Visit the main page and start a new map
    cy.visit('/')
    cy.get('.homeStartButton').should('be.visible').click({ force: true })
    cy.get('.add', { timeout: 20000 }).should('exist')

    // Create a transit line
    cy.get('.add').first().click({ force: true })
    cy.get('.back', { timeout: 10000 }).should('be.visible')

    cy.get('#map').click(300, 250, { force: true })
    cy.wait(500)
    cy.get('#map').click(500, 300, { force: true })
    cy.wait(500)
    cy.get('#map').dblclick(700, 250, { force: true })

    // Wait for line stats (route calculation complete)
    cy.contains('buses').should('be.visible')
  })

  it('should display service windows with editable fields', () => {
    // Default enabled weekday windows should be visible
    cy.get('.windows').within(() => {
      cy.contains('AM Peak').should('be.visible')
      cy.contains('Midday').should('be.visible')
      cy.contains('PM Peak').should('be.visible')
      cy.contains('Evening').should('be.visible')

      // Each service window should have from, to, headway inputs
      cy.get('.from').should('have.length.at.least', 4)
      cy.get('.to').should('have.length.at.least', 4)
      cy.get('.headway').should('have.length.at.least', 4)
    })
  })

  it('should update cost when headway is changed', () => {
    cy.get('.cost').invoke('text').then((initialCost) => {
      // Change the first headway input to 30 min
      cy.get('.windows .headway').first().clear().type('30', { force: true })
      cy.get('.windows .headway').first().blur()

      // Retry assertion until cost recalculates
      cy.get('.cost').invoke('text').should('not.eq', initialCost)
    })
  })

  it('should update cost when service window times are changed', () => {
    cy.get('.cost').invoke('text').then((initialCost) => {
      // Change the first "from" time
      cy.get('.windows .from').first().clear().type('5am', { force: true })
      cy.get('.windows .from').first().blur()

      // Retry assertion until cost recalculates
      cy.get('.cost').invoke('text').should('not.eq', initialCost)
    })
  })

  it('should add a service window via map settings and verify update', () => {
    // Go back to all lines view
    cy.get('.back').click({ force: true })
    cy.get('.mapDetailsItemView', { timeout: 10000 }).should('exist')

    // Open map settings
    cy.get('.toggleSettings').click({ force: true })
    cy.get('.mapSettingsView').should('be.visible')

    // Find the disabled "Morning" service window and enable it
    cy.contains('.serviceWindow', 'Morning').within(() => {
      cy.get('.toggle').click({ force: true })
    })

    // Apply to all existing lines
    cy.get('.applyToAll').click({ force: true })

    // Close settings
    cy.get('.closeSettings').click({ force: true })
    cy.get('.mapSettingsView').should('not.exist')

    // Click on the line to view its details
    cy.get('.mapDetailsItemView').first().click({ force: true })
    cy.get('.windows', { timeout: 10000 }).should('exist')

    // Verify "Morning" now appears in the line's service windows
    cy.get('.windows').within(() => {
      cy.contains('Morning').should('exist')
    })
  })

  it('should remove a service window via map settings and verify update', () => {
    // Go back to all lines view
    cy.get('.back').click({ force: true })
    cy.get('.mapDetailsItemView', { timeout: 10000 }).should('exist')

    // Open map settings
    cy.get('.toggleSettings').click({ force: true })
    cy.get('.mapSettingsView').should('be.visible')

    // Find the enabled "Evening" service window and disable it
    cy.contains('.serviceWindow', 'Evening').within(() => {
      cy.get('.toggle').click({ force: true })
    })

    // Apply to all existing lines
    cy.get('.applyToAll').click({ force: true })

    // Close settings
    cy.get('.closeSettings').click({ force: true })
    cy.get('.mapSettingsView').should('not.exist')

    // Click on the line to view its details
    cy.get('.mapDetailsItemView').first().click({ force: true })
    cy.get('.windows', { timeout: 10000 }).should('exist')

    // Verify "Evening" no longer appears in the line's service windows
    cy.get('.windows').within(() => {
      cy.contains('Evening').should('not.exist')
    })
  })
})
