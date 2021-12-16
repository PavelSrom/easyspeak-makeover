describe('Authentication test', () => {
    it('Testing meetings page', () => {
        cy.request({
            url: 'http://localhost:3000/meetings',
          }).then((resp) => {
            // Access denied status code 403
            expect(resp.status).to.eq(403)
            expect(resp.redirectedToUrl).to.eq('http://localhost:3000/signin')
          })
    })
})