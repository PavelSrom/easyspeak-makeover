import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import {
  authCheckUserSchema,
  authSignupSchema,
  createNewMemberSchema,
  validateBody,
} from 'utils/payload-validations'
import { prisma } from 'utils/prisma-client'
import { ApiSession } from 'types/helpers'

export const createNewMemberHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: ApiSession
) => {
  const { isValid, msg } = await validateBody(createNewMemberSchema, req)
  if (!isValid) return res.status(400).json({ message: msg })

  const { email } = req.body

  try {
    const newMemberExists = await prisma.user.findUnique({ where: { email } })
    if (newMemberExists)
      return res.status(400).json({ message: 'This member is already invited' })

    const newMember = await prisma.user.create({
      // @ts-ignore
      data: { email, Club: { connect: { id: session.user.clubId } } },
      select: { id: true, email: true, invitationSent: true },
    })

    // TODO: send email for invite and change 'invitationSent' to true and save to DB

    res.status(201).json(newMember)
    return newMember
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

export const authCheckUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { isValid, msg } = await validateBody(authCheckUserSchema, req)
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
  const { isValid, msg } = await validateBody(authSignupSchema, req)
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
