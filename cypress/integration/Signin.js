describe('Signin with missing credentials', () => {
  it('Should show error messages when missing credentials', () => {
    cy.visit('http://localhost:3000/signin')

    cy.get('input[name="email"]')
      .click()
      .type("patryk@gmail.com")
      .should('have.value', 'patryk@gmail.com')

      cy.get('input[name="password"]')
      .should('be.empty')

      cy.get('button[type="submit"]')
      .click()

      cy.get('input[name="password"]')
      .get('div')
      .should('have.class', 'Mui-error')
  })
})

describe('Signin procedure with correct credentials', () => {
    it('Should signin and redirect to protected dashboard page', () => {
      cy.visit('http://localhost:3000/signin')

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
      
      cy.url().should('eq', 'http://localhost:3000/')
  
    })
    it('Should show a green success message when signed in', () => {
      cy.get('.SnackbarItem-message')
      .should('have.text', 'Signed in')
    })
  })
  