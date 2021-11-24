import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'utils/prisma-client'

export const getAllUsersHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const users = await prisma.user.findMany()

    res.send(users)
    return users
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err })
  }
}

export const createNewUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { email } = req.body
    if (!email)
      return res.status(400).send({ message: 'Missing name or email' })

    const newUser = await prisma.user.create({ data: { email } })

    res.status(201).send(newUser)
    return newUser
  } catch (err) {
    console.log(err)
    return res.status(500).send({ err })
  }
}
