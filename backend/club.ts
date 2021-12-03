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
    })

    res.json(clubMembers)
    return clubMembers
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
      include: { User: { select: { email: true } } },
    })
    if (!clubMember)
      return res.status(404).json({ message: 'Member not found' })

    res.json(clubMember)
    return clubMember
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
