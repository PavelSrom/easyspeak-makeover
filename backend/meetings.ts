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
      include: {
        Manager: { select: { avatar: true, name: true, surname: true } },
        Attendance: {
          where: { memberId: { not: null } },
          orderBy: { Member: { surname: 'asc' } },
          select: {
            Member: {
              select: { id: true, avatar: true, name: true, surname: true },
            },
          },
        },
      },
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

export const toggleMeetingAttendanceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { attending, id } = req.query
  if (!attending)
    return res.status(400).json({ message: 'Cannot toggle attendance' })

  try {
    const meetingAttendance = await prisma.attendance.findMany({
      where: { meetingId: id as string },
      include: { RoleType: { select: { name: true } } },
    })
    const alreadyAttending = meetingAttendance.find(
      member => member.memberId === session.user.profileId
    )

    if (alreadyAttending && attending === 'true')
      return res
        .status(400)
        .json({ message: 'You already confirmed attending' })
    if (!alreadyAttending && attending === 'false')
      return res
        .status(400)
        .json({ message: 'You already confirmed not attending' })

    if (attending === 'true') {
      // we've already checked if they're attending, so if they had a role,
      // they would've already shown up => they don't have a role, so create
      // a member role
      const memberRoleType = await prisma.meetingRoleType.findFirst({
        where: { name: 'Coming' },
      })
      if (!memberRoleType)
        return res.status(500).json({ message: 'Cannot toggle attendance' })

      await prisma.attendance.create({
        data: {
          Meeting: { connect: { id: id as string } },
          Member: { connect: { id: session.user.profileId } },
          RoleType: { connect: { id: memberRoleType.id } },
          roleStatus: 'CONFIRMED',
        },
      })

      // TODO: remove this once testing of notifs is completed
      await prisma.notification.create({
        data: {
          Receiver: { connect: { id: session.user.profileId } },
          title: 'Meeting attendance',
          message: 'You are coming to a meeting',
        },
      })

      return res.json({ message: 'You are attending' })
    }
    if (alreadyAttending?.RoleType.name !== 'Coming') {
      // if they don't wanna attend but have a role
      await prisma.attendance.update({
        where: { id: alreadyAttending!.id },
        data: { memberId: null, roleStatus: 'PENDING' },
      })
    } else {
      // if they don't wanna attend and don't have a role
      await prisma.attendance.delete({
        where: { id: alreadyAttending?.id },
      })
    }

    return res.json({ message: 'You are not attending' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
