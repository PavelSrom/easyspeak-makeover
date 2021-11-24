import type { NextApiRequest, NextApiResponse } from 'next'
import { createNewUserHandler, getAllUsersHandler } from 'backend/hello'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getAllUsersHandler(req, res)

    case 'POST':
      return createNewUserHandler(req, res)

    default:
      return res.status(405).send({ message: 'Method not allowed' })
  }
}
