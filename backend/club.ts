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

export const changeMemberRoleHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  // clubRole = 'member'
  const { clubRole } = req.body

  try {
    // 1. check if user making a request is admin, if not, kick them out
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
    })
    if (!profile) return res.status(404).json({ message: 'Profile not found' })
    if (!profile.roleTypeId)
      return res.status(403).json({ message: 'Access denied' })

    // 2. check if there already is a person with that role, if there are, return 400
    const targetClubRole = await prisma.profile.findFirst({
      where: { roleTypeId: clubRole, User: { clubId: session.user.clubId } },
    })
    if (targetClubRole)
      return res.status(400).json({ message: 'This role is already taken' })

    if (clubRole === 'member') {
      // if changing to a regular member
      await prisma.profile.update({
        where: { id: req.query.id as string },
        data: { roleTypeId: null },
      })
    } else {
      // changing to a board member
      await prisma.profile.update({
        where: { id: req.query.id as string },
        data: { ClubRole: { connect: { id: clubRole } } },
      })
    }

    return res.json({ message: 'Role has been changed' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
