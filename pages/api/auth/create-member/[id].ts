import { NextApiRequest, NextApiResponse } from 'next'
import { deleteNewMemberByIdHandler } from 'backend/auth'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'DELETE':
      return deleteNewMemberByIdHandler(req, res)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
