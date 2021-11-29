import { NextApiRequest, NextApiResponse } from 'next'
import { createNewMemberHandler } from 'backend/auth'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      return createNewMemberHandler(req, res)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
