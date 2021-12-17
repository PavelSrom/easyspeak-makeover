import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'

export const getDashBoardHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const template = {
    requestedSpeeches: undefined,
    requestedRoles: undefined,
  }

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
        },
        orderBy: { RoleType: { name: 'asc' } },
        include: {
          RoleType: true,
          Speech: true,
          Member: { select: { avatar: true, name: true, surname: true } },
        },
      })
      // @ts-ignore
      template.requestedSpeeches = requestedSpeechesQuery
    } else {
      const requestedRolesQuery = await prisma.attendance.findMany({
        where: {
          roleStatus: 'PENDING',
          Member: { id: session.user.profileId },
          // Speech: false,
        },
        orderBy: { RoleType: { name: 'asc' } },
        include: {
          RoleType: true,
          Member: { select: { avatar: true, name: true, surname: true } },
        },
      })
      // @ts-ignore
      template.requestedRoles = requestedRolesQuery
    }

    const finalApiResponse = {
      ...template,
    } as const

    res.json(finalApiResponse)
    return { finalApiResponse }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
