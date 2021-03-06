import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import {
  authCheckUserSchema,
  authSignupSchema,
  changePasswordSchema,
  createNewMemberSchema,
  validateBody,
} from 'utils/payload-validations'
import { prisma } from 'utils/prisma-client'
import { ApiSession } from 'types/helpers'
import { sendEmail } from 'utils/sendgrid'

export const createNewMemberHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { isValid, msg } = await validateBody(createNewMemberSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { email } = req.body

  try {
    const newMemberExists = await prisma.user.findUnique({ where: { email } })
    if (newMemberExists)
      return res.status(400).json({ message: 'This member is already invited' })

    const newMember = await prisma.user.create({
      data: { email, Club: { connect: { id: session.user.clubId } } },
      select: { id: true, email: true },
    })

    const { err } = await sendEmail({
      to: newMember.email,
      subject: 'Welcome to EasySpeak!',
      text: `We are glad to have you onboard! Please access the EasySpeak app and sign up using the email address this email has been sent to.`,
    })
    if (err)
      return res.status(400).json({ message: 'Invitation email not sent' })

    const updatedMember = await prisma.user.update({
      where: { id: newMember.id },
      data: { invitationSent: true },
      select: { id: true, email: true, invitationSent: true },
    })

    res.status(201).json(updatedMember)
    return updatedMember
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const deleteNewMemberByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
  // session: ApiSession
) => {
  try {
    const newMemberToDelete = await prisma.user.delete({
      where: { id: req.query.id as string },
    })
    if (!newMemberToDelete)
      return res.status(400).json({ message: 'Cannot delete new member' })

    res.json({ message: 'New user deleted' })
    return { message: 'New user deleted' }
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const resendInvitationEmailHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.profileId },
    })
    if (!profile) return res.status(404).json({ message: 'Profile not found' })
    if (!profile.roleTypeId)
      return res.status(403).json({ message: 'Access denied' })

    const targetUser = await prisma.user.findUnique({
      where: { id: req.query.id as string },
    })
    if (!targetUser) return res.status(404).json({ message: 'User not found' })

    const { err } = await sendEmail({
      to: targetUser.email,
      subject: 'Welcome to EasySpeak!',
      text: `We are glad to have you onboard! Please access the EasySpeak app and sign up using the email address this email has been sent to.`,
    })
    if (err)
      return res.status(400).json({ message: 'Invitation email not sent' })

    return res.json({ message: 'Invitation sent' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const authCheckUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { isValid, msg } = await validateBody(authCheckUserSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { email } = req.body

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
      include: { Profile: { select: { id: true } } },
    })
    if (!userExists)
      return res.status(400).json({ message: 'User does not exist' })
    if (userExists.Profile?.id)
      return res.status(400).json({ message: 'Sign in to access your profile' })

    return res.json({ id: userExists.id })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const authSignupHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { isValid, msg } = await validateBody(authSignupSchema, req.body)
  if (!isValid) return res.status(400).json({ message: msg })

  const { id, name, surname, phone, password, pathway } = req.body

  try {
    // check once again if user has been created via email beforehand
    const userExists = await prisma.user.findUnique({
      where: { id },
    })
    if (!userExists)
      return res.status(400).json({ message: 'User does not exist' })

    await prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(password, 8) },
    })

    await prisma.profile.create({
      data: {
        name,
        surname,
        phone,
        Pathway: { connect: { id: pathway } },
        User: { connect: { id } },
      },
    })

    return res.status(201).json({ message: 'User created' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

export const changePasswordHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.userId },
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { isValid, msg } = await validateBody(changePasswordSchema, req.body)
    if (!isValid) return res.status(400).json({ message: msg })

    const { password } = req.body

    await prisma.user.update({
      where: { id: session.user.userId },
      data: { password: await bcrypt.hash(password, 8) },
    })

    return res.json({ message: 'Password changed' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}
