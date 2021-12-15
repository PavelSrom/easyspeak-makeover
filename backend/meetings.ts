import format from 'date-fns/format'
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
      orderBy: { timeStart: 'asc' },
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
          distinct: ['memberId'],
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

  const { title, description, venue, start, end, agenda } = req.body
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
        roleStatus: 'UNASSIGNED',
      }))

    const newMeeting = await prisma.meeting.create({
      data: {
        Club: { connect: { id: session.user.clubId } },
        Manager: { connect: { id: session.user.profileId } },
        title,
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

      // TODO: remove speeches if there are any
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

export const getFullAgendaHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const speakersQuery = prisma.attendance.findMany({
      where: {
        meetingId: req.query.id as string,
        RoleType: { name: { startsWith: 'Speaker' } },
      },
      orderBy: { RoleType: { name: 'asc' } },
      include: {
        RoleType: true,
        Speech: true,
        Member: { select: { avatar: true, name: true, surname: true } },
      },
    })

    const evaluatorsQuery = prisma.attendance.findMany({
      where: {
        meetingId: req.query.id as string,
        RoleType: { name: { startsWith: 'Evaluator' } },
      },
      orderBy: { RoleType: { name: 'asc' } },
      include: {
        RoleType: true,
        Member: { select: { avatar: true, name: true, surname: true } },
      },
    })

    const helpersQuery = prisma.attendance.findMany({
      where: {
        meetingId: req.query.id as string,
        NOT: [
          { RoleType: { name: { contains: 'ing' } } }, // coming or not coming
          { RoleType: { name: { startsWith: 'Speaker' } } },
          { RoleType: { name: { startsWith: 'Evaluator' } } },
        ],
      },
      orderBy: { RoleType: { name: 'asc' } },
      include: {
        RoleType: true,
        Member: { select: { avatar: true, name: true, surname: true } },
      },
    })

    const [speakers, evaluators, helpers] = await Promise.all([
      speakersQuery,
      evaluatorsQuery,
      helpersQuery,
    ])

    res.json({ speakers, evaluators, helpers })
    return { speakers, evaluators, helpers }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

/**
 * ROLE SIGNUPS AND ALLOCATIONS
 *
 * CONFIRMED = that role for that meeting is confirmed by member
 * PENDING = when member asks for a speech or admin assigns someone to that role
 * UNASSIGNED = whenever there's nobody taking that role
 */

export const memberAssignRoleHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const targetRole = await prisma.attendance.findFirst({
      where: {
        meetingId: req.query.id as string,
        roleTypeId: req.query.roleId as string,
      },
      include: { RoleType: true },
    })

    if (!targetRole) return res.status(404).json({ message: 'Role not found' })
    if (targetRole.memberId)
      return res.status(400).json({ message: 'This role is already taken' })

    const isRequestForSpeech = targetRole.RoleType.name
      .toLowerCase()
      .startsWith('speaker')

    // remove any coming/not coming roles for that meeting and that member
    await prisma.attendance.deleteMany({
      where: {
        meetingId: req.query.id as string,
        memberId: session.user.profileId,
        RoleType: { name: { contains: 'ing' } },
      },
    })

    if (isRequestForSpeech) {
      // it's a signup for a speech => admin needs to approve it
      const { title, description } = req.body
      if (!title || !description)
        return res.status(400).json({ message: 'Missing data for speech' })

      // create new speech
      await prisma.speech.create({
        data: {
          Attendance: { connect: { id: targetRole.id } },
          title,
          description,
        },
      })

      // TODO: send notification to meeting manager to approve it
    }

    await prisma.attendance.update({
      where: { id: targetRole.id },
      data: {
        Member: { connect: { id: session.user.profileId } },
        roleStatus: isRequestForSpeech ? 'PENDING' : 'CONFIRMED',
      },
    })

    return res.json({ message: 'Role assigned' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const memberUnassignRoleHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const targetRole = await prisma.attendance.findFirst({
      where: {
        meetingId: req.query.id as string,
        roleTypeId: req.query.roleId as string,
      },
      include: { RoleType: true },
    })
    if (!targetRole) return res.status(404).json({ message: 'Role not found' })
    if (targetRole.memberId !== session.user.profileId)
      return res.status(403).json({ message: 'Access denied' })

    const isRequestForSpeech = targetRole.RoleType.name
      .toLowerCase()
      .includes('speaker')

    if (isRequestForSpeech) {
      // member is cancelling their speaker role => remove speech too
      const targetSpeech = await prisma.speech.findUnique({
        where: { attendanceId: targetRole.id },
      })
      if (!targetSpeech)
        return res.status(404).json({ message: 'Speech not found' })

      await prisma.speech.delete({ where: { id: targetSpeech.id } })
    }

    // unassign person - remove memberId and set status back to UNASSIGNED
    // this logic assumes when you unassign, you're not coming to the meeting
    await prisma.attendance.update({
      where: { id: targetRole.id },
      data: { memberId: null, roleStatus: 'UNASSIGNED' },
    })

    return res.json({ message: 'Role unassigned' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const adminAssignRoleHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
    })
    if (!profile)
      return res.status(404).json({ message: 'Cannot assign member' })
    if (!profile.roleTypeId)
      return res.status(403).json({ message: 'Access denied' })

    const { memberId } = req.body
    if (!memberId)
      return res.status(400).json({ message: 'Choose a member to assign' })

    const targetRole = await prisma.attendance.findFirst({
      where: {
        meetingId: req.query.id as string,
        roleTypeId: req.query.roleId as string,
      },
    })

    if (!targetRole) return res.status(404).json({ message: 'Role not found' })
    if (targetRole.memberId)
      return res.status(400).json({ message: 'This role is already taken' })

    // remove any coming/not coming roles for that meeting and that member
    await prisma.attendance.deleteMany({
      where: {
        meetingId: req.query.id as string,
        memberId: session.user.profileId,
        RoleType: { name: { contains: 'ing' } },
      },
    })

    await prisma.attendance.update({
      where: { id: targetRole.id },
      data: {
        Member: { connect: { id: memberId } },
        roleStatus: 'PENDING',
      },
    })

    return res.json({ message: 'Role assigned' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const acceptAssignedRoleHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { roleId, accepted } = req.query
  // if accepting a non-speaker role, 'speech' is undefined
  const { speech } = req.body

  try {
    const targetRole = await prisma.attendance.findUnique({
      where: { id: roleId as string },
      include: { RoleType: { select: { name: true } } },
    })
    if (!targetRole) return res.status(404).json({ message: 'Role not found' })

    const roleToEditIsSpeaker = targetRole?.RoleType.name
      .toLowerCase()
      .includes('speaker')

    if (roleToEditIsSpeaker) {
      // if accepting speech, set status to CONFIRMED and create speech
      if (accepted === 'true') {
        await prisma.attendance.update({
          where: { id: targetRole.id },
          data: {
            roleStatus: 'CONFIRMED',
            Speech: {
              create: { title: speech.title, description: speech.description },
            },
          },
        })
      } else {
        // if rejecting a speech, set status to UNASSIGNED and unlink person
        await prisma.attendance.update({
          where: { id: targetRole.id },
          data: { roleStatus: 'UNASSIGNED', memberId: null },
        })
      }
    }

    await prisma.attendance.update({
      where: { id: targetRole.id },
      data: {
        roleStatus: accepted === 'true' ? 'CONFIRMED' : 'UNASSIGNED',
        memberId: accepted === 'true' ? session.user.profileId : null,
      },
    })

    return res.json({ message: `Role ${accepted ? 'accepted' : 'rejected'}` })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const toggleSpeechApprovalHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
    })
    if (!profile)
      return res.status(404).json({ message: 'Cannot toggle speech approval' })
    if (!profile.roleTypeId)
      return res.status(403).json({ message: 'Access denied' })

    const { approved } = req.query
    // if 'approved' is not provided
    if (approved === undefined)
      return res.status(400).json({ message: 'Cannot toggle speech approval' })

    const targetSpeech = await prisma.speech.findUnique({
      where: { id: req.query.speechId as string },
      include: {
        Attendance: { include: { Meeting: { select: { timeStart: true } } } },
      },
    })
    if (!targetSpeech)
      return res.status(404).json({ message: 'Speech not found' })

    // if speech should be approved, it's just a simple Attendance update
    if (approved === 'true') {
      await prisma.attendance.update({
        where: { id: targetSpeech.attendanceId },
        data: { roleStatus: 'CONFIRMED' },
      })

      return res.json({ message: 'Speech approved' })
    }

    // update Attendance, send notification to user and remove the speech
    const attendanceQuery = prisma.attendance.update({
      where: { id: targetSpeech.attendanceId },
      data: { roleStatus: 'UNASSIGNED', memberId: null },
    })
    const speechQuery = prisma.speech.delete({ where: { id: targetSpeech.id } })
    const notificationQuery = await prisma.notification.create({
      data: {
        title: 'Speech rejected',
        message: `Your speech on ${format(
          new Date(targetSpeech.Attendance.Meeting.timeStart),
          'DD.MM.yyyy'
        )} has been rejected by a board member`,
        Receiver: { connect: { id: targetSpeech.Attendance.memberId! } },
      },
    })

    await Promise.all([attendanceQuery, speechQuery, notificationQuery])

    return res.json({ message: 'Speech rejected' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
