import { createNewMemberHandler } from 'backend/auth'
import { prismaMock } from 'singleton'

test('should create a new member', async () => {
    const user = {
        email: "test@test.com",
        id: "999",
        password: "010101",
        invitationSent: true,
        clubId: "9",
        createdAt: new Date("2021-12-14T22:49:25+00:00"),
        pwResetToken: null,
        pwResetExpiration: null,
    }
    prismaMock.user.create.mockResolvedValue(user)

    await expect(createNewMemberHandler()).resolves.toEqual({
        id: "999",
        email: "test@test.com",
        invitationSent: true,
    })
})