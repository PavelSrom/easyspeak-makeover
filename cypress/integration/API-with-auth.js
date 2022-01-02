describe('API endpoints with authentication', () => {

    let cookie
    
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

        cy.getCookie('next-auth.session-token')
            .should('exist')
            .then((c) => {
                // save cookie until we need it
                cookie = c
            })
    })

    it('getAllPathways', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/pathways',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('getClubRoles', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/club-roles',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('getMeetingRoles', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/meeting-roles',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })
})