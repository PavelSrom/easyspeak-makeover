describe('Signin with missing credentials', () => {
  it('Show error message when missing password', () => {
    cy.visit('/signin')

    cy.get('input[name="email"]')
      .click()
      .type('patryk.czarnecki93@gmail.com')
      .should('have.value', 'patryk.czarnecki93@gmail.com')

    cy.get('input[name="password"]').should('be.empty')

    cy.get('button[type="submit"]').click()

    cy.get('input[name="password"]')
      .get('div')
      .should('have.class', 'Mui-error')
  })
})

describe('Signin procedure with correct credentials', () => {
  it('Signin and redirect to protected dashboard page', () => {
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

    cy.url().should('eq', 'http://localhost:3000/')
  })
  it('Show a green success message when signed in', () => {
    cy.get('.SnackbarItem-message').should('have.text', 'Signed in')
  })
})
