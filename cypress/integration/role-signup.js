describe('Signing up for roles other than speeches', () => {
    it('Be visible in "coming to meeting" when attending', () => {
        cy.visit('/signin')

        cy.get('input[name="email"]')
        .click()
        .type("patryk@gmail.com")
        .should('have.value', 'patryk@gmail.com')
  
        cy.get('input[name="password"]')
        .click()
        .type("000000")
        .should('have.value', '000000')
  
        cy.get('button[type="submit"]')
        .click()

        cy.wait(6000)
        
        cy.contains('Meetings').click()

        cy.wait(4000)

        cy.contains('Herning').click()

        cy.contains('Attend').click()

        cy.contains('Agenda').click()

        // Cypress scrolls down to the bottom of the page here,
        // so eq(1) refers to the first button in the scrolled
        // down view = Evaluator 1
        cy.get('.MuiFab-circular').eq(1).click()

        cy.get('button[type="submit"]')
        .click()

        cy.wait(6000)

        cy.get('label').eq(3).should('contain', "Patryk Czarnecki")
    })
  })