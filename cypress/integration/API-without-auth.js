describe('API endpoints without authentication', () => {
  it('getAllPathways', () => {
    cy.request({
      method: 'GET',
      url: '/api/pathways',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 200: OK
      expect(resp.status).to.eq(200)
    })
  })
  it('getClubRoles', () => {
    cy.request({
      method: 'GET',
      url: '/api/club-roles',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getMeetingRoles', () => {
    cy.request({
      method: 'GET',
      url: '/api/meeting-roles',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('createNewMember', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/create-member',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('deleteNewMemberById', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/auth/create-member/999',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('resendInvitationEmail', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/email/999',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('authCheckUser', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/check-user',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 400: Bad request
      expect(resp.status).to.eq(400)
    })
  })
  it('authSignup', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/signup',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 400: Bad request
      expect(resp.status).to.eq(400)
    })
  })
  it('changePassword', () => {
    cy.request({
      method: 'POST',
      url: 'api/auth/change-password',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('deleteUserAccount', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/auth/delete',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 400: Bad request
      expect(resp.status).to.eq(400)
    })
  })
  it('getAllPosts', () => {
    cy.request({
      method: 'GET',
      url: '/api/posts',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getPostById', () => {
    cy.request({
      method: 'GET',
      url: '/api/posts/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('createNewPost', () => {
    cy.request({
      method: 'POST',
      url: '/api/posts',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('updatePostById', () => {
    cy.request({
      method: 'PUT',
      url: '/api/posts/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('deletePostById', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/posts/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('togglePostPinStatus', () => {
    cy.request({
      method: 'PUT',
      url: '/api/posts/1/?pin=true',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getAllComments', () => {
    cy.request({
      method: 'GET',
      url: '/api/comments',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('createNewComment', () => {
    cy.request({
      method: 'POST',
      url: '/api/comments',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('deleteCommentById', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/comments/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getAllNotifications', () => {
    cy.request({
      method: 'GET',
      url: '/api/notifications',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('markNotificationAsRead', () => {
    cy.request({
      method: 'PUT',
      url: '/api/notifications',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('deleteNotoficationById', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/notifications/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getUserProfile', () => {
    cy.request({
      method: 'GET',
      url: '/api/profile',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('updateUserProfile', () => {
    cy.request({
      method: 'PUT',
      url: '/api/profile',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getUserActivity', () => {
    cy.request({
      method: 'GET',
      url: '/api/profile/activity',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getAllMeetings', () => {
    cy.request({
      method: 'GET',
      url: '/api/meetings',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('createNewMeeting', () => {
    cy.request({
      method: 'POST',
      url: '/api/meetings',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getMeetingById', () => {
    cy.request({
      method: 'GET',
      url: '/api/meetings/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('toggleMeetingAttendance', () => {
    cy.request({
      method: 'POST',
      url: '/api/meetings/1/?attending=true',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getFullAgenda', () => {
    cy.request({
      method: 'GET',
      url: '/api/meetings/1/agenda',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('memberAssignRole', () => {
    cy.request({
      method: 'POST',
      url: '/api/meetings/1/assign/2',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('memberUnassignRole', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/meetings/1/assign/2',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('adminAssignRole', () => {
    cy.request({
      method: 'POST',
      url: '/api/meetings/1/admin-assign/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('acceptAssignedRole', () => {
    cy.request({
      method: 'POST',
      url: '/api/meetings/1/?accepted=true/2',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('toggleSpeechApproval', () => {
    cy.request({
      method: 'POST',
      url: '/api/meetings/1/?approved=true/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getClubInfo', () => {
    cy.request({
      method: 'GET',
      url: '/api/club',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getClubMembers', () => {
    cy.request({
      method: 'GET',
      url: '/api/club/members',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getClubBoard', () => {
    cy.request({
      method: 'GET',
      url: '/api/club/board',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getClubMemberById', () => {
    cy.request({
      method: 'GET',
      url: '/api/club/members/1',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('changeMemberRole', () => {
    cy.request({
      method: 'POST',
      url: '/api/club/members/1/change-role',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
  it('getDashboard', () => {
    cy.request({
      method: 'GET',
      url: '/api/dashboard',
      failOnStatusCode: false,
    }).then(resp => {
      // Status code 403: Forbidden
      expect(resp.status).to.eq(403)
    })
  })
})
