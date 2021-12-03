import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from 'utils/prisma-client'
import { validateBody, authSignupSchema } from 'utils/payload-validations'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      const { isValid, msg } = await validateBody(authSignupSchema, req)
      if (!isValid) return res.status(400).json({ message: msg })

      const { id, name, surname, phone, password, pathway } = req.body

      try {
        // check once again if user has been created via email beforehand
        const userExists = await prisma.user.findFirst({ where: { id } })
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

        res.status(201).json({ message: 'User created' })
        return { message: 'User created' }
      } catch ({ message }) {
        return res.status(500).json({ message })
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
