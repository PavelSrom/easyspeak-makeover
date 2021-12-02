import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import bcrypt from 'bcryptjs'
import { prisma } from 'utils/prisma-client'

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    Providers.Credentials({
      async authorize(credentials: { email: string; password: string }) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { Profile: { select: { id: true } } },
        })
        if (!user) throw new Error('Invalid credentials')

        const match = await bcrypt.compare(
          credentials.password,
          user.password ?? ''
        )
        if (!match) throw new Error('Invalid credentials')

        return {
          userId: user.id,
          profileId: user.Profile?.id,
          clubId: user.clubId,
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user) => {
      // eslint-disable-next-line no-param-reassign
      if (user?.userId) token.userId = user.userId
      // eslint-disable-next-line no-param-reassign
      if (user?.profileId) token.profileId = user.profileId
      // eslint-disable-next-line no-param-reassign
      if (user?.clubId) token.clubId = user.clubId

      return token
    },
    session: async (session, user) => {
      // eslint-disable-next-line no-param-reassign
      session.user = user

      return Promise.resolve(session)
    },
  },
})
