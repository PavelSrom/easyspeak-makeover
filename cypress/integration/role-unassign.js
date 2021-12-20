describe('Signing up for two roles and removing one', () => {
  it('Be visible only once after removing one of two roles', () => {
    cy.visit('/signin')

    cy.get('input[name="email"]')
      .click()
      .type('patryk.czarnecki93@gmail.com')
      .should('have.value', 'patryk.czarnecki93@gmail.com')

    cy.get('input[name="password"]')
      .click()
      .type('000000')
      .should('have.value', '000000')

    cy.get('button[type="submit"]').click()

    cy.wait(6000)

    cy.contains('Meetings').click()

    cy.wait(4000)

    cy.contains('Herning').click()

    cy.contains('Attend').click()

    cy.contains('Agenda').click()

    cy.scrollTo('bottom')

    // eq(4) = Ah counter
    cy.get('.MuiFab-circular').eq(4).click()

    cy.get('button[type="submit"]').click()

    // eq(5) = Grammarian
    cy.get('.MuiFab-circular').eq(5).click()

    cy.get('button[type="submit"]').click()

    cy.wait(4000)

    // eq(6) = Ah counter label
    // eq(7) = Grammarian label
    cy.get('label').eq(6).should('contain', 'Patryk Czarnecki')
    cy.get('label').eq(7).should('contain', 'Patryk Czarnecki')

    cy.get('[data-testid=DeleteIcon]').eq(0).click()

    cy.wait(4000)

    cy.get('label').eq(7).should('contain', 'Patryk Czarnecki')
    cy.get('label').eq(6).should('not.contain', 'Patryk Czarnecki')
  })
})
