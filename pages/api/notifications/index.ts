import { NextApiRequest, NextApiResponse } from 'next'
import { getApiSession } from 'utils/get-api-session'
import { getAllNotificationsHandler } from 'backend/notifications'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getApiSession(req)
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      return getAllNotificationsHandler(req, res, session)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
