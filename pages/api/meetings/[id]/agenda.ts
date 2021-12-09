import { getFullAgendaHandler } from 'backend/meetings'
import { NextApiRequest, NextApiResponse } from 'next'
import { getApiSession } from 'utils/get-api-session'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getApiSession(req)
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      return getFullAgendaHandler(req, res)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
