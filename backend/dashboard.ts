import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'

export const getDashBoardHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const auth = await prisma.profile.findFirst({
      where: { id: session.user.profileId },
    })
    if (!auth) return res.status(404).json({ message: 'Access denied' })
    if (auth.roleTypeId) {
      const requestedSpeechesQuery = await prisma.attendance.findMany({
        where: {
          roleStatus: 'PENDING',
          RoleType: { name: { startsWith: 'Speaker' } },
          Meeting: { clubId: session.user.clubId },
          memberId: { not: session.user.profileId },
          Speech: { isNot: null },
        },
        orderBy: { RoleType: { name: 'asc' } },
        include: {
          RoleType: true,
          Speech: true,
          Member: { select: { avatar: true, name: true, surname: true } },
        },
      })

      res.json({
        requestedSpeeches: requestedSpeechesQuery,
        requestedRoles: undefined,
      })
      return {
        requestedSpeeches: requestedSpeechesQuery,
        requestedRoles: undefined,
      }
    }

    const requestedRolesQuery = await prisma.attendance.findMany({
      where: {
        roleStatus: 'PENDING',
        Member: { id: session.user.profileId },
        Speech: { is: null },
      },
      orderBy: { RoleType: { name: 'asc' } },
      include: {
        RoleType: true,
        Member: { select: { avatar: true, name: true, surname: true } },
      },
    })

    res.json({
      requestedSpeeches: undefined,
      requestedRoles: requestedRolesQuery,
    })
    return {
      requestedSpeeches: undefined,
      requestedRoles: requestedRolesQuery,
    }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
