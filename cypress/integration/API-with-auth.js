describe('API endpoints with authentication', () => {

    let cookie
    let fakeUserID
    let postID
    
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

    it('createNewMember', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/auth/create-member',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'email': "test@cypress.dk",
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile.
            expect(resp.status).to.eq(403)
            fakeUserID = resp.body.id
        })
    })

    it('authCheckUser with correct email', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/auth/check-user',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'email': "test@cypress.dk"
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile.
            expect(resp.status).to.eq(403)
        })
    })

    it('authCheckUser with invalid email', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/auth/check-user',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'email': "ishouldnotexist@cypress.dk"
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile.
            expect(resp.status).to.eq(403)
        })
    })

    it('resendInvitationEmail', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: `/api/auth/email/${fakeUserID}`,
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile.
            expect(resp.status).to.eq(403)
        })
    })

    // it('authSignup', () => {
    //     cy.setCookie('next-auth.session-token', cookie.value)
    //     cy.request({
    //         method: 'POST',
    //         url: '/api/auth/signup',
    //         headers: {
    //             'next-auth.session-token': cookie.value,
    //         },
    //         body: {
    //             id: fakeUserID,
    //             email: "test@cypress.dk",
    //             data: {
    //                 name: "Tester",
    //                 surname: "Testson",
    //                 phone: "12345678",
    //                 password: "010203",
    //                 pathway: 1,
    //                 User: fakeUserID
    //             },                
    //         },
    //         failOnStatusCode: false,
    //     }).then(resp => {
    //         expect(resp.status).to.eq(201)
    //     })
    // })

    // it('changePassword', () => {
    //     cy.setCookie('next-auth.session-token', cookie.value)
    //     cy.request({
    //         method: 'POST',
    //         url: '/api/auth/change-password',
    //         headers: {
    //             'next-auth.session-token': cookie.value,
    //         },
    //         body: {
    //             password: "000000"
    //         },
    //         failOnStatusCode: false,
    //     }).then(resp => {
    //         // Only for board members, therefore not allowed with this profile.
    //         expect(resp.status).to.eq(200)
    //     })
    // })

    it('deleteNewMemberById', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'DELETE',
            url: `/api/auth/create-member/${fakeUserID}`,
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile.
            expect(resp.status).to.eq(403)
        })
    })

    it('getAllPosts', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/posts',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('createNewPost', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/posts',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'title': "Test title",
                'body': "Test body"
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(201)
            postID = resp.body.id
        })
    })

    it('getPostById', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: `/api/posts/${postID}`,
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('updatePostById', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'PUT',
            url: `/api/posts/${postID}`,
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'title': "Edited test title",
                'body': "Edited test body"
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('togglePinPostStatus', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'PUT',
            url: `/api/posts/${postID}/pin`,
            qs: {
                pin: true
            },
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('deletePostById', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'DELETE',
            url: `/api/posts/${postID}`,
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })
})