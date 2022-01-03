describe('API endpoints with authentication', () => {

    let cookie
    let fakeUserID
    let postID
    let commentID
    
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

    it('getDashboard', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/dashboard',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
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

    /* -------------------------------------------------------------------------- */
    /*                                    CLUB                                    */
    /* -------------------------------------------------------------------------- */
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

    it('getClubInfo', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/club',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('getClubMembers', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/club/members',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('getClubBoard', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/club/board',
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

    /* -------------------------------------------------------------------------- */
    /*                                   MEMBERS                                  */
    /* -------------------------------------------------------------------------- */
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

    /** 
     * This test is made correctly, however we have an error in the UI which makes it fail.
     * It returns 5 x "This field is required" as it seems to get from the field validators
     * even though there are filled out.
    */
    // it('authSignup', () => {
    //     cy.setCookie('next-auth.session-token', cookie.value)
    //     cy.request({
    //         method: 'POST',
    //         url: '/api/auth/signup',
    //         headers: {
    //             'next-auth.session-token': cookie.value,
    //         },
    //         body: {
    //             'id': fakeUserID,
    //             'email': "test@cypress.dk",
    //             data: {
    //                 'name': "Tester",
    //                 'surname': "Testson",
    //                 'phone': "12345678",
    //                 'password': "010203",
    //                 'pathway': 1,
    //                 'User': fakeUserID
    //             },                
    //         },
    //         failOnStatusCode: false,
    //     }).then(resp => {
    //         expect(resp.status).to.eq(201)
    //     })
    // })

    it('changePassword', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/auth/change-password',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                password: "000000"
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile.
            expect(resp.status).to.eq(200)
        })
    })

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

    /* -------------------------------------------------------------------------- */
    /*                              POSTS & COMMENTS                              */
    /* -------------------------------------------------------------------------- */
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

    it('createNewComment', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/comments',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'postId': postID,
                'message': "Super awesome test comment!"
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(201)
            commentID = resp.body.id
        })
    })

    it('getAllComments', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/comments',
            qs: {
                posidId: postID,
                userId: fakeUserID
            },
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('deleteCommentById', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'DELETE',
            url: `/api/comments/${commentID}`,
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

    /* -------------------------------------------------------------------------- */
    /*                                NOTIFICATIONS                               */
    /* -------------------------------------------------------------------------- */
    it('getAllNotifications', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/notifications',
            qs: {
                userId: fakeUserID
            },
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    /* -------------------------------------------------------------------------- */
    /*                                   PROFILE                                  */
    /* -------------------------------------------------------------------------- */
    it('getUserProfile', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/profile',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('updateUserProfile', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'PUT',
            url: '/api/profile',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                'phone': "53570773"
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('getUserActivity', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/profile/activity',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    /* -------------------------------------------------------------------------- */
    /*                                  MEETINGS                                  */
    /* -------------------------------------------------------------------------- */
    it('getAllMeetings', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'GET',
            url: '/api/meetings',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            failOnStatusCode: false,
        }).then(resp => {
            expect(resp.status).to.eq(200)
        })
    })

    it('createNewMeeting', () => {
        cy.setCookie('next-auth.session-token', cookie.value)
        cy.request({
            method: 'POST',
            url: '/api/meetings',
            headers: {
                'next-auth.session-token': cookie.value,
            },
            body: {
                title: "Test meeting title",
                description: "Automated test to make sure meetings work.",
                venue: "Virtually",
                start: new Date(),
                end: new Date()+10,
                agenda: []
            },
            failOnStatusCode: false,
        }).then(resp => {
            // Only for board members, therefore not allowed with this profile
            expect(resp.status).to.eq(403)
        })
    })
})