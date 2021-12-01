import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import {
  authCheckUserSchema,
  authSignupSchema,
  createNewMemberSchema,
  validateBody,
} from 'utils/payload-validations'
import { prisma } from 'utils/prisma-client'

// TODO: only for board members
export const createNewMemberHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { isValid, msg } = await validateBody(createNewMemberSchema, req)
  if (!isValid) return res.status(400).json({ msg })

  const { email } = req.body

  try {
    const newMember = await prisma.user.create({
      data: { email },
      select: { id: true, email: true, invitationSent: true },
    })

    // TODO: send email for invite and change 'invitationSent' to true and save to DB

    res.status(201).json(newMember)
    return newMember
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}

// TODO: only for board members
export const deleteNewMemberByIdHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
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
  if (!isValid) return res.status(400).json({ msg })

  const { email } = req.body

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
      include: { Profile: { select: { id: true } } },
    })
    if (!userExists) return res.status(400).json({ msg: 'User does not exist' })
    if (userExists.Profile?.id)
      return res.status(400).json({ msg: 'Sign in to access your profile' })

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
  if (!isValid) return res.status(400).json({ msg })

  const { id, name, surname, phone, password, pathway } = req.body

  try {
    // check once again if user has been created via email beforehand
    const userExists = await prisma.user.findUnique({
      where: { id },
    })
    if (!userExists) return res.status(400).json({ msg: 'User does not exist' })

    await prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(password, 8) },
    })

    await prisma.profile.create({
      data: {
        name,
        surname,
        phone,
        pathway,
        User: {
          connect: {
            id,
          },
        },
      },
    })

    return res.status(201).json({ message: 'User created' })
  } catch ({ message }) {
    return res.status(500).json({ message })
  }
}