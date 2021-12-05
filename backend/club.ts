import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'

export const getClubInfoHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const clubInfo = await prisma.club.findUnique({
      where: { id: session.user.clubId },
    })
    if (!clubInfo) return res.status(404).json({ message: 'Club not found' })

    res.json(clubInfo)
    return clubInfo
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getClubMembersHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const clubMembers = await prisma.profile.findMany({
      where: { User: { clubId: session.user.clubId } },
      select: {
        id: true,
        avatar: true,
        name: true,
        surname: true,
        User: { select: { email: true } },
        ClubRole: { select: { name: true } },
      },
      orderBy: { surname: 'asc' },
    })

    const pendingInvites = await prisma.user.findMany({
      where: { clubId: session.user.clubId, password: null },
      select: { id: true, email: true, invitationSent: true, createdAt: true },
    })

    res.json({ clubMembers, pendingInvites })
    return { clubMembers, pendingInvites }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getClubBoardHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const boardMembers = await prisma.profile.findMany({
      where: {
        User: { clubId: session.user.clubId },
        roleTypeId: { not: null },
      },
      select: {
        ClubRole: { select: { name: true } },
        User: { select: { email: true } },
        id: true,
        avatar: true,
        name: true,
        surname: true,
        phone: true,
      },
    })

    res.json(boardMembers)
    return boardMembers
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getClubMemberByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const clubMember = await prisma.profile.findFirst({
      where: {
        id: req.query.id as string,
        User: { clubId: session.user.clubId },
      },
      include: {
        User: { select: { email: true, Club: { select: { name: true } } } },
        ClubRole: { select: { name: true } },
      },
    })
    if (!clubMember)
      return res.status(404).json({ message: 'Member not found' })

    res.json(clubMember)
    return clubMember
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
