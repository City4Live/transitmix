/// <reference types="cypress" />

describe('Map Remix Flow', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err, runnable) => {
      return false
    })

    // Navigate to a new map
    cy.visit('/')
    cy.get('.homeStartButton').should('be.visible').click({ force: true })
    cy.get('.add', { timeout: 20000 }).should('exist')

    // Create a transit line
    cy.get('.add').first().click({ force: true })
    cy.get('.back', { timeout: 10000 }).should('be.visible')

    cy.get('#map').click(300, 250, { force: true })
    cy.wait(1500)
    cy.get('#map').click(500, 300, { force: true })
    cy.wait(1500)
    cy.get('#map').dblclick(700, 250, { force: true })
    cy.wait(2000)

    // Go back to all lines view
    cy.get('.back').click({ force: true })
    cy.wait(1000)
    cy.contains('Add a line').should('be.visible')
  })

  it('should remix a map and navigate to the new copy', () => {
    cy.url().then((originalUrl) => {
      cy.get('.remix').click({ force: true })

      // Notification should appear
      cy.get('.NotificationView', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'freshly-made duplicate')

      // URL should change to new map
      cy.url({ timeout: 10000 }).should('not.eq', originalUrl)

      // New map should still show line stats
      cy.contains('km').should('be.visible')
      cy.contains('buses').should('be.visible')

      // Remixed-from link should exist
      cy.get('.remixedFrom').should('exist')
    })
  })

  it('should preserve line count after remix', () => {
    cy.get('.lineCount').invoke('text').then((originalCount) => {
      cy.get('.remix').click({ force: true })
      cy.get('.NotificationView', { timeout: 10000 }).should('be.visible')

      cy.get('.lineCount').should('have.text', originalCount)
    })
  })

  it('should navigate back to original map via remixedFrom link', () => {
    cy.url().then((originalUrl) => {
      cy.get('.remix').click({ force: true })
      cy.get('.NotificationView', { timeout: 10000 }).should('be.visible')
      cy.url({ timeout: 10000 }).should('not.eq', originalUrl)

      // Click the remixed-from link to go back
      cy.get('.remixedFrom').click({ force: true })
      cy.wait(1000)

      // Should be back at the original map
      cy.url().should('eq', originalUrl)

      // Original map should still show its stats
      cy.contains('km').should('be.visible')
      cy.contains('buses').should('be.visible')
    })
  })
})
