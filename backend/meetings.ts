import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'
import { Prisma } from '.prisma/client'

export const getMeetingRolesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const meetingRoles = await prisma.meetingRoleType.findMany()

    return res.json(meetingRoles)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getAllMeetingsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { timeStart, timeEnd } = req.query

  const where: Prisma.MeetingWhereInput = {}
  if (timeStart) where.timeStart = { gte: new Date(timeStart as string) }
  if (timeEnd) where.timeEnd = { lt: new Date(timeEnd as string) }

  try {
    const allMeetings = await prisma.meeting.findMany({
      where: { clubId: session.user.clubId, ...where },
      select: {
        id: true,
        venue: true,
        timeStart: true,
        Club: { select: { name: true } },
      },
    })

    res.json(allMeetings)
    return allMeetings
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const getMeetingByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const meeting = await prisma.meeting.findFirst({
      where: { id: req.query.id as string, clubId: session.user.clubId },
    })
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' })

    res.json(meeting)
    return meeting
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

// TODO, this is just placeholder stuff for now
export const createNewMeetingHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  // TODO: check if meeting in this timeframe already exists
  try {
    const newMeeting = await prisma.meeting.create({
      data: {
        Club: { connect: { id: session.user.clubId } },
        Manager: { connect: { id: session.user.profileId } },
        description: 'Placeholder meeting',
        venue: 'Vesterbro Bibliotek',
        timeStart: new Date(req.body.timeStart),
        timeEnd: new Date(req.body.timeEnd),
      },
    })
    if (!newMeeting) return res.status(400).json({ message: 'Meeting failed' })

    return res.json(newMeeting)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
