import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'

export const getUserProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const fullProfile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
      include: { User: { select: { Club: { select: { name: true } } } } },
    })
    if (!fullProfile)
      return res.status(404).json({ message: 'Profile not found' })

    res.json(fullProfile)
    return fullProfile
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const updateUserProfileHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { pathway, ...body } = req.body

  const payload: Prisma.ProfileUpdateInput = body
  if (pathway) payload.Pathway = { connect: { id: pathway } }

  try {
    const updatedProfile = await prisma.profile.update({
      where: { id: session.user.profileId },
      data: payload,
      include: { User: { select: { Club: { select: { name: true } } } } },
    })

    return res.json(updatedProfile)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getUserActivityHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const meetingsQuery = prisma.meeting.findMany({
      where: { clubId: session.user.clubId, timeStart: { gte: new Date() } },
      orderBy: { timeStart: 'asc' },
      take: 3,
      select: {
        id: true,
        venue: true,
        timeStart: true,
        Club: { select: { name: true } },
      },
    })

    const postsQuery = prisma.post.findMany({
      where: { clubId: session.user.clubId, authorId: session.user.profileId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        body: true,
      },
    })

    const [meetings, posts] = await Promise.all([meetingsQuery, postsQuery])

    res.json({ meetings, posts })
    return { meetings, posts }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
