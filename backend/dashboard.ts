import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'

export const getDashBoardHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  let requestedItemsQuery

  try {
    const clubInfoQuery = await prisma.club.findUnique({
      where: { id: session.user.clubId },
      select: {
        name: true,
        location: true,
        description: true,
        Users: {
          where: {
            Profile: { ClubRole: { name: 'President' } },
          },
          select: {
            Profile: {
              select: { avatar: true, name: true, surname: true },
            },
          },
        },
      },
    })

    const pinnedPostQuery = prisma.post.findFirst({
      where: { isPinned: true, clubId: session.user.clubId },
      select: {
        id: true,
        title: true,
        body: true,
        isPinned: true,
        createdAt: true,
        _count: { select: { Comments: true } },
        Author: {
          select: {
            name: true,
            surname: true,
            avatar: true,
            ClubRole: { select: { name: true } },
          },
        },
      },
    })

    const auth = await prisma.profile.findFirst({
      where: { id: session.user.profileId },
    })
    if (!auth) return res.status(404).json({ message: 'Access denied' })
    if (auth.roleTypeId) {
      const requestedSpeechesQuery = prisma.attendance.findMany({
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
      requestedItemsQuery = requestedSpeechesQuery
    } else {
      const requestedRoles = prisma.attendance.findMany({
        where: {
          roleStatus: 'PENDING',
          Member: { id: session.user.userId },
          // Speech: false,  Check if speech isn't there
        },
        orderBy: { RoleType: { name: 'asc' } },
        include: {
          RoleType: true,
          Member: { select: { avatar: true, name: true, surname: true } },
        },
      })
      requestedItemsQuery = requestedRoles
    }

    const [clubInfo, requestedItems, pinnedPost] = await Promise.all([
      clubInfoQuery,
      requestedItemsQuery,
      pinnedPostQuery,
    ])
    res.json({ clubInfo, requestedItems, pinnedPost })
    return { clubInfo, requestedItems, pinnedPost }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
