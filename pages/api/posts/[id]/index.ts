import {
  deletePostByIdHandler,
  getPostByIdHandler,
  updatePostByIdHandler,
} from 'backend/posts'
import { NextApiRequest, NextApiResponse } from 'next'
import { getApiSession } from 'utils/get-api-session'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getApiSession(req)
  if (!session) return res.status(403).json({ message: 'Access denied' })

  switch (req.method) {
    case 'GET':
      return getPostByIdHandler(req, res)

    case 'PUT':
      return updatePostByIdHandler(req, res, session)

    case 'DELETE':
      return deletePostByIdHandler(req, res, session)

    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}
