import { getAllPathwaysHandler } from 'backend/misc'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      return getAllPathwaysHandler(req, res)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
