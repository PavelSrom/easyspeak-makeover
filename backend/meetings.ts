import { NextApiRequest, NextApiResponse } from 'next'
import { ApiSession } from 'types/helpers'
import { prisma } from 'utils/prisma-client'
import { createNewMeetingSchema, validateBody } from 'utils/payload-validations'
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

export const createNewMeetingHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { isValid, msg } = await validateBody(createNewMeetingSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { description, venue, start, end, agenda } = req.body
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
    })
    if (!profile)
      return res.status(404).json({ message: 'Cannot create meeting' })
    if (!profile.roleTypeId)
      return res.status(403).json({ message: 'Access denied' })

    // TODO: check if meeting in this timeframe already exists

    const attendances: Prisma.Enumerable<Prisma.AttendanceCreateManyMeetingInput> =
      agenda.map((role: { id: string; name: string }) => ({
        roleTypeId: role.id,
        roleStatus: 'PENDING',
      }))

    const newMeeting = await prisma.meeting.create({
      data: {
        Club: { connect: { id: session.user.clubId } },
        Manager: { connect: { id: session.user.profileId } },
        description,
        venue,
        timeStart: new Date(start),
        timeEnd: new Date(end),
        Attendance: { createMany: { data: attendances } },
      },
    })

    return res.status(201).json(newMeeting)
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
