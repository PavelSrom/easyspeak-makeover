import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from 'utils/prisma-client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      try {
        const users = await prisma.user.findMany()

        return res.send(users)
      } catch (err) {
        console.log(err)
        return res.status(500).send({ err })
      }

    case 'POST':
      try {
        const { email } = req.body
        if (!email)
          return res.status(400).send({ message: 'Missing name or email' })

        const newUser = await prisma.user.create({ data: { email } })

        return res.status(201).send(newUser)
      } catch (err) {
        console.log(err)
        return res.status(500).send({ err })
      }
    default:
      return res.status(405).send({ message: 'Method not allowed' })
  }
}
