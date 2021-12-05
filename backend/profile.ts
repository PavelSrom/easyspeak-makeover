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

  try {
    const updatedProfile = await prisma.profile.update({
      where: { id: session.user.profileId },
      data: { Pathway: { connect: { id: pathway } }, ...body },
    })

    return res.json(updatedProfile)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
